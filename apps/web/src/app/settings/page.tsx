import Link from "next/link";
import { AppLayout } from "../../components/layout/AppLayout";
import { Button } from "../../components/ui/Button";
import { PageHeader } from "../../components/ui/PageHeader";
import { company, currentUser } from "../../lib/mock-data";
import { roleLabel } from "../../lib/format";

const settingsSections = [
  "Компания",
  "Профиль пользователя",
  "Уведомления",
  "Безопасность",
  "Тариф",
  "Интеграции"
];

export default function SettingsPage() {
  return (
    <AppLayout>
      <section className="page-content">
        <PageHeader description="Настройки компании, профиля и будущих прав доступа." title="Настройки" />

        <section className="settings-summary">
          <div>
            <span>Название компании</span>
            <strong>{company.name}</strong>
          </div>
          <div>
            <span>Текущий пользователь</span>
            <strong>{currentUser.name}</strong>
          </div>
          <div>
            <span>Роль</span>
            <strong>{roleLabel(currentUser.role)}</strong>
          </div>
          <Link className="button button-secondary" href="/login">
            Выйти
          </Link>
        </section>

        <div className="settings-grid">
          {settingsSections.map((section) => (
            <section className="settings-card" key={section}>
              <h3>{section}</h3>
              <p>Раздел подготовлен под будущую backend-логику и права workspace.</p>
              <Button variant="ghost">Открыть</Button>
            </section>
          ))}
        </div>
      </section>
    </AppLayout>
  );
}
