import DealPile from "./DealPile";
import FoundationPile from "./FoundationPile";

const demoCards = [
  { rank: "A", suit: "♥", red: true },
  { rank: "2", suit: "♣", red: false },
  { rank: "3", suit: "♦", red: true },
  { rank: "4", suit: "♠", red: false },
  { rank: "5", suit: "♥", red: true },
  { rank: "6", suit: "♣", red: false },
  { rank: "7", suit: "♦", red: true },
  { rank: "8", suit: "♠", red: false },
  { rank: "9", suit: "♥", red: true },
  { rank: "10", suit: "♣", red: false },
  { rank: "J", suit: "♦", red: true },
  { rank: "Q", suit: "♠", red: false },
  { rank: "K", suit: "♥", red: true },
];

export default function GameBoard() {
  return (
    <>
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">
          Deal Piles
        </h2>

        <div className="grid grid-cols-7 gap-4">
          {demoCards.map((card, i) => (
            <DealPile
              key={i}
              label={card.rank}
              card={card}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">
          Suit Foundations
        </h2>

        <div className="grid grid-cols-4 gap-4 mb-4">
          {[1, 2, 3, 4].map((i) => (
            <FoundationPile
              key={i}
              title="Ascending"
            />
          ))}
        </div>

        <div className="grid grid-cols-4 gap-4">
          {[5, 6, 7, 8].map((i) => (
            <FoundationPile
              key={i}
              title="Descending"
            />
          ))}
        </div>
      </section>
    </>
  );
}