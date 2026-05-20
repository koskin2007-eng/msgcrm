import { redirect } from "next/navigation";
import { AppLayout } from "../../components/layout/AppLayout";
import { DealsTable } from "../../components/deals/DealsTable";
import { Button } from "../../components/ui/Button";
import { PageHeader } from "../../components/ui/PageHeader";
import { fetchAuthSession } from "../../lib/auth-server";
import { deals } from "../../lib/mock-data";
import { canCreateDeals } from "../../lib/permissions";

export default async function DealsPage() {
  const session = await fetchAuthSession();

  if (!session) {
    redirect("/login");
  }

  const canCreate = canCreateDeals(session.user.role);

  return (
    <AppLayout session={session}>
      <section className="page-content">
        <PageHeader
          actions={<Button disabled={!canCreate}>Создать сделку</Button>}
          description="Лиды и продажи, которые появились из переписок с клиентами."
          title="Сделки"
        />
        {!canCreate ? (
          <p className="permission-note">Роль viewer может просматривать сделки, но не создавать новые.</p>
        ) : null}
        <DealsTable deals={deals} />
      </section>
    </AppLayout>
  );
}
