import { Plug, Settings, Unplug } from "lucide-react";
import { accountStatusLabel, platformLabel } from "../../lib/format";
import type { ConnectedAccount } from "../../lib/types";
import { Button } from "../ui/Button";
import { AccountStatusBadge } from "../ui/StatusBadge";

interface IntegrationCardProps {
  account: ConnectedAccount;
  canManage?: boolean;
}

export function IntegrationCard({ account, canManage = true }: IntegrationCardProps) {
  const canConnect = canManage && account.status === "disconnected";
  const canDisconnect =
    canManage && (account.status === "connected" || account.status === "auth_error");

  return (
    <section className="integration-card">
      <div className="integration-head">
        <div>
          <h3>{account.title}</h3>
          <p>{platformLabel(account.platform)}</p>
        </div>
        <AccountStatusBadge status={account.status} />
      </div>
      <p>{account.description}</p>
      <div className="integration-stats">
        <span>Новых сообщений</span>
        <strong>{account.unreadCount}</strong>
      </div>
      <div className="integration-actions">
        <Button disabled={!canConnect} variant={canConnect ? "primary" : "secondary"}>
          <Plug size={16} />
          Подключить
        </Button>
        <Button disabled={!canDisconnect} variant="secondary">
          <Unplug size={16} />
          Отключить
        </Button>
        <Button
          disabled={!canManage}
          variant="ghost"
          title={accountStatusLabel(account.status)}
        >
          <Settings size={16} />
          Настроить
        </Button>
      </div>
    </section>
  );
}
