import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module.js";
import { AuthController } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";
import { AuthGuard } from "./guards/auth.guard.js";
import { PasswordService } from "./password.service.js";

@Module({
  imports: [PrismaModule],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, PasswordService],
  exports: [AuthService, AuthGuard, PasswordService]
})
export class AuthModule {}
