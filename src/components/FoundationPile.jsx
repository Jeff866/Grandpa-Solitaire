import PlayingCard from "./PlayingCard";

export default function FoundationPile({
  suit,
  direction,
  cards = [],
}) {

  const topCard =
    cards[cards.length - 1];


  const title =
    direction === "ascending"
      ? "A → K"
      : "K → A";


  const red =
    suit === "♥" || suit === "♦";


  return (

    <div className="
      bg-green-800
      rounded-xl
      p-4
      shadow
      text-center
      min-h-40
    ">


      <div className="font-bold text-xl mb-2">

        {suit}

      </div>


      <div className="text-sm text-green-200 mb-3">

        {title}

      </div>



      {topCard ? (

        <PlayingCard

          rank={topCard.rank}

          suit={topCard.suit}

          red={topCard.red}

        />

      ) : (

        <div className="

          border-2
          border-dashed
          border-green-400
          rounded-lg
          h-28
          flex
          items-center
          justify-center

        ">

          Empty

        </div>

      )}


    </div>

  );

}