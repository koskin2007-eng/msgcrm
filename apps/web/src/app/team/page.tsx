import { redirect } from "next/navigation";
import { AppLayout } from "../../components/layout/AppLayout";
import { InviteTeamMemberForm } from "../../components/team/InviteTeamMemberForm";
import { TeamTable } from "../../components/team/TeamTable";
import { PageHeader } from "../../components/ui/PageHeader";
import { fetchAuthSession } from "../../lib/auth-server";
import { canManageTeam } from "../../lib/permissions";
import { fetchTeamMembers } from "../../lib/team-server";

export default async function TeamPage() {
  const session = await fetchAuthSession();

  if (!session) {
    redirect("/login");
  }

  const members = (await fetchTeamMembers()) ?? [];
  const canInvite = canManageTeam(session.user.role);

  return (
    <AppLayout session={session}>
      <section className="page-content">
        <PageHeader
          description="Пользователи внутри компании клиента. Сейчас роли отображаются и готовят будущие права доступа."
          title="Команда"
        />
        <div className="team-layout">
          {canInvite ? (
            <InviteTeamMemberForm />
          ) : (
            <section className="team-invite-card">
              <h2>Приглашения ограничены</h2>
              <p>Приглашать сотрудников и выдавать роли могут только owner и admin.</p>
            </section>
          )}
          <TeamTable members={members} />
        </div>
      </section>
    </AppLayout>
  );
}
