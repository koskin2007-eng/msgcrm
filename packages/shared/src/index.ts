export type ChannelType = "avito" | "telegram";

export type ConversationStatus = "new" | "open" | "waiting" | "closed";

export type MessageDirection = "inbound" | "outbound";

export interface ChannelAccountSummary {
  id: string;
  type: ChannelType;
  displayName: string;
  isActive: boolean;
}

export interface ConversationSummary {
  id: string;
  channelAccountId: string;
  customerName: string | null;
  listingTitle: string | null;
  status: ConversationStatus;
  lastMessageAt: string | null;
  unreadCount: number;
}

export interface MessageView {
  id: string;
  conversationId: string;
  direction: MessageDirection;
  authorName: string | null;
  text: string;
  sentAt: string;
}
