export default function HowToPlay({
  open,
  onClose,
}) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="how-to-overlay"
      role="presentation"
      onClick={onClose}
    >
      <section
        className="how-to-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="how-to-title"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="how-to-header">
          <div>
            <h2 id="how-to-title">
              How to Play
            </h2>

            <p>
              Grandpa&apos;s Solitaire
              — Solitaire 104
            </p>
          </div>

          <button
            type="button"
            className="how-to-close"
            onClick={onClose}
            aria-label="Close How to Play"
          >
            ×
          </button>
        </div>

        <div className="how-to-content">
          <section>
            <h3>Goal</h3>

            <p>
              Move all 104 cards onto
              the eight foundations.
            </p>
          </section>

          <section>
            <h3>Foundations</h3>

            <p>
              Each suit has two
              foundations: one builds
              upward from Ace to King
              and one builds downward
              from King to Ace.
            </p>

            <p>
              A card must always be
              played on the foundation
              for its own suit.
            </p>
          </section>

          <section>
            <h3>The Deal</h3>

            <p>
              Cards are dealt in order
              across the 13 Deal Piles:
              A, 2, 3, 4, 5, 6, 7, 8,
              9, 10, J, Q, K.
            </p>

            <p>
              Every Ace dealt sends one
              extra card face down to
              the Discard pile.
            </p>

            <p>
              When a card matches the
              rank of the pile where it
              was dealt, two additional
              cards are sent face down
              to Discard.
            </p>

            <p>
              An Ace dealt to the Ace
              pile therefore sends
              three cards to Discard.
            </p>

            <p>
              At the end of each
              complete A-through-K
              round, one additional
              card is sent to Discard.
            </p>
          </section>

          <section>
            <h3>Active Play</h3>

            <p>
              After the deal, the top
              Discard card becomes the
              selector. Its rank tells
              you which Deal Pile to
              pick up as the Active
              Pile.
            </p>

            <p>
              Play any legal cards from
              the Active Pile to the
              foundations. You may also
              play any legal face-up
              card exposed on a Deal
              Pile.
            </p>

            <p>
              You can drag a card onto
              a legal foundation, or
              click the card and then
              click a highlighted
              foundation.
            </p>

            <p>
              If both the ascending and
              descending foundation are
              legal, you choose which
              one receives the card.
            </p>
          </section>

          <section>
            <h3>Finishing an Active Pile</h3>

            <p>
              When you are finished
              playing from the Active
              Pile, all unplayed cards
              return to that same rank
              pile in their current
              order.
            </p>

            <p>
              You may not rearrange or
              sort the pile.
            </p>
          </section>

          <section>
            <h3>Final Pass</h3>

            <p>
              After all selector cards
              have been used, make one
              final pass through the
              Deal Piles from Ace
              through King.
            </p>

            <p>
              During the Final Pass,
              continue playing legal
              cards from the current
              pile and any other
              exposed Deal Pile cards.
            </p>
          </section>

          <section>
            <h3>Winning</h3>

            <p>
              You win only when all
              eight suit foundations
              are completely built.
            </p>
          </section>
        </div>

        <div className="how-to-footer">
          <button
            type="button"
            onClick={onClose}
          >
            Back to Game
          </button>
        </div>
      </section>
    </div>
  );
}