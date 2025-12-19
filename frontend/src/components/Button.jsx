export function Button({ children, variant = 'primary', className = '', ...props }) {
  const styles =
    variant === 'secondary'
      ? 'border border-slate-800 bg-slate-900 hover:bg-slate-800'
      : variant === 'danger'
        ? 'bg-rose-600 hover:bg-rose-500'
        : 'bg-indigo-600 hover:bg-indigo-500';

  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 ${styles} ${className}`}
    >
      {children}
    </button>
  );
}
