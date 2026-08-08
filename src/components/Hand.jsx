import PlayingCard from "./PlayingCard";

export default function Hand({
  cards = [],
  selectedIndex = null,
  onSelectCard,
}) {
  function getCardPosition(index, count) {
    if (count <= 1) {
      return {
        left: "10px",
        transform: "none",
      };
    }

    /*
     * Spread the active pile across the available width.
     * Every card remains identifiable and selectable.
     */
    const maxSpread =
      count <= 7
        ? 78
        : count <= 10
          ? 80
          : 82;

    const position =
      (index / (count - 1)) * maxSpread;

    return {
      left: `${position}%`,
      transform: "none",
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

            const selected =
              index === selectedIndex;

            return (
              <button
                type="button"
                key={card.id}
                onClick={() =>
                  onSelectCard?.(
                    card,
                    index
                  )
                }
                className={[
                  "active-hand-card",
                  selected
                    ? "active-hand-card-current"
                    : "active-hand-card-waiting",
                ].join(" ")}
                style={{
                  left: position.left,
                  transform:
                    position.transform,
                  zIndex: selected
                    ? 200
                    : index + 1,
                }}
                aria-label={
                  selected
                    ? `Selected ${card.rank}${card.suit}`
                    : `Select ${card.rank}${card.suit}`
                }
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
          {selectedIndex !== null &&
          cards[selectedIndex] ? (
            <>
              Selected card:{" "}
              <strong>
                {
                  cards[selectedIndex]
                    .rank
                }
                {
                  cards[selectedIndex]
                    .suit
                }
              </strong>
              {" · "}
            </>
          ) : (
            <>Select a card · </>
          )}

          {cards.length} cards remaining
        </div>
      )}
    </section>
  );
}