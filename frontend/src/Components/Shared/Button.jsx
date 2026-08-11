import React from 'react';

const variantStyles = {
  primary: 'bg-[var(--brand-primary)] text-white shadow-[0_18px_38px_-18px_rgba(49,46,129,0.55)] hover:bg-[var(--brand-primary-hover)] hover:shadow-[0_22px_46px_-18px_rgba(49,46,129,0.65)] active:scale-95',
  secondary: 'border border-[color:var(--brand-border)] bg-[var(--brand-surface-strong)] text-[var(--brand-text)] hover:bg-[var(--brand-bg-mid)] shadow-sm hover:shadow-md backdrop-blur-sm',
  subtle: 'border border-[rgba(245,158,11,0.25)] bg-[rgba(245,158,11,0.1)] text-amber-900 hover:bg-[rgba(245,158,11,0.14)] shadow-sm hover:shadow-md',
  ghost: 'bg-transparent text-[var(--brand-text)] hover:bg-[rgba(79,70,229,0.08)]',
};

const Button = ({
  children,
  variant = 'primary',
  loading = false,
  loadingText,
  type = 'button',
  className = '',
  disabled = false,
  ...props
}) => {
  const isDisabled = disabled || loading;
  const styles = variantStyles[variant] || variantStyles.primary;

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 font-bold transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-70 ${styles} ${className}`}
      {...props}
    >
      {loading ? loadingText || children : children}
    </button>
  );
};

export default Button;
