import { getPublicApiUrl } from "./auth-client";
import type { AgentMode, TelegramBotIntegration } from "./types";

export interface TelegramConnectPayload {
  displayName: string;
  botToken: string;
  agentId?: string;
  mode: AgentMode;
}

async function getResponseMessage(response: Response) {
  const body = await response.json().catch(() => null);
  const message = body?.message;

  if (Array.isArray(message)) {
    return message.join(", ");
  }

  return message || body?.error || `Request failed with status ${response.status}`;
}

export async function connectTelegramIntegration(payload: TelegramConnectPayload) {
  const response = await fetch(`${getPublicApiUrl()}/api/integrations/telegram/connect`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(await getResponseMessage(response));
  }

  return response.json() as Promise<TelegramBotIntegration>;
}

export async function checkTelegramIntegration(id: string) {
  const response = await fetch(
    `${getPublicApiUrl()}/api/integrations/telegram/${id}/check`,
    {
      method: "POST",
      credentials: "include"
    }
  );

  if (!response.ok) {
    throw new Error(await getResponseMessage(response));
  }

  return response.json() as Promise<TelegramBotIntegration & { webhookUrl: string | null }>;
}
