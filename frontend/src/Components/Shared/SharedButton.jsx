import React from 'react';

const SharedButton = ({
  text,
  onClick,
  icon: Icon,
  className = '',
  type = 'button',
  disabled = false,
  variant = 'primary', // 'primary', 'secondary', 'danger' etc if needed
}) => {
  // Base classes for the pill shape and layout
  const baseClasses = 'group flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 active:scale-95';
  
  // Dynamic color variants
  const variants = {
    primary: 'bg-indigo-900 text-white shadow-[0_10px_20px_-10px_rgba(49,46,129,0.5)] hover:bg-indigo-800 hover:shadow-[0_15px_25px_-10px_rgba(49,46,129,0.7)]',
    secondary: 'bg-slate-100 text-indigo-900 hover:bg-slate-200',
    danger: 'bg-red-500 text-white shadow-md hover:bg-red-600',
    outline: 'border border-indigo-900 text-indigo-900 hover:bg-indigo-50',
  };

  const variantClasses = variants[variant] || variants.primary;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses} ${disabled ? 'opacity-70 cursor-not-allowed hover:bg-indigo-900' : ''} ${className}`}
    >
      <span>{text}</span>
      {Icon && <Icon size={18} className="transition-transform duration-300 group-hover:translate-x-1 whitespace-nowrap md:translate-x-0 group-hover:drop-shadow-lg" />}
    </button>
  );
};

export default SharedButton;