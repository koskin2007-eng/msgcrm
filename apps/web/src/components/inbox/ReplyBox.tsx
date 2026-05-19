import { Send, Truck, WandSparkles } from "lucide-react";
import { quickReplyTemplates } from "../../lib/mock-data";
import { Button } from "../ui/Button";
import { Textarea } from "../ui/Input";

interface ReplyBoxProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onCreateDeal: () => void;
}

export function ReplyBox({ value, onChange, onSend, onCreateDeal }: ReplyBoxProps) {
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

      <div className="reply-actions">
        <Button onClick={onSend}>
          <Send size={16} />
          Отправить
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
