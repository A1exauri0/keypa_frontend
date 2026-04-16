export default function TextArea({
  id,
  label,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  maxLength,
  rows = 4,
  error,
}) {
  const wrapperClass = `w-full rounded-xl border bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:ring-2 focus:ring-fuchsia-200 disabled:cursor-not-allowed ${
    error ? 'border-rose-500 focus:border-rose-500' : 'border-slate-300 focus:border-fuchsia-500'
  }`;

  return (
    <div className="grid gap-1.5">
      {label ? (
        <label htmlFor={id} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      ) : null}

      <textarea
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        maxLength={maxLength}
        rows={rows}
        className={wrapperClass}
      />

      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
