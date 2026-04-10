import { Icon } from '@iconify/react';
import { useEffect, useMemo, useRef, useState } from 'react';

export default function Select({
  id,
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Seleccionar',
  disabled = false,
  containerClassName = '',
}) {
  const rootRef = useRef(null);
  const [open, setOpen] = useState(false);

  const selected = useMemo(() => options.find((item) => String(item.value) === String(value)), [options, value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!rootRef.current || rootRef.current.contains(event.target)) {
        return;
      }
      setOpen(false);
    };

    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const onSelect = (nextValue) => {
    onChange(nextValue);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className={`relative grid gap-1.5 ${containerClassName}`.trim()}>
      {label ? (
        <label htmlFor={id} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      ) : null}

      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-10 items-center justify-between rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:ring-2 focus:ring-fuchsia-200 disabled:cursor-not-allowed"
      >
        <span>{selected?.label || placeholder}</span>
        <Icon icon={open ? 'mdi:chevron-up' : 'mdi:chevron-down'} width="18" className="text-slate-500" />
      </button>

      {open ? (
        <ul className="absolute left-0 top-full z-30 mt-1 max-h-64 w-full overflow-auto rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
          {options.map((item) => {
            const active = String(item.value) === String(value);
            return (
              <li key={item.value}>
                <button
                  type="button"
                  onClick={() => onSelect(item.value)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
                    active
                      ? 'bg-fuchsia-100 text-fuchsia-700'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                  {active ? <Icon icon="mdi:check" width="16" /> : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
