"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createIntegrationAccount } from "../../lib/integrations-client";
import { Button } from "../ui/Button";

interface CreateIntegrationButtonProps {
  disabled?: boolean;
}

export function CreateIntegrationButton({ disabled = false }: CreateIntegrationButtonProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleClick() {
    if (disabled || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await createIntegrationAccount({ platform: "avito" });
      router.refresh();
    } catch (createError) {
      setError(
        createError instanceof Error ? createError.message : "Не удалось подключить Авито"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="integration-create-action">
      <Button disabled={disabled || isSubmitting} onClick={handleClick}>
        <Plus size={16} />
        {isSubmitting ? "Подключаем..." : "Подключить Авито"}
      </Button>
      {error ? <span>{error}</span> : null}
    </div>
  );
}
