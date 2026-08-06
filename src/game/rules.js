export const FOUNDATION_TYPES = {
  ASCENDING: "ascending",
  DESCENDING: "descending",
};

export const SUITS = [
  "♠",
  "♥",
  "♦",
  "♣",
];

const VALUES = {
  A: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 10,
  J: 11,
  Q: 12,
  K: 13,
};

export function canPlayCard(card, foundation, type) {
  if (!card || !foundation) return false;

  if (
    foundation.length === 0 &&
    type === FOUNDATION_TYPES.ASCENDING
  ) {
    return VALUES[card.rank] === 1;
  }

  if (
    foundation.length === 0 &&
    type === FOUNDATION_TYPES.DESCENDING
  ) {
    return VALUES[card.rank] === 13;
  }

  const top = foundation[foundation.length - 1];

  if (card.suit !== top.suit) {
    return false;
  }

  const current = VALUES[card.rank];
  const previous = VALUES[top.rank];

  if (type === FOUNDATION_TYPES.ASCENDING) {
    return current === previous + 1;
  }

  if (type === FOUNDATION_TYPES.DESCENDING) {
    return current === previous - 1;
  }

  return false;
}

export function getLegalMoves(card, ascending, descending) {
  const moves = [];

  ascending.forEach((pile, index) => {
    if (
      canPlayCard(
        card,
        pile,
        FOUNDATION_TYPES.ASCENDING
      )
    ) {
      moves.push({
        type: FOUNDATION_TYPES.ASCENDING,
        index,
      });
    }
  });

  descending.forEach((pile, index) => {
    if (
      canPlayCard(
        card,
        pile,
        FOUNDATION_TYPES.DESCENDING
      )
    ) {
      moves.push({
        type: FOUNDATION_TYPES.DESCENDING,
        index,
      });
    }
  });

  return moves;
}

export function hasAnyLegalMove(
  hand,
  ascending,
  descending
) {
  if (hand.length === 0) {
    return false;
  }

  return (
    getLegalMoves(
      hand[0],
      ascending,
      descending
    ).length > 0
  );
}

export function foundationLabel(type, index) {
  const suit = SUITS[index] ?? "?";

  return type === FOUNDATION_TYPES.ASCENDING
    ? `${suit} A → K`
    : `${suit} K → A`;
}
