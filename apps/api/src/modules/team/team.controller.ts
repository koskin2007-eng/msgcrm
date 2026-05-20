import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import type { AuthenticatedUser } from "../auth/auth.types.js";
import { CurrentUser } from "../auth/decorators/current-user.decorator.js";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { AuthGuard } from "../auth/guards/auth.guard.js";
import { RoleGuard } from "../auth/guards/role.guard.js";
import { AcceptInviteDto } from "./dto/accept-invite.dto.js";
import { InviteMemberDto } from "./dto/invite-member.dto.js";
import { TeamService } from "./team.service.js";

@Controller("team")
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get("members")
  @UseGuards(AuthGuard)
  listMembers(@CurrentUser() user: AuthenticatedUser) {
    return this.teamService.listMembers(user.companyId);
  }

  @Post("invitations")
  @Roles("OWNER", "ADMIN")
  @UseGuards(AuthGuard, RoleGuard)
  inviteMember(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: InviteMemberDto
  ) {
    return this.teamService.inviteMember(user, body);
  }

  @Get("invitations/:token")
  getInvitation(@Param("token") token: string) {
    return this.teamService.getInvitation(token);
  }

  @Post("invitations/:token/accept")
  acceptInvitation(
    @Param("token") token: string,
    @Body() body: AcceptInviteDto
  ) {
    return this.teamService.acceptInvitation(token, body);
  }
}
