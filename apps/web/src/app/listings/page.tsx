import { AppLayout } from "../../components/layout/AppLayout";
import { ListingsTable } from "../../components/listings/ListingsTable";
import { PageHeader } from "../../components/ui/PageHeader";
import { listings } from "../../lib/mock-data";

export default function ListingsPage() {
  return (
    <AppLayout>
      <section className="page-content">
        <PageHeader
          description="Объявления, которые подтягиваются из подключённых внешних аккаунтов."
          title="Объявления"
        />
        <ListingsTable listings={listings} />
      </section>
    </AppLayout>
  );
}
