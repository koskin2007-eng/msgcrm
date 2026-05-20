import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable
} from "@nestjs/common";
import type { User, UserRole } from "@prisma/client";
import type { AuthenticatedUser } from "../auth/auth.types.js";
import { PrismaService } from "../prisma/prisma.service.js";
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

const inviteRoles: Record<InviteMemberDto["role"], UserRole> = {
  admin: "ADMIN",
  manager: "MANAGER",
  viewer: "VIEWER"
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
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

@Injectable()
export class TeamService {
  constructor(private readonly prisma: PrismaService) {}

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

    const invitedUser = await this.prisma.user.create({
      data: {
        companyId: currentUser.companyId,
        displayName,
        email,
        role: inviteRoles[dto.role],
        isActive: false
      }
    });

    return toTeamMember(invitedUser as User & { companyId: string });
  }
}
