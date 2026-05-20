export type ChannelType = "avito" | "telegram";

export type ConversationStatus = "new" | "open" | "waiting" | "closed";

export type MessageDirection = "inbound" | "outbound";

export type AgentMode = "approval" | "manual" | "auto_reply";

export type TelegramBotStatus = "connected" | "disconnected" | "error";

export type SuggestedReplyStatus = "draft" | "approved" | "rejected" | "sent";

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

export interface AgentSummary {
  id: string;
  companyId: string;
  name: string;
  role: string;
  tone: string;
  isActive: boolean;
  mode: AgentMode;
  assignedTelegramBot: {
    id: string;
    displayName: string;
    botUsername: string | null;
    status: string;
  } | null;
}

export interface KnowledgeDocumentSummary {
  id: string;
  companyId: string | null;
  title: string;
  source: string | null;
  chunksCount: number;
  updatedAt: string;
}

export interface TelegramBotIntegrationSummary {
  id: string;
  companyId: string;
  agentId: string | null;
  displayName: string;
  botUsername: string | null;
  status: string;
  mode: AgentMode;
  webhookUrl: string | null;
}

export interface SuggestedReplyView {
  id: string;
  companyId: string;
  conversationId: string;
  messageId: string | null;
  agentId: string | null;
  text: string;
  status: SuggestedReplyStatus;
  createdAt: string;
}
