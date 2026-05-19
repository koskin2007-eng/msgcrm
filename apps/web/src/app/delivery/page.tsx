import { Calculator } from "lucide-react";
import { AppLayout } from "../../components/layout/AppLayout";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { PageHeader } from "../../components/ui/PageHeader";
import { deliveryOptions } from "../../lib/mock-data";
import { AccountStatusBadge } from "../../components/ui/StatusBadge";

export default function DeliveryPage() {
  return (
    <AppLayout>
      <section className="page-content">
        <PageHeader
          description="Будущие службы доставки и mock-расчёт стоимости для сделки."
          title="Доставка"
        />

        <div className="delivery-layout">
          <section className="delivery-form-card">
            <h2>Расчёт доставки</h2>
            <div className="form-grid">
              <label>
                Город отправления
                <Input defaultValue="Москва" />
              </label>
              <label>
                Город получения
                <Input defaultValue="Санкт-Петербург" />
              </label>
              <label>
                ПВЗ клиента
                <Input defaultValue="ПВЗ Озерки" />
              </label>
              <label>
                Вес
                <Input defaultValue="3,2 кг" />
              </label>
              <label>
                Габариты
                <Input defaultValue="40 × 30 × 25 см" />
              </label>
              <label>
                Служба доставки
                <Input defaultValue="СДЭК" />
              </label>
            </div>
            <Button>
              <Calculator size={16} />
              Рассчитать доставку
            </Button>
          </section>

          <section className="delivery-result-card">
            <h2>Mock-результат</h2>
            <div className="delivery-result-list">
              <div>
                <strong>СДЭК</strong>
                <span>420 ₽, 2-3 дня</span>
              </div>
              <div>
                <strong>Ozon Delivery</strong>
                <span>350 ₽, 2-4 дня</span>
              </div>
            </div>
          </section>
        </div>

        <div className="integration-grid compact">
          {deliveryOptions.map((option) => (
            <section className="integration-card" key={option.id}>
              <div className="integration-head">
                <h3>{option.title}</h3>
                <AccountStatusBadge status={option.status} />
              </div>
              <p>{option.priceLabel ? `${option.priceLabel}, ${option.etaLabel}` : "Интеграция запланирована"}</p>
            </section>
          ))}
        </div>
      </section>
    </AppLayout>
  );
}
