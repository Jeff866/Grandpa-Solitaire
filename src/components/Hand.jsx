import PlayingCard from "./PlayingCard";


export default function Hand({
  cards = [],
  onPlayCard,
}) {


  return (

    <section className="mt-10">

      <h2 className="text-2xl font-bold mb-4">
        Hand
      </h2>


      <div className="
        bg-green-800
        rounded-xl
        p-6
        shadow
        min-h-40
        flex
        flex-wrap
        gap-4
        items-center
      ">


        {cards.length === 0 ? (

          <div className="text-green-200">
            No cards in hand
          </div>

        ) : (


          cards.map((card,index) => (

            <button

              key={card.id}

              onClick={() =>
                onPlayCard(card,index)
              }

              className="
                transform
                hover:-translate-y-2
                transition
                cursor-pointer
              "

            >

              <PlayingCard

                rank={card.rank}

                suit={card.suit}

                red={card.red}

              />


            </button>

          ))


        )}


      </div>


    </section>

  );

}