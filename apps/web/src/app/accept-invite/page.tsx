import { Suspense } from "react";
import { UserCheck } from "lucide-react";
import { AcceptInviteForm } from "../../components/auth/AcceptInviteForm";

export default function AcceptInvitePage() {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand">
          <span className="logo-mark">M</span>
          <div>
            <strong>MsgCRM</strong>
            <p>Доступ сотрудника к рабочему пространству</p>
          </div>
        </div>

        <div className="auth-icon">
          <UserCheck size={28} />
        </div>

        <h1>Принять приглашение</h1>
        <p>Задайте пароль для входа в аккаунт MsgCRM.</p>

        <Suspense fallback={<p>Проверяем приглашение...</p>}>
          <AcceptInviteForm />
        </Suspense>
      </section>
    </main>
  );
}
