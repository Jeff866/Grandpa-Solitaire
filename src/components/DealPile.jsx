import PlayingCard from "./PlayingCard";


export default function DealPile({
  label,
  card,
  cards = [],
  onSelect,
}) {


  const count =
    cards.length;



  return (

    <button

      onClick={onSelect}

      className="
        bg-green-800
        rounded-xl
        p-4
        shadow
        hover:bg-green-700
        transition
        text-center
      "

    >

      <h3 className="text-xl font-bold mb-3">
        {label}
      </h3>



      <div className="
        h-32
        flex
        items-center
        justify-center
      ">


        {card && card.rank ? (

          <PlayingCard

            rank={card.rank}

            suit={card.suit}

            red={card.red}

          />

        ) : (

          <div className="
            w-20
            h-28
            rounded-lg
            border-2
            border-dashed
            border-green-300
            flex
            items-center
            justify-center
            text-green-200
          ">

            Empty

          </div>

        )}


      </div>



      <div className="mt-3 text-sm text-green-200">

        {count} cards

      </div>


    </button>

  );

}