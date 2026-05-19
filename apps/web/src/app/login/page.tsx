import Link from "next/link";
import { MessageSquareText } from "lucide-react";
import { LoginForm } from "../../components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand">
          <span className="logo-mark">M</span>
          <div>
            <strong>MsgCRM</strong>
            <p>Все сообщения продавца в одном окне</p>
          </div>
        </div>

        <div className="auth-icon">
          <MessageSquareText size={28} />
        </div>

        <h1>Вход в CRM</h1>
        <p>
          Войдите в аккаунт MsgCRM. Внешние аккаунты Авито и других каналов
          подключаются уже внутри рабочего пространства компании.
        </p>

        <LoginForm />

        <Link className="auth-link" href="/register">
          Создать аккаунт
        </Link>
      </section>
    </main>
  );
}
