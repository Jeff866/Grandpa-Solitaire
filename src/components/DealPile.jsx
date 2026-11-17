import { useRef } from "react";
import PlayingCard from "./PlayingCard";

const DOUBLE_TAP_MS = 350;

export default function DealPile({
  label,
  cards = [],
  onSelect,
  onQuickPlay,
  playable = false,
  onDragCardStart,
  onDragCardEnd,
}) {
  const lastTap = useRef({ id: null, time: 0 });
  const topCard = cards.length > 0 ? cards[cards.length - 1] : null;

  function handleClick(event) {
    if (!topCard || !playable) return;

    const now = Date.now();
    const previous = lastTap.current;
    const isDouble =
      event.detail >= 2 ||
      (previous.id === topCard.id &&
        now - previous.time <= DOUBLE_TAP_MS);

    if (isDouble) {
      lastTap.current = { id: null, time: 0 };
      onQuickPlay?.(label, topCard);
    } else {
      lastTap.current = { id: topCard.id, time: now };
      onSelect?.(label, topCard);
    }
  }

  return (
    <button
      type="button"
      className={[
        "deal-pile",
        playable ? "deal-pile-playable" : "",
      ].join(" ")}
      onClick={handleClick}
      disabled={!topCard || !playable}
      aria-label={
        topCard
          ? `${label} pile, top card ${topCard.rank}${topCard.suit}`
          : `${label} pile empty`
      }
    >
      <div className="deal-pile-label">{label}</div>

      <div className="deal-pile-card-area">
        {topCard ? (
          <PlayingCard
            rank={topCard.rank}
            suit={topCard.suit}
            red={topCard.suit === "♥" || topCard.suit === "♦"}
            draggable={playable}
            onDragStart={(event) => {
              lastTap.current = { id: null, time: 0 };
              if (!playable) {
                event.preventDefault();
                return;
              }
              event.dataTransfer.setData("text/plain", topCard.id);
              event.dataTransfer.effectAllowed = "move";
              onDragCardStart?.(label, topCard);
            }}
            onDragEnd={() => onDragCardEnd?.()}
          />
        ) : (
          <div className="deal-pile-empty">{label}</div>
        )}
      </div>

      <div className="deal-pile-count">{cards.length}</div>
    </button>
  );
}
