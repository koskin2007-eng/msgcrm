import Link from "next/link";
import { Building2 } from "lucide-react";
import { RegisterForm } from "../../components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="auth-page">
      <section className="auth-card wide">
        <div className="auth-brand">
          <span className="logo-mark">M</span>
          <div>
            <strong>MsgCRM</strong>
            <p>Создание компании и владельца рабочего пространства</p>
          </div>
        </div>

        <div className="auth-icon">
          <Building2 size={28} />
        </div>

        <h1>Создать аккаунт</h1>
        <p>
          После регистрации будет создан пользователь MsgCRM, отдельная
          компания/workspace и роль owner. Подключенные аккаунты Авито, Telegram
          и других площадок добавляются позже в разделе интеграций.
        </p>

        <RegisterForm />

        <Link className="auth-link" href="/login">
          Уже есть аккаунт
        </Link>
      </section>
    </main>
  );
}
