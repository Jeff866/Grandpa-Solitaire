import PlayingCard from "./PlayingCard";

export default function Hand({
  cards = [],
  onPlayCard,
}) {
  function getCardPosition(index, count) {
    if (count <= 1) {
      return {
        left: "10px",
        transform: "none",
      };
    }

    /*
     * Spread smaller hands comfortably across the panel.
     * Larger hands automatically overlap more tightly.
     *
     * Because the cards are absolutely positioned,
     * the hand never increases the height of the board.
     */
    const cardWidth = 72;
    const sidePadding = 10;

    /*
     * Percentage spacing is capped so large hands remain
     * inside the Active Pile.
     */
    const maxSpread =
      count <= 7
        ? 88
        : count <= 10
          ? 86
          : 84;

    const position =
      (index / (count - 1)) * maxSpread;

    return {
      left: `calc(${position}% + ${sidePadding}px)`,
      transform:
        index === 0
          ? "none"
          : "translateX(-50%)",
    };
  }

  return (
    <section className="active-hand">
      <div className="active-hand-area">
        {cards.length === 0 ? (
          <div className="active-hand-empty">
            No cards in hand
          </div>
        ) : (
          cards.map((card, index) => {
            const position = getCardPosition(
              index,
              cards.length
            );

            return (
              <button
                type="button"
                key={card.id}
                onClick={() =>
                  onPlayCard?.(card, index)
                }
                className="active-hand-card"
                style={{
                  left: position.left,
                  transform: position.transform,
                  zIndex: index + 1,
                }}
              >
                <PlayingCard
                  rank={card.rank}
                  suit={card.suit}
                  red={
                    card.suit === "♥" ||
                    card.suit === "♦"
                  }
                />
              </button>
            );
          })
        )}
      </div>

      {cards.length > 0 && (
        <div className="active-hand-count">
          {cards.length} cards
        </div>
      )}
    </section>
  );
}