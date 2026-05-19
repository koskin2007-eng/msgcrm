import { platformLabel } from "../../lib/format";
import type { Conversation } from "../../lib/types";

export function CustomerCard({ conversation }: { conversation: Conversation }) {
  return (
    <section className="side-info-card">
      <h3>Клиент</h3>
      <dl className="info-list">
        <div>
          <dt>Имя</dt>
          <dd>{conversation.customerName}</dd>
        </div>
        <div>
          <dt>Телефон</dt>
          <dd>{conversation.customerPhone}</dd>
        </div>
        <div>
          <dt>Ближайший ПВЗ</dt>
          <dd>{conversation.customerPickupPoint}</dd>
        </div>
        <div>
          <dt>Источник</dt>
          <dd>{platformLabel(conversation.source)}</dd>
        </div>
        <div>
          <dt>История</dt>
          <dd>3 обращения</dd>
        </div>
      </dl>
    </section>
  );
}
