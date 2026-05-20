import { getPublicApiUrl } from "./auth-client";
import type { Agent } from "./types";

export interface AgentPayload {
  name: string;
  role: string;
  tone: string;
  instructions: string;
  restrictions?: string;
  handoffRules?: string;
  isActive?: boolean;
}

async function getResponseMessage(response: Response) {
  const body = await response.json().catch(() => null);
  const message = body?.message;

  if (Array.isArray(message)) {
    return message.join(", ");
  }

  return message || body?.error || `Request failed with status ${response.status}`;
}

export async function createAgent(payload: AgentPayload) {
  const response = await fetch(`${getPublicApiUrl()}/api/agents`, {
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

  return response.json() as Promise<Agent>;
}

export async function updateAgent(id: string, payload: AgentPayload) {
  const response = await fetch(`${getPublicApiUrl()}/api/agents/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(await getResponseMessage(response));
  }

  return response.json() as Promise<Agent>;
}
