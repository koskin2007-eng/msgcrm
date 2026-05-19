import { getConnectedAccount, getListing } from "../../lib/mock-data";
import { formatCurrency, formatTime, platformLabel } from "../../lib/format";
import type { Conversation } from "../../lib/types";
import { ConversationStatusBadge } from "../ui/StatusBadge";

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onSelect: () => void;
}

export function ConversationItem({ conversation, isActive, onSelect }: ConversationItemProps) {
  const listing = getListing(conversation.listingId);
  const account = getConnectedAccount(conversation.connectedAccountId);

  return (
    <button className={`conversation-card ${isActive ? "active" : ""}`} onClick={onSelect} type="button">
      <div className="conversation-card-head">
        <strong>{conversation.customerName}</strong>
        <span>{formatTime(conversation.updatedAt)}</span>
      </div>
      <div className="conversation-title-row">
        <span>{listing?.title}</span>
        <small>{listing ? formatCurrency(listing.price) : ""}</small>
      </div>
      <p>{conversation.lastMessage}</p>
      <div className="conversation-meta">
        <span>
          {platformLabel(conversation.source)} · {account?.title}
        </span>
        <ConversationStatusBadge status={conversation.status} />
      </div>
    </button>
  );
}
