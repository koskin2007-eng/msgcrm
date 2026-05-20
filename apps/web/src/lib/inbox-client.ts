import { getPublicApiUrl } from "./auth-client";
import type { Message } from "./types";

interface ApiMessage {
  id: string;
  direction: "INBOUND" | "OUTBOUND";
  text: string;
  sentAt: string;
}

async function getResponseMessage(response: Response) {
  const body = await response.json().catch(() => null);
  const message = body?.message;

  if (Array.isArray(message)) {
    return message.join(", ");
  }

  return message || body?.error || `Request failed with status ${response.status}`;
}

export async function sendInboxMessage(conversationId: string, text: string) {
  const response = await fetch(
    `${getPublicApiUrl()}/api/inbox/conversations/${conversationId}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({ text })
    }
  );

  if (!response.ok) {
    throw new Error(await getResponseMessage(response));
  }

  const message = (await response.json()) as ApiMessage;

  return {
    id: message.id,
    conversationId,
    sender: message.direction === "OUTBOUND" ? "manager" : "customer",
    text: message.text,
    createdAt: message.sentAt
  } satisfies Message;
}
