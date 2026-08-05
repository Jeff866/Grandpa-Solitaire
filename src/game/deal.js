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

    phase: "deal",

    currentPile: 0,

    stock: [],

    discard: [],

    hand: [],

    dealPiles: Object.fromEntries(
      RANKS.map(rank => [rank, []])
    ),

    ascending: [
      [],
      [],
      [],
      []
    ],

    descending: [
      [],
      [],
      [],
      []
    ],

  };

}



function takeCard(game) {

  if (game.stock.length === 0) {
    return null;
  }

  return game.stock.shift();

}



export function dealCard(game) {

  const card = takeCard(game);


  if (!card) {
    return game;
  }


  const pileRank =
    RANKS[game.currentPile];


  game.dealPiles[pileRank].push(card);



  // Ace penalty
  if (card.rank === "A") {

    const penalty =
      takeCard(game);

    if (penalty) {
      game.discard.push(penalty);
    }

  }



  // Matching rank penalty
  if (card.rank === pileRank) {

    const penaltyOne =
      takeCard(game);

    const penaltyTwo =
      takeCard(game);


    if (penaltyOne) {
      game.discard.push(penaltyOne);
    }


    if (penaltyTwo) {
      game.discard.push(penaltyTwo);
    }

  }


  return game;

}



export function dealRound(game) {


  for (
    let i = 0;
    i < 13;
    i++
  ) {

    dealCard(game);


    game.currentPile =
      (game.currentPile + 1) % 13;

  }


  return game;

}