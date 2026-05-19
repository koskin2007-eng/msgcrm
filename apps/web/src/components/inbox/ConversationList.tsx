import type { Conversation } from "../../lib/types";
import { ConversationItem } from "./ConversationItem";

export type InboxFilter = "all" | "new" | "unanswered" | "delivery" | "deals";

const filters: Array<{ id: InboxFilter; label: string }> = [
  { id: "all", label: "Все" },
  { id: "new", label: "Новые" },
  { id: "unanswered", label: "Неотвеченные" },
  { id: "delivery", label: "С доставкой" },
  { id: "deals", label: "Сделки" }
];

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: string;
  filter: InboxFilter;
  onFilterChange: (filter: InboxFilter) => void;
  onSelect: (conversationId: string) => void;
}

export function ConversationList({
  conversations,
  selectedId,
  filter,
  onFilterChange,
  onSelect
}: ConversationListProps) {
  return (
    <section className="conversation-column">
      <div className="conversation-column-head">
        <div>
          <h2>Входящие</h2>
          <p>{conversations.length} диалога в рабочем пространстве</p>
        </div>
      </div>

      <div className="filter-row">
        {filters.map((item) => (
          <button
            className={`filter-pill ${filter === item.id ? "active" : ""}`}
            key={item.id}
            onClick={() => onFilterChange(item.id)}
            type="button"
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="conversation-scroll">
        {conversations.map((conversation) => (
          <ConversationItem
            conversation={conversation}
            isActive={conversation.id === selectedId}
            key={conversation.id}
            onSelect={() => onSelect(conversation.id)}
          />
        ))}
      </div>
    </section>
  );
}
