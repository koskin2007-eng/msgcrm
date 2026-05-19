import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../auth/decorators/current-user.decorator.js";
import { AuthGuard } from "../auth/guards/auth.guard.js";
import type { AuthenticatedUser } from "../auth/auth.types.js";
import { CreateMessageDto } from "./dto/create-message.dto.js";
import { InboxService } from "./inbox.service.js";

@Controller("inbox")
@UseGuards(AuthGuard)
export class InboxController {
  constructor(private readonly inboxService: InboxService) {}

  @Get("conversations")
  listConversations(@CurrentUser() user: AuthenticatedUser) {
    return this.inboxService.listConversations(user.companyId);
  }

  @Get("conversations/:id")
  getConversation(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.inboxService.getConversation(id, user.companyId);
  }

  @Post("conversations/:id/messages")
  createMessage(
    @Param("id") id: string,
    @Body() body: CreateMessageDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.inboxService.createOutboundMessage(id, user.companyId, body.text);
  }
}
