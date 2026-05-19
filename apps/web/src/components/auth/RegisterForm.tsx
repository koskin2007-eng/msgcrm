"use client";

import { useState, type FormEvent } from "react";
import { postAuthRequest } from "../../lib/auth-client";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

export function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await postAuthRequest("register", {
        name,
        email,
        password,
        companyName
      });
      window.location.assign("/inbox");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Не удалось создать аккаунт"
      );
      setIsSubmitting(false);
    }
  }

  return (
    <form className="auth-form two-columns" onSubmit={handleSubmit}>
      <label>
        Имя
        <Input
          autoComplete="name"
          minLength={2}
          onChange={(event) => setName(event.target.value)}
          required
          value={name}
        />
      </label>
      <label>
        Email
        <Input
          autoComplete="email"
          onChange={(event) => setEmail(event.target.value)}
          required
          type="email"
          value={email}
        />
      </label>
      <label>
        Пароль
        <Input
          autoComplete="new-password"
          minLength={8}
          onChange={(event) => setPassword(event.target.value)}
          required
          type="password"
          value={password}
        />
      </label>
      <label>
        Название компании
        <Input
          autoComplete="organization"
          minLength={2}
          onChange={(event) => setCompanyName(event.target.value)}
          required
          value={companyName}
        />
      </label>
      {error ? <p className="form-error span-2">{error}</p> : null}
      <Button className="span-2" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Создаем..." : "Создать аккаунт"}
      </Button>
    </form>
  );
}
