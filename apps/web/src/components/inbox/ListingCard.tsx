import { Package } from "lucide-react";
import { formatCurrency } from "../../lib/format";
import type { Listing } from "../../lib/types";

export function ListingCard({ listing }: { listing: Listing }) {
  return (
    <section className="side-info-card">
      <div className="product-visual" aria-label={listing.photoLabel}>
        <Package size={34} />
        <span>{listing.photoLabel}</span>
      </div>
      <h3>{listing.title}</h3>
      <dl className="info-list">
        <div>
          <dt>Цена</dt>
          <dd>{formatCurrency(listing.price)}</dd>
        </div>
        <div>
          <dt>Город</dt>
          <dd>{listing.city}</dd>
        </div>
        <div>
          <dt>Остаток</dt>
          <dd>{listing.stock}</dd>
        </div>
        <div>
          <dt>Габариты</dt>
          <dd>{listing.dimensions}</dd>
        </div>
        <div>
          <dt>Вес</dt>
          <dd>{listing.weight}</dd>
        </div>
      </dl>
    </section>
  );
}
