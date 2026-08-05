import { useState } from "react";

import Header from "./components/Header";
import StatusBar from "./components/StatusBar";
import DealPile from "./components/DealPile";
import FoundationPile from "./components/FoundationPile";
import Hand from "./components/Hand";

import { createDeck, shuffle } from "./game/deck";

import {
  createEmptyGame,
  dealCard,
  dealRound,
  RANKS,
} from "./game/deal";

import {
  canPlayCard,
  FOUNDATION_TYPES,
} from "./game/rules";


const SUITS = [
  "♠",
  "♥",
  "♦",
  "♣",
];


export default function App() {


  const [game, setGame] = useState(() => {

    const newGame = createEmptyGame();

    newGame.stock = shuffle(createDeck());

    return newGame;

  });



  function newGame() {

    const reset = createEmptyGame();

    reset.stock = shuffle(createDeck());

    setGame(reset);

  }





  function cloneGame() {

    return {

      ...game,

      stock: [...game.stock],

      discard: [...game.discard],

      hand: [...game.hand],

      dealPiles: {
        ...game.dealPiles,
      },

      ascending: game.ascending.map(
        pile => [...pile]
      ),

      descending: game.descending.map(
        pile => [...pile]
      ),

    };

  }





  function handleDealOne() {

    const updated = cloneGame();

    dealCard(updated);

    updated.currentPile =
      (updated.currentPile + 1) % 13;

    setGame(updated);

  }





  function handleDealRound() {

    const updated = cloneGame();

    dealRound(updated);

    setGame(updated);

  }





  function handleSelectPile(rank) {

    const updated = cloneGame();


    updated.hand.push(
      ...updated.dealPiles[rank]
    );


    updated.dealPiles[rank] = [];


    setGame(updated);

  }







  function handlePlayCard(card, index) {

    const updated = cloneGame();


    const suitIndex =
      SUITS.indexOf(card.suit);



    // Try ascending first

    const ascendingPile =
      updated.ascending[suitIndex];


    if (
      canPlayCard(
        card,
        ascendingPile,
        FOUNDATION_TYPES.ASCENDING
      )
    ) {

      ascendingPile.push(card);

      updated.hand.splice(index,1);

      setGame(updated);

      return;

    }




    // Try descending second

    const descendingPile =
      updated.descending[suitIndex];



    if (
      canPlayCard(
        card,
        descendingPile,
        FOUNDATION_TYPES.DESCENDING
      )
    ) {

      descendingPile.push(card);

      updated.hand.splice(index,1);

      setGame(updated);

      return;

    }



  }







  return (

    <div className="min-h-screen bg-green-900 text-white">


      <Header

        onNewGame={newGame}

        onDealOne={handleDealOne}

        onDealRound={handleDealRound}

      />



      <main className="max-w-7xl mx-auto p-8">


        <StatusBar

          phase={game.phase}

          stock={game.stock.length}

          discard={game.discard}

          hand={game.hand}

        />





        <section className="mb-10">


          <h2 className="text-2xl font-bold mb-4">
            Deal Piles
          </h2>



          <div className="grid grid-cols-7 gap-4">


            {RANKS.map(rank => (

              <DealPile

                key={rank}

                label={rank}

                onSelect={() =>
                  handleSelectPile(rank)
                }

                card={
                  game.dealPiles[rank].at(-1)
                  ||
                  {
                    rank:"",
                    suit:"",
                    red:false
                  }
                }

              />

            ))}


          </div>


        </section>






        <Hand

          cards={game.hand}

          onPlayCard={handlePlayCard}

        />








        <section className="mt-10">


          <h2 className="text-2xl font-bold mb-4">
            Ascending Foundations
          </h2>



          <div className="grid grid-cols-4 gap-4">


            {SUITS.map((suit,index)=>(


              <FoundationPile

                key={suit}

                suit={suit}

                direction="ascending"

                cards={
                  game.ascending[index] || []
                }

              />


            ))}


          </div>


        </section>







        <section className="mt-10">


          <h2 className="text-2xl font-bold mb-4">
            Descending Foundations
          </h2>



          <div className="grid grid-cols-4 gap-4">


            {SUITS.map((suit,index)=>(


              <FoundationPile

                key={suit}

                suit={suit}

                direction="descending"

                cards={
                  game.descending[index] || []
                }

              />


            ))}


          </div>


        </section>





      </main>


    </div>

  );

}