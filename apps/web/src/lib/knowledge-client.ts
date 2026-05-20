import { getPublicApiUrl } from "./auth-client";
import type { KnowledgeDocument } from "./types";

export interface KnowledgeDocumentPayload {
  title: string;
  source?: string;
  body: string;
}

async function getResponseMessage(response: Response) {
  const body = await response.json().catch(() => null);
  const message = body?.message;

  if (Array.isArray(message)) {
    return message.join(", ");
  }

  return message || body?.error || `Request failed with status ${response.status}`;
}

export async function createKnowledgeDocument(payload: KnowledgeDocumentPayload) {
  const response = await fetch(`${getPublicApiUrl()}/api/knowledge/documents`, {
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

  return response.json() as Promise<KnowledgeDocument>;
}
