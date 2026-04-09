export default function InputNumber({
  id,
  label,
  value,
  onChange,
  prefix,
  suffix,
  placeholder,
  required = false,
  disabled = false,
  min,
  max,
  step = 1,
  error,
}) {
  const handleChange = (event) => {
    const nextValue = event.target.value;

    if (nextValue === '') {
      onChange('');
      return;
    }

    const numericValue = Number(nextValue);
    if (!Number.isFinite(numericValue)) {
      return;
    }

    if (typeof min === 'number' && numericValue < min) {
      onChange(min);
      return;
    }

    if (typeof max === 'number' && numericValue > max) {
      onChange(max);
      return;
    }

    onChange(numericValue);
  };

  const wrapperClass = `flex h-11 items-center rounded-xl border bg-white transition focus-within:ring-2 focus-within:ring-fuchsia-200 ${
    error ? 'border-rose-500 focus-within:border-rose-500' : 'border-slate-300 focus-within:border-fuchsia-500'
  }`;

  return (
    <div className="grid gap-1.5">
      {label ? (
        <label htmlFor={id} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      ) : null}

      <div className={wrapperClass}>
        {prefix ? <span className="px-3 text-sm text-slate-500">{prefix}</span> : null}

        <input
          id={id}
          type="number"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          className="h-full w-full rounded-xl bg-transparent px-3 text-sm text-slate-900 outline-none disabled:cursor-not-allowed"
        />

        {suffix ? <span className="px-3 text-sm text-slate-500">{suffix}</span> : null}
      </div>

      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
