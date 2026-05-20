import { redirect } from "next/navigation";
import { AppLayout } from "../../components/layout/AppLayout";
import { LogoutButton } from "../../components/layout/LogoutButton";
import { EmptyState } from "../../components/ui/EmptyState";
import { Button } from "../../components/ui/Button";
import { PageHeader } from "../../components/ui/PageHeader";
import { fetchAuthSession } from "../../lib/auth-server";
import { roleLabel } from "../../lib/format";
import { canManageSettings } from "../../lib/permissions";

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

  const canManage = canManageSettings(session.user.role);

  return (
    <AppLayout session={session}>
      <section className="page-content">
        <PageHeader
          description="Настройки компании, профиля и будущих прав доступа."
          title="Настройки"
        />

        {!canManage ? (
          <EmptyState
            description="Настройки workspace доступны только ролям owner и admin. Личные данные можно изменить в отдельном разделе профиля."
            title="Недостаточно прав"
          />
        ) : null}

        {canManage ? (
          <>
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
          </>
        ) : null}
      </section>
    </AppLayout>
  );
}
