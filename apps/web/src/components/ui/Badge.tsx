import type { ReactNode } from "react";

type BadgeTone = "blue" | "green" | "orange" | "red" | "gray";

interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
}

export function Badge({ children, tone = "gray" }: BadgeProps) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}
