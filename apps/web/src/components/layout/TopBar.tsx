import { Bell, Building2 } from "lucide-react";
import { roleLabel } from "../../lib/format";
import type { AuthSession } from "../../lib/auth-types";
import { LogoutButton } from "./LogoutButton";

interface TopBarProps {
  session: AuthSession;
}

export function TopBar({ session }: TopBarProps) {
  return (
    <header className="top-bar">
      <div className="top-bar-company">
        <Building2 size={18} />
        <span>Компания: {session.company.name}</span>
      </div>

      <div className="top-bar-actions">
        <div className="notification-indicator" aria-label="Уведомления">
          <Bell size={18} />
          <span>11</span>
        </div>
        <div className="user-chip">
          <strong>{session.user.displayName}</strong>
          <span>{roleLabel(session.user.role)}</span>
        </div>
        <LogoutButton />
      </div>
    </header>
  );
}
