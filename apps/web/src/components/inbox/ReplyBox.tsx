import { Send, Truck, WandSparkles } from "lucide-react";
import { quickReplyTemplates } from "../../lib/mock-data";
import { Button } from "../ui/Button";
import { Textarea } from "../ui/Input";

interface ReplyBoxProps {
  value: string;
  isSending?: boolean;
  sendError?: string | null;
  onChange: (value: string) => void;
  onSend: () => void | Promise<void>;
  onCreateDeal: () => void;
}

export function ReplyBox({
  value,
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
          <button key={template.id} onClick={() => onChange(template.text)} type="button">
            {template.title}
          </button>
        ))}
      </div>

      <Textarea
        aria-label="Ответ клиенту"
        onChange={(event) => onChange(event.target.value)}
        placeholder="Напишите ответ клиенту..."
        value={value}
      />

      {sendError ? <p className="reply-error">{sendError}</p> : null}

      <div className="reply-actions">
        <Button disabled={isSending} onClick={onSend}>
          <Send size={16} />
          {isSending ? "Отправляем..." : "Отправить"}
        </Button>
        <Button onClick={() => onChange(quickReplyTemplates[0]?.text ?? "")} variant="secondary">
          <WandSparkles size={16} />
          Быстрый ответ
        </Button>
        <Button variant="secondary">
          <Truck size={16} />
          Рассчитать доставку
        </Button>
        <Button onClick={onCreateDeal} variant="secondary">
          Создать сделку
        </Button>
      </div>
    </section>
  );
}
