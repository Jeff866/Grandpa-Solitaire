import PlayingCard from "./PlayingCard";

export default function Hand({
  cards = [],
  onPlayCard,
}) {

  return (

    <section className="mb-10">

      <h2 className="text-2xl font-bold mb-4">
        Hand
      </h2>


      <div className="bg-green-800 rounded-xl p-6 shadow flex gap-4 min-h-40">


        {cards.length === 0 && (

          <div className="text-green-200">
            Empty
          </div>

        )}



        {cards.map((card, index) => (

          <button

            key={index}

            onClick={() =>
              onPlayCard(card, index)
            }

            className="hover:scale-105 transition"

          >

            <PlayingCard

              rank={card.rank}

              suit={card.suit}

              red={card.red}

            />

          </button>

        ))}


      </div>


    </section>

  );

}