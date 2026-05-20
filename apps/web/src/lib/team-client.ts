import { getPublicApiUrl } from "./auth-client";
import type { UserRole } from "./types";

export interface InviteTeamMemberPayload {
  displayName: string;
  email: string;
  role: Exclude<UserRole, "owner">;
}

async function getResponseMessage(response: Response) {
  const body = await response.json().catch(() => null);
  const message = body?.message;

  if (Array.isArray(message)) {
    return message.join(", ");
  }

  return message || body?.error || `Request failed with status ${response.status}`;
}

export async function inviteTeamMemberRequest(data: InviteTeamMemberPayload) {
  const response = await fetch(`${getPublicApiUrl()}/api/team/invitations`, {
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
