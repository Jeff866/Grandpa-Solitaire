
import { useEffect } from "react";
export function Dialog({ open, onOpenChange, children }) {
  useEffect(() => {
    if (!open) return;
    const onEsc = e => { if (e.key==="Escape") onOpenChange?.(false); };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onOpenChange]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40" onClick={() => onOpenChange?.(false)}>
      <div className="bg-white rounded-2xl shadow-xl w-[92vw] max-w-xl" onClick={e=>e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
export function DialogContent({ className="", children }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}
export function DialogHeader({ children }) { return <div className="mb-2">{children}</div>; }
export function DialogTitle({ children, className="" }) { return <h2 className={`text-xl font-semibold ${className}`}>{children}</h2>; }
export function DialogTrigger({ asChild, children }) { return children; }
