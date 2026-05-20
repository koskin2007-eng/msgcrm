import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module.js";
import { PrismaModule } from "../prisma/prisma.module.js";
import { IntegrationsController } from "./integrations.controller.js";
import { IntegrationsService } from "./integrations.service.js";

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [IntegrationsController],
  providers: [IntegrationsService]
})
export class IntegrationsModule {}
