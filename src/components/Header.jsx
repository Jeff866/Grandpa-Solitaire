import GameButton from "./GameButton";

export default function Header({
  onNewGame,
  onDealOne,
  onDealRound,
}) {
  return (
    <header className="game-header">
      <div className="game-header-brand">
        <h1>Grandpa's Solitaire</h1>
        <span>Solitaire 104</span>
      </div>

      <div className="game-header-deal-controls">
        <GameButton
          color="blue"
          onClick={onDealOne}
        >
          Deal One
        </GameButton>

        <GameButton
          color="amber"
          onClick={onDealRound}
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