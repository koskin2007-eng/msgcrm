export type UserRole = "owner" | "admin" | "manager" | "viewer";

export type Platform =
  | "avito"
  | "drom"
  | "youla"
  | "vk"
  | "telegram"
  | "ozon_delivery"
  | "cdek"
  | "boxberry"
  | "russian_post"
  | "pickup";

export type ConnectedAccountStatus =
  | "connected"
  | "auth_error"
  | "disconnected"
  | "coming_soon";

export type ConversationStatus =
  | "new"
  | "in_progress"
  | "waiting_customer"
  | "ready_to_deal"
  | "closed";

export type DealStatus =
  | "new_lead"
  | "waiting_pickup_point"
  | "delivery_calculated"
  | "waiting_payment"
  | "shipped"
  | "closed";

export type DeliveryStatus =
  | "calculation_needed"
  | "calculated"
  | "awaiting_pickup_point"
  | "shipped"
  | "delivered";

export type AgentMode = "approval" | "manual" | "auto_reply";

export type TelegramIntegrationStatus = "CONNECTED" | "DISCONNECTED" | "ERROR";

export type SuggestedReplyStatus = "DRAFT" | "APPROVED" | "REJECTED" | "SENT";

export interface Company {
  id: string;
  name: string;
  createdAt: string;
}

export interface User {
  id: string;
  companyId: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
}

export interface TeamMember extends User {
  status: "active" | "invited" | "blocked";
  joinedAt: string;
}

export interface ConnectedAccount {
  id: string;
  companyId: string;
  platform: Platform;
  title: string;
  status: ConnectedAccountStatus;
  unreadCount: number;
  description: string;
  isPlaceholder?: boolean;
}

export interface Listing {
  id: string;
  companyId: string;
  connectedAccountId: string;
  title: string;
  price: number;
  source: Platform;
  accountTitle: string;
  city: string;
  status: "active" | "paused" | "archived";
  messagesCount: number;
  stock: number;
  dimensions: string;
  weight: string;
  photoLabel: string;
}

export interface Conversation {
  id: string;
  companyId: string;
  connectedAccountId: string;
  listingId: string;
  customerName: string;
  customerPhone: string;
  customerPickupPoint: string;
  lastMessage: string;
  status: ConversationStatus;
  source: Platform;
  createdAt: string;
  updatedAt: string;
  unreadCount: number;
  assigneeName: string;
  hasDelivery: boolean;
  hasDeal: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  sender: "customer" | "manager";
  text: string;
  createdAt: string;
}

export interface SuggestedReply {
  id: string;
  companyId: string;
  conversationId: string;
  messageId: string | null;
  agentId: string | null;
  text: string;
  status: SuggestedReplyStatus;
  createdAt: string;
}

export interface Deal {
  id: string;
  companyId: string;
  conversationId: string;
  customerName: string;
  listingTitle: string;
  amount: number;
  deliveryStatus: string;
  dealStatus: DealStatus;
  managerName: string;
  createdAt: string;
}

export interface QuickReplyTemplate {
  id: string;
  companyId: string;
  title: string;
  text: string;
}

export interface DeliveryOption {
  id: string;
  companyId: string;
  title: string;
  platform: Platform;
  status: ConnectedAccountStatus;
  priceLabel?: string;
  etaLabel?: string;
}

export interface Agent {
  id: string;
  companyId: string;
  name: string;
  role: string;
  tone: string;
  instructions: string;
  restrictions: string | null;
  handoffRules: string | null;
  isActive: boolean;
  mode: AgentMode;
  assignedTelegramBot: {
    id: string;
    displayName: string;
    botUsername: string | null;
    status: TelegramIntegrationStatus | string;
  } | null;
  knowledgeDocumentIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeDocument {
  id: string;
  companyId: string | null;
  title: string;
  source: string | null;
  body: string;
  chunksCount: number;
  agentIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TelegramBotIntegration {
  id: string;
  companyId: string;
  agentId: string | null;
  displayName: string;
  botUsername: string | null;
  webhookUrl: string | null;
  status: TelegramIntegrationStatus;
  mode: AgentMode;
  approvalRequired: boolean;
  autoReplyEnabled: boolean;
  lastWebhookAt: string | null;
  agent: {
    id: string;
    name: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}
