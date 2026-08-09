import { useRef, useState } from "react";

export default function PlayingCard({
  rank,
  suit,
  red,
  onClick,
  draggable = false,
  onDragStart,
  onDragEnd,
}) {
  const [dragging, setDragging] =
    useState(false);

  const justDragged =
    useRef(false);

  function handleClick(event) {
    /*
     * Some browsers fire a click immediately
     * after a drag finishes.
     *
     * Suppress that click so dropping a card
     * cannot accidentally select it afterward.
     */
    if (justDragged.current) {
      justDragged.current = false;
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    onClick?.(event);
  }

  function handleDragStart(event) {
    if (!draggable) {
      event.preventDefault();
      return;
    }

    justDragged.current = true;
    setDragging(true);

    onDragStart?.(event);
  }

  function handleDragEnd(event) {
    setDragging(false);

    onDragEnd?.(event);

    /*
     * Keep the suppression flag alive through
     * the browser's immediate post-drag click,
     * then clear it if no click occurs.
     */
    window.setTimeout(() => {
      justDragged.current = false;
    }, 100);
  }

  return (
    <div
      onClick={handleClick}
      draggable={draggable}
      onDragStart={
        handleDragStart
      }
      onDragEnd={handleDragEnd}
      className={[
        "playing-card",
        dragging
          ? "playing-card-dragging"
          : "",
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