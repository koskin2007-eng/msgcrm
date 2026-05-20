import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import type { User, UserRole } from "@prisma/client";
import { createHash, randomBytes } from "node:crypto";
import type { AuthenticatedUser } from "../auth/auth.types.js";
import { PasswordService } from "../auth/password.service.js";
import { PrismaService } from "../prisma/prisma.service.js";
import type { AcceptInviteDto } from "./dto/accept-invite.dto.js";
import type { InviteMemberDto } from "./dto/invite-member.dto.js";

type TeamStatus = "active" | "invited";
type TeamRole = "owner" | "admin" | "manager" | "viewer";

interface TeamMemberResponse {
  id: string;
  companyId: string;
  name: string;
  email: string;
  role: TeamRole;
  status: TeamStatus;
  joinedAt: string;
}

const INVITE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const inviteRoles: Record<InviteMemberDto["role"], UserRole> = {
  admin: "ADMIN",
  manager: "MANAGER",
  viewer: "VIEWER"
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function hashInviteToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function createInviteToken() {
  return randomBytes(32).toString("base64url");
}

function toTeamMember(user: User & { companyId: string }): TeamMemberResponse {
  return {
    id: user.id,
    companyId: user.companyId,
    name: user.displayName,
    email: user.email,
    role: user.role.toLowerCase() as TeamRole,
    status: user.isActive ? "active" : "invited",
    joinedAt: user.createdAt.toISOString()
  };
}

function assertInvitationIsUsable(user: User & { company: { name: string } | null }) {
  if (user.isActive || user.passwordHash) {
    throw new BadRequestException("Invitation has already been accepted");
  }

  if (!user.inviteExpiresAt || user.inviteExpiresAt <= new Date()) {
    throw new BadRequestException("Invitation has expired");
  }

  if (!user.company) {
    throw new NotFoundException("Invitation not found");
  }
}

@Injectable()
export class TeamService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService
  ) {}

  async listMembers(companyId: string) {
    const users = await this.prisma.user.findMany({
      where: {
        companyId
      },
      orderBy: [
        {
          createdAt: "asc"
        }
      ]
    });

    return users.map((user) => toTeamMember(user as User & { companyId: string }));
  }

  async inviteMember(currentUser: AuthenticatedUser, dto: InviteMemberDto) {
    if (currentUser.role !== "OWNER" && currentUser.role !== "ADMIN") {
      throw new ForbiddenException("Only owner or admin can invite team members");
    }

    const email = normalizeEmail(dto.email);
    const displayName = dto.displayName.trim();

    if (!displayName) {
      throw new BadRequestException("Member name is required");
    }

    const existingUser = await this.prisma.user.findUnique({
      where: {
        email
      }
    });

    if (existingUser) {
      throw new ConflictException("User with this email already exists");
    }

    const token = createInviteToken();
    const expiresAt = new Date(Date.now() + INVITE_TTL_MS);

    const invitedUser = await this.prisma.user.create({
      data: {
        companyId: currentUser.companyId,
        displayName,
        email,
        role: inviteRoles[dto.role],
        isActive: false,
        inviteTokenHash: hashInviteToken(token),
        inviteExpiresAt: expiresAt,
        invitedAt: new Date()
      }
    });

    return {
      member: toTeamMember(invitedUser as User & { companyId: string }),
      invitation: {
        acceptPath: `/accept-invite?token=${encodeURIComponent(token)}`,
        expiresAt: expiresAt.toISOString()
      }
    };
  }

  async getInvitation(token: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        inviteTokenHash: hashInviteToken(token)
      },
      include: {
        company: {
          select: {
            name: true
          }
        }
      }
    });

    if (!user) {
      throw new NotFoundException("Invitation not found");
    }

    assertInvitationIsUsable(user);

    return {
      email: user.email,
      displayName: user.displayName,
      role: user.role.toLowerCase() as TeamRole,
      companyName: user.company!.name,
      expiresAt: user.inviteExpiresAt!.toISOString()
    };
  }

  async acceptInvitation(token: string, dto: AcceptInviteDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        inviteTokenHash: hashInviteToken(token)
      },
      include: {
        company: {
          select: {
            name: true
          }
        }
      }
    });

    if (!user) {
      throw new NotFoundException("Invitation not found");
    }

    assertInvitationIsUsable(user);

    const passwordHash = await this.passwordService.hash(dto.password);
    const updatedUser = await this.prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        passwordHash,
        isActive: true,
        inviteTokenHash: null,
        inviteExpiresAt: null,
        acceptedAt: new Date()
      },
      include: {
        company: {
          select: {
            name: true
          }
        }
      }
    });

    return {
      ok: true,
      user: {
        email: updatedUser.email,
        displayName: updatedUser.displayName,
        role: updatedUser.role.toLowerCase() as TeamRole
      },
      company: {
        name: updatedUser.company!.name
      }
    };
  }
}
