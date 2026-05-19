import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service.js";
import { clearSessionCookie, setSessionCookie } from "./session-cookie.js";
import type {
  AuthenticatedRequest,
  AuthResponse,
  CookieResponse
} from "./auth.types.js";
import { CurrentUser } from "./decorators/current-user.decorator.js";
import { LoginDto } from "./dto/login.dto.js";
import { RegisterDto } from "./dto/register.dto.js";
import { AuthGuard } from "./guards/auth.guard.js";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(
    @Body() body: RegisterDto,
    @Req() request: AuthenticatedRequest,
    @Res({ passthrough: true }) response: CookieResponse
  ) {
    const { token, payload } = await this.authService.register(body, request);
    setSessionCookie(response, token);
    return payload;
  }

  @Post("login")
  async login(
    @Body() body: LoginDto,
    @Req() request: AuthenticatedRequest,
    @Res({ passthrough: true }) response: CookieResponse
  ) {
    const { token, payload } = await this.authService.login(body, request);
    setSessionCookie(response, token);
    return payload;
  }

  @Post("logout")
  async logout(
    @Req() request: AuthenticatedRequest,
    @Res({ passthrough: true }) response: CookieResponse
  ) {
    await this.authService.logout(request);
    clearSessionCookie(response);
    return { ok: true };
  }

  @Get("me")
  @UseGuards(AuthGuard)
  me(@CurrentUser() user: AuthenticatedRequest["user"]): AuthResponse {
    return {
      user: {
        id: user!.id,
        email: user!.email,
        displayName: user!.displayName,
        role: user!.role
      },
      company: user!.company
    };
  }
}
