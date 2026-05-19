import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <main className="app-shell">
      <Sidebar />
      <section className="app-main">
        <TopBar />
        {children}
      </section>
    </main>
  );
}
