import { BookOpenText } from "lucide-react";
import { redirect } from "next/navigation";
import { KnowledgeDocumentForm } from "../../components/knowledge/KnowledgeDocumentForm";
import { AppLayout } from "../../components/layout/AppLayout";
import { Badge } from "../../components/ui/Badge";
import { EmptyState } from "../../components/ui/EmptyState";
import { PageHeader } from "../../components/ui/PageHeader";
import { fetchAuthSession } from "../../lib/auth-server";
import { formatDateTime } from "../../lib/format";
import { fetchKnowledgeDocuments } from "../../lib/knowledge-server";
import { canManageKnowledge } from "../../lib/permissions";

export default async function KnowledgePage() {
  const session = await fetchAuthSession();

  if (!session) {
    redirect("/login");
  }

  const documents = await fetchKnowledgeDocuments();
  const canManage = canManageKnowledge(session.user.role);

  return (
    <AppLayout session={session}>
      <section className="page-content">
        <PageHeader
          description="Загрузите инструкции, регламенты, FAQ и описание услуг. Агент использует эти материалы для подготовки ответов клиентам."
          title="База знаний"
        />
        <div className="knowledge-layout">
          <section className="knowledge-editor-card">
            <h2>Новый документ</h2>
            <KnowledgeDocumentForm canManage={canManage} />
          </section>
          <section className="knowledge-list-card">
            <h2>Документы компании</h2>
            {documents.length ? (
              <div className="knowledge-list">
                {documents.map((document) => (
                  <article className="knowledge-item" key={document.id}>
                    <div className="knowledge-item-head">
                      <span className="agent-icon">
                        <BookOpenText size={18} />
                      </span>
                      <div>
                        <h3>{document.title}</h3>
                        <p>{document.source ?? "manual"} · {formatDateTime(document.updatedAt)}</p>
                      </div>
                      <Badge tone="blue">{document.chunksCount} chunk</Badge>
                    </div>
                    <p>{document.body}</p>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState
                description="Добавьте первый FAQ или регламент, чтобы агенту было на что опираться."
                title="База знаний пуста"
              />
            )}
          </section>
        </div>
      </section>
    </AppLayout>
  );
}
