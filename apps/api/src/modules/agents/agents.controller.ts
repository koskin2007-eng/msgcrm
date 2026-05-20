import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards
} from "@nestjs/common";
import type { AuthenticatedUser } from "../auth/auth.types.js";
import { CurrentUser } from "../auth/decorators/current-user.decorator.js";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { AuthGuard } from "../auth/guards/auth.guard.js";
import { RoleGuard } from "../auth/guards/role.guard.js";
import { AgentsService } from "./agents.service.js";
import { CreateAgentDto } from "./dto/create-agent.dto.js";
import { UpdateAgentDto } from "./dto/update-agent.dto.js";

@Controller("agents")
@UseGuards(AuthGuard)
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Get()
  listAgents(@CurrentUser() user: AuthenticatedUser) {
    return this.agentsService.listAgents(user.companyId);
  }

  @Post()
  @Roles("OWNER", "ADMIN")
  @UseGuards(RoleGuard)
  createAgent(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: CreateAgentDto
  ) {
    return this.agentsService.createAgent(user.companyId, body);
  }

  @Get(":id")
  getAgent(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string) {
    return this.agentsService.getAgent(user.companyId, id);
  }

  @Patch(":id")
  @Roles("OWNER", "ADMIN")
  @UseGuards(RoleGuard)
  updateAgent(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id") id: string,
    @Body() body: UpdateAgentDto
  ) {
    return this.agentsService.updateAgent(user.companyId, id, body);
  }

  @Delete(":id")
  @Roles("OWNER", "ADMIN")
  @UseGuards(RoleGuard)
  disableAgent(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string) {
    return this.agentsService.disableAgent(user.companyId, id);
  }
}
