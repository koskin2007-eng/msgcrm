import "server-only";
import { telegramBotIntegrations as mockTelegramBotIntegrations } from "./mock-data";
import { getServerCookieHeader } from "./auth-server";
import type { TelegramBotIntegration } from "./types";

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

export async function fetchTelegramIntegrations() {
  return (
    (await fetchJson<TelegramBotIntegration[]>("/api/integrations/telegram")) ??
    mockTelegramBotIntegrations
  );
}
