import { Bell, Building2, LogOut } from "lucide-react";
import { company, currentUser } from "../../lib/mock-data";
import { roleLabel } from "../../lib/format";
import { Button } from "../ui/Button";

export function TopBar() {
  return (
    <header className="top-bar">
      <div className="top-bar-company">
        <Building2 size={18} />
        <span>Компания: {company.name}</span>
      </div>

      <div className="top-bar-actions">
        <div className="notification-indicator" aria-label="Уведомления">
          <Bell size={18} />
          <span>11</span>
        </div>
        <div className="user-chip">
          <strong>{currentUser.name}</strong>
          <span>{roleLabel(currentUser.role)}</span>
        </div>
        <Button variant="ghost">
          <LogOut size={16} />
          Выйти
        </Button>
      </div>
    </header>
  );
}
