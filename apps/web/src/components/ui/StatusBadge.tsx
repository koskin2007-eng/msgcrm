import { Badge } from "./Badge";
import {
  accountStatusLabel,
  conversationStatusLabel,
  dealStatusLabel
} from "../../lib/format";
import type {
  ConnectedAccountStatus,
  ConversationStatus,
  DealStatus
} from "../../lib/types";

export function ConversationStatusBadge({ status }: { status: ConversationStatus }) {
  const tone =
    status === "new"
      ? "orange"
      : status === "ready_to_deal"
        ? "green"
        : status === "closed"
          ? "gray"
          : "blue";

  return <Badge tone={tone}>{conversationStatusLabel(status)}</Badge>;
}

export function AccountStatusBadge({ status }: { status: ConnectedAccountStatus }) {
  const tone =
    status === "connected"
      ? "green"
      : status === "auth_error"
        ? "red"
        : status === "disconnected"
          ? "gray"
          : "gray";

  return <Badge tone={tone}>{accountStatusLabel(status)}</Badge>;
}

export function DealStatusBadge({ status }: { status: DealStatus }) {
  const tone =
    status === "closed"
      ? "green"
      : status === "waiting_pickup_point" || status === "waiting_payment"
        ? "orange"
        : "blue";

  return <Badge tone={tone}>{dealStatusLabel(status)}</Badge>;
}
