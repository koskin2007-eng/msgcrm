import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import type { AuthenticatedUser } from "../auth/auth.types.js";
import { CurrentUser } from "../auth/decorators/current-user.decorator.js";
import { AuthGuard } from "../auth/guards/auth.guard.js";
import { InviteMemberDto } from "./dto/invite-member.dto.js";
import { TeamService } from "./team.service.js";

@Controller("team")
@UseGuards(AuthGuard)
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get("members")
  listMembers(@CurrentUser() user: AuthenticatedUser) {
    return this.teamService.listMembers(user.companyId);
  }

  @Post("invitations")
  inviteMember(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: InviteMemberDto
  ) {
    return this.teamService.inviteMember(user, body);
  }
}
