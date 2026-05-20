"use client";

import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";
import { createAgent, updateAgent } from "../../lib/agents-client";
import type { Agent } from "../../lib/types";
import { Button } from "../ui/Button";
import { Input, Textarea } from "../ui/Input";

interface AgentFormProps {
  agent?: Agent | null;
  canManage: boolean;
}

export function AgentForm({ agent, canManage }: AgentFormProps) {
  const router = useRouter();
  const [name, setName] = useState(agent?.name ?? "");
  const [role, setRole] = useState(agent?.role ?? "AI-менеджер поддержки");
  const [tone, setTone] = useState(agent?.tone ?? "Вежливый, короткий, деловой");
  const [instructions, setInstructions] = useState(agent?.instructions ?? "");
  const [restrictions, setRestrictions] = useState(agent?.restrictions ?? "");
  const [handoffRules, setHandoffRules] = useState(agent?.handoffRules ?? "");
  const [isActive, setIsActive] = useState(agent?.isActive ?? true);
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
      const payload = {
        name,
        role,
        tone,
        instructions,
        restrictions,
        handoffRules,
        isActive
      };

      if (agent) {
        await updateAgent(agent.id, payload);
        setMessage("Агент сохранён");
        router.refresh();
      } else {
        const created = await createAgent(payload);
        router.push(`/agents/${created.id}`);
      }
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Не удалось сохранить агента"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="agent-form" onSubmit={handleSubmit}>
      {!canManage ? (
        <p className="permission-note">Создавать и менять агентов могут только owner и admin.</p>
      ) : null}
      {message ? <p className="profile-message">{message}</p> : null}
      {error ? <p className="profile-error">{error}</p> : null}

      <label>
        Название агента
        <Input
          onChange={(event) => setName(event.target.value)}
          placeholder="Telegram помощник"
          readOnly={!canManage}
          required
          value={name}
        />
      </label>
      <label>
        Роль агента
        <Input
          onChange={(event) => setRole(event.target.value)}
          placeholder="AI-менеджер поддержки и продаж"
          readOnly={!canManage}
          required
          value={role}
        />
      </label>
      <label>
        Тон общения
        <Input
          onChange={(event) => setTone(event.target.value)}
          placeholder="Вежливый, уверенный, короткий"
          readOnly={!canManage}
          required
          value={tone}
        />
      </label>
      <label>
        Статус
        <select
          className="input"
          disabled={!canManage}
          onChange={(event) => setIsActive(event.target.value === "active")}
          value={isActive ? "active" : "paused"}
        >
          <option value="active">Активен</option>
          <option value="paused">Пауза</option>
        </select>
      </label>
      <label className="span-2">
        Основная инструкция
        <Textarea
          onChange={(event) => setInstructions(event.target.value)}
          placeholder="Что агент должен делать, как отвечать и какие данные уточнять"
          readOnly={!canManage}
          required
          value={instructions}
        />
      </label>
      <label>
        Что агенту запрещено
        <Textarea
          onChange={(event) => setRestrictions(event.target.value)}
          placeholder="Не обещать скидки, не давать юридические гарантии..."
          readOnly={!canManage}
          value={restrictions}
        />
      </label>
      <label>
        Когда передавать человеку
        <Textarea
          onChange={(event) => setHandoffRules(event.target.value)}
          placeholder="Оплата, жалобы, нестандартные условия..."
          readOnly={!canManage}
          value={handoffRules}
        />
      </label>
      <div className="span-2 profile-actions">
        <Button disabled={!canManage || isSubmitting} type="submit">
          <Save size={16} />
          {isSubmitting ? "Сохраняем..." : "Сохранить агента"}
        </Button>
      </div>
    </form>
  );
}
