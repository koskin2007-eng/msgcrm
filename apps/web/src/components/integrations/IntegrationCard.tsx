"use client";

import { Plug, Settings, Unplug } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { accountStatusLabel, platformLabel } from "../../lib/format";
import {
  createIntegrationAccount,
  isSupportedIntegrationPlatform,
  updateIntegrationAccount
} from "../../lib/integrations-client";
import type { ConnectedAccount } from "../../lib/types";
import { Button } from "../ui/Button";
import { AccountStatusBadge } from "../ui/StatusBadge";

interface IntegrationCardProps {
  account: ConnectedAccount;
  canManage?: boolean;
}

export function IntegrationCard({ account, canManage = true }: IntegrationCardProps) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const canConnect =
    canManage &&
    account.status === "disconnected" &&
    isSupportedIntegrationPlatform(account.platform);
  const canDisconnect =
    canManage && (account.status === "connected" || account.status === "auth_error");
  const canConfigure = canManage && account.status !== "coming_soon";

  async function handleConnect() {
    if (!canConnect || isSubmitting) {
      return;
    }

    setMessage(null);
    setError(null);
    setIsSubmitting(true);

    try {
      if (account.isPlaceholder) {
        if (!isSupportedIntegrationPlatform(account.platform)) {
          throw new Error("Эта интеграция пока недоступна для подключения");
        }

        await createIntegrationAccount({
          platform: account.platform,
          title: account.title
        });
      } else {
        await updateIntegrationAccount(account.id, true);
      }

      setMessage("Интеграция обновлена");
      router.refresh();
    } catch (connectError) {
      setError(
        connectError instanceof Error
          ? connectError.message
          : "Не удалось подключить интеграцию"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDisconnect() {
    if (!canDisconnect || isSubmitting) {
      return;
    }

    setMessage(null);
    setError(null);
    setIsSubmitting(true);

    try {
      await updateIntegrationAccount(account.id, false);
      setMessage("Интеграция отключена");
      router.refresh();
    } catch (disconnectError) {
      setError(
        disconnectError instanceof Error
          ? disconnectError.message
          : "Не удалось отключить интеграцию"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

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
      {message ? <p className="integration-message">{message}</p> : null}
      {error ? <p className="integration-error">{error}</p> : null}
      <div className="integration-stats">
        <span>Новых сообщений</span>
        <strong>{account.unreadCount}</strong>
      </div>
      <div className="integration-actions">
        <Button
          disabled={!canConnect || isSubmitting}
          onClick={handleConnect}
          variant={canConnect ? "primary" : "secondary"}
        >
          <Plug size={16} />
          {isSubmitting && canConnect ? "Подключаем..." : "Подключить"}
        </Button>
        <Button
          disabled={!canDisconnect || isSubmitting}
          onClick={handleDisconnect}
          variant="secondary"
        >
          <Unplug size={16} />
          {isSubmitting && canDisconnect ? "Отключаем..." : "Отключить"}
        </Button>
        <Button
          disabled={!canConfigure}
          onClick={() => setMessage("Настройки OAuth подключим отдельным этапом")}
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
