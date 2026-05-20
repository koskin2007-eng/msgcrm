import {
  Body,
  Controller,
  Get,
  Headers,
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
import { ConnectTelegramDto } from "./dto/connect-telegram.dto.js";
import { UpdateTelegramIntegrationDto } from "./dto/update-telegram-integration.dto.js";
import { TelegramService } from "./telegram.service.js";

@Controller()
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @Get("integrations/telegram")
  @UseGuards(AuthGuard)
  listIntegrations(@CurrentUser() user: AuthenticatedUser) {
    return this.telegramService.listIntegrations(user.companyId);
  }

  @Post("integrations/telegram/connect")
  @Roles("OWNER", "ADMIN")
  @UseGuards(AuthGuard, RoleGuard)
  connectIntegration(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: ConnectTelegramDto
  ) {
    return this.telegramService.connectIntegration(user.companyId, body);
  }

  @Patch("integrations/telegram/:id")
  @Roles("OWNER", "ADMIN")
  @UseGuards(AuthGuard, RoleGuard)
  updateIntegration(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id") id: string,
    @Body() body: UpdateTelegramIntegrationDto
  ) {
    return this.telegramService.updateIntegration(user.companyId, id, body);
  }

  @Post("integrations/telegram/:id/check")
  @Roles("OWNER", "ADMIN")
  @UseGuards(AuthGuard, RoleGuard)
  checkIntegration(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id") id: string
  ) {
    return this.telegramService.checkIntegration(user.companyId, id);
  }

  @Post("telegram/webhook/:webhookSecret")
  receiveWebhook(
    @Param("webhookSecret") webhookSecret: string,
    @Headers("x-telegram-bot-api-secret-token") secretToken: string | undefined,
    @Body() body: unknown
  ) {
    return this.telegramService.handleWebhook(
      webhookSecret,
      secretToken,
      body as Parameters<TelegramService["handleWebhook"]>[2]
    );
  }
}
