import { notFound, redirect } from "next/navigation";
import { AgentForm } from "../../../components/agents/AgentForm";
import { AppLayout } from "../../../components/layout/AppLayout";
import { PageHeader } from "../../../components/ui/PageHeader";
import { fetchAgent } from "../../../lib/agents-server";
import { fetchAuthSession } from "../../../lib/auth-server";
import { canManageAgents } from "../../../lib/permissions";

interface AgentPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AgentPage({ params }: AgentPageProps) {
  const session = await fetchAuthSession();

  if (!session) {
    redirect("/login");
  }

  const { id } = await params;
  const agent = await fetchAgent(id);

  if (!agent) {
    notFound();
  }

  return (
    <AppLayout session={session}>
      <section className="page-content">
        <PageHeader
          description="Измените роль, тон, инструкции и ограничения агента. Telegram-боты назначаются на странице Telegram."
          title={agent.name}
        />
        <section className="agent-editor-card">
          <AgentForm agent={agent} canManage={canManageAgents(session.user.role)} />
        </section>
      </section>
    </AppLayout>
  );
}
