import { deliveryOptions } from "../../lib/mock-data";
import { Button } from "../ui/Button";
import { AccountStatusBadge } from "../ui/StatusBadge";

interface DeliveryCardProps {
  canCalculateDelivery?: boolean;
}

export function DeliveryCard({ canCalculateDelivery = true }: DeliveryCardProps) {
  return (
    <section className="side-info-card">
      <h3>Доставка</h3>
      <div className="delivery-mini-list">
        {deliveryOptions.slice(0, 3).map((option) => (
          <div key={option.id}>
            <span>{option.title}</span>
            <AccountStatusBadge status={option.status} />
          </div>
        ))}
      </div>
      {!canCalculateDelivery ? (
        <p className="permission-note compact">Расчёт доступен менеджерам, администраторам и владельцу.</p>
      ) : null}
      <Button className="full-width" disabled={!canCalculateDelivery} variant="secondary">
        Рассчитать доставку
      </Button>
    </section>
  );
}
