import PlayingCard from "./PlayingCard";

export default function FoundationPile({
  title,
  cards = [],
}) {

  const topCard = cards[cards.length - 1];


  return (
    <div className="bg-green-800 rounded-xl p-5">

      <h3 className="text-center text-xl font-bold mb-4">
        {title}
      </h3>


      <div className="border-2 border-dashed border-green-300 rounded-lg h-40 flex items-center justify-center">

        {topCard ? (

          <PlayingCard
            rank={topCard.rank}
            suit={topCard.suit}
            red={topCard.red}
          />

        ) : (

          <span className="text-green-200">
            Empty
          </span>

        )}

      </div>

    </div>
  );
}