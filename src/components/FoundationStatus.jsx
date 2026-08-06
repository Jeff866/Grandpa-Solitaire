import { legalMoves } from "../game/play";

export default function FoundationStatus({
  ascending,
  descending,
  hand = [],
  game,
  onPlay,
}) {
  const currentCard =
    hand.length > 0 ? hand[0] : null;

  const moves =
    currentCard && game
      ? legalMoves(game, currentCard)
      : [];

  function isLegal(type, index) {
    return moves.some(
      (m) =>
        m.type === type &&
        m.index === index
    );
  }

  function foundationClass(active) {
    return [
      "rounded-xl",
      "border-2",
      "p-4",
      "min-h-28",
      "transition-all",
      active
        ? "border-yellow-300 bg-yellow-200/20 cursor-pointer shadow-lg"
        : "border-green-700 bg-green-900/40",
    ].join(" ");
  }

  return (
    <div className="grid grid-cols-4 gap-6">
      {ascending.map((pile, index) => (
        <button
          key={`A-${index}`}
          disabled={!isLegal("ascending", index)}
          onClick={() =>
            onPlay?.({
              type: "ascending",
              index,
            })
          }
          className={foundationClass(
            isLegal("ascending", index)
          )}
        >
          <div className="font-bold mb-2">
            ▲ Foundation {index + 1}
          </div>

          <div className="text-3xl">
            {pile.length === 0
              ? "—"
              : pile[pile.length - 1].rank}
          </div>
        </button>
      ))}

      {descending.map((pile, index) => (
        <button
          key={`D-${index}`}
          disabled={!isLegal("descending", index)}
          onClick={() =>
            onPlay?.({
              type: "descending",
              index,
            })
          }
          className={foundationClass(
            isLegal("descending", index)
          )}
        >
          <div className="font-bold mb-2">
            ▼ Foundation {index + 1}
          </div>

          <div className="text-3xl">
            {pile.length === 0
              ? "—"
              : pile[pile.length - 1].rank}
          </div>
        </button>
      ))}
    </div>
  );
}