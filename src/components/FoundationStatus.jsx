export default function FoundationStatus({
  ascending,
  descending,
}) {


  const completeAscending =
    ascending.filter(
      pile => pile.length === 13
    ).length;


  const completeDescending =
    descending.filter(
      pile => pile.length === 13
    ).length;



  const total =
    completeAscending + completeDescending;



  return (

    <div className="bg-green-800 rounded-xl p-4 shadow mb-8 flex justify-between">


      <div>
        Foundations Complete:
        <strong className="ml-2">
          {total} / 8
        </strong>
      </div>


      {total === 8 && (

        <div className="font-bold">
          🏆 Grandpa's Solitaire Complete!
        </div>

      )}


    </div>

  );

}