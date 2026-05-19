import {
  ConflictException,
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import { createHash, randomBytes } from "node:crypto";
import { SESSION_COOKIE_NAME, type AuthenticatedRequest } from "./auth.types.js";
import { parseCookieHeader } from "./cookie.js";
import { PasswordService } from "./password.service.js";
import { PrismaService } from "../prisma/prisma.service.js";
import type { LoginDto } from "./dto/login.dto.js";
import type { RegisterDto } from "./dto/register.dto.js";

const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function hashSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService
  ) {}

  async register(dto: RegisterDto, request: AuthenticatedRequest) {
    const email = normalizeEmail(dto.email);
    const existingUser = await this.prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      throw new ConflictException("User with this email already exists");
    }

    const passwordHash = await this.passwordService.hash(dto.password);
    const company = await this.prisma.company.create({
      data: {
        name: dto.companyName.trim()
      }
    });

    const user = await this.prisma.user.create({
      data: {
        email,
        displayName: dto.name.trim(),
        passwordHash,
        role: "OWNER",
        companyId: company.id
      },
      include: {
        company: true
      }
    });

    const token = await this.createSession(user.id, request);

    return {
      token,
      payload: this.toAuthResponse(user)
    };
  }

  async login(dto: LoginDto, request: AuthenticatedRequest) {
    const email = normalizeEmail(dto.email);
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        company: true
      }
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const isValidPassword = await this.passwordService.verify(
      dto.password,
      user.passwordHash
    );

    if (!isValidPassword || !user.companyId || !user.company) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const token = await this.createSession(user.id, request);

    return {
      token,
      payload: this.toAuthResponse(user)
    };
  }

  async logout(request: AuthenticatedRequest) {
    const token = this.getSessionTokenFromRequest(request);

    if (!token) {
      return;
    }

    await this.prisma.session.deleteMany({
      where: {
        tokenHash: hashSessionToken(token)
      }
    });
  }

  async getUserFromRequest(request: AuthenticatedRequest) {
    const token = this.getSessionTokenFromRequest(request);

    if (!token) {
      return null;
    }

    const session = await this.prisma.session.findUnique({
      where: {
        tokenHash: hashSessionToken(token)
      },
      include: {
        user: {
          include: {
            company: true
          }
        }
      }
    });

    if (
      !session ||
      session.expiresAt <= new Date() ||
      !session.user.isActive ||
      !session.user.companyId ||
      !session.user.company
    ) {
      return null;
    }

    return {
      id: session.user.id,
      email: session.user.email,
      displayName: session.user.displayName,
      role: session.user.role,
      companyId: session.user.companyId,
      company: {
        id: session.user.company.id,
        name: session.user.company.name
      }
    };
  }

  toAuthResponse(user: {
    id: string;
    email: string;
    displayName: string;
    role: "OWNER" | "ADMIN" | "MANAGER" | "VIEWER";
    company: {
      id: string;
      name: string;
    } | null;
  }) {
    if (!user.company) {
      throw new UnauthorizedException("User is not attached to a company");
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        role: user.role
      },
      company: {
        id: user.company.id,
        name: user.company.name
      }
    };
  }

  private getSessionTokenFromRequest(request: AuthenticatedRequest) {
    return parseCookieHeader(request.headers.cookie).get(SESSION_COOKIE_NAME);
  }

  private async createSession(userId: string, request: AuthenticatedRequest) {
    const token = randomBytes(32).toString("base64url");
    const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
    const userAgent = Array.isArray(request.headers["user-agent"])
      ? request.headers["user-agent"].join(" ")
      : request.headers["user-agent"];

    await this.prisma.session.create({
      data: {
        userId,
        tokenHash: hashSessionToken(token),
        userAgent,
        ipAddress: request.ip,
        expiresAt
      }
    });

    return token;
  }
}
