import "server-only";
import { getServerCookieHeader } from "./auth-server";
import type { ConnectedAccount } from "./types";

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

export async function fetchIntegrationAccounts(): Promise<ConnectedAccount[] | null> {
  const cookieHeader = await getServerCookieHeader();

  if (!cookieHeader) {
    return null;
  }

  const response = await fetch(`${getInternalApiUrl()}/api/integrations/accounts`, {
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
