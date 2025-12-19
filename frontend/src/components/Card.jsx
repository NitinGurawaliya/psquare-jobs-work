export function Card({ children, className = '' }) {
  return <div className={`rounded-2xl border border-slate-900 bg-slate-950 p-5 ${className}`}>{children}</div>;
}
