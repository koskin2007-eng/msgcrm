import Link from "next/link";
import { MessageSquareText } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

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
        <p>Введите данные аккаунта MsgCRM. Внешние аккаунты Авито подключаются уже внутри кабинета.</p>

        <form className="auth-form">
          <label>
            Email
            <Input defaultValue="pavel@example.com" type="email" />
          </label>
          <label>
            Пароль
            <Input defaultValue="demo-password" type="password" />
          </label>
          <Button type="submit">Войти</Button>
        </form>

        <Link className="auth-link" href="/register">
          Создать аккаунт
        </Link>
      </section>
    </main>
  );
}
