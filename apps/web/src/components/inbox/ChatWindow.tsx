import { getConnectedAccount, getListing } from "../../lib/mock-data";
import { formatCurrency, platformLabel } from "../../lib/format";
import type { Conversation, Message } from "../../lib/types";
import { ConversationStatusBadge } from "../ui/StatusBadge";
import { CustomerCard } from "./CustomerCard";
import { DeliveryCard } from "./DeliveryCard";
import { ListingCard } from "./ListingCard";
import { MessageBubble } from "./MessageBubble";
import { ReplyBox } from "./ReplyBox";

interface ChatWindowProps {
  conversation: Conversation;
  messages: Message[];
  replyText: string;
  onReplyTextChange: (value: string) => void;
  onSend: () => void;
  onCreateDeal: () => void;
}

export function ChatWindow({
  conversation,
  messages,
  replyText,
  onReplyTextChange,
  onSend,
  onCreateDeal
}: ChatWindowProps) {
  const listing = getListing(conversation.listingId);
  const account = getConnectedAccount(conversation.connectedAccountId);

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
              Объявление: {listing.title} · Цена: {formatCurrency(listing.price)} · Аккаунт: {account?.title}
            </p>
          </div>
        </header>

        <div className="message-list">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </div>

        <ReplyBox
          onChange={onReplyTextChange}
          onCreateDeal={onCreateDeal}
          onSend={onSend}
          value={replyText}
        />
      </section>

      <aside className="right-info-panel">
        <ListingCard listing={listing} />
        <CustomerCard conversation={conversation} />
        <DeliveryCard />
      </aside>
    </section>
  );
}
