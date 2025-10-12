
export function Select({ children }) { return <div>{children}</div>; }
export function SelectTrigger({ children, className="", ...p }) {
  return <div className={`border rounded-lg px-3 py-2 text-sm bg-white ${className}`} {...p}>{children}</div>;
}
export function SelectValue({ placeholder }) { return <span className="text-slate-500">{placeholder}</span>; }
export function SelectContent({ children }) { return <div className="mt-1 border rounded-lg bg-white shadow p-2 space-y-1">{children}</div>; }
export function SelectItem({ value, children, onClick }) {
  return <div onClick={onClick} className="px-2 py-1 rounded hover:bg-slate-100 cursor-pointer text-sm">{children}</div>;
}
