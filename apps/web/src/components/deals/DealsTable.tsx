import { formatCurrency, formatDate } from "../../lib/format";
import type { Deal } from "../../lib/types";
import { DealStatusBadge } from "../ui/StatusBadge";

export function DealsTable({ deals }: { deals: Deal[] }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Клиент</th>
            <th>Товар / объявление</th>
            <th>Сумма</th>
            <th>Доставка</th>
            <th>Статус сделки</th>
            <th>Дата</th>
            <th>Менеджер</th>
          </tr>
        </thead>
        <tbody>
          {deals.map((deal) => (
            <tr key={deal.id}>
              <td>{deal.customerName}</td>
              <td>{deal.listingTitle}</td>
              <td>{formatCurrency(deal.amount)}</td>
              <td>{deal.deliveryStatus}</td>
              <td>
                <DealStatusBadge status={deal.dealStatus} />
              </td>
              <td>{formatDate(deal.createdAt)}</td>
              <td>{deal.managerName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
