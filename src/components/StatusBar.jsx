export default function StatusBar({
  phase = "Deal",
  stock = 104,
  discard = [],
  hand = [],
  nextRank = "",
}) {

  return (

    <div className="bg-green-800 rounded-xl p-4 shadow mb-8 flex justify-between">

      <div>
        Phase:
        <strong className="ml-2">
          {phase}
        </strong>
      </div>


      <div>
        Stock:
        <strong className="ml-2">
          {stock}
        </strong>
      </div>


      <div>
        Discard:
        <strong className="ml-2">
          {discard.length}
        </strong>
      </div>


      <div>
        Next:
        <strong className="ml-2">
          {nextRank}
        </strong>
      </div>


    </div>

  );

}