import { getPublicApiUrl } from "./auth-client";
import type { ConnectedAccount, Platform } from "./types";

type SupportedIntegrationPlatform = Extract<Platform, "avito" | "telegram">;

interface CreateIntegrationAccountPayload {
  platform: SupportedIntegrationPlatform;
  title?: string;
}

async function getResponseMessage(response: Response) {
  const body = await response.json().catch(() => null);
  const message = body?.message;

  if (Array.isArray(message)) {
    return message.join(", ");
  }

  return message || body?.error || `Request failed with status ${response.status}`;
}

export function isSupportedIntegrationPlatform(
  platform: Platform
): platform is SupportedIntegrationPlatform {
  return platform === "avito" || platform === "telegram";
}

export async function createIntegrationAccount(
  data: CreateIntegrationAccountPayload
): Promise<ConnectedAccount> {
  const response = await fetch(`${getPublicApiUrl()}/api/integrations/accounts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(await getResponseMessage(response));
  }

  return response.json();
}

export async function updateIntegrationAccount(
  accountId: string,
  isActive: boolean
): Promise<ConnectedAccount> {
  const response = await fetch(
    `${getPublicApiUrl()}/api/integrations/accounts/${encodeURIComponent(accountId)}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ isActive })
    }
  );

  if (!response.ok) {
    throw new Error(await getResponseMessage(response));
  }

  return response.json();
}
