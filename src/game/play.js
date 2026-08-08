// Grandpa's Solitaire play engine

export const FOUNDATION_SUITS = [
  "♥",
  "♦",
  "♣",
  "♠",
];

const ASCENDING = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
];

const DESCENDING = [
  "K",
  "Q",
  "J",
  "10",
  "9",
  "8",
  "7",
  "6",
  "5",
  "4",
  "3",
  "2",
  "A",
];

function nextAscendingRank(pile) {
  return ASCENDING[pile.length] ?? null;
}

function nextDescendingRank(pile) {
  return DESCENDING[pile.length] ?? null;
}

export function legalMoves(game, card) {
  if (!card) return [];

  const index =
    FOUNDATION_SUITS.indexOf(card.suit);

  if (index === -1) return [];

  const moves = [];

  const ascendingPile =
    game.ascending[index];

  const descendingPile =
    game.descending[index];

  if (
    card.rank ===
    nextAscendingRank(ascendingPile)
  ) {
    moves.push({
      type: "ascending",
      index,
    });
  }

  if (
    card.rank ===
    nextDescendingRank(descendingPile)
  ) {
    moves.push({
      type: "descending",
      index,
    });
  }

  return moves;
}

function placeOnFoundation(
  game,
  card,
  move
) {
  const valid = legalMoves(
    game,
    card
  ).find(
    (candidate) =>
      candidate.type === move.type &&
      candidate.index === move.index
  );

  if (!valid) return false;

  if (move.type === "ascending") {
    game.ascending[
      move.index
    ].push(card);
  } else {
    game.descending[
      move.index
    ].push(card);
  }

  return true;
}

/*
 * Play a selected card from the Active Pile.
 *
 * Any card in game.hand may be selected and
 * played if it has a legal foundation move.
 *
 * Removing a selected card must preserve the
 * relative order of every remaining card.
 */
export function playCard(
  game,
  move,
  handIndex = 0
) {
  if (game.hand.length === 0) {
    return false;
  }

  if (
    handIndex < 0 ||
    handIndex >= game.hand.length
  ) {
    return false;
  }

  const card =
    game.hand[handIndex];

  const success =
    placeOnFoundation(
      game,
      card,
      move
    );

  if (!success) {
    return false;
  }

  game.hand.splice(
    handIndex,
    1
  );

  return true;
}

/*
 * Play the exposed top card from one of
 * the 13 Deal Piles.
 *
 * Deal piles use the final array item as
 * the exposed top card.
 */
export function playDealPileCard(
  game,
  rank,
  move
) {
  const pile =
    game.piles[rank];

  if (
    !pile ||
    pile.length === 0
  ) {
    return false;
  }

  const card =
    pile[pile.length - 1];

  const success =
    placeOnFoundation(
      game,
      card,
      move
    );

  if (!success) {
    return false;
  }

  pile.pop();

  return true;
}

export function hasLegalMove(game) {
  /*
   * Every card currently in the Active
   * Pile is available for selection.
   */
  if (game.hand.length > 0) {
    const handHasMove =
      game.hand.some(
        (card) =>
          legalMoves(
            game,
            card
          ).length > 0
      );

    if (handHasMove) {
      return true;
    }
  }

  /*
   * The exposed top card of every Deal
   * Pile is also available for play.
   */
  return Object.values(
    game.piles
  ).some((pile) => {
    if (
      !pile ||
      pile.length === 0
    ) {
      return false;
    }

    const topCard =
      pile[pile.length - 1];

    return (
      legalMoves(
        game,
        topCard
      ).length > 0
    );
  });
}

export function foundationCardsPlayed(
  game
) {
  return (
    game.ascending.reduce(
      (sum, pile) =>
        sum + pile.length,
      0
    ) +
    game.descending.reduce(
      (sum, pile) =>
        sum + pile.length,
      0
    )
  );
}

export function drawPileRemaining(
  game
) {
  return game.drawPile.length;
}

export function handIsEmpty(game) {
  return game.hand.length === 0;
}

export function gameOver(game) {
  return (
    handIsEmpty(game) &&
    drawPileRemaining(game) === 0 &&
    !hasLegalMove(game)
  );
}

export function isVictory(game) {
  return (
    foundationCardsPlayed(game) ===
    104
  );
}