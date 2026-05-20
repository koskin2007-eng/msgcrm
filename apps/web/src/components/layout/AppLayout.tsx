import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { fetchAuthSession } from "../../lib/auth-server";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import type { AuthSession } from "../../lib/auth-types";

interface AppLayoutProps {
  children: ReactNode;
  session?: AuthSession;
}

export async function AppLayout({ children, session: providedSession }: AppLayoutProps) {
  const session = providedSession ?? (await fetchAuthSession());

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="app-shell">
      <Sidebar role={session.user.role} />
      <section className="app-main">
        <TopBar session={session} />
        {children}
      </section>
    </main>
  );
}
