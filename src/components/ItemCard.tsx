import type { Garment } from "../data/wardrobe";
import { Icon } from "./ui";

export function ItemCard({
  garment,
  onClick,
  hideFav,
}: {
  garment: Garment;
  onClick?: () => void;
  hideFav?: boolean;
}) {
  return (
    <button className="item-card" onClick={onClick}>
      <div className="item-card__image">
        <img src={garment.image} alt={garment.name} loading="lazy" />
        {!hideFav && (
          <span
            className={`item-card__fav${garment.favourite ? " item-card__fav--on" : ""}`}
          >
            <Icon name={garment.favourite ? "heart-fill" : "heart"} size={18} />
          </span>
        )}
      </div>
      <div className="item-card__info">
        <span className="t-overline overline-muted">{garment.brand}</span>
        <span className="t-title-m item-card__name">{garment.name}</span>
        <span className="t-caption item-card__detail">
          {garment.color} · {garment.category}
        </span>
      </div>
    </button>
  );
}
