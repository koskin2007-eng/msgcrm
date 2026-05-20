import { Send, Truck, WandSparkles } from "lucide-react";
import { quickReplyTemplates } from "../../lib/mock-data";
import { Button } from "../ui/Button";
import { Textarea } from "../ui/Input";

interface ReplyBoxProps {
  value: string;
  canCalculateDelivery?: boolean;
  canCreateDeal?: boolean;
  canReply?: boolean;
  isSending?: boolean;
  sendError?: string | null;
  onChange: (value: string) => void;
  onSend: () => void | Promise<void>;
  onCreateDeal: () => void;
}

export function ReplyBox({
  value,
  canCalculateDelivery = true,
  canCreateDeal = true,
  canReply = true,
  isSending = false,
  sendError,
  onChange,
  onSend,
  onCreateDeal
}: ReplyBoxProps) {
  return (
    <section className="reply-panel">
      <div className="quick-replies">
        {quickReplyTemplates.slice(0, 5).map((template) => (
          <button
            disabled={!canReply}
            key={template.id}
            onClick={() => onChange(template.text)}
            type="button"
          >
            {template.title}
          </button>
        ))}
      </div>

      <Textarea
        aria-label="Ответ клиенту"
        onChange={(event) => onChange(event.target.value)}
        placeholder={
          canReply
            ? "Напишите ответ клиенту..."
            : "Ваша роль позволяет только просматривать переписку"
        }
        readOnly={!canReply}
        value={value}
      />

      {!canReply ? (
        <p className="permission-note">Роль viewer открывает переписку только для просмотра.</p>
      ) : null}
      {sendError ? <p className="reply-error">{sendError}</p> : null}

      <div className="reply-actions">
        <Button disabled={isSending || !canReply} onClick={onSend}>
          <Send size={16} />
          {isSending ? "Отправляем..." : "Отправить"}
        </Button>
        <Button
          disabled={!canReply}
          onClick={() => onChange(quickReplyTemplates[0]?.text ?? "")}
          variant="secondary"
        >
          <WandSparkles size={16} />
          Быстрый ответ
        </Button>
        <Button disabled={!canCalculateDelivery} variant="secondary">
          <Truck size={16} />
          Рассчитать доставку
        </Button>
        <Button disabled={!canCreateDeal} onClick={onCreateDeal} variant="secondary">
          Создать сделку
        </Button>
      </div>
    </section>
  );
}
