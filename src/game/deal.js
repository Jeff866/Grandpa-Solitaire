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

    // Face-down during the deal.
    discard: [],

    // Created when dealing is complete.
    drawPile: [],

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

function beginPlay(game) {
  game.drawPile = game.discard
    .slice()
    .reverse()
    .map((card) => ({
      ...card,
      faceUp: true,
    }));

  game.discard = [];
  game.phase = "Play";
}

export function drawCard(game) {
  if (game.phase !== "Play") return;

  if (game.hand.length > 0) return;

  if (game.drawPile.length === 0) return;

  const card = game.drawPile.pop();

  game.hand.push({
    ...card,
    faceUp: true,
  });
}

export function dealOne(game) {
  if (game.phase !== "Deal") return;

  if (game.stock.length === 0) {
    beginPlay(game);
    return;
  }

  const pileRank = RANKS[game.currentPile];

  const card = {
    ...game.stock.pop(),
    faceUp: true,
  };

  game.piles[pileRank].push(card);

  const isAce = card.rank === "A";
  const isMatch = card.rank === pileRank;

  // Every Ace burns one extra card.
  if (isAce) {
    burnCard(game);
  }

  // Every correct pile burns two extra cards.
  // Ace on Ace therefore burns three.
  if (isMatch) {
    burnCard(game);
    burnCard(game);
  }

  game.currentPile =
    (game.currentPile + 1) % RANKS.length;

  if (game.stock.length === 0) {
    beginPlay(game);
  }
}

export function dealRound(game) {
  if (game.phase !== "Deal") return;

  for (
    let i = 0;
    i < RANKS.length && game.phase === "Deal";
    i++
  ) {
    dealOne(game);
  }
}