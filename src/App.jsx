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
    <div className="game-shell">
      <Header
        onNewGame={newGame}
        onDealOne={() => updateGame(dealOne)}
        onDealRound={() => updateGame(dealRound)}
      />

      <main className="game-main">
        <div className="game-info-row">
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
        </div>

        <section className="deal-section">
          <div className="deal-section-heading">
            <h2>Deal Piles</h2>

            {game.phase === "Deal" && (
              <p>
                Dealing to{" "}
                <strong>
                  {RANKS[game.currentPile]}
                </strong>
              </p>
            )}
          </div>

          <div className="deal-piles-row">
            {RANKS.map((rank) => (
              <DealPile
                key={rank}
                label={rank}
                cards={game.piles[rank]}
              />
            ))}
          </div>
        </section>

        <div className="lower-board">
          <section className="stock-panel">
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
              <div className="play-controls">
                <h2>Active Play</h2>

                <p>
                  Draw pile remaining:{" "}
                  <strong>{game.drawPile.length}</strong>
                </p>

                <button
                  type="button"
                  onClick={() => updateGame(drawCard)}
                  disabled={
                    game.drawPile.length === 0 ||
                    game.hand.length > 0
                  }
                >
                  Draw Card
                </button>
              </div>
            )}
          </section>

          <section className="active-panel">
            <h2>Active Pile</h2>

            <Hand cards={game.hand} />
          </section>

          <section className="foundation-panel">
            <FoundationStatus
              ascending={game.ascending}
              descending={game.descending}
              hand={game.hand}
              game={game}
              onPlay={handlePlay}
            />
          </section>
        </div>
      </main>
    </div>
  );
}