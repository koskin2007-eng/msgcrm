import { getConnectedAccount, getListing } from "../../lib/mock-data";
import { formatCurrency, formatTime, platformLabel } from "../../lib/format";
import type { ConnectedAccount, Conversation, Listing } from "../../lib/types";
import { ConversationStatusBadge } from "../ui/StatusBadge";

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  account?: ConnectedAccount;
  listing?: Listing;
  onSelect: () => void;
}

export function ConversationItem({
  conversation,
  isActive,
  account: accountOverride,
  listing: listingOverride,
  onSelect
}: ConversationItemProps) {
  const listing = listingOverride ?? getListing(conversation.listingId);
  const account = accountOverride ?? getConnectedAccount(conversation.connectedAccountId);

  return (
    <button className={`conversation-card ${isActive ? "active" : ""}`} onClick={onSelect} type="button">
      <div className="conversation-card-head">
        <strong>{conversation.customerName}</strong>
        <span>{formatTime(conversation.updatedAt)}</span>
      </div>
      <div className="conversation-title-row">
        <span>{listing?.title ?? "Диалог без объявления"}</span>
        <small>{listing?.price ? formatCurrency(listing.price) : ""}</small>
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
