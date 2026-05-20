"use client";

import { useMemo, useState } from "react";
import {
  connectedAccounts as mockConnectedAccounts,
  conversations as mockConversations,
  listings as mockListings,
  messages as mockMessages
} from "../../lib/mock-data";
import { sendInboxMessage } from "../../lib/inbox-client";
import type { ConnectedAccount, Conversation, Listing, Message } from "../../lib/types";
import { EmptyState } from "../ui/EmptyState";
import { ChatWindow } from "./ChatWindow";
import { ConversationList, type InboxFilter } from "./ConversationList";

interface InboxWorkspaceProps {
  accounts?: ConnectedAccount[];
  backendConversationIds?: string[];
  canCalculateDelivery?: boolean;
  canCreateDeal?: boolean;
  canReply?: boolean;
  conversations?: Conversation[];
  listings?: Listing[];
  messages?: Message[];
}

function filterConversations(
  conversations: Conversation[],
  messages: Message[],
  filter: InboxFilter
) {
  if (filter === "new") {
    return conversations.filter((conversation) => conversation.status === "new");
  }

  if (filter === "delivery") {
    return conversations.filter((conversation) => conversation.hasDelivery);
  }

  if (filter === "deals") {
    return conversations.filter((conversation) => conversation.hasDeal);
  }

  if (filter === "unanswered") {
    return conversations.filter((conversation) => {
      const lastMessage = messages
        .filter((message) => message.conversationId === conversation.id)
        .at(-1);

      return lastMessage?.sender === "customer";
    });
  }

  return conversations;
}

function mapById<T extends { id: string }>(items: T[]) {
  return new Map(items.map((item) => [item.id, item]));
}

export function InboxWorkspace({
  accounts = mockConnectedAccounts,
  backendConversationIds = [],
  canCalculateDelivery = true,
  canCreateDeal = true,
  canReply = true,
  conversations: initialConversations = mockConversations,
  listings = mockListings,
  messages: initialMessages = mockMessages
}: InboxWorkspaceProps) {
  const [conversations, setConversations] = useState(initialConversations);
  const [messages, setMessages] = useState(initialMessages);
  const [selectedId, setSelectedId] = useState(initialConversations[0]?.id ?? "");
  const [filter, setFilter] = useState<InboxFilter>("all");
  const [replyText, setReplyText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const accountsById = useMemo(() => mapById(accounts), [accounts]);
  const backendIds = useMemo(
    () => new Set(backendConversationIds),
    [backendConversationIds]
  );
  const listingsById = useMemo(() => mapById(listings), [listings]);

  const visibleConversations = useMemo(
    () => filterConversations(conversations, messages, filter),
    [conversations, filter, messages]
  );

  const selectedConversation =
    conversations.find((conversation) => conversation.id === selectedId) ??
    visibleConversations[0] ??
    conversations[0];

  const selectedMessages = selectedConversation
    ? messages.filter((message) => message.conversationId === selectedConversation.id)
    : [];

  async function handleSend() {
    const text = replyText.trim();

    if (!canReply || !selectedConversation || !text || isSending) {
      return;
    }

    setSendError(null);
    setIsSending(true);

    try {
      const nextMessage = backendIds.has(selectedConversation.id)
        ? await sendInboxMessage(selectedConversation.id, text)
        : {
            id: `message_mock_${Date.now()}`,
            conversationId: selectedConversation.id,
            sender: "manager" as const,
            text,
            createdAt: new Date().toISOString()
          };

      setMessages((current) => [...current, nextMessage]);
      setConversations((current) =>
        current.map((conversation) =>
          conversation.id === selectedConversation.id
            ? {
                ...conversation,
                lastMessage: text,
                status: "waiting_customer",
                updatedAt: nextMessage.createdAt,
                unreadCount: 0
              }
            : conversation
        )
      );
      setReplyText("");
    } catch (error) {
      setSendError(
        error instanceof Error ? error.message : "Не удалось отправить сообщение"
      );
    } finally {
      setIsSending(false);
    }
  }

  function handleCreateDeal() {
    if (!canCreateDeal || !selectedConversation) {
      return;
    }

    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === selectedConversation.id
          ? { ...conversation, hasDeal: true, status: "ready_to_deal" }
          : conversation
      )
    );
  }

  return (
    <div className="inbox-workspace">
      <ConversationList
        accountsById={accountsById}
        conversations={visibleConversations}
        filter={filter}
        listingsById={listingsById}
        onFilterChange={setFilter}
        onSelect={setSelectedId}
        selectedId={selectedConversation?.id ?? ""}
      />

      {selectedConversation ? (
        <ChatWindow
          account={accountsById.get(selectedConversation.connectedAccountId)}
          canCalculateDelivery={canCalculateDelivery}
          canCreateDeal={canCreateDeal}
          canReply={canReply}
          conversation={selectedConversation}
          isSending={isSending}
          listing={listingsById.get(selectedConversation.listingId)}
          messages={selectedMessages}
          onCreateDeal={handleCreateDeal}
          onReplyTextChange={setReplyText}
          onSend={handleSend}
          replyText={replyText}
          sendError={sendError}
        />
      ) : (
        <section className="chat-empty-state">
          <EmptyState
            description="Подключите Авито или Telegram, чтобы получать обращения в этом рабочем пространстве."
            title="Выберите диалог"
          />
        </section>
      )}
    </div>
  );
}
