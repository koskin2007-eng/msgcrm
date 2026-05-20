"use client";

import { Copy } from "lucide-react";
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
  const [inviteUrl, setInviteUrl] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);
    setInviteUrl("");

    if (!displayName.trim() || !email.trim()) {
      setError("Заполните имя и email сотрудника");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await inviteTeamMemberRequest({
        displayName: displayName.trim(),
        email: email.trim(),
        role
      });
      const origin = window.location.origin;
      setInviteUrl(`${origin}${response.invitation.acceptPath}`);
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

  async function copyInviteUrl() {
    if (!inviteUrl) {
      return;
    }

    await navigator.clipboard.writeText(inviteUrl);
    setMessage("Ссылка скопирована");
  }

  return (
    <section className="team-invite-card">
      <div>
        <h2>Пригласить сотрудника</h2>
        <p>Сотрудник задаст пароль по одноразовой ссылке и войдёт в эту компанию.</p>
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
        {inviteUrl ? (
          <label className="team-invite-link span-2">
            Ссылка приглашения
            <span>
              <Input readOnly value={inviteUrl} />
              <Button onClick={copyInviteUrl} variant="secondary">
                <Copy size={16} />
                Копировать
              </Button>
            </span>
          </label>
        ) : null}
        {message ? <p className="team-message span-2">{message}</p> : null}
        {error ? <p className="team-error span-2">{error}</p> : null}
      </form>
    </section>
  );
}
