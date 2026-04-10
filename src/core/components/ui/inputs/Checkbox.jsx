import { Icon } from '@iconify/react';

export default function Checkbox({ checked = false, onChange, ariaLabel = 'Seleccionar elemento' }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={() => onChange(!checked)}
      className={`grid h-5 w-5 place-items-center rounded-md border transition ${
        checked
          ? 'border-fuchsia-600 bg-fuchsia-600 text-white'
          : 'border-slate-300 bg-white text-transparent hover:border-fuchsia-400'
      }`}
    >
      <Icon icon="mdi:check" width="14" />
    </button>
  );
}
