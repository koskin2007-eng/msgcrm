"use client";

import { PlugZap, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";
import { checkTelegramIntegration, connectTelegramIntegration } from "../../lib/telegram-client";
import type { Agent, AgentMode, TelegramBotIntegration } from "../../lib/types";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

interface TelegramConnectFormProps {
  agents: Agent[];
  canManage: boolean;
}

interface TelegramCheckButtonProps {
  integration: TelegramBotIntegration;
  canManage: boolean;
}

export function TelegramConnectForm({ agents, canManage }: TelegramConnectFormProps) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [botToken, setBotToken] = useState("");
  const [agentId, setAgentId] = useState(agents[0]?.id ?? "");
  const [mode, setMode] = useState<AgentMode>("approval");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canManage || isSubmitting) {
      return;
    }

    setMessage(null);
    setError(null);
    setIsSubmitting(true);

    try {
      await connectTelegramIntegration({
        displayName,
        botToken,
        agentId: agentId || undefined,
        mode
      });
      setDisplayName("");
      setBotToken("");
      setMessage("Telegram-бот сохранён. Теперь проверьте подключение.");
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Не удалось подключить Telegram-бота"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="telegram-form" onSubmit={handleSubmit}>
      {!canManage ? (
        <p className="permission-note">Подключать Telegram-ботов могут только owner и admin.</p>
      ) : null}
      {message ? <p className="profile-message">{message}</p> : null}
      {error ? <p className="profile-error">{error}</p> : null}
      <label>
        Название подключения
        <Input
          onChange={(event) => setDisplayName(event.target.value)}
          placeholder="Telegram Support Bot"
          readOnly={!canManage}
          required
          value={displayName}
        />
      </label>
      <label>
        Telegram bot token
        <Input
          autoComplete="off"
          onChange={(event) => setBotToken(event.target.value)}
          placeholder="123456:ABC..."
          readOnly={!canManage}
          required
          type="password"
          value={botToken}
        />
      </label>
      <label>
        Назначенный агент
        <select
          className="input"
          disabled={!canManage}
          onChange={(event) => setAgentId(event.target.value)}
          value={agentId}
        >
          <option value="">Без агента</option>
          {agents.map((agent) => (
            <option key={agent.id} value={agent.id}>
              {agent.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Режим работы
        <select
          className="input"
          disabled={!canManage}
          onChange={(event) => setMode(event.target.value as AgentMode)}
          value={mode}
        >
          <option value="manual">Только готовить ответ</option>
          <option value="approval">Отправка после подтверждения</option>
          <option disabled value="auto_reply">Автоответ, позже</option>
        </select>
      </label>
      <div className="span-2 profile-actions">
        <Button disabled={!canManage || isSubmitting} type="submit">
          <PlugZap size={16} />
          {isSubmitting ? "Сохраняем..." : "Сохранить"}
        </Button>
      </div>
    </form>
  );
}

export function TelegramCheckButton({
  integration,
  canManage
}: TelegramCheckButtonProps) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  async function handleCheck() {
    if (!canManage || isChecking) {
      return;
    }

    setMessage(null);
    setError(null);
    setIsChecking(true);

    try {
      const checked = await checkTelegramIntegration(integration.id);
      setMessage(checked.webhookUrl ? "Webhook установлен" : "Бот проверен");
      router.refresh();
    } catch (checkError) {
      setError(
        checkError instanceof Error ? checkError.message : "Не удалось проверить бота"
      );
    } finally {
      setIsChecking(false);
    }
  }

  return (
    <div className="integration-create-action">
      <Button disabled={!canManage || isChecking} onClick={handleCheck} variant="secondary">
        <ShieldCheck size={16} />
        {isChecking ? "Проверяем..." : "Проверить подключение"}
      </Button>
      {message ? <p className="integration-message">{message}</p> : null}
      {error ? <p className="integration-error">{error}</p> : null}
    </div>
  );
}
