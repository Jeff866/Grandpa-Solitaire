import PlayingCard from "./PlayingCard";
import { FOUNDATION_SUITS, legalMoves } from "../game/play";

export default function FoundationStatus({
  ascending,
  descending,
  hand = [],
  game,
  onPlay,
}) {
  const currentCard = hand.length > 0 ? hand[0] : null;
  const moves = currentCard && game ? legalMoves(game, currentCard) : [];

  function isLegal(type, index) {
    return moves.some((m) => m.type === type && m.index === index);
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

  function renderSlot(type, pile, index) {
    const suit = FOUNDATION_SUITS[index];
    const active = isLegal(type, index);
    const topCard = pile[pile.length - 1];
    const ascendingType = type === "ascending";

    return (
      <button
        key={`${type}-${suit}`}
        disabled={!active}
        onClick={() => onPlay?.({ type, index })}
        className={foundationClass(active)}
        aria-label={`${suit} ${ascendingType ? "ascending" : "descending"} foundation`}
      >
        <div className="foundation-label">
          <span>{ascendingType ? "▲ A→K" : "▼ K→A"}</span>
          <span className={suit === "♥" || suit === "♦" ? "text-red-500" : "text-white"}>
            {suit}
          </span>
        </div>

        <div className="foundation-card-space">
          {topCard ? (
            <div className="foundation-card-wrap">
              <PlayingCard rank={topCard.rank} suit={topCard.suit} red={topCard.red} />
            </div>
          ) : (
            <div className="foundation-empty">{suit}</div>
          )}
        </div>
      </button>
    );
  }

  return (
    <div className="foundation-board">
      <div className="foundation-title-row">
        <h2 className="text-2xl font-bold">Foundations</h2>
        <span className="text-green-200">♥ Hearts · ♦ Diamonds · ♣ Clubs · ♠ Spades</span>
      </div>

      <div className="foundation-grid">
        {FOUNDATION_SUITS.map((_, index) =>
          renderSlot("ascending", ascending[index], index)
        )}
        {FOUNDATION_SUITS.map((_, index) =>
          renderSlot("descending", descending[index], index)
        )}
      </div>
    </div>
  );
}
