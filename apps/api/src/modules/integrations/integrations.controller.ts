import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import type { AuthenticatedUser } from "../auth/auth.types.js";
import { CurrentUser } from "../auth/decorators/current-user.decorator.js";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { AuthGuard } from "../auth/guards/auth.guard.js";
import { RoleGuard } from "../auth/guards/role.guard.js";
import { CreateIntegrationAccountDto } from "./dto/create-integration-account.dto.js";
import { UpdateIntegrationAccountDto } from "./dto/update-integration-account.dto.js";
import { IntegrationsService } from "./integrations.service.js";

@Controller("integrations")
@UseGuards(AuthGuard)
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) {}

  @Get("accounts")
  listAccounts(@CurrentUser() user: AuthenticatedUser) {
    return this.integrationsService.listAccounts(user.companyId);
  }

  @Post("accounts")
  @Roles("OWNER", "ADMIN")
  @UseGuards(RoleGuard)
  createAccount(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: CreateIntegrationAccountDto
  ) {
    return this.integrationsService.createAccount(user.companyId, body);
  }

  @Patch("accounts/:id")
  @Roles("OWNER", "ADMIN")
  @UseGuards(RoleGuard)
  updateAccount(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id") id: string,
    @Body() body: UpdateIntegrationAccountDto
  ) {
    return this.integrationsService.updateAccount(user.companyId, id, body);
  }
}
