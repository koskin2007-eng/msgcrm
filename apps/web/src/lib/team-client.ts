import { getPublicApiUrl } from "./auth-client";
import type { TeamMember, UserRole } from "./types";

export interface InviteTeamMemberPayload {
  displayName: string;
  email: string;
  role: Exclude<UserRole, "owner">;
}

export interface TeamInvitation {
  email: string;
  displayName: string;
  role: UserRole;
  companyName: string;
  expiresAt: string;
}

export interface InviteTeamMemberResponse {
  member: TeamMember;
  invitation: {
    acceptPath: string;
    expiresAt: string;
  };
}

async function getResponseMessage(response: Response) {
  const body = await response.json().catch(() => null);
  const message = body?.message;

  if (Array.isArray(message)) {
    return message.join(", ");
  }

  return message || body?.error || `Request failed with status ${response.status}`;
}

export async function inviteTeamMemberRequest(
  data: InviteTeamMemberPayload
): Promise<InviteTeamMemberResponse> {
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

export async function getTeamInvitationRequest(token: string): Promise<TeamInvitation> {
  const response = await fetch(
    `${getPublicApiUrl()}/api/team/invitations/${encodeURIComponent(token)}`,
    {
      cache: "no-store"
    }
  );

  if (!response.ok) {
    throw new Error(await getResponseMessage(response));
  }

  return response.json();
}

export async function acceptTeamInvitationRequest(token: string, password: string) {
  const response = await fetch(
    `${getPublicApiUrl()}/api/team/invitations/${encodeURIComponent(token)}/accept`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    }
  );

  if (!response.ok) {
    throw new Error(await getResponseMessage(response));
  }

  return response.json();
}
