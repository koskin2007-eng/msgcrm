import type { ConnectedAccount, Conversation, Listing } from "../../lib/types";
import { EmptyState } from "../ui/EmptyState";
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
  accountsById?: Map<string, ConnectedAccount>;
  listingsById?: Map<string, Listing>;
  onFilterChange: (filter: InboxFilter) => void;
  onSelect: (conversationId: string) => void;
}

export function ConversationList({
  conversations,
  selectedId,
  filter,
  accountsById,
  listingsById,
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
        {conversations.length ? (
          conversations.map((conversation) => (
            <ConversationItem
              account={accountsById?.get(conversation.connectedAccountId)}
              conversation={conversation}
              isActive={conversation.id === selectedId}
              key={conversation.id}
              listing={listingsById?.get(conversation.listingId)}
              onSelect={() => onSelect(conversation.id)}
            />
          ))
        ) : (
          <div className="conversation-empty">
            <EmptyState
              description="После подключения канала здесь появятся обращения клиентов."
              title="Диалогов пока нет"
            />
          </div>
        )}
      </div>
    </section>
  );
}
