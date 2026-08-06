export default function GameMessage({
  phase,
  won,
}) {

  if (won) {

    return (

      <div className="bg-yellow-500 text-black rounded-xl p-5 mb-8 text-center shadow">

        <h2 className="text-3xl font-bold">
          🏆 Grandpa's Solitaire Complete!
        </h2>

        <p>
          All 8 foundations are finished.
        </p>

      </div>

    );

  }



  if (phase === "Complete") {

    return (

      <div className="bg-red-700 rounded-xl p-5 mb-8 text-center shadow">

        <h2 className="text-3xl font-bold">
          Game Over
        </h2>

        <p>
          The deal is complete. Try again!
        </p>

      </div>

    );

  }



  return null;

}