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

    hand: [],


    currentPile: 0,


    dealPiles: {

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


    ascending: [
      [],
      [],
      [],
      [],
    ],


    descending: [
      [],
      [],
      [],
      [],
    ],


  };

}






export function dealCard(game) {


  if (game.stock.length === 0) {

    return;

  }



  const card =
    game.stock.pop();



  const targetRank =
    RANKS[game.currentPile];



  const isMatch =
    card.rank === targetRank;



  const isAce =
    card.rank === "A";



  if (isMatch || isAce) {


    game.discard.push(card);


  } else {


    game.dealPiles[targetRank].push(card);


  }



  game.currentPile =
    (game.currentPile + 1) % RANKS.length;


}





export function dealRound(game) {


  for (
    let i = 0;
    i < 13;
    i++
  ) {

    dealCard(game);

  }


}