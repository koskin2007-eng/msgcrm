import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { fetchAuthSession } from "../../lib/auth-server";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

interface AppLayoutProps {
  children: ReactNode;
}

export async function AppLayout({ children }: AppLayoutProps) {
  const session = await fetchAuthSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="app-shell">
      <Sidebar />
      <section className="app-main">
        <TopBar session={session} />
        {children}
      </section>
    </main>
  );
}
