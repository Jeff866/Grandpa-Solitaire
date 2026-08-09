import GameButton from "./GameButton";

export default function Header({
  phase,
  onNewGame,
  onDealOne,
  onDealRound,
}) {
  const canDeal =
    phase === "Deal";

  return (
    <header className="game-header">
      <div className="game-header-brand">
        <h1>
          Grandpa&apos;s Solitaire
        </h1>

        <span>
          Solitaire 104
        </span>
      </div>

      <div className="game-header-deal-controls">
        <GameButton
          color="blue"
          onClick={onDealOne}
          disabled={!canDeal}
        >
          Deal One
        </GameButton>

        <GameButton
          color="amber"
          onClick={onDealRound}
          disabled={!canDeal}
        >
          Deal Round (13)
        </GameButton>
      </div>

      <div className="game-header-new">
        <GameButton
          color="green"
          onClick={onNewGame}
        >
          New Game
        </GameButton>
      </div>
    </header>
  );
}