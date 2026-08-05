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



export function canPlayCard(
  card,
  pile,
  direction
) {

  if (!card) {
    return false;
  }


  // Empty foundation

  if (pile.length === 0) {

    if (
      direction === FOUNDATION_TYPES.ASCENDING
    ) {
      return card.rank === "A";
    }


    if (
      direction === FOUNDATION_TYPES.DESCENDING
    ) {
      return card.rank === "K";
    }

  }



  const lastCard =
    pile[pile.length - 1];


  return (

    card.suit === lastCard.suit &&

    getNextRank(
      lastCard.rank,
      direction
    ) === card.rank

  );

}




function getNextRank(
  rank,
  direction
) {

  const index =
    RANKS.indexOf(rank);



  if (
    direction === FOUNDATION_TYPES.ASCENDING
  ) {

    return RANKS[index + 1];

  }


  return RANKS[index - 1];

}