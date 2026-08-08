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
     * Spread the hand across the available width.
     *
     * Later cards overlap earlier cards like a normal
     * fanned hand, but each card keeps enough of its
     * upper-left corner visible to identify rank/suit.
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

            const isPlayableCard = index === 0;

            return (
              <button
                type="button"
                key={card.id}
                onClick={() => {
                  if (isPlayableCard) {
                    onPlayCard?.(card, index);
                  }
                }}
                className={[
                  "active-hand-card",
                  isPlayableCard
                    ? "active-hand-card-current"
                    : "active-hand-card-waiting",
                ].join(" ")}
                style={{
                  left: position.left,
                  transform: position.transform,

                  /*
                   * Normal card-hand stacking:
                   * each card to the right sits above
                   * the card immediately before it.
                   */
                  zIndex: index + 1,
                }}
                aria-label={
                  isPlayableCard
                    ? `Current card ${card.rank}${card.suit}`
                    : `${card.rank}${card.suit} waiting`
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
          Current card:{" "}
          <strong>
            {cards[0].rank}
            {cards[0].suit}
          </strong>
          {" · "}
          {cards.length} cards remaining
        </div>
      )}
    </section>
  );
}