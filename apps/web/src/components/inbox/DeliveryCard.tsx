import { deliveryOptions } from "../../lib/mock-data";
import { Button } from "../ui/Button";
import { AccountStatusBadge } from "../ui/StatusBadge";

export function DeliveryCard() {
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
      <Button className="full-width" variant="secondary">
        Рассчитать доставку
      </Button>
    </section>
  );
}
