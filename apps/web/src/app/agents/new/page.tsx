import { redirect } from "next/navigation";
import { AgentForm } from "../../../components/agents/AgentForm";
import { AppLayout } from "../../../components/layout/AppLayout";
import { PageHeader } from "../../../components/ui/PageHeader";
import { fetchAuthSession } from "../../../lib/auth-server";
import { canManageAgents } from "../../../lib/permissions";

export default async function NewAgentPage() {
  const session = await fetchAuthSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <AppLayout session={session}>
      <section className="page-content">
        <PageHeader
          description="Опишите роль, тон, инструкции и правила передачи человеку. Эти настройки будет использовать backend при подготовке ответов через OpenAI."
          title="Новый агент"
        />
        <section className="agent-editor-card">
          <AgentForm canManage={canManageAgents(session.user.role)} />
        </section>
      </section>
    </AppLayout>
  );
}
