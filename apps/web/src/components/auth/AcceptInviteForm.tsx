"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  acceptTeamInvitationRequest,
  getTeamInvitationRequest,
  type TeamInvitation
} from "../../lib/team-client";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

export function AcceptInviteForm() {
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get("token") ?? "", [searchParams]);
  const [invitation, setInvitation] = useState<TeamInvitation | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadInvitation() {
      setError(null);
      setMessage(null);

      if (!token) {
        setError("Ссылка приглашения не найдена");
        setIsLoading(false);
        return;
      }

      try {
        const data = await getTeamInvitationRequest(token);

        if (isMounted) {
          setInvitation(data);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Приглашение недоступно"
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadInvitation();

    return () => {
      isMounted = false;
    };
  }, [token]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (password.length < 8) {
      setError("Пароль должен быть не короче 8 символов");
      return;
    }

    setIsSubmitting(true);

    try {
      await acceptTeamInvitationRequest(token, password);
      setPassword("");
      setMessage("Пароль установлен. Теперь можно войти в MsgCRM.");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Не удалось принять приглашение"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return <p>Проверяем приглашение...</p>;
  }

  if (message) {
    return (
      <div className="auth-form">
        <p className="team-message">{message}</p>
        <Link className="auth-link" href="/login">
          Перейти ко входу
        </Link>
      </div>
    );
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {invitation ? (
        <dl className="invite-summary">
          <div>
            <dt>Компания</dt>
            <dd>{invitation.companyName}</dd>
          </div>
          <div>
            <dt>Сотрудник</dt>
            <dd>{invitation.displayName}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{invitation.email}</dd>
          </div>
          <div>
            <dt>Роль</dt>
            <dd>{invitation.role}</dd>
          </div>
        </dl>
      ) : null}

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

      {error ? <p className="form-error">{error}</p> : null}
      <Button disabled={isSubmitting || !invitation} type="submit">
        {isSubmitting ? "Активируем..." : "Активировать аккаунт"}
      </Button>
    </form>
  );
}
