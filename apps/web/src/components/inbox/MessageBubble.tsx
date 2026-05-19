import { formatTime } from "../../lib/format";
import type { Message } from "../../lib/types";

export function MessageBubble({ message }: { message: Message }) {
  const isManager = message.sender === "manager";

  return (
    <article className={`message-bubble ${isManager ? "manager" : "customer"}`}>
      <div>
        <span>{isManager ? "Менеджер" : "Клиент"}</span>
        <time>{formatTime(message.createdAt)}</time>
      </div>
      <p>{message.text}</p>
    </article>
  );
}
