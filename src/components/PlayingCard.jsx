export default function PlayingCard({
  rank,
  suit,
  red,
  onClick,
  draggable = false,
  onDragStart,
  onDragEnd,
}) {
  return (
    <div
      onClick={onClick}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={[
        "aspect-[2.5/3.5]",
        "bg-white",
        "rounded-lg",
        "shadow-lg",
        "border",
        "border-gray-300",
        "flex",
        "flex-col",
        "justify-between",
        "p-2",
        draggable
          ? "cursor-grab active:cursor-grabbing"
          : "cursor-pointer",
        "hover:scale-105",
        "transition",
        "select-none",
      ].join(" ")}
    >
      <div
        className={[
          "text-left",
          "font-bold",
          "text-xl",
          red
            ? "text-red-600"
            : "text-black",
        ].join(" ")}
      >
        {rank}
        {suit}
      </div>

      <div
        className={[
          "text-center",
          "text-5xl",
          red
            ? "text-red-600"
            : "text-black",
        ].join(" ")}
      >
        {suit}
      </div>

      <div
        className={[
          "text-right",
          "font-bold",
          "text-xl",
          "rotate-180",
          red
            ? "text-red-600"
            : "text-black",
        ].join(" ")}
      >
        {rank}
        {suit}
      </div>
    </div>
  );
}