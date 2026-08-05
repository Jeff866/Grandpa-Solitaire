export default function VictoryBanner({
  won,
}) {

  if (!won) {
    return null;
  }


  return (

    <div className="bg-yellow-600 text-black rounded-xl p-5 shadow-lg mb-8 text-center">

      <h2 className="text-3xl font-bold">
        🏆 Grandpa's Solitaire Complete!
      </h2>

      <p className="mt-2">
        All 8 foundations are finished.
      </p>

    </div>

  );

}
