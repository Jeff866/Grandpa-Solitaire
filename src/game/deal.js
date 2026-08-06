export const RANKS = [
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

export function createEmptyGame() {
  return {
    phase: "Deal",

    stock: [],
    discard: [],

    piles: {
      A: [],
      "2": [],
      "3": [],
      "4": [],
      "5": [],
      "6": [],
      "7": [],
      "8": [],
      "9": [],
      "10": [],
      J: [],
      Q: [],
      K: [],
    },

    currentPile: 0,

    ascending: [[], [], [], []],
    descending: [[], [], [], []],

    hand: [],
  };
}

function burnCard(game) {
  if (game.stock.length === 0) return;

  const card = game.stock.pop();

  game.discard.push({
    ...card,
    faceUp: false,
  });
}

function placeOnPile(game, pileRank, card) {
  // During the deal every revealed card remains face-up on the deal pile.
  game.piles[pileRank].push({
    ...card,
    faceUp: true,
  });
}

export function dealOne(game) {
  if (game.phase !== "Deal") return;

  if (game.stock.length === 0) {
    game.phase = "Play";
    return;
  }

  const pileRank = RANKS[game.currentPile];

  const card = game.stock.pop();

  placeOnPile(game, pileRank, card);

  const isAce = card.rank === "A";
  const isMatch = card.rank === pileRank;

  // Ace: always burn one card.
  if (isAce) {
    burnCard(game);
  }

  // Correct pile: burn two additional cards.
  // If the matching card is also an Ace this correctly burns three total.
  if (isMatch) {
    burnCard(game);
    burnCard(game);
  }

  game.currentPile = (game.currentPile + 1) % RANKS.length;

  if (game.stock.length === 0) {
    game.phase = "Play";
  }
}

export function dealRound(game) {
  if (game.phase !== "Deal") return;

  for (let i = 0; i < RANKS.length && game.phase === "Deal"; i++) {
    dealOne(game);
  }
}
