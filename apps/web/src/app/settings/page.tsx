import { redirect } from "next/navigation";
import { AppLayout } from "../../components/layout/AppLayout";
import { LogoutButton } from "../../components/layout/LogoutButton";
import { Button } from "../../components/ui/Button";
import { PageHeader } from "../../components/ui/PageHeader";
import { fetchAuthSession } from "../../lib/auth-server";
import { roleLabel } from "../../lib/format";

const settingsSections = [
  "Компания",
  "Профиль пользователя",
  "Уведомления",
  "Безопасность",
  "Тариф",
  "Интеграции"
];

export default async function SettingsPage() {
  const session = await fetchAuthSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <AppLayout session={session}>
      <section className="page-content">
        <PageHeader
          description="Настройки компании, профиля и будущих прав доступа."
          title="Настройки"
        />

        <section className="settings-summary">
          <div>
            <span>Название компании</span>
            <strong>{session.company.name}</strong>
          </div>
          <div>
            <span>Текущий пользователь</span>
            <strong>{session.user.displayName}</strong>
          </div>
          <div>
            <span>Роль</span>
            <strong>{roleLabel(session.user.role)}</strong>
          </div>
          <LogoutButton />
        </section>

        <div className="settings-grid">
          {settingsSections.map((section) => (
            <section className="settings-card" key={section}>
              <h3>{section}</h3>
              <p>
                Раздел подготовлен под будущую backend-логику и права workspace.
              </p>
              <Button variant="ghost">Открыть</Button>
            </section>
          ))}
        </div>
      </section>
    </AppLayout>
  );
}
