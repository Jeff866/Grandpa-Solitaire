
export function Tabs({ children }) { return <div>{children}</div>; }
export function TabsList({ children }) { return <div className="inline-flex gap-2 bg-slate-100 rounded-xl p-1">{children}</div>; }
export function TabsTrigger({ value, children }) { return <button className="px-3 py-1 text-sm rounded-xl">{children}</button>; }
export function TabsContent({ value, children }) { return <div className="mt-2">{children}</div>; }
