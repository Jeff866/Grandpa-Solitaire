export default function StatusBar({
  phase = "Deal",
  stock = 104,
  discard = [],
  hand = [],
}) {

  const topDiscard =
    discard.length > 0
      ? discard[discard.length - 1]
      : null;


  return (
    <div className="bg-green-800 rounded-xl p-4 shadow mb-8">

      <div className="flex justify-between mb-4">

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

      </div>



      <div className="grid grid-cols-2 gap-4">


        <div className="bg-green-900 rounded-lg p-4">

          <h3 className="font-bold mb-2">
            Discard Top
          </h3>


          {topDiscard ? (
            <div>
              {topDiscard.rank}
              {topDiscard.suit}
            </div>
          ) : (
            <div>
              Empty
            </div>
          )}

        </div>



        <div className="bg-green-900 rounded-lg p-4">

          <h3 className="font-bold mb-2">
            Hand
          </h3>


          {hand.length > 0 ? (
            <div>
              {hand.length} cards
            </div>
          ) : (
            <div>
              Empty
            </div>
          )}

        </div>


      </div>

    </div>
  );
}