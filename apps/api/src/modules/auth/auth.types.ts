import type { Company, User, UserRole } from "@prisma/client";

export const SESSION_COOKIE_NAME = "msgcrm_session";

export type AuthenticatedUser = Pick<
  User,
  "id" | "email" | "displayName" | "role" | "companyId"
> & {
  companyId: string;
  company: Pick<Company, "id" | "name">;
};

export interface AuthenticatedRequest {
  headers: Record<string, string | string[] | undefined>;
  ip?: string;
  user?: AuthenticatedUser;
}

export interface CookieResponse {
  cookie: (
    name: string,
    value: string,
    options: {
      domain?: string;
      httpOnly: boolean;
      maxAge: number;
      path: string;
      sameSite: "lax";
      secure: boolean;
    }
  ) => void;
  clearCookie: (
    name: string,
    options: {
      domain?: string;
      path: string;
      sameSite: "lax";
      secure: boolean;
    }
  ) => void;
}

export interface PublicUser {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
}

export interface AuthResponse {
  user: PublicUser;
  company: {
    id: string;
    name: string;
  };
}
