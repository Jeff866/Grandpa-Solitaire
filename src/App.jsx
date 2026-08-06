import { useState } from "react";

import Header from "./components/Header";
import StatusBar from "./components/StatusBar";
import StockArea from "./components/StockArea";
import DealPile from "./components/DealPile";
import FoundationStatus from "./components/FoundationStatus";
import Hand from "./components/Hand";
import GameMessage from "./components/GameMessage";

import { createDeck, shuffle } from "./game/deck";
import {
  createEmptyGame,
  dealOne,
  dealRound,
  RANKS,
} from "./game/deal";

export default function App() {
  const [game, setGame] = useState(() => {
    const fresh = createEmptyGame();
    fresh.stock = shuffle(createDeck());
    return fresh;
  });

  function newGame() {
    const fresh = createEmptyGame();
    fresh.stock = shuffle(createDeck());
    setGame(fresh);
  }

  function cloneGame() {
    return {
      ...game,
      stock: [...game.stock],
      discard: [...game.discard],
      piles: Object.fromEntries(
        RANKS.map((rank) => [rank, [...game.piles[rank]]])
      ),
      ascending: game.ascending.map((p) => [...p]),
      descending: game.descending.map((p) => [...p]),
      hand: [...game.hand],
    };
  }

  function updateGame(mutator) {
    const updated = cloneGame();
    mutator(updated);
    setGame(updated);
  }

  return (
    <div className="min-h-screen bg-green-900 text-white">
      <Header
        onNewGame={newGame}
        onDealOne={() => updateGame(dealOne)}
        onDealRound={() => updateGame(dealRound)}
      />

      <main className="max-w-7xl mx-auto p-8">
        <StatusBar
          phase={game.phase}
          stock={game.stock.length}
          discard={game.discard}
          hand={game.hand}
          nextRank={game.phase === "Deal" ? RANKS[game.currentPile] : null}
        />

        <GameMessage
          phase={game.phase}
          won={false}
        />

        <StockArea
          stock={game.stock.length}
          discard={game.discard}
        />

        <section className="mt-10">
          <h2 className="text-3xl font-bold mb-2">
            Deal Piles
          </h2>

          {game.phase === "Deal" && (
            <p className="mb-4 text-green-200">
              Currently dealing to <strong>{RANKS[game.currentPile]}</strong>.
              Matching cards burn two extra cards. Aces burn one extra card. An
              Ace dealt to the Ace pile burns three cards total.
            </p>
          )}

          <div className="grid grid-cols-7 gap-4">
            {RANKS.map((rank) => (
              <DealPile
                key={rank}
                label={rank}
                cards={game.piles[rank]}
              />
            ))}
          </div>
        </section>

        <section className="mt-10">
          <FoundationStatus
            ascending={game.ascending}
            descending={game.descending}
          />
        </section>

        <Hand cards={game.hand} />
      </main>
    </div>
  );
}
