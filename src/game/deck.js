const SUITS = [
  {
    symbol: "♠",
    red: false,
  },
  {
    symbol: "♥",
    red: true,
  },
  {
    symbol: "♦",
    red: true,
  },
  {
    symbol: "♣",
    red: false,
  },
];


const RANKS = [
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



export function createDeck() {

  const deck = [];

  let id = 1;


  for (let deckNumber = 1; deckNumber <= 2; deckNumber++) {


    for (const suit of SUITS) {

      for (const rank of RANKS) {

        deck.push({

          id: id++,

          deckNumber,

          rank,

          suit: suit.symbol,

          red: suit.red,

        });

      }

    }

  }


  return deck;

}





export function shuffle(cards) {

  const shuffled = [...cards];


  for (let i = shuffled.length - 1; i > 0; i--) {

    const j =
      Math.floor(
        Math.random() * (i + 1)
      );


    [
      shuffled[i],
      shuffled[j],
    ] =
    [
      shuffled[j],
      shuffled[i],
    ];

  }


  return shuffled;

}