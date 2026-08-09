import PlayingCard from "./PlayingCard";

export default function DealPile({
  label,
  cards = [],
  onSelect,
  playable = false,
  onDragCardStart,
  onDragCardEnd,
}) {
  const topCard =
    cards.length > 0
      ? cards[cards.length - 1]
      : null;

  return (
    <button
      type="button"
      className={[
        "deal-pile",
        playable
          ? "deal-pile-playable"
          : "",
      ].join(" ")}
      onClick={() => {
        if (topCard && playable) {
          onSelect?.(
            label,
            topCard
          );
        }
      }}
      disabled={
        !topCard || !playable
      }
      aria-label={
        topCard
          ? `${label} pile, top card ${topCard.rank}${topCard.suit}`
          : `${label} pile empty`
      }
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
            draggable={playable}
            onDragStart={(event) => {
              if (!playable) {
                event.preventDefault();
                return;
              }

              event.dataTransfer.setData(
                "text/plain",
                topCard.id
              );

              event.dataTransfer.effectAllowed =
                "move";

              onDragCardStart?.(
                label,
                topCard
              );
            }}
            onDragEnd={() => {
              onDragCardEnd?.();
            }}
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