"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  inviteTeamMemberRequest,
  type InviteTeamMemberPayload
} from "../../lib/team-client";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

const roles: Array<{ value: InviteTeamMemberPayload["role"]; label: string }> = [
  { value: "manager", label: "manager" },
  { value: "admin", label: "admin" },
  { value: "viewer", label: "viewer" }
];

export function InviteTeamMemberForm() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<InviteTeamMemberPayload["role"]>("manager");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);

    if (!displayName.trim() || !email.trim()) {
      setError("Заполните имя и email сотрудника");
      return;
    }

    setIsSubmitting(true);

    try {
      await inviteTeamMemberRequest({
        displayName: displayName.trim(),
        email: email.trim(),
        role
      });
      setDisplayName("");
      setEmail("");
      setRole("manager");
      setMessage("Приглашение добавлено");
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Не удалось добавить приглашение"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="team-invite-card">
      <div>
        <h2>Пригласить сотрудника</h2>
        <p>Сотрудник появится в команде со статусом приглашения. Отправку email подключим отдельно.</p>
      </div>
      <form className="team-invite-form" onSubmit={handleSubmit}>
        <label>
          Имя
          <Input
            minLength={2}
            onChange={(event) => setDisplayName(event.target.value)}
            required
            value={displayName}
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
          Роль
          <select
            className="input"
            onChange={(event) =>
              setRole(event.target.value as InviteTeamMemberPayload["role"])
            }
            value={role}
          >
            {roles.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <div className="team-invite-actions">
          <Button disabled={isSubmitting} type="submit">
            {isSubmitting ? "Добавляем..." : "Пригласить сотрудника"}
          </Button>
        </div>
        {message ? <p className="team-message span-2">{message}</p> : null}
        {error ? <p className="team-error span-2">{error}</p> : null}
      </form>
    </section>
  );
}
