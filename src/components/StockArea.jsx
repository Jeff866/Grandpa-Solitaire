export default function StockArea({
  stock,
  discard,
}) {
  const topDiscard =
    discard[discard.length - 1];

  return (
    <section className="stock-area">
      <h2>Stock & Discard</h2>

      <div className="stock-discard-grid">
        <div className="stock-card-box">
          <div className="stock-card-title">
            Stock
          </div>

          <div className="stock-card-space">
            {stock > 0 ? (
              <div className="card-back-symbol">
                🂠
              </div>
            ) : (
              <div>Empty</div>
            )}
          </div>

          <div className="stock-card-count">
            {stock} cards
          </div>
        </div>

        <div className="stock-card-box">
          <div className="stock-card-title">
            Discard
          </div>

          <div className="stock-card-space">
            {topDiscard ? (
              topDiscard.faceUp ? (
                <div
                  className={
                    topDiscard.suit === "♥" ||
                    topDiscard.suit === "♦"
                      ? "discard-face red-card"
                      : "discard-face black-card"
                  }
                >
                  {topDiscard.rank}
                  {topDiscard.suit}
                </div>
              ) : (
                <div className="card-back-symbol">
                  🂠
                </div>
              )
            ) : (
              <div>Empty</div>
            )}
          </div>

          <div className="stock-card-count">
            {discard.length} cards
          </div>
        </div>
      </div>
    </section>
  );
}