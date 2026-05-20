import Link from "next/link";
import { Bot, Settings } from "lucide-react";
import type { Agent } from "../../lib/types";
import { Badge } from "../ui/Badge";

interface AgentCardProps {
  agent: Agent;
}

function modeLabel(mode: Agent["mode"]) {
  if (mode === "auto_reply") {
    return "auto-reply";
  }

  if (mode === "manual") {
    return "только черновики";
  }

  return "approval";
}

export function AgentCard({ agent }: AgentCardProps) {
  return (
    <section className="agent-card">
      <div className="agent-card-head">
        <span className="agent-icon">
          <Bot size={20} />
        </span>
        <div>
          <h3>{agent.name}</h3>
          <p>{agent.role}</p>
        </div>
        <Badge tone={agent.isActive ? "green" : "gray"}>
          {agent.isActive ? "активен" : "пауза"}
        </Badge>
      </div>
      <dl className="info-list">
        <div>
          <dt>Тон</dt>
          <dd>{agent.tone}</dd>
        </div>
        <div>
          <dt>Telegram-бот</dt>
          <dd>{agent.assignedTelegramBot?.displayName ?? "не назначен"}</dd>
        </div>
        <div>
          <dt>Режим</dt>
          <dd>{modeLabel(agent.mode)}</dd>
        </div>
      </dl>
      <Link className="button button-secondary" href={`/agents/${agent.id}`}>
        <Settings size={16} />
        Настроить
      </Link>
    </section>
  );
}
