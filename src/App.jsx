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
  drawCard,
  RANKS,
} from "./game/deal";

import {
  playCard,
  isVictory,
} from "./game/play";

export default function App() {
  const [won, setWon] = useState(false);

  const [game, setGame] = useState(() => {
    const fresh = createEmptyGame();
    fresh.stock = shuffle(createDeck());
    return fresh;
  });

  function newGame() {
    const fresh = createEmptyGame();
    fresh.stock = shuffle(createDeck());

    setWon(false);
    setGame(fresh);
  }

  function cloneGame() {
    return {
      ...game,

      stock: [...game.stock],
      discard: [...game.discard],
      drawPile: [...game.drawPile],

      piles: Object.fromEntries(
        RANKS.map((rank) => [
          rank,
          [...game.piles[rank]],
        ])
      ),

      ascending: game.ascending.map((pile) => [...pile]),
      descending: game.descending.map((pile) => [...pile]),

      hand: [...game.hand],
    };
  }

  function updateGame(action) {
    const updated = cloneGame();
    action(updated);
    setGame(updated);
  }

  function handlePlay(move) {
    updateGame((updated) => {
      const success = playCard(updated, move);

      if (!success) return;

      drawCard(updated);

      if (isVictory(updated)) {
        setWon(true);
      }
    });
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
          stock={
            game.phase === "Deal"
              ? game.stock.length
              : game.drawPile.length
          }
          discard={
            game.phase === "Deal"
              ? game.discard
              : game.drawPile
          }
          hand={game.hand}
          nextRank={
            game.phase === "Deal"
              ? RANKS[game.currentPile]
              : null
          }
        />

        <GameMessage
          phase={game.phase}
          won={won}
        />

        <StockArea
          stock={
            game.phase === "Deal"
              ? game.stock.length
              : game.drawPile.length
          }
          discard={
            game.phase === "Deal"
              ? game.discard
              : game.drawPile
          }
        />

        {game.phase === "Play" && (
          <section className="mt-6 rounded-xl border border-green-700 bg-green-800/40 p-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">
                  Play Phase
                </h2>

                <p className="text-green-200 mt-1">
                  The discard pile has been flipped and is now
                  the draw pile.
                </p>
              </div>

              <button
                onClick={() => updateGame(drawCard)}
                disabled={
                  game.drawPile.length === 0 ||
                  game.hand.length > 0
                }
                className="rounded-lg bg-emerald-400 px-5 py-3 font-semibold text-black disabled:opacity-40"
              >
                Draw Card
              </button>
            </div>

            <div className="mt-4 text-sm text-green-200">
              Draw pile remaining: {game.drawPile.length}
            </div>
          </section>
        )}

        <section className="mt-10">
          <h2 className="text-3xl font-bold mb-5">
            Deal Piles
          </h2>

          {game.phase === "Deal" && (
            <p className="mb-4 text-green-200">
              Currently dealing to{" "}
              <strong>{RANKS[game.currentPile]}</strong>
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
            hand={game.hand}
            game={game}
            onPlay={handlePlay}
          />
        </section>

        <Hand cards={game.hand} />
      </main>
    </div>
  );
}