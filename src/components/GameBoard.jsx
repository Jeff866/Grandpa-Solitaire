import { RANKS } from "../game/deal";
import DealPile from "./DealPile";
import FoundationPile from "./FoundationPile";

export default function GameBoard({
  piles,
  ascending,
  descending,
}) {
  return (
    <>
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">
          Deal Piles
        </h2>

        <div className="grid grid-cols-7 gap-4">
          {RANKS.map((rank) => (
            <DealPile
              key={rank}
              label={rank}
              cards={piles[rank]}
            />
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold mb-4">
          Suit Foundations
        </h2>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {ascending.map((pile, index) => (
            <FoundationPile
              key={`asc-${index}`}
              title={`Ascending ${index + 1}`}
              cards={pile}
            />
          ))}
        </div>

        <div className="grid grid-cols-4 gap-4">
          {descending.map((pile, index) => (
            <FoundationPile
              key={`desc-${index}`}
              title={`Descending ${index + 1}`}
              cards={pile}
            />
          ))}
        </div>
      </section>
    </>
  );
}
