import { UserPlus } from "lucide-react";
import { AppLayout } from "../../components/layout/AppLayout";
import { TeamTable } from "../../components/team/TeamTable";
import { Button } from "../../components/ui/Button";
import { PageHeader } from "../../components/ui/PageHeader";
import { teamMembers } from "../../lib/mock-data";

export default function TeamPage() {
  return (
    <AppLayout>
      <section className="page-content">
        <PageHeader
          actions={
            <Button>
              <UserPlus size={16} />
              Пригласить сотрудника
            </Button>
          }
          description="Пользователи внутри компании клиента. Права позже будут влиять на доступ к разделам."
          title="Команда"
        />
        <TeamTable members={teamMembers} />
      </section>
    </AppLayout>
  );
}
