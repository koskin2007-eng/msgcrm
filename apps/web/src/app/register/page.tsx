import Link from "next/link";
import { Building2 } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

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
        <p>После регистрации будет создан пользователь, компания/workspace и роль owner.</p>

        <form className="auth-form two-columns">
          <label>
            Имя
            <Input defaultValue="Павел" />
          </label>
          <label>
            Email
            <Input defaultValue="pavel@example.com" type="email" />
          </label>
          <label>
            Пароль
            <Input defaultValue="demo-password" type="password" />
          </label>
          <label>
            Название компании
            <Input defaultValue="АвтоПлюс" />
          </label>
          <Button className="span-2" type="submit">
            Создать аккаунт
          </Button>
        </form>

        <Link className="auth-link" href="/login">
          Уже есть аккаунт
        </Link>
      </section>
    </main>
  );
}
