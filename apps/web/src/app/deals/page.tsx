import { AppLayout } from "../../components/layout/AppLayout";
import { DealsTable } from "../../components/deals/DealsTable";
import { Button } from "../../components/ui/Button";
import { PageHeader } from "../../components/ui/PageHeader";
import { deals } from "../../lib/mock-data";

export default function DealsPage() {
  return (
    <AppLayout>
      <section className="page-content">
        <PageHeader
          actions={<Button>Создать сделку</Button>}
          description="Лиды и продажи, которые появились из переписок с клиентами."
          title="Сделки"
        />
        <DealsTable deals={deals} />
      </section>
    </AppLayout>
  );
}
