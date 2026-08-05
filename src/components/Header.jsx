import GameButton from "./GameButton";

export default function Header({
  onNewGame,
  onDealOne,
  onDealRound,
}) {
  return (
    <header className="bg-amber-900 shadow-lg border-b-4 border-amber-700">

      <div className="max-w-7xl mx-auto px-8 py-5">

        <div className="flex justify-between items-center">

          <div>

            <h1 className="text-4xl font-bold">
              Grandpa's Solitaire
            </h1>

            <p className="text-green-200 mt-1">
              Solitaire 104
            </p>

          </div>


          <GameButton
            color="green"
            onClick={onNewGame}
          >
            New Game
          </GameButton>

        </div>


        <div className="flex gap-3 mt-5">

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

      </div>

    </header>
  );
}