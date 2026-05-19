import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CreateMessageDto } from "./dto/create-message.dto.js";
import { InboxService } from "./inbox.service.js";

@Controller("inbox")
export class InboxController {
  constructor(private readonly inboxService: InboxService) {}

  @Get("conversations")
  listConversations() {
    return this.inboxService.listConversations();
  }

  @Get("conversations/:id")
  getConversation(@Param("id") id: string) {
    return this.inboxService.getConversation(id);
  }

  @Post("conversations/:id/messages")
  createMessage(@Param("id") id: string, @Body() body: CreateMessageDto) {
    return this.inboxService.createOutboundMessage(id, body.text);
  }
}
