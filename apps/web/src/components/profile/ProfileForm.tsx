"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  patchProfileRequest,
  type ProfileUpdatePayload
} from "../../lib/auth-client";
import type { AuthSession } from "../../lib/auth-types";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

interface ProfileFormProps {
  session: AuthSession;
}

function getInitialValues(session: AuthSession): ProfileUpdatePayload {
  return {
    displayName: session.user.displayName,
    phone: session.user.phone ?? "",
    email: session.user.email,
    companyName: session.company.name
  };
}

export function ProfileForm({ session }: ProfileFormProps) {
  const router = useRouter();
  const [savedValues, setSavedValues] = useState(() => getInitialValues(session));
  const [values, setValues] = useState(savedValues);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field: keyof ProfileUpdatePayload, value: string) {
    setValues((current) => ({
      ...current,
      [field]: value
    }));
  }

  function handleCancel() {
    setValues(savedValues);
    setMessage(null);
    setError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);

    if (
      !values.displayName.trim() ||
      !values.phone.trim() ||
      !values.email.trim() ||
      !values.companyName.trim()
    ) {
      setError("Заполните имя, телефон, email и компанию");
      return;
    }

    setIsSubmitting(true);

    try {
      const updatedSession: AuthSession = await patchProfileRequest({
        displayName: values.displayName.trim(),
        phone: values.phone.trim(),
        email: values.email.trim(),
        companyName: values.companyName.trim()
      });
      const nextValues = getInitialValues(updatedSession);
      setSavedValues(nextValues);
      setValues(nextValues);
      setMessage("Данные сохранены");
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Не удалось сохранить данные"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="profile-card">
      <form className="profile-form" onSubmit={handleSubmit}>
        <label>
          Имя
          <Input
            autoComplete="name"
            minLength={2}
            onChange={(event) => updateField("displayName", event.target.value)}
            required
            value={values.displayName}
          />
        </label>
        <label>
          Телефон
          <Input
            autoComplete="tel"
            onChange={(event) => updateField("phone", event.target.value)}
            placeholder="+7 999 123-45-67"
            required
            type="tel"
            value={values.phone}
          />
        </label>
        <label>
          Email
          <Input
            autoComplete="email"
            onChange={(event) => updateField("email", event.target.value)}
            required
            type="email"
            value={values.email}
          />
        </label>
        <label>
          Компания
          <Input
            autoComplete="organization"
            minLength={2}
            onChange={(event) => updateField("companyName", event.target.value)}
            required
            value={values.companyName}
          />
        </label>

        {message ? <p className="profile-message span-2">{message}</p> : null}
        {error ? <p className="profile-error span-2">{error}</p> : null}

        <div className="profile-actions span-2">
          <Button disabled={isSubmitting} type="submit">
            {isSubmitting ? "Сохраняем..." : "Сохранить изменения"}
          </Button>
          <Button disabled={isSubmitting} onClick={handleCancel} variant="secondary">
            Отменить
          </Button>
        </div>
      </form>
    </section>
  );
}
