import PlayingCard from "./PlayingCard";
import {
  FOUNDATION_SUITS,
  legalMoves,
} from "../game/play";

export default function FoundationStatus({
  ascending,
  descending,
  game,
  selectedCard = null,
  draggedCard = null,
  onPlay,
  onDropCard,
}) {
  /*
   * Click selection remains the normal fallback.
   *
   * While dragging, the dragged card temporarily
   * becomes the card used to determine which
   * foundations are legal.
   */
  const activeCard =
    draggedCard || selectedCard;

  const moves =
    activeCard && game
      ? legalMoves(game, activeCard)
      : [];

  function isLegal(type, index) {
    return moves.some(
      (move) =>
        move.type === type &&
        move.index === index
    );
  }

  function foundationClass(active) {
    return [
      "foundation-slot",
      "rounded-xl border-2 transition-all",
      active
        ? "border-yellow-300 bg-yellow-200/20 cursor-pointer shadow-lg"
        : "border-green-700 bg-green-900/40",
    ].join(" ");
  }

  function renderSlot(
    type,
    pile,
    index
  ) {
    const suit =
      FOUNDATION_SUITS[index];

    const active =
      isLegal(type, index);

    const topCard =
      pile[pile.length - 1];

    const ascendingType =
      type === "ascending";

    return (
      <button
        type="button"
        key={`${type}-${suit}`}
        disabled={!active}
        onClick={() => {
          /*
           * Preserve the existing
           * click-to-play system.
           */
          if (
            active &&
            selectedCard
          ) {
            onPlay?.({
              type,
              index,
            });
          }
        }}
        onDragOver={(event) => {
          /*
           * Browsers only allow a drop
           * when dragover is prevented.
           *
           * We only do that for a legal
           * foundation.
           */
          if (
            active &&
            draggedCard
          ) {
            event.preventDefault();
            event.dataTransfer.dropEffect =
              "move";
          }
        }}
        onDrop={(event) => {
          event.preventDefault();

          if (
            !active ||
            !draggedCard
          ) {
            return;
          }

          onDropCard?.({
            type,
            index,
          });
        }}
        className={foundationClass(
          active
        )}
        aria-label={`${suit} ${
          ascendingType
            ? "ascending"
            : "descending"
        } foundation`}
      >
        <div className="foundation-label">
          <span>
            {ascendingType
              ? "▲ A→K"
              : "▼ K→A"}
          </span>

          <span
            className={
              suit === "♥" ||
              suit === "♦"
                ? "text-red-500"
                : "text-white"
            }
          >
            {suit}
          </span>
        </div>

        <div className="foundation-card-space">
          {topCard ? (
            <div className="foundation-card-wrap">
              <PlayingCard
                rank={
                  topCard.rank
                }
                suit={
                  topCard.suit
                }
                red={
                  topCard.suit ===
                    "♥" ||
                  topCard.suit ===
                    "♦"
                }
              />
            </div>
          ) : (
            <div className="foundation-empty">
              {suit}
            </div>
          )}
        </div>
      </button>
    );
  }

  return (
    <div className="foundation-board">
      <div className="foundation-title-row">
        <h2>Foundations</h2>

        <div>
          ♥ Hearts · ♦ Diamonds ·
          ♣ Clubs · ♠ Spades
        </div>
      </div>

      <div className="foundation-grid">
        {FOUNDATION_SUITS.map(
          (_, index) =>
            renderSlot(
              "ascending",
              ascending[index],
              index
            )
        )}

        {FOUNDATION_SUITS.map(
          (_, index) =>
            renderSlot(
              "descending",
              descending[index],
              index
            )
        )}
      </div>
    </div>
  );
}