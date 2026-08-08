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

    // Cards temporarily picked up from the selected
    // rank pile. The exposed selector card is added
    // to this hand when a nonempty pile is picked up.
    hand: [],

    // Rank selected by the currently exposed
    // selector card.
    activeRank: null,

    // Currently exposed selector card.
    activeDiscard: null,
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

  revealNextDiscard(game);
}

/*
 * Reveal the next selector card.
 *
 * If the selector points to an empty rank pile,
 * that selector is consumed immediately and the
 * next selector is revealed.
 *
 * Continue until:
 *
 * 1. a selector points to a nonempty rank pile, or
 * 2. no selector cards remain.
 *
 * This prevents Play from becoming stranded on
 * a rank pile that has already been cleared.
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
    const card = game.drawPile.pop();

    const rank = card.rank;
    const pile = game.piles[rank];

    /*
     * Empty rank pile:
     *
     * Consume this selector and immediately
     * continue to the next selector.
     */
    if (!pile || pile.length === 0) {
      continue;
    }

    /*
     * Nonempty rank pile:
     *
     * Leave this selector exposed so the player
     * can pick up the selected pile.
     */
    game.activeDiscard = {
      ...card,
      faceUp: true,
    };

    game.activeRank = rank;

    return true;
  }

  /*
   * No selectors remain.
   */
  game.activeDiscard = null;
  game.activeRank = null;

  return false;
}

/*
 * Pick up the entire rank pile selected by
 * activeDiscard.
 *
 * The exposed selector card ALSO becomes part
 * of the hand.
 *
 * Existing rank-pile order is preserved.
 *
 * The selector is placed at the end of the hand
 * so that, if it is not played, it becomes the
 * TOP card when the hand is returned to the
 * rank pile.
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

  /*
   * This normally cannot occur because
   * revealNextDiscard skips empty piles.
   *
   * Keep this defensive check so the game
   * cannot become stranded if state changes
   * between revealing and picking up.
   */
  if (!cards || cards.length === 0) {
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

  /*
   * The selector is no longer sitting
   * separately in Discard. It is now
   * physically part of the Active Pile.
   */
  game.activeDiscard = null;

  return true;
}

/*
 * Finish the current active pile.
 *
 * Any unplayed cards go back to their selected
 * rank pile in their current order.
 *
 * Because the selector was appended to the hand
 * when the pile was picked up, an unplayed
 * selector naturally becomes the top card of
 * the returned pile.
 *
 * The exposed top card is face up so it can
 * be played later.
 *
 * After the pile is returned, reveal the next
 * valid selector. Empty selected piles are
 * skipped automatically by revealNextDiscard.
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
 * Compatibility wrapper.
 *
 * In Play, "draw" means pick up the rank pile
 * selected by the currently exposed selector.
 */
export function drawCard(game) {
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

  /*
   * Every Ace sends one extra card
   * face-down to Discard.
   */
  if (isAce) {
    burnCard(game);
  }

  /*
   * Every card dealt onto its matching
   * rank pile sends two extra cards
   * face-down to Discard.
   *
   * Ace on Ace therefore sends three:
   *
   * +1 for Ace
   * +2 for matching its pile
   */
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

  /*
   * Completing a full A-through-K round
   * sends one additional card face-down
   * to Discard.
   */
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