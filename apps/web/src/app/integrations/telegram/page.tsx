import { Send } from "lucide-react";
import { redirect } from "next/navigation";
import {
  TelegramCheckButton,
  TelegramConnectForm
} from "../../../components/telegram/TelegramConnectForm";
import { AppLayout } from "../../../components/layout/AppLayout";
import { Badge } from "../../../components/ui/Badge";
import { EmptyState } from "../../../components/ui/EmptyState";
import { PageHeader } from "../../../components/ui/PageHeader";
import { fetchAgents } from "../../../lib/agents-server";
import { fetchAuthSession } from "../../../lib/auth-server";
import { formatDateTime } from "../../../lib/format";
import { canManageTelegram } from "../../../lib/permissions";
import { fetchTelegramIntegrations } from "../../../lib/telegram-server";

function statusTone(status: string) {
  if (status === "CONNECTED") {
    return "green" as const;
  }

  if (status === "ERROR") {
    return "red" as const;
  }

  return "gray" as const;
}

function modeLabel(mode: string) {
  if (mode === "auto_reply") {
    return "Автоответ, позже";
  }

  if (mode === "manual") {
    return "Только готовить ответ";
  }

  return "После подтверждения";
}

export default async function TelegramIntegrationPage() {
  const session = await fetchAuthSession();

  if (!session) {
    redirect("/login");
  }

  const [agents, integrations] = await Promise.all([
    fetchAgents(),
    fetchTelegramIntegrations()
  ]);
  const canManage = canManageTelegram(session.user.role);

  return (
    <AppLayout session={session}>
      <section className="page-content">
        <PageHeader
          description="Подключите Telegram-бота, назначьте AI-агента и включите безопасный режим подтверждения ответов менеджером."
          title="Telegram"
        />
        <div className="telegram-layout">
          <section className="telegram-connect-card">
            <h2>Подключить бота</h2>
            <p>
              Токен хранится только на backend в зашифрованном виде. В GitHub,
              mock-данные и документацию реальные токены не попадают.
            </p>
            <TelegramConnectForm agents={agents} canManage={canManage} />
          </section>
          <section className="telegram-list-card">
            <h2>Подключения</h2>
            {integrations.length ? (
              <div className="telegram-list">
                {integrations.map((integration) => (
                  <article className="telegram-card" key={integration.id}>
                    <div className="telegram-card-head">
                      <span className="agent-icon">
                        <Send size={18} />
                      </span>
                      <div>
                        <h3>{integration.displayName}</h3>
                        <p>
                          {integration.botUsername
                            ? `@${integration.botUsername}`
                            : "username не проверен"}
                        </p>
                      </div>
                      <Badge tone={statusTone(integration.status)}>
                        {integration.status}
                      </Badge>
                    </div>
                    <dl className="info-list">
                      <div>
                        <dt>Агент</dt>
                        <dd>{integration.agent?.name ?? "не назначен"}</dd>
                      </div>
                      <div>
                        <dt>Режим</dt>
                        <dd>{modeLabel(integration.mode)}</dd>
                      </div>
                      <div>
                        <dt>Webhook</dt>
                        <dd>{integration.webhookUrl ?? "нужен TELEGRAM_WEBHOOK_BASE_URL"}</dd>
                      </div>
                      <div>
                        <dt>Последний webhook</dt>
                        <dd>
                          {integration.lastWebhookAt
                            ? formatDateTime(integration.lastWebhookAt)
                            : "ещё не было"}
                        </dd>
                      </div>
                    </dl>
                    <TelegramCheckButton
                      canManage={canManage}
                      integration={integration}
                    />
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState
                description="Сохраните токен бота из BotFather и назначьте агента."
                title="Telegram-боты ещё не подключены"
              />
            )}
          </section>
        </div>
      </section>
    </AppLayout>
  );
}
