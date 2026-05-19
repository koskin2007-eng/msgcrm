import { AppLayout } from "../../components/layout/AppLayout";
import { IntegrationCard } from "../../components/integrations/IntegrationCard";
import { Button } from "../../components/ui/Button";
import { PageHeader } from "../../components/ui/PageHeader";
import { connectedAccounts } from "../../lib/mock-data";

export default function IntegrationsPage() {
  return (
    <AppLayout>
      <section className="page-content">
        <PageHeader
          actions={<Button>Подключить канал</Button>}
          description="Внешние аккаунты и каналы продаж. Это не аккаунты пользователей MsgCRM."
          title="Интеграции"
        />
        <div className="integration-grid">
          {connectedAccounts.map((account) => (
            <IntegrationCard account={account} key={account.id} />
          ))}
        </div>
      </section>
    </AppLayout>
  );
}
