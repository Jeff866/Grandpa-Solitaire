// Grandpa's Solitaire play engine

export const FOUNDATION_SUITS = ["♥", "♦", "♣", "♠"];

const ASCENDING = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const DESCENDING = ["K", "Q", "J", "10", "9", "8", "7", "6", "5", "4", "3", "2", "A"];

function nextAscendingRank(pile) {
  return ASCENDING[pile.length] ?? null;
}

function nextDescendingRank(pile) {
  return DESCENDING[pile.length] ?? null;
}

export function legalMoves(game, card) {
  if (!card) return [];

  // Each suit owns exactly one column forever:
  // Hearts, Diamonds, Clubs, Spades.
  const index = FOUNDATION_SUITS.indexOf(card.suit);
  if (index === -1) return [];

  const moves = [];
  const ascendingPile = game.ascending[index];
  const descendingPile = game.descending[index];

  if (card.rank === nextAscendingRank(ascendingPile)) {
    moves.push({ type: "ascending", index });
  }

  if (card.rank === nextDescendingRank(descendingPile)) {
    moves.push({ type: "descending", index });
  }

  return moves;
}

export function hasLegalMove(game) {
  if (game.hand.length === 0) return false;
  return legalMoves(game, game.hand[0]).length > 0;
}

export function playCard(game, move) {
  if (game.hand.length === 0) return false;

  const card = game.hand[0];
  const valid = legalMoves(game, card).find(
    (m) => m.type === move.type && m.index === move.index
  );

  if (!valid) return false;

  if (move.type === "ascending") {
    game.ascending[move.index].push(card);
  } else {
    game.descending[move.index].push(card);
  }

  game.hand.shift();
  return true;
}

export function foundationCardsPlayed(game) {
  return (
    game.ascending.reduce((sum, pile) => sum + pile.length, 0) +
    game.descending.reduce((sum, pile) => sum + pile.length, 0)
  );
}

export function drawPileRemaining(game) {
  return game.drawPile.length;
}

export function handIsEmpty(game) {
  return game.hand.length === 0;
}

export function gameOver(game) {
  return handIsEmpty(game) && drawPileRemaining(game) === 0 && !hasLegalMove(game);
}

export function isVictory(game) {
  return foundationCardsPlayed(game) === 104;
}
