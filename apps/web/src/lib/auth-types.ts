export type AuthRole = "OWNER" | "ADMIN" | "MANAGER" | "VIEWER";

export interface AuthSession {
  user: {
    id: string;
    email: string;
    displayName: string;
    phone: string | null;
    role: AuthRole;
  };
  company: {
    id: string;
    name: string;
  };
}
