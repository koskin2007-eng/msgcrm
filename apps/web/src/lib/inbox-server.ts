import "server-only";
import type {
  ConnectedAccount,
  Conversation,
  ConversationStatus,
  Listing,
  Message,
  Platform,
  SuggestedReply
} from "./types";
import { getServerCookieHeader } from "./auth-server";

interface ApiConversationSummary {
  id: string;
  status: "NEW" | "OPEN" | "WAITING" | "CLOSED";
  channel: {
    id: string;
    type: "AVITO" | "TELEGRAM";
    displayName: string;
  };
  customer: {
    id: string;
    displayName: string | null;
  } | null;
  listing: {
    id: string;
    title: string;
    url: string | null;
  } | null;
  assignee: {
    id: string;
    displayName: string;
  } | null;
  lastMessage: {
    id: string;
    direction: "INBOUND" | "OUTBOUND";
    text: string;
    sentAt: string;
  } | null;
  suggestedReply: ApiSuggestedReply | null;
  lastMessageAt: string | null;
  unreadCount: number;
}

interface ApiConversationDetail {
  id: string;
  customer: {
    id: string;
    displayName: string | null;
    phone: string | null;
  } | null;
  messages: Array<{
    id: string;
    direction: "INBOUND" | "OUTBOUND";
    text: string;
    sentAt: string;
  }>;
  suggestedReply: ApiSuggestedReply | null;
}

interface ApiSuggestedReply {
  id: string;
  companyId: string;
  conversationId?: string;
  messageId: string | null;
  agentId: string | null;
  text: string;
  status: "DRAFT" | "APPROVED" | "REJECTED" | "SENT";
  createdAt: string;
}

export interface InboxBootstrapData {
  accounts: ConnectedAccount[];
  backendConversationIds: string[];
  conversations: Conversation[];
  listings: Listing[];
  messages: Message[];
  suggestedReplies: SuggestedReply[];
}

function stripTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

function getInternalApiUrl() {
  return stripTrailingSlash(
    process.env.INTERNAL_API_URL ??
      process.env.NEXT_PUBLIC_API_URL ??
      "http://127.0.0.1:3001"
  );
}

function mapPlatform(type: ApiConversationSummary["channel"]["type"]): Platform {
  return type === "TELEGRAM" ? "telegram" : "avito";
}

function mapStatus(status: ApiConversationSummary["status"]): ConversationStatus {
  const statuses: Record<ApiConversationSummary["status"], ConversationStatus> = {
    NEW: "new",
    OPEN: "in_progress",
    WAITING: "waiting_customer",
    CLOSED: "closed"
  };

  return statuses[status];
}

async function fetchJson<T>(path: string): Promise<T | null> {
  const cookieHeader = await getServerCookieHeader();

  if (!cookieHeader) {
    return null;
  }

  const response = await fetch(`${getInternalApiUrl()}${path}`, {
    headers: {
      cookie: cookieHeader
    },
    cache: "no-store"
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}

function buildAccount(
  companyId: string,
  summary: ApiConversationSummary
): ConnectedAccount {
  return {
    id: summary.channel.id,
    companyId,
    platform: mapPlatform(summary.channel.type),
    title: summary.channel.displayName,
    status: "connected",
    unreadCount: summary.unreadCount,
    description: "Подключенный канал из backend API"
  };
}

function buildListing(companyId: string, summary: ApiConversationSummary): Listing {
  const platform = mapPlatform(summary.channel.type);

  return {
    id: summary.listing?.id ?? `listing_${summary.id}`,
    companyId,
    connectedAccountId: summary.channel.id,
    title: summary.listing?.title ?? "Диалог без объявления",
    price: 0,
    source: platform,
    accountTitle: summary.channel.displayName,
    city: "Не указан",
    status: "active",
    messagesCount: 0,
    stock: 0,
    dimensions: "Не указаны",
    weight: "Не указан",
    photoLabel: platform === "telegram" ? "Telegram" : "Авито"
  };
}

function buildConversation(
  companyId: string,
  summary: ApiConversationSummary,
  detail: ApiConversationDetail | null
): Conversation {
  const updatedAt =
    summary.lastMessageAt ?? summary.lastMessage?.sentAt ?? new Date().toISOString();

  return {
    id: summary.id,
    companyId,
    connectedAccountId: summary.channel.id,
    listingId: summary.listing?.id ?? `listing_${summary.id}`,
    customerName:
      detail?.customer?.displayName ??
      summary.customer?.displayName ??
      "Клиент",
    customerPhone: detail?.customer?.phone ?? "Не указан",
    customerPickupPoint: "Не указан",
    lastMessage: summary.lastMessage?.text ?? "Сообщений пока нет",
    status: mapStatus(summary.status),
    source: mapPlatform(summary.channel.type),
    createdAt: updatedAt,
    updatedAt,
    unreadCount: summary.unreadCount,
    assigneeName: summary.assignee?.displayName ?? "Не назначен",
    hasDelivery: false,
    hasDeal: false
  };
}

function buildMessages(detail: ApiConversationDetail | null): Message[] {
  return (
    detail?.messages.map((message) => ({
      id: message.id,
      conversationId: detail.id,
      sender: message.direction === "OUTBOUND" ? "manager" : "customer",
      text: message.text,
      createdAt: message.sentAt
    })) ?? []
  );
}

function buildSuggestedReply(
  conversationId: string,
  reply: ApiSuggestedReply | null
): SuggestedReply | null {
  if (!reply) {
    return null;
  }

  return {
    id: reply.id,
    companyId: reply.companyId,
    conversationId: reply.conversationId ?? conversationId,
    messageId: reply.messageId,
    agentId: reply.agentId,
    text: reply.text,
    status: reply.status,
    createdAt: reply.createdAt
  };
}

export async function fetchInboxBootstrap(
  companyId: string
): Promise<InboxBootstrapData> {
  const summaries =
    (await fetchJson<ApiConversationSummary[]>("/api/inbox/conversations")) ?? [];

  const details = await Promise.all(
    summaries.map((summary) =>
      fetchJson<ApiConversationDetail>(`/api/inbox/conversations/${summary.id}`)
    )
  );

  const accountMap = new Map<string, ConnectedAccount>();
  const listingMap = new Map<string, Listing>();

  summaries.forEach((summary) => {
    accountMap.set(summary.channel.id, buildAccount(companyId, summary));

    const listing = buildListing(companyId, summary);
    listingMap.set(listing.id, listing);
  });

  return {
    accounts: Array.from(accountMap.values()),
    backendConversationIds: summaries.map((summary) => summary.id),
    conversations: summaries.map((summary, index) =>
      buildConversation(companyId, summary, details[index] ?? null)
    ),
    listings: Array.from(listingMap.values()),
    messages: details.flatMap((detail) => buildMessages(detail)),
    suggestedReplies: summaries
      .map((summary, index) =>
        buildSuggestedReply(
          summary.id,
          details[index]?.suggestedReply ?? summary.suggestedReply
        )
      )
      .filter((reply): reply is SuggestedReply => Boolean(reply))
  };
}
