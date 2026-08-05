import PlayingCard from "./PlayingCard";

export default function DealPile({
  label,
  card,
  onSelect,
}) {
  return (
    <div
      className="
        bg-green-800
        rounded-xl
        p-3
        shadow
        text-center
        cursor-pointer
        hover:bg-green-700
        transition
      "
      onClick={onSelect}
    >

      <div className="text-lg font-bold mb-2">
        {label}
      </div>


      {card.rank ? (
        <PlayingCard
          rank={card.rank}
          suit={card.suit}
          red={card.red}
        />
      ) : (

        <div className="
          aspect-[2.5/3.5]
          border-2
          border-dashed
          border-green-500
          rounded-lg
          flex
          items-center
          justify-center
          text-green-300
        ">
          Empty
        </div>

      )}

    </div>
  );
}