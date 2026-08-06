export const FOUNDATION_TYPES = {
  ASCENDING: "ascending",
  DESCENDING: "descending",
};


const VALUES = {
  A: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 10,
  J: 11,
  Q: 12,
  K: 13,
};





export function canPlayCard(
  card,
  foundation,
  type
) {


  if (!card) {
    return false;
  }



  if (!foundation) {
    return false;
  }




  // Empty ascending foundation starts with Ace

  if (
    foundation.length === 0
    &&
    type === FOUNDATION_TYPES.ASCENDING
  ) {

    return VALUES[card.rank] === 1;

  }





  // Empty descending foundation starts with King

  if (
    foundation.length === 0
    &&
    type === FOUNDATION_TYPES.DESCENDING
  ) {

    return VALUES[card.rank] === 13;

  }






  const top =
    foundation[
      foundation.length - 1
    ];





  // Must match suit

  if (
    card.suit !== top.suit
  ) {

    return false;

  }






  const current =
    VALUES[card.rank];


  const previous =
    VALUES[top.rank];






  if (
    type === FOUNDATION_TYPES.ASCENDING
  ) {

    return current === previous + 1;

  }







  if (
    type === FOUNDATION_TYPES.DESCENDING
  ) {

    return current === previous - 1;

  }






  return false;


}