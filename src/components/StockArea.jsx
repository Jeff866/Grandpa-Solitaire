export default function StockArea({
  stock,
  discard,
}) {

  const topDiscard =
    discard[discard.length - 1];


  return (

    <section className="mb-10">

      <h2 className="text-2xl font-bold mb-4">
        Stock & Discard
      </h2>


      <div className="grid grid-cols-2 gap-6">


        <div className="bg-green-800 rounded-xl p-5 shadow text-center">

          <div className="font-bold text-xl mb-3">
            Stock
          </div>


          <div className="
            h-32
            flex
            items-center
            justify-center
            border-2
            border-dashed
            border-green-300
            rounded-lg
          ">

            {stock > 0 ? (

              <div className="text-5xl">
                🂠
              </div>

            ) : (

              <div>
                Empty
              </div>

            )}

          </div>


          <div className="mt-3">
            {stock} cards
          </div>


        </div>





        <div className="bg-green-800 rounded-xl p-5 shadow text-center">

          <div className="font-bold text-xl mb-3">
            Discard
          </div>


          <div className="
            h-32
            flex
            items-center
            justify-center
            border-2
            border-dashed
            border-green-300
            rounded-lg
          ">

            {topDiscard ? (

              <div className="text-5xl">
                {topDiscard.rank}
                {topDiscard.suit}
              </div>

            ) : (

              <div>
                Empty
              </div>

            )}

          </div>


          <div className="mt-3">
            {discard.length} cards
          </div>


        </div>


      </div>


    </section>

  );

}