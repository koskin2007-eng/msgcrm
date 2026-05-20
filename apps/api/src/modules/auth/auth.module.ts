import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module.js";
import { AuthController } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";
import { AuthGuard } from "./guards/auth.guard.js";
import { RoleGuard } from "./guards/role.guard.js";
import { PasswordService } from "./password.service.js";

@Module({
  imports: [PrismaModule],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, RoleGuard, PasswordService],
  exports: [AuthService, AuthGuard, RoleGuard, PasswordService]
})
export class AuthModule {}
