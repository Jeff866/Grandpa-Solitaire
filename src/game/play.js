// Grandpa's Solitaire play engine

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
  return pile.length < ASCENDING.length
    ? ASCENDING[pile.length]
    : null;
}

function nextDescendingRank(pile) {
  return pile.length < DESCENDING.length
    ? DESCENDING[pile.length]
    : null;
}

export function legalMoves(game, card) {
  if (!card) return [];

  const moves = [];

  game.ascending.forEach((pile, index) => {
    if (card.rank === nextAscendingRank(pile)) {
      moves.push({
        type: "ascending",
        index,
      });
    }
  });

  game.descending.forEach((pile, index) => {
    if (card.rank === nextDescendingRank(pile)) {
      moves.push({
        type: "descending",
        index,
      });
    }
  });

  return moves;
}

export function hasLegalMove(game) {
  if (game.hand.length === 0) {
    return false;
  }

  return legalMoves(game, game.hand[0]).length > 0;
}

export function playCard(game, move) {
  if (game.hand.length === 0) {
    return false;
  }

  const card = game.hand[0];

  const validMove = legalMoves(game, card).find(
    (candidate) =>
      candidate.type === move.type &&
      candidate.index === move.index
  );

  if (!validMove) {
    return false;
  }

  if (move.type === "ascending") {
    game.ascending[move.index].push(card);
  } else {
    game.descending[move.index].push(card);
  }

  game.hand.shift();

  return true;
}

export function totalFoundationCards(game) {
  return (
    game.ascending.reduce(
      (count, pile) => count + pile.length,
      0
    ) +
    game.descending.reduce(
      (count, pile) => count + pile.length,
      0
    )
  );
}

export function isVictory(game) {
  return totalFoundationCards(game) === 104;
}

export function isGameOver(game) {
  return (
    game.drawPile.length === 0 &&
    game.hand.length === 0 &&
    !hasLegalMove(game)
  );
}