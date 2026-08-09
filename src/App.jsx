import { useState } from "react";

import Header from "./components/Header";
import StatusBar from "./components/StatusBar";
import StockArea from "./components/StockArea";
import DealPile from "./components/DealPile";
import FoundationStatus from "./components/FoundationStatus";
import Hand from "./components/Hand";
import GameMessage from "./components/GameMessage";
import HowToPlay from "./components/HowToPlay";
import "./how-to-play.css";

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
  pickUpFinalPassPile,
  finishFinalPassPile,
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

  const [
    howToPlayOpen,
    setHowToPlayOpen,
  ] = useState(false);

  const [
    selectedSource,
    setSelectedSource,
  ] = useState(null);

  const [
    draggedSource,
    setDraggedSource,
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
    setDraggedSource(null);
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

    if (isVictory(updated)) {
      setWon(true);
    }

    setGame(updated);
  }

  const selectedDealCard =
    selectedSource?.type === "deal"
      ? game.piles[
          selectedSource.rank
        ]?.[
          game.piles[
            selectedSource.rank
          ].length - 1
        ] || null
      : null;

  const selectedHandCard =
    selectedSource?.type === "hand" &&
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

  const draggedHandCard =
    draggedSource?.type === "hand" &&
    draggedSource.index >= 0 &&
    draggedSource.index <
      game.hand.length
      ? game.hand[
          draggedSource.index
        ]
      : null;

  const draggedDealCard =
    draggedSource?.type === "deal"
      ? game.piles[
          draggedSource.rank
        ]?.[
          game.piles[
            draggedSource.rank
          ].length - 1
        ] || null
      : null;

  const draggedCard =
    draggedHandCard ||
    draggedDealCard;

  function handleDealPileSelect(
    rank,
    card
  ) {
    if (
      game.phase !== "Play" &&
      game.phase !== "FinalPass"
    ) {
      return;
    }

    if (!card) return;

    const alreadySelected =
      selectedSource?.type ===
        "deal" &&
      selectedSource.rank === rank;

    if (alreadySelected) {
      setSelectedSource(null);
      return;
    }

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
      game.phase !== "Play" &&
      game.phase !== "FinalPass"
    ) {
      return;
    }

    if (!card) return;

    const alreadySelected =
      selectedSource?.type ===
        "hand" &&
      selectedSource.index === index;

    if (alreadySelected) {
      setSelectedSource(null);
      return;
    }

    setSelectedSource({
      type: "hand",
      index,
    });
  }

  function handleHandDragStart(
    card,
    index
  ) {
    if (
      game.phase !== "Play" &&
      game.phase !== "FinalPass"
    ) {
      return;
    }

    if (!card) return;

    setDraggedSource({
      type: "hand",
      index,
    });
  }

  function handleDealPileDragStart(
    rank,
    card
  ) {
    if (
      game.phase !== "Play" &&
      game.phase !== "FinalPass"
    ) {
      return;
    }

    if (!card) return;

    /*
     * DealPile only makes a card draggable
     * when that exposed top card has at
     * least one legal foundation move.
     */
    if (
      legalMoves(
        game,
        card
      ).length === 0
    ) {
      return;
    }

    setDraggedSource({
      type: "deal",
      rank,
    });
  }

  function handleDragEnd() {
    setDraggedSource(null);
  }

  function handleFoundationPlay(
    move
  ) {
    if (!selectedSource) {
      return;
    }

    updateGame((updated) => {
      if (
        selectedSource.type ===
        "deal"
      ) {
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
        playCard(
          updated,
          move,
          selectedSource.index
        );
      }
    });

    setSelectedSource(null);
  }

  function handleFoundationDrop(
    move
  ) {
    if (!draggedSource) {
      return;
    }

    updateGame((updated) => {
      if (
        draggedSource.type ===
        "hand"
      ) {
        playCard(
          updated,
          move,
          draggedSource.index
        );
      }

      if (
        draggedSource.type ===
        "deal"
      ) {
        playDealPileCard(
          updated,
          draggedSource.rank,
          move
        );
      }
    });

    setDraggedSource(null);
    setSelectedSource(null);
  }

  function handlePickUpActivePile() {
    setSelectedSource(null);
    setDraggedSource(null);

    updateGame((updated) => {
      pickUpActivePile(updated);
    });
  }

  function handleFinishActivePile() {
    setSelectedSource(null);
    setDraggedSource(null);

    updateGame((updated) => {
      finishActivePile(updated);
    });
  }

  function handlePickUpFinalPassPile() {
    setSelectedSource(null);
    setDraggedSource(null);

    updateGame((updated) => {
      pickUpFinalPassPile(updated);
    });
  }

  function handleFinishFinalPassPile() {
    setSelectedSource(null);
    setDraggedSource(null);

    updateGame((updated) => {
      finishFinalPassPile(updated);
    });
  }

  function handleDealOne() {
    setSelectedSource(null);
    setDraggedSource(null);

    updateGame((updated) => {
      dealOne(updated);
    });
  }

  function handleDealRound() {
    setSelectedSource(null);
    setDraggedSource(null);

    updateGame((updated) => {
      dealRound(updated);
    });
  }

  const playDiscard =
    game.activeDiscard
      ? [game.activeDiscard]
      : [];

  const inFinalPass =
    game.phase === "FinalPass";

  const gameFinished =
    game.phase === "Finished";

  return (
    <div className="game-shell">
      <Header
        phase={game.phase}
        onNewGame={newGame}
        onHowToPlay={() =>
          setHowToPlayOpen(true)
        }
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
                : game.drawPile.length +
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
                      game.currentPile
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

            {inFinalPass &&
              game.activeRank && (
                <p>
                  Final Pass:{" "}
                  <strong>
                    {
                      game.activeRank
                    }
                  </strong>{" "}
                  pile
                </p>
              )}

            {gameFinished && (
              <p>
                Final Pass complete.
              </p>
            )}
          </div>

          <div className="deal-piles-row">
            {RANKS.map(
              (rank) => {
                const pile =
                  game.piles[rank];

                const topCard =
                  pile.length > 0
                    ? pile[
                        pile.length -
                          1
                      ]
                    : null;

                const playable =
                  (game.phase ===
                    "Play" ||
                    game.phase ===
                      "FinalPass") &&
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
                    onDragCardStart={
                      handleDealPileDragStart
                    }
                    onDragCardEnd={
                      handleDragEnd
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
                  ? game.stock.length
                  : game.drawPile.length
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
                        game.activeRank
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
                        game.activeRank
                      }
                    </strong>{" "}
                    pile.
                  </p>
                ) : (
                  <p>
                    Preparing next
                    selector.
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

            {inFinalPass && (
              <div className="play-controls">
                <h2>
                  Final A→K Pass
                </h2>

                {game.activeRank ? (
                  <>
                    <p>
                      Now working the{" "}
                      <strong>
                        {
                          game.activeRank
                        }
                      </strong>{" "}
                      pile.
                    </p>

                    <p>
                      Play any legal
                      cards. Remaining
                      cards stay in their
                      existing order.
                    </p>

                    <button
                      type="button"
                      onClick={
                        handlePickUpFinalPassPile
                      }
                      disabled={
                        game.hand.length >
                        0
                      }
                    >
                      Pick Up{" "}
                      {
                        game.activeRank
                      }{" "}
                      Pile
                    </button>

                    <button
                      type="button"
                      onClick={
                        handleFinishFinalPassPile
                      }
                      disabled={
                        game.hand.length ===
                        0
                      }
                      style={{
                        marginLeft:
                          "6px",
                      }}
                    >
                      Finish{" "}
                      {
                        game.activeRank
                      }{" "}
                      Pile
                    </button>
                  </>
                ) : (
                  <p>
                    Final Pass complete.
                  </p>
                )}
              </div>
            )}

            {gameFinished && (
              <div className="play-controls">
                <h2>
                  Game Complete
                </h2>

                <p>
                  {won
                    ? "All 104 cards reached the foundations."
                    : "The Final Pass is complete."}
                </p>
              </div>
            )}
          </section>

          <section className="active-panel">
            <h2>
              {inFinalPass
                ? "Final Pass Pile"
                : "Active Pile"}

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
              onDragCardStart={
                handleHandDragStart
              }
              onDragCardEnd={
                handleDragEnd
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
              draggedCard={
                draggedCard
              }
              onPlay={
                handleFoundationPlay
              }
              onDropCard={
                handleFoundationDrop
              }
            />
          </section>
        </div>
      </main>
      <HowToPlay
        open={howToPlayOpen}
        onClose={() =>
          setHowToPlayOpen(false)
        }
      />
    </div>
  );
}