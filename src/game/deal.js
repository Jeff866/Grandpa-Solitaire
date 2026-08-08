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

  // Every Ace sends one additional card face-down
  // to the discard pile.
  if (isAce) {
    burnCard(game);
  }

  // A card matching the rank pile where it was dealt
  // sends two additional cards face-down to discard.
  //
  // Therefore, an Ace dealt to the Ace pile sends
  // three cards total to discard:
  // 1 for being an Ace + 2 for matching the pile.
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

  const startingPile = game.currentPile;

  for (
    let i = 0;
    i < RANKS.length && game.phase === "Deal";
    i++
  ) {
    dealOne(game);
  }

  // Completing a full A-through-K round sends
  // one additional card face-down to discard.
  //
  // Only do this when the entire 13-pile round
  // actually completed and the game is still
  // in the Deal phase.
  if (
    game.phase === "Deal" &&
    game.currentPile === startingPile
  ) {
    burnCard(game);

    if (game.stock.length === 0) {
      beginPlay(game);
    }
  }
}