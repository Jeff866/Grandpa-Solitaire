export default function GameButton({
  children,
  onClick,
  color = "green",
  disabled = false,
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
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        ${colors[color]}
        px-5
        py-3
        rounded-xl
        font-semibold
        shadow-lg
        transition
        duration-200
        disabled:opacity-35
        disabled:cursor-not-allowed
        disabled:hover:brightness-100
      `}
    >
      {children}
    </button>
  );
}