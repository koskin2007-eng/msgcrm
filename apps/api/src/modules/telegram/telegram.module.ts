import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module.js";
import { TelegramController } from "./telegram.controller.js";
import { AiReplyService } from "./ai-reply.service.js";
import { SecretEncryptionService } from "./secret-encryption.service.js";
import { TelegramService } from "./telegram.service.js";

@Module({
  imports: [AuthModule],
  controllers: [TelegramController],
  providers: [AiReplyService, SecretEncryptionService, TelegramService],
  exports: [AiReplyService, TelegramService]
})
export class TelegramModule {}
