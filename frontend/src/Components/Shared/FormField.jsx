import React from "react";

const FormField = ({
  label,
  name,
  type = "text",
  defaultValue,
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  required = false,
  isTextArea = false,
  icon = null,
  disabled = false,
  className = "",
}) => {
  const baseClasses = `w-full rounded-2xl py-3 border transition-all duration-200 outline-none font-['Open_Sans'] text-base placeholder:text-[var(--brand-muted)] ${icon ? "pl-11 pr-4" : "px-4"} ${className}`;
  const stateClasses = `border-[color:var(--brand-border)] bg-[var(--brand-surface-strong)] text-[var(--brand-text)] shadow-sm focus:border-[color:var(--brand-accent)] focus:shadow-[0_0_0_4px_rgba(79,70,129,0.10)] disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500 disabled:shadow-none`;
  const inputProps = value !== undefined ? { value } : { defaultValue };

  return (
    <div className="flex flex-col space-y-1.5 w-full group">
      <label
        htmlFor={name}
        className="text-sm font-medium ml-0.5 text-indigo-900 transition-colors duration-200"
      >
        {label} {required && <span className="text-red-500 text-xs">*</span>}
      </label>

      <div className="relative w-full">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--brand-muted)]">
            {icon}
          </div>
        )}

        {isTextArea ? (
          <textarea
            id={name}
            name={name}
            {...inputProps}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            rows="4"
            className={`${baseClasses} ${stateClasses} resize-none shadow-sm`}
          />
        ) : (
          <input
            id={name}
            type={type}
            name={name}
            {...inputProps}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            className={`${baseClasses} ${stateClasses} shadow-sm`}
          />
        )}
      </div>

      <div className="min-h-[20px] ml-0.5 mt-1 flex items-start space-x-1.5">
        {error && (
          <>
            <div className="mt-0.5 flex-shrink-0 rounded-sm w-3.5 h-3.5 flex items-center justify-center bg-[var(--brand-warning)]">
              <span className="text-white text-[10px] font-bold">!</span>
            </div>
            <p className="text-[var(--brand-danger)] text-[12px] font-normal leading-tight">
              {error}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default FormField;
