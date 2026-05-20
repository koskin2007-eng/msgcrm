import { Plus } from "lucide-react";
import { redirect } from "next/navigation";
import { AppLayout } from "../../components/layout/AppLayout";
import { Button } from "../../components/ui/Button";
import { PageHeader } from "../../components/ui/PageHeader";
import { fetchAuthSession } from "../../lib/auth-server";
import { quickReplyTemplates } from "../../lib/mock-data";
import { canManageTemplates } from "../../lib/permissions";

export default async function TemplatesPage() {
  const session = await fetchAuthSession();

  if (!session) {
    redirect("/login");
  }

  const canManage = canManageTemplates(session.user.role);

  return (
    <AppLayout session={session}>
      <section className="page-content">
        <PageHeader
          actions={
            <Button disabled={!canManage}>
              <Plus size={16} />
              Создать шаблон
            </Button>
          }
          description="Заготовки ответов для менеджеров, чтобы быстрее вести диалоги к сделке."
          title="Быстрые ответы"
        />
        {!canManage ? (
          <p className="permission-note">
            Роль viewer может просматривать шаблоны без редактирования.
          </p>
        ) : null}
        <div className="template-grid">
          {quickReplyTemplates.map((template) => (
            <section className="template-card" key={template.id}>
              <h3>{template.title}</h3>
              <p>{template.text}</p>
              <div>
                <Button disabled={!canManage} variant="secondary">
                  Редактировать
                </Button>
                <Button disabled={!canManage} variant="ghost">
                  Использовать
                </Button>
              </div>
            </section>
          ))}
        </div>
      </section>
    </AppLayout>
  );
}
