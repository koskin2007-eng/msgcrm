"use client";

import { useMemo, useState } from "react";
import {
  conversations as initialConversations,
  getMessages,
  messages as initialMessages
} from "../../lib/mock-data";
import type { Conversation, Message } from "../../lib/types";
import { ChatWindow } from "./ChatWindow";
import { ConversationList, type InboxFilter } from "./ConversationList";

function filterConversations(conversations: Conversation[], messages: Message[], filter: InboxFilter) {
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

export function InboxWorkspace() {
  const [conversations, setConversations] = useState(initialConversations);
  const [messages, setMessages] = useState(initialMessages);
  const [selectedId, setSelectedId] = useState(initialConversations[0]?.id ?? "");
  const [filter, setFilter] = useState<InboxFilter>("all");
  const [replyText, setReplyText] = useState("");

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

  function handleSend() {
    const text = replyText.trim();

    if (!selectedConversation || !text) {
      return;
    }

    const now = new Date().toISOString();
    const nextMessage: Message = {
      id: `message_mock_${Date.now()}`,
      conversationId: selectedConversation.id,
      sender: "manager",
      text,
      createdAt: now
    };

    setMessages((current) => [...current, nextMessage]);
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === selectedConversation.id
          ? {
              ...conversation,
              lastMessage: text,
              status: "waiting_customer",
              updatedAt: now,
              unreadCount: 0
            }
          : conversation
      )
    );
    setReplyText("");
  }

  function handleCreateDeal() {
    if (!selectedConversation) {
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
        conversations={visibleConversations}
        filter={filter}
        onFilterChange={setFilter}
        onSelect={setSelectedId}
        selectedId={selectedConversation?.id ?? ""}
      />

      {selectedConversation ? (
        <ChatWindow
          conversation={selectedConversation}
          messages={selectedMessages.length ? selectedMessages : getMessages(selectedConversation.id)}
          onCreateDeal={handleCreateDeal}
          onReplyTextChange={setReplyText}
          onSend={handleSend}
          replyText={replyText}
        />
      ) : null}
    </div>
  );
}
