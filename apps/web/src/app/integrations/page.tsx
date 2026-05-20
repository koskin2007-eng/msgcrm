import { redirect } from "next/navigation";
import { AppLayout } from "../../components/layout/AppLayout";
import { IntegrationCard } from "../../components/integrations/IntegrationCard";
import { Button } from "../../components/ui/Button";
import { PageHeader } from "../../components/ui/PageHeader";
import { fetchAuthSession } from "../../lib/auth-server";
import { connectedAccounts } from "../../lib/mock-data";
import { canManageIntegrations } from "../../lib/permissions";

export default async function IntegrationsPage() {
  const session = await fetchAuthSession();

  if (!session) {
    redirect("/login");
  }

  const canManage = canManageIntegrations(session.user.role);

  return (
    <AppLayout session={session}>
      <section className="page-content">
        <PageHeader
          actions={<Button disabled={!canManage}>Подключить канал</Button>}
          description="Внешние аккаунты и каналы продаж. Это не аккаунты пользователей MsgCRM."
          title="Интеграции"
        />
        {!canManage ? (
          <p className="permission-note">Подключать и менять внешние аккаунты могут только owner и admin.</p>
        ) : null}
        <div className="integration-grid">
          {connectedAccounts.map((account) => (
            <IntegrationCard account={account} canManage={canManage} key={account.id} />
          ))}
        </div>
      </section>
    </AppLayout>
  );
}
