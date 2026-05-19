import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import { AuthService } from "../auth.service.js";
import type { AuthenticatedRequest } from "../auth.types.js";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = await this.authService.getUserFromRequest(request);

    if (!user) {
      throw new UnauthorizedException("Authentication required");
    }

    request.user = user;
    return true;
  }
}
