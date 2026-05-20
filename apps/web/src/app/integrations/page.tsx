import { redirect } from "next/navigation";
import { AppLayout } from "../../components/layout/AppLayout";
import { CreateIntegrationButton } from "../../components/integrations/CreateIntegrationButton";
import { IntegrationCard } from "../../components/integrations/IntegrationCard";
import { PageHeader } from "../../components/ui/PageHeader";
import { fetchAuthSession } from "../../lib/auth-server";
import { fetchIntegrationAccounts } from "../../lib/integrations-server";
import { connectedAccounts } from "../../lib/mock-data";
import { canManageIntegrations } from "../../lib/permissions";

export default async function IntegrationsPage() {
  const session = await fetchAuthSession();

  if (!session) {
    redirect("/login");
  }

  const canManage = canManageIntegrations(session.user.role);
  const accounts = (await fetchIntegrationAccounts()) ?? connectedAccounts;

  return (
    <AppLayout session={session}>
      <section className="page-content">
        <PageHeader
          actions={<CreateIntegrationButton disabled={!canManage} />}
          description="Внешние аккаунты и каналы продаж. Это не аккаунты пользователей MsgCRM."
          title="Интеграции"
        />
        {!canManage ? (
          <p className="permission-note">Подключать и менять внешние аккаунты могут только owner и admin.</p>
        ) : null}
        <div className="integration-grid">
          {accounts.map((account) => (
            <IntegrationCard account={account} canManage={canManage} key={account.id} />
          ))}
        </div>
      </section>
    </AppLayout>
  );
}
