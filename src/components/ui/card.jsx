
export function Card({ className="", children }) {
  return <div className={`rounded-2xl bg-white shadow border border-slate-200 ${className}`}>{children}</div>;
}
export function CardContent({ className="", children }) {
  return <div className={className}>{children}</div>;
}
export const UICard = Card;
