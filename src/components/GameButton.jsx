export default function GameButton({
  children,
  onClick,
  color = "green",
}) {

  const colors = {
    green:
      "bg-green-700 hover:bg-green-600",

    blue:
      "bg-blue-700 hover:bg-blue-600",

    red:
      "bg-red-700 hover:bg-red-600",

    amber:
      "bg-amber-700 hover:bg-amber-600",
  };

  return (
    <button
      onClick={onClick}
      className={`
        ${colors[color]}
        px-5
        py-3
        rounded-xl
        font-semibold
        shadow-lg
        transition
        duration-200
      `}
    >
      {children}
    </button>
  );
}