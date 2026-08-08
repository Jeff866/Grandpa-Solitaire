import PlayingCard from "./PlayingCard";

export default function DealPile({
  label,
  cards = [],
  onSelect,
}) {
  const topCard =
    cards.length > 0 ? cards[cards.length - 1] : null;

  return (
    <button
      type="button"
      onClick={onSelect}
      className="deal-pile"
    >
      <div className="deal-pile-label">
        {label}
      </div>

      <div className="deal-pile-card-area">
        {topCard ? (
          <PlayingCard
            rank={topCard.rank}
            suit={topCard.suit}
            red={
              topCard.suit === "♥" ||
              topCard.suit === "♦"
            }
          />
        ) : (
          <div className="deal-pile-empty">
            {label}
          </div>
        )}
      </div>

      <div className="deal-pile-count">
        {cards.length}
      </div>
    </button>
  );
}