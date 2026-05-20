import "server-only";
import { agents as mockAgents } from "./mock-data";
import { getServerCookieHeader } from "./auth-server";
import type { Agent } from "./types";

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

export async function fetchAgents() {
  return (await fetchJson<Agent[]>("/api/agents")) ?? mockAgents;
}

export async function fetchAgent(id: string) {
  const backendAgent = await fetchJson<Agent>(`/api/agents/${id}`);

  return backendAgent ?? mockAgents.find((agent) => agent.id === id) ?? null;
}
