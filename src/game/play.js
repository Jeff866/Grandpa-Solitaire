// Grandpa's Solitaire play rules

const ASCENDING = [
  "A", "2", "3", "4", "5", "6", "7",
  "8", "9", "10", "J", "Q", "K"
];

const DESCENDING = [
  "K", "Q", "J", "10", "9", "8", "7",
  "6", "5", "4", "3", "2", "A"
];

function nextAscendingRank(pile) {
  if (pile.length === 0) return "A";
  return ASCENDING[pile.length];
}

function nextDescendingRank(pile) {
  if (pile.length === 0) return "K";
  return DESCENDING[pile.length];
}

export function legalMoves(game, card) {
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
  if (game.hand.length === 0) return false;

  return (
    legalMoves(game, game.hand[0]).length > 0
  );
}

export function playCard(game, move) {
  if (game.hand.length === 0) return false;

  const card = game.hand[0];

  const allowed = legalMoves(game, card);

  const legal = allowed.find(
    (m) =>
      m.type === move.type &&
      m.index === move.index
  );

  if (!legal) return false;

  if (move.type === "ascending") {
    game.ascending[move.index].push(card);
  } else {
    game.descending[move.index].push(card);
  }

  game.hand.shift();

  return true;
}

export function isVictory(game) {
  return (
    game.ascending.every(
      (pile) => pile.length === 13
    ) &&
    game.descending.every(
      (pile) => pile.length === 13
    )
  );
}