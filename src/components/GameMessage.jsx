export default function GameMessage({
  phase,
  won,
}) {
  if (won) {
    return (
      <div
        style={{
          marginTop: "5px",
          padding: "10px 18px",
          borderRadius: "9px",
          border: "2px solid #fde047",
          background:
            "rgba(202, 138, 4, 0.95)",
          color: "#111827",
          textAlign: "center",
          boxShadow:
            "0 2px 8px rgba(0, 0, 0, 0.25)",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "1.35rem",
            lineHeight: 1.2,
            fontWeight: 700,
          }}
        >
          🏆 You Won Grandpa&apos;s
          Solitaire!
        </h2>

        <p
          style={{
            margin: "3px 0 0",
            fontSize: "0.9rem",
          }}
        >
          All 8 foundations are
          complete.
        </p>
      </div>
    );
  }

  if (phase === "Finished") {
    return (
      <div
        style={{
          marginTop: "5px",
          padding: "10px 18px",
          borderRadius: "9px",
          border:
            "2px solid rgba(254, 202, 202, 0.75)",
          background:
            "rgba(153, 27, 27, 0.94)",
          color: "white",
          textAlign: "center",
          boxShadow:
            "0 2px 8px rgba(0, 0, 0, 0.25)",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "1.35rem",
            lineHeight: 1.2,
            fontWeight: 700,
          }}
        >
          Game Over
        </h2>

        <p
          style={{
            margin: "3px 0 0",
            fontSize: "0.9rem",
          }}
        >
          The Final Pass is complete.
          Better luck next game!
        </p>
      </div>
    );
  }

  return null;
}