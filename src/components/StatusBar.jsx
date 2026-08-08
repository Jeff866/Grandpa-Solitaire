export default function StatusBar({
  phase = "Deal",
  stock = 104,
  discard = [],
  hand = [],
  nextRank = "",
}) {
  return (
    <div className="status-bar">
      <div>
        Phase: <strong>{phase}</strong>
      </div>

      <div>
        Stock: <strong>{stock}</strong>
      </div>

      <div>
        Discard: <strong>{discard.length}</strong>
      </div>

      <div>
        Next: <strong>{nextRank}</strong>
      </div>
    </div>
  );
}