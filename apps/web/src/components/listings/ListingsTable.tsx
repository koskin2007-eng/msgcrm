import { formatCurrency, platformLabel } from "../../lib/format";
import type { Listing } from "../../lib/types";
import { Badge } from "../ui/Badge";

function listingStatusLabel(status: Listing["status"]) {
  const labels: Record<Listing["status"], string> = {
    active: "активно",
    paused: "на паузе",
    archived: "архив"
  };

  return labels[status];
}

export function ListingsTable({ listings }: { listings: Listing[] }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Название</th>
            <th>Цена</th>
            <th>Источник</th>
            <th>Аккаунт</th>
            <th>Город</th>
            <th>Статус</th>
            <th>Сообщения</th>
          </tr>
        </thead>
        <tbody>
          {listings.map((listing) => (
            <tr key={listing.id}>
              <td>{listing.title}</td>
              <td>{formatCurrency(listing.price)}</td>
              <td>{platformLabel(listing.source)}</td>
              <td>{listing.accountTitle}</td>
              <td>{listing.city}</td>
              <td>
                <Badge tone={listing.status === "active" ? "green" : "gray"}>
                  {listingStatusLabel(listing.status)}
                </Badge>
              </td>
              <td>{listing.messagesCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
