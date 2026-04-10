import { useMemo, useState } from 'react';
import { Icon } from '@iconify/react';

function sanitizeValue(value, allowSpecialChars, type) {
  if (type === 'password' || allowSpecialChars) {
    return value;
  }

  return value.replace(/[^a-zA-Z0-9\s]/g, '');
}

export default function InputText({
  id,
  label,
  value,
  onChange,
  type = 'text',
  prefix,
  suffix,
  placeholder,
  required = false,
  disabled = false,
  maxLength,
  allowSpecialChars = true,
  inputMode,
  autoComplete,
  error,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const resolvedType = type === 'password' ? (showPassword ? 'text' : 'password') : type;

  const wrapperClass = useMemo(() => {
    const base =
      'flex h-10 items-center rounded-xl border bg-white transition focus-within:ring-2 focus-within:ring-fuchsia-200';
    const border = error ? 'border-rose-500 focus-within:border-rose-500' : 'border-slate-300 focus-within:border-fuchsia-500';
    return `${base} ${border}`;
  }, [error]);

  const handleChange = (event) => {
    const cleanValue = sanitizeValue(event.target.value, allowSpecialChars, type);
    onChange(cleanValue);
  };

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
          type={resolvedType}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          maxLength={maxLength}
          inputMode={inputMode}
          autoComplete={autoComplete}
          className="h-full w-full rounded-xl bg-transparent px-3 text-sm text-slate-900 outline-none disabled:cursor-not-allowed"
        />

        {type === 'password' ? (
          <button
            type="button"
            className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 transition hover:bg-fuchsia-50 hover:text-fuchsia-700"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
            title={showPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
          >
            <Icon icon={showPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'} width="18" />
          </button>
        ) : null}

        {suffix && type !== 'password' ? <span className="px-3 text-sm text-slate-500">{suffix}</span> : null}
      </div>

      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
