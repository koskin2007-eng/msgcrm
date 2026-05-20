import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AgentsModule } from "./agents/agents.module.js";
import { AuthModule } from "./auth/auth.module.js";
import { HealthModule } from "./health/health.module.js";
import { InboxModule } from "./inbox/inbox.module.js";
import { IntegrationsModule } from "./integrations/integrations.module.js";
import { KnowledgeModule } from "./knowledge/knowledge.module.js";
import { PrismaModule } from "./prisma/prisma.module.js";
import { TeamModule } from "./team/team.module.js";
import { TelegramModule } from "./telegram/telegram.module.js";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    PrismaModule,
    AuthModule,
    HealthModule,
    AgentsModule,
    InboxModule,
    IntegrationsModule,
    KnowledgeModule,
    TelegramModule,
    TeamModule
  ]
})
export class AppModule {}
