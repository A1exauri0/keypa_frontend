export default function Button({
  type = 'button',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  className = '',
  children,
  ...props
}) {
  const baseClass =
    'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60';

  const variants = {
    primary: 'bg-fuchsia-600 text-white hover:bg-fuchsia-700 focus-visible:ring-fuchsia-500',
    secondary: 'bg-violet-100 text-violet-800 hover:bg-violet-200 focus-visible:ring-violet-400',
    ghost: 'bg-transparent text-violet-700 hover:bg-violet-50 focus-visible:ring-violet-400',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 focus-visible:ring-rose-500',
  };

  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-11 px-4 text-sm',
    lg: 'h-12 px-5 text-base',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${baseClass} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${fullWidth ? 'w-full' : ''} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
