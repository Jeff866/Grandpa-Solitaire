import { useState } from "react";

import Header from "./components/Header";
import StatusBar from "./components/StatusBar";
import StockArea from "./components/StockArea";
import DealPile from "./components/DealPile";
import FoundationStatus from "./components/FoundationStatus";
import Hand from "./components/Hand";
import GameMessage from "./components/GameMessage";

import {
  createDeck,
  shuffle,
} from "./game/deck";

import {
  createEmptyGame,
  dealOne,
  dealRound,
  pickUpActivePile,
  finishActivePile,
  RANKS,
} from "./game/deal";

import {
  legalMoves,
  playCard,
  playDealPileCard,
  isVictory,
} from "./game/play";

export default function App() {
  const [won, setWon] =
    useState(false);

  /*
   * selectedSource may be:
   *
   * { type: "deal", rank }
   *
   * or
   *
   * { type: "hand", index }
   */
  const [
    selectedSource,
    setSelectedSource,
  ] = useState(null);

  const [game, setGame] =
    useState(() => {
      const fresh =
        createEmptyGame();

      fresh.stock = shuffle(
        createDeck()
      );

      return fresh;
    });

  function newGame() {
    const fresh =
      createEmptyGame();

    fresh.stock = shuffle(
      createDeck()
    );

    setWon(false);
    setSelectedSource(null);
    setGame(fresh);
  }

  function cloneGame() {
    return {
      ...game,

      stock: [...game.stock],
      discard: [...game.discard],
      drawPile: [
        ...game.drawPile,
      ],

      piles: Object.fromEntries(
        RANKS.map((rank) => [
          rank,
          [...game.piles[rank]],
        ])
      ),

      ascending:
        game.ascending.map(
          (pile) => [...pile]
        ),

      descending:
        game.descending.map(
          (pile) => [...pile]
        ),

      hand: [...game.hand],

      activeDiscard:
        game.activeDiscard
          ? {
              ...game.activeDiscard,
            }
          : null,
    };
  }

  function updateGame(action) {
    const updated =
      cloneGame();

    action(updated);

    setGame(updated);
  }

  const selectedDealCard =
    selectedSource?.type ===
    "deal"
      ? game.piles[
          selectedSource.rank
        ]?.[
          game.piles[
            selectedSource.rank
          ].length - 1
        ] || null
      : null;

  const selectedHandCard =
    selectedSource?.type ===
      "hand" &&
    selectedSource.index >= 0 &&
    selectedSource.index <
      game.hand.length
      ? game.hand[
          selectedSource.index
        ]
      : null;

  const selectedCard =
    selectedDealCard ||
    selectedHandCard;

  function handleDealPileSelect(
    rank,
    card
  ) {
    if (
      game.phase !== "Play"
    ) {
      return;
    }

    if (!card) return;

    const moves =
      legalMoves(game, card);

    if (moves.length === 0) {
      setSelectedSource(null);
      return;
    }

    setSelectedSource({
      type: "deal",
      rank,
    });
  }

  function handleHandCardSelect(
    card,
    index
  ) {
    if (
      game.phase !== "Play"
    ) {
      return;
    }

    if (!card) return;

    /*
     * Selecting a card does not play it.
     * It simply makes that card the source
     * used by FoundationStatus.
     */
    setSelectedSource({
      type: "hand",
      index,
    });
  }

  function handleFoundationPlay(
    move
  ) {
    if (!selectedSource) {
      return;
    }

    updateGame((updated) => {
      let success = false;

      if (
        selectedSource.type ===
        "deal"
      ) {
        success =
          playDealPileCard(
            updated,
            selectedSource.rank,
            move
          );
      }

      if (
        selectedSource.type ===
        "hand"
      ) {
        success = playCard(
          updated,
          move,
          selectedSource.index
        );
      }

      if (!success) return;

      if (isVictory(updated)) {
        setWon(true);
      }
    });

    setSelectedSource(null);
  }

  function handlePickUpActivePile() {
    setSelectedSource(null);

    updateGame((updated) => {
      pickUpActivePile(updated);
    });
  }

  function handleFinishActivePile() {
    setSelectedSource(null);

    updateGame((updated) => {
      finishActivePile(updated);
    });
  }

  function handleDealOne() {
    setSelectedSource(null);

    updateGame((updated) => {
      dealOne(updated);
    });
  }

  function handleDealRound() {
    setSelectedSource(null);

    updateGame((updated) => {
      dealRound(updated);
    });
  }

  const playDiscard =
    game.activeDiscard
      ? [game.activeDiscard]
      : [];

  return (
    <div className="game-shell">
      <Header
        onNewGame={newGame}
        onDealOne={handleDealOne}
        onDealRound={
          handleDealRound
        }
      />

      <main className="game-main">
        <div className="game-info-row">
          <StatusBar
            phase={game.phase}
            stock={
              game.phase === "Deal"
                ? game.stock.length
                : game.drawPile
                    .length +
                  (game.activeDiscard
                    ? 1
                    : 0)
            }
            discard={
              game.phase === "Deal"
                ? game.discard
                : playDiscard
            }
            hand={game.hand}
            nextRank={
              game.phase === "Deal"
                ? RANKS[
                    game.currentPile
                  ]
                : game.activeRank ||
                  ""
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

            {game.phase ===
              "Deal" && (
              <p>
                Dealing to{" "}
                <strong>
                  {
                    RANKS[
                      game
                        .currentPile
                    ]
                  }
                </strong>
              </p>
            )}

            {game.phase ===
              "Play" &&
              game.activeRank && (
                <p>
                  Active rank:{" "}
                  <strong>
                    {
                      game.activeRank
                    }
                  </strong>
                </p>
              )}
          </div>

          <div className="deal-piles-row">
            {RANKS.map(
              (rank) => {
                const pile =
                  game.piles[
                    rank
                  ];

                const topCard =
                  pile.length > 0
                    ? pile[
                        pile.length -
                          1
                      ]
                    : null;

                const playable =
                  game.phase ===
                    "Play" &&
                  topCard &&
                  legalMoves(
                    game,
                    topCard
                  ).length > 0;

                return (
                  <DealPile
                    key={rank}
                    label={rank}
                    cards={pile}
                    playable={
                      playable
                    }
                    onSelect={
                      handleDealPileSelect
                    }
                  />
                );
              }
            )}
          </div>
        </section>

        <div className="lower-board">
          <section className="stock-panel">
            <StockArea
              stock={
                game.phase ===
                "Deal"
                  ? game.stock
                      .length
                  : game.drawPile
                      .length
              }
              discard={
                game.phase ===
                "Deal"
                  ? game.discard
                  : playDiscard
              }
            />

            {game.phase ===
              "Play" && (
              <div className="play-controls">
                <h2>
                  Active Play
                </h2>

                {game.activeDiscard ? (
                  <p>
                    <strong>
                      {
                        game
                          .activeDiscard
                          .rank
                      }
                      {
                        game
                          .activeDiscard
                          .suit
                      }
                    </strong>{" "}
                    selects the{" "}
                    <strong>
                      {
                        game
                          .activeRank
                      }
                    </strong>{" "}
                    pile.
                  </p>
                ) : game.hand
                    .length > 0 ? (
                  <p>
                    Playing the{" "}
                    <strong>
                      {
                        game
                          .activeRank
                      }
                    </strong>{" "}
                    pile.
                  </p>
                ) : (
                  <p>
                    No selector card
                    remaining.
                  </p>
                )}

                <p>
                  Selector cards
                  remaining:{" "}
                  <strong>
                    {
                      game.drawPile
                        .length
                    }
                  </strong>
                </p>

                <button
                  type="button"
                  onClick={
                    handlePickUpActivePile
                  }
                  disabled={
                    !game.activeRank ||
                    !game.activeDiscard ||
                    game.hand.length >
                      0
                  }
                >
                  Pick Up{" "}
                  {game.activeRank ||
                    ""}{" "}
                  Pile
                </button>

                <button
                  type="button"
                  onClick={
                    handleFinishActivePile
                  }
                  disabled={
                    !game.activeRank ||
                    game.hand.length ===
                      0
                  }
                  style={{
                    marginLeft:
                      "6px",
                  }}
                >
                  Finish Active Pile
                </button>
              </div>
            )}
          </section>

          <section className="active-panel">
            <h2>
              Active Pile
              {game.activeRank
                ? ` — ${game.activeRank}`
                : ""}
            </h2>

            <Hand
              cards={game.hand}
              selectedIndex={
                selectedSource?.type ===
                "hand"
                  ? selectedSource.index
                  : null
              }
              onSelectCard={
                handleHandCardSelect
              }
            />
          </section>

          <section className="foundation-panel">
            <FoundationStatus
              ascending={
                game.ascending
              }
              descending={
                game.descending
              }
              game={game}
              selectedCard={
                selectedCard
              }
              onPlay={
                handleFoundationPlay
              }
            />
          </section>
        </div>
      </main>
    </div>
  );
}