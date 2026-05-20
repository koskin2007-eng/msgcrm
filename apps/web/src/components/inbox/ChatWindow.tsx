import { getConnectedAccount, getListing } from "../../lib/mock-data";
import { formatCurrency, platformLabel } from "../../lib/format";
import type { ConnectedAccount, Conversation, Listing, Message } from "../../lib/types";
import { ConversationStatusBadge } from "../ui/StatusBadge";
import { CustomerCard } from "./CustomerCard";
import { DeliveryCard } from "./DeliveryCard";
import { ListingCard } from "./ListingCard";
import { MessageBubble } from "./MessageBubble";
import { ReplyBox } from "./ReplyBox";

interface ChatWindowProps {
  conversation: Conversation;
  messages: Message[];
  account?: ConnectedAccount;
  canCalculateDelivery?: boolean;
  canCreateDeal?: boolean;
  canReply?: boolean;
  isSending?: boolean;
  listing?: Listing;
  replyText: string;
  sendError?: string | null;
  onReplyTextChange: (value: string) => void;
  onSend: () => void | Promise<void>;
  onCreateDeal: () => void;
}

export function ChatWindow({
  conversation,
  messages,
  account: accountOverride,
  canCalculateDelivery = true,
  canCreateDeal = true,
  canReply = true,
  isSending = false,
  listing: listingOverride,
  replyText,
  sendError,
  onReplyTextChange,
  onSend,
  onCreateDeal
}: ChatWindowProps) {
  const listing = listingOverride ?? getListing(conversation.listingId);
  const account = accountOverride ?? getConnectedAccount(conversation.connectedAccountId);

  if (!listing) {
    return null;
  }

  return (
    <section className="chat-layout">
      <section className="chat-panel">
        <header className="chat-header">
          <div>
            <div className="chat-title-row">
              <h2>
                {conversation.customerName} · {platformLabel(conversation.source)}
              </h2>
              <ConversationStatusBadge status={conversation.status} />
            </div>
            <p>
              Объявление: {listing.title} · Цена:{" "}
              {listing.price ? formatCurrency(listing.price) : "не указана"} ·
              Аккаунт: {account?.title ?? "не указан"}
            </p>
          </div>
        </header>

        <div className="message-list">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </div>

        <ReplyBox
          canCalculateDelivery={canCalculateDelivery}
          canCreateDeal={canCreateDeal}
          canReply={canReply}
          isSending={isSending}
          onChange={onReplyTextChange}
          onCreateDeal={onCreateDeal}
          onSend={onSend}
          sendError={sendError}
          value={replyText}
        />
      </section>

      <aside className="right-info-panel">
        <ListingCard listing={listing} />
        <CustomerCard conversation={conversation} />
        <DeliveryCard canCalculateDelivery={canCalculateDelivery} />
      </aside>
    </section>
  );
}
