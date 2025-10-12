
export function Button({ children, variant="default", size="md", onClick, ...props }) {
  const base = "inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm border transition";
  const v = variant==="outline" ? "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
    : variant==="ghost" ? "border-transparent bg-transparent hover:bg-slate-100"
    : "bg-slate-900 text-white border-slate-900 hover:opacity-90";
  const s = size==="sm" ? "text-xs px-2 py-1" : size==="xs" ? "text-[12px] px-2 py-1" : "";
  return <button onClick={onClick} className={`${base} ${v} ${s}`} {...props}>{children}</button>;
}
export default Button;
