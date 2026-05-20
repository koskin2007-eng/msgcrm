import type { AuthRole } from "./auth-types";
import type { UserRole } from "./types";

type AnyRole = AuthRole | UserRole;
type NormalizedRole = UserRole;

const allRoles: NormalizedRole[] = ["owner", "admin", "manager", "viewer"];
const workspaceManagerRoles: NormalizedRole[] = ["owner", "admin"];
const salesOperatorRoles: NormalizedRole[] = ["owner", "admin", "manager"];

const routeRoles: Record<string, NormalizedRole[]> = {
  "/inbox": allRoles,
  "/agents": allRoles,
  "/agents/new": workspaceManagerRoles,
  "/knowledge": allRoles,
  "/integrations/telegram": allRoles,
  "/deals": allRoles,
  "/listings": allRoles,
  "/templates": allRoles,
  "/integrations": allRoles,
  "/team": allRoles,
  "/delivery": allRoles,
  "/profile": allRoles,
  "/settings": workspaceManagerRoles
};

export function normalizeRole(role: AnyRole): NormalizedRole {
  return role.toLowerCase() as NormalizedRole;
}

export function hasRole(role: AnyRole, allowedRoles: NormalizedRole[]) {
  return allowedRoles.includes(normalizeRole(role));
}

export function canAccessRoute(role: AnyRole, href: string) {
  return hasRole(role, routeRoles[href] ?? allRoles);
}

export function canManageWorkspace(role: AnyRole) {
  return hasRole(role, workspaceManagerRoles);
}

export function canManageTeam(role: AnyRole) {
  return canManageWorkspace(role);
}

export function canManageIntegrations(role: AnyRole) {
  return canManageWorkspace(role);
}

export function canManageAgents(role: AnyRole) {
  return canManageWorkspace(role);
}

export function canManageKnowledge(role: AnyRole) {
  return canManageWorkspace(role);
}

export function canManageTelegram(role: AnyRole) {
  return canManageWorkspace(role);
}

export function canManageSettings(role: AnyRole) {
  return canManageWorkspace(role);
}

export function canReplyToConversations(role: AnyRole) {
  return hasRole(role, salesOperatorRoles);
}

export function canCreateDeals(role: AnyRole) {
  return hasRole(role, salesOperatorRoles);
}

export function canManageTemplates(role: AnyRole) {
  return hasRole(role, salesOperatorRoles);
}

export function canCalculateDelivery(role: AnyRole) {
  return hasRole(role, salesOperatorRoles);
}
