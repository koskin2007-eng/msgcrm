import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module.js";
import { PrismaModule } from "../prisma/prisma.module.js";
import { TeamController } from "./team.controller.js";
import { TeamService } from "./team.service.js";

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [TeamController],
  providers: [TeamService]
})
export class TeamModule {}
