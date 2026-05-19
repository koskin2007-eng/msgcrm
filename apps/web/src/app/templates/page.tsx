import { Plus } from "lucide-react";
import { AppLayout } from "../../components/layout/AppLayout";
import { Button } from "../../components/ui/Button";
import { PageHeader } from "../../components/ui/PageHeader";
import { quickReplyTemplates } from "../../lib/mock-data";

export default function TemplatesPage() {
  return (
    <AppLayout>
      <section className="page-content">
        <PageHeader
          actions={
            <Button>
              <Plus size={16} />
              Создать шаблон
            </Button>
          }
          description="Заготовки ответов для менеджеров, чтобы быстрее вести диалоги к сделке."
          title="Быстрые ответы"
        />
        <div className="template-grid">
          {quickReplyTemplates.map((template) => (
            <section className="template-card" key={template.id}>
              <h3>{template.title}</h3>
              <p>{template.text}</p>
              <div>
                <Button variant="secondary">Редактировать</Button>
                <Button variant="ghost">Использовать</Button>
              </div>
            </section>
          ))}
        </div>
      </section>
    </AppLayout>
  );
}
