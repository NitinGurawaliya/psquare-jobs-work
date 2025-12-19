export function Input({ label, error, className = '', ...props }) {
  return (
    <label className={`block ${className}`}>
      {label ? <div className="mb-1 text-sm text-slate-200">{label}</div> : null}
      <input
        {...props}
        className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:border-indigo-500"
      />
      {error ? <div className="mt-1 text-sm text-rose-400">{error}</div> : null}
    </label>
  );
}
