export default function PlayingCard({
  rank,
  suit,
  red,
  onClick,
}) {

  return (

    <div

      onClick={onClick}

      className="
        aspect-[2.5/3.5]
        bg-white
        rounded-lg
        shadow-lg
        border
        border-gray-300
        flex
        flex-col
        justify-between
        p-2
        cursor-pointer
        hover:scale-105
        transition
        select-none
      "

    >


      <div

        className={`
          text-left
          font-bold
          text-xl
          ${red ? "text-red-600" : "text-black"}
        `}

      >

        {rank}{suit}

      </div>



      <div

        className={`
          text-center
          text-5xl
          ${red ? "text-red-600" : "text-black"}
        `}

      >

        {suit}

      </div>



      <div

        className={`
          text-right
          font-bold
          text-xl
          rotate-180
          ${red ? "text-red-600" : "text-black"}
        `}

      >

        {rank}{suit}

      </div>


    </div>

  );
}