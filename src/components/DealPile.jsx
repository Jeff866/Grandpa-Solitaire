import PlayingCard from "./PlayingCard";


export default function DealPile({
  label,
  cards = [],
  onSelect,
}) {


  return (

    <button

      onClick={onSelect}

      className="
        bg-green-800
        rounded-xl
        p-4
        min-h-[340px]
        hover:bg-green-700
        transition
      "

    >

      <h3 className="text-xl font-bold text-center mb-4">
        {label}
      </h3>


      <div className="relative h-72">


        {cards.length === 0 && (

          <div
            className="
              border-2
              border-dashed
              border-green-300
              rounded-lg
              h-28
              flex
              items-center
              justify-center
              text-green-200
            "
          >
            Empty
          </div>

        )}



        {cards.map((card, index) => (

          <div

            key={card.id}

            className="
              absolute
              left-1/2
              -translate-x-1/2
            "

            style={{
              top: `${index * 22}px`,
              zIndex: index,
            }}

          >

            <PlayingCard

              card={card}

            />

          </div>

        ))}


      </div>



      <div className="text-sm text-green-200 mt-4">

        {cards.length} cards

      </div>


    </button>

  );

}