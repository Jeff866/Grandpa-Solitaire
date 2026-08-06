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


    hand: [],


  };

}






function burnCard(game) {

  if (game.stock.length === 0) {
    return;
  }


  const card =
    game.stock.pop();


  game.discard.push({

    ...card,

    faceUp: false,

  });

}







export function dealOne(game) {


  if (game.stock.length === 0) {

    game.phase = "Play";

    return;

  }



  const pileRank =
    RANKS[game.currentPile];



  const card =
    game.stock.pop();



  // Every card goes onto the current pile

  game.piles[pileRank].push(card);




  const isAce =
    card.rank === "A";



  const isMatch =
    card.rank === pileRank;



  // Ace penalty

  if (isAce) {

    burnCard(game);

  }



  // Matching rank penalty

  if (isMatch) {

    burnCard(game);

    burnCard(game);

  }




  game.currentPile =
    (
      game.currentPile + 1
    )
    %
    RANKS.length;





  if (game.stock.length === 0) {

    game.phase = "Play";

  }


}







export function dealRound(game) {


  for (
    let i = 0;
    i < 13;
    i++
  ) {

    dealOne(game);

  }


}