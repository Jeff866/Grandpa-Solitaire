import PlayingCard from "./PlayingCard";

export default function FoundationPile({
  title,
  cards = [],
}) {

  return (

    <div className="bg-green-800 rounded-xl p-5">

      <h3 className="text-center text-xl font-bold mb-4">
        {title}
      </h3>


      <div className="relative border-2 border-dashed border-green-300 rounded-lg h-40">

        {cards.length === 0 && (

          <div className="absolute inset-0 flex items-center justify-center">

            <span className="text-green-200">
              Empty
            </span>

          </div>

        )}



        {cards.map((card, index) => (

          <div
            key={card.id}
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              top: `${index * 8}px`,
              zIndex: index,
            }}
          >

            <PlayingCard
              rank={card.rank}
              suit={card.suit}
              red={card.red}
            />

          </div>

        ))}


      </div>


    </div>

  );

}