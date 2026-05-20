import Link from "next/link";
import { Plus } from "lucide-react";
import { redirect } from "next/navigation";
import { AgentCard } from "../../components/agents/AgentCard";
import { AppLayout } from "../../components/layout/AppLayout";
import { EmptyState } from "../../components/ui/EmptyState";
import { PageHeader } from "../../components/ui/PageHeader";
import { fetchAgents } from "../../lib/agents-server";
import { fetchAuthSession } from "../../lib/auth-server";
import { canManageAgents } from "../../lib/permissions";

export default async function AgentsPage() {
  const session = await fetchAuthSession();

  if (!session) {
    redirect("/login");
  }

  const agents = await fetchAgents();
  const canManage = canManageAgents(session.user.role);

  return (
    <AppLayout session={session}>
      <section className="page-content">
        <PageHeader
          actions={
            canManage ? (
              <Link className="button button-primary" href="/agents/new">
                <Plus size={16} />
                Создать агента
              </Link>
            ) : null
          }
          description="AI-агенты отвечают на вопросы клиентов в Telegram по инструкциям и базе знаний компании. По умолчанию агент готовит ответ, а менеджер подтверждает отправку."
          title="Агенты"
        />
        {!canManage ? (
          <p className="permission-note">Создавать и менять агентов могут только owner и admin.</p>
        ) : null}
        {agents.length ? (
          <div className="agent-grid">
            {agents.map((agent) => (
              <AgentCard agent={agent} key={agent.id} />
            ))}
          </div>
        ) : (
          <EmptyState
            description="Создайте первого Telegram AI-агента и назначьте ему инструкции."
            title="Агенты ещё не созданы"
          />
        )}
      </section>
    </AppLayout>
  );
}
