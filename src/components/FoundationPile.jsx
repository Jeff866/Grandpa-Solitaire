import PlayingCard from "./PlayingCard";


export default function FoundationPile({
  suit,
  direction,
  cards = [],
}) {


  const topCard =
    cards.length > 0
      ? cards[cards.length - 1]
      : null;



  return (

    <div className="bg-green-800 rounded-xl p-5 shadow text-center">


      <div className="text-xl font-bold mb-3">

        {suit}

      </div>



      <div className="text-lg mb-3">

        {direction === "ascending"
          ? "A → K"
          : "K → A"}

      </div>




      <div className="h-32 flex items-center justify-center">


        {topCard ? (

          <PlayingCard

            rank={topCard.rank}

            suit={topCard.suit}

            red={topCard.red}

          />

        ) : (

          <div className="h-28 w-20 border-2 border-dashed border-green-300 rounded-lg flex items-center justify-center">

            Empty

          </div>

        )}


      </div>


    </div>

  );

}