"use client";

import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";
import { createKnowledgeDocument } from "../../lib/knowledge-client";
import { Button } from "../ui/Button";
import { Input, Textarea } from "../ui/Input";

interface KnowledgeDocumentFormProps {
  canManage: boolean;
}

export function KnowledgeDocumentForm({ canManage }: KnowledgeDocumentFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [source, setSource] = useState("manual");
  const [body, setBody] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canManage || isSubmitting) {
      return;
    }

    setMessage(null);
    setError(null);
    setIsSubmitting(true);

    try {
      await createKnowledgeDocument({ title, source, body });
      setTitle("");
      setSource("manual");
      setBody("");
      setMessage("Документ добавлен в базу знаний");
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Не удалось добавить документ"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="knowledge-form" onSubmit={handleSubmit}>
      {!canManage ? (
        <p className="permission-note">Добавлять документы могут только owner и admin.</p>
      ) : null}
      {message ? <p className="profile-message">{message}</p> : null}
      {error ? <p className="profile-error">{error}</p> : null}
      <label>
        Название
        <Input
          onChange={(event) => setTitle(event.target.value)}
          placeholder="FAQ по доставке"
          readOnly={!canManage}
          required
          value={title}
        />
      </label>
      <label>
        Источник
        <Input
          onChange={(event) => setSource(event.target.value)}
          placeholder="manual, faq, policy"
          readOnly={!canManage}
          value={source}
        />
      </label>
      <label className="span-2">
        Содержимое
        <Textarea
          onChange={(event) => setBody(event.target.value)}
          placeholder="Вставьте инструкции, регламент, FAQ или описание товара..."
          readOnly={!canManage}
          required
          value={body}
        />
      </label>
      <div className="span-2 profile-actions">
        <Button disabled={!canManage || isSubmitting} type="submit">
          <Save size={16} />
          {isSubmitting ? "Сохраняем..." : "Добавить документ"}
        </Button>
      </div>
    </form>
  );
}
