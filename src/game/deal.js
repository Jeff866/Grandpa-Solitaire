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

    // Face-down during Deal.
    discard: [],

    // Becomes the selector pile during Play.
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

    // Cards temporarily picked up from either
    // selector play or the Final Pass.
    hand: [],

    // Rank currently being worked.
    activeRank: null,

    // Currently exposed selector card during Play.
    activeDiscard: null,

    // Index into RANKS during the Final Pass.
    finalPassIndex: 0,
  };
}

function burnCard(game) {
  if (game.stock.length === 0) {
    return;
  }

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
  game.activeRank = null;
  game.activeDiscard = null;
  game.hand = [];
  game.finalPassIndex = 0;

  revealNextDiscard(game);
}

/*
 * Start the one-time A-through-K Final Pass.
 */
function beginFinalPass(game) {
  game.phase = "FinalPass";
  game.activeDiscard = null;
  game.activeRank = null;
  game.hand = [];
  game.finalPassIndex = 0;

  advanceFinalPass(game);
}

/*
 * Advance to the next nonempty pile in A→K order.
 *
 * Empty piles are skipped automatically.
 *
 * After K has been processed, the game enters
 * the Finished phase.
 */
function advanceFinalPass(game) {
  while (
    game.finalPassIndex < RANKS.length
  ) {
    const rank =
      RANKS[game.finalPassIndex];

    const pile =
      game.piles[rank];

    if (
      pile &&
      pile.length > 0
    ) {
      game.activeRank = rank;
      return true;
    }

    game.finalPassIndex += 1;
  }

  game.activeRank = null;
  game.hand = [];
  game.phase = "Finished";

  return false;
}

/*
 * Reveal the next selector card.
 *
 * Empty selected piles are skipped.
 *
 * When no selector cards remain, immediately
 * begin the Final Pass.
 */
export function revealNextDiscard(game) {
  if (game.phase !== "Play") {
    return false;
  }

  if (game.hand.length > 0) {
    return false;
  }

  if (game.activeDiscard) {
    return false;
  }

  while (game.drawPile.length > 0) {
    const card =
      game.drawPile.pop();

    const rank = card.rank;
    const pile =
      game.piles[rank];

    if (
      !pile ||
      pile.length === 0
    ) {
      continue;
    }

    game.activeDiscard = {
      ...card,
      faceUp: true,
    };

    game.activeRank = rank;

    return true;
  }

  game.activeDiscard = null;
  game.activeRank = null;

  beginFinalPass(game);

  return false;
}

/*
 * Pick up the selected rank pile during
 * normal selector Play.
 *
 * The selector card is appended to the hand.
 * If it remains unplayed, it therefore becomes
 * the top card when the pile is returned.
 */
export function pickUpActivePile(game) {
  if (game.phase !== "Play") {
    return false;
  }

  if (
    !game.activeRank ||
    !game.activeDiscard
  ) {
    return false;
  }

  if (game.hand.length > 0) {
    return false;
  }

  const cards =
    game.piles[game.activeRank];

  if (
    !cards ||
    cards.length === 0
  ) {
    game.activeDiscard = null;
    game.activeRank = null;

    revealNextDiscard(game);

    return false;
  }

  const pileCards =
    cards.map((card) => ({
      ...card,
      faceUp: true,
    }));

  const selectorCard = {
    ...game.activeDiscard,
    faceUp: true,
  };

  game.hand = [
    ...pileCards,
    selectorCard,
  ];

  game.piles[
    game.activeRank
  ] = [];

  game.activeDiscard = null;

  return true;
}

/*
 * Finish the current selector-play pile.
 *
 * Remaining cards return in their current
 * relative order. No sorting is performed.
 */
export function finishActivePile(game) {
  if (game.phase !== "Play") {
    return false;
  }

  if (!game.activeRank) {
    return false;
  }

  if (game.hand.length > 0) {
    game.piles[
      game.activeRank
    ] = game.hand.map(
      (card, index) => ({
        ...card,
        faceUp:
          index ===
          game.hand.length - 1,
      })
    );
  } else {
    game.piles[
      game.activeRank
    ] = [];
  }

  game.hand = [];
  game.activeRank = null;
  game.activeDiscard = null;

  revealNextDiscard(game);

  return true;
}

/*
 * Pick up the entire current pile during
 * the Final Pass.
 *
 * Unlike normal selector Play, no selector
 * card is added.
 *
 * Card order is preserved exactly.
 */
export function pickUpFinalPassPile(game) {
  if (game.phase !== "FinalPass") {
    return false;
  }

  if (!game.activeRank) {
    return false;
  }

  if (game.hand.length > 0) {
    return false;
  }

  const cards =
    game.piles[game.activeRank];

  if (
    !cards ||
    cards.length === 0
  ) {
    game.finalPassIndex += 1;
    game.activeRank = null;

    advanceFinalPass(game);

    return false;
  }

  game.hand = cards.map(
    (card) => ({
      ...card,
      faceUp: true,
    })
  );

  game.piles[
    game.activeRank
  ] = [];

  return true;
}

/*
 * Finish one pile during the Final Pass.
 *
 * Any unplayed cards return in their current
 * relative order. They cannot be rearranged.
 *
 * Then advance exactly forward through
 * A, 2, 3, ... Q, K.
 */
export function finishFinalPassPile(game) {
  if (game.phase !== "FinalPass") {
    return false;
  }

  if (!game.activeRank) {
    return false;
  }

  const rank =
    game.activeRank;

  if (game.hand.length > 0) {
    game.piles[rank] =
      game.hand.map(
        (card, index) => ({
          ...card,
          faceUp:
            index ===
            game.hand.length - 1,
        })
      );
  } else {
    game.piles[rank] = [];
  }

  game.hand = [];
  game.activeRank = null;

  game.finalPassIndex += 1;

  advanceFinalPass(game);

  return true;
}

/*
 * Compatibility wrapper.
 */
export function drawCard(game) {
  if (game.phase === "FinalPass") {
    return pickUpFinalPassPile(game);
  }

  return pickUpActivePile(game);
}

export function dealOne(game) {
  if (game.phase !== "Deal") {
    return;
  }

  if (game.stock.length === 0) {
    beginPlay(game);
    return;
  }

  const pileRank =
    RANKS[game.currentPile];

  const card = {
    ...game.stock.pop(),
    faceUp: true,
  };

  game.piles[
    pileRank
  ].push(card);

  const isAce =
    card.rank === "A";

  const isMatch =
    card.rank === pileRank;

  // Every Ace sends one extra card
  // face-down to Discard.
  if (isAce) {
    burnCard(game);
  }

  // Every matching-rank deal sends two
  // additional cards face-down to Discard.
  //
  // Ace on Ace therefore sends three total.
  if (isMatch) {
    burnCard(game);
    burnCard(game);
  }

  game.currentPile =
    (game.currentPile + 1) %
    RANKS.length;

  if (game.stock.length === 0) {
    beginPlay(game);
  }
}

export function dealRound(game) {
  if (game.phase !== "Deal") {
    return;
  }

  const startingPile =
    game.currentPile;

  for (
    let i = 0;
    i < RANKS.length &&
    game.phase === "Deal";
    i++
  ) {
    dealOne(game);
  }

  // Completing a full A-through-K round
  // sends one additional card face-down
  // to Discard.
  if (
    game.phase === "Deal" &&
    game.currentPile ===
      startingPile
  ) {
    burnCard(game);

    if (game.stock.length === 0) {
      beginPlay(game);
    }
  }
}