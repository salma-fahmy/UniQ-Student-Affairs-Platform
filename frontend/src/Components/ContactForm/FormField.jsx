import React from 'react';

const FormField = ({ 
  label, 
  name, 
  type = 'text', 
  defaultValue,
  onChange, 
  onBlur,
  error, 
  placeholder, 
  required = false,
  isTextArea = false 
}) => {
  const baseClasses = "w-full px-4 py-3 rounded-lg border transition-all duration-200 outline-none font-['Open_Sans'] text-base";
  const stateClasses = "border-gray-200 bg-white focus:border-indigo-700 focus:ring-1 focus:ring-indigo-900/10";

  return (
    <div className="flex flex-col space-y-1.5 w-full group">
      <label 
        htmlFor={name}
        className={`text-sm font-medium ml-0.5 transition-colors duration-200 ${error ? 'text-indigo-900' : 'text-indigo-900 group-focus-within:text-indigo-800'}`}
      >
        {label} {required && <span className="text-red-500 text-xs">*</span>}
      </label>
      
      {isTextArea ? (
        <textarea
          id={name}
          name={name}
          defaultValue={defaultValue}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          rows="4"
          className={`${baseClasses} ${stateClasses} resize-none shadow-sm`}
        />
      ) : (
        <input
          id={name}
          type={type}
          name={name}
          defaultValue={defaultValue}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`${baseClasses} ${stateClasses} shadow-sm`}
        />
      )}
      
      <div className="min-h-[20px] ml-0.5 mt-1 flex items-start space-x-1.5">
        {error && (
          <>
            <div className="mt-0.5 flex-shrink-0 bg-[#FF9800] rounded-sm w-3.5 h-3.5 flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">!</span>
            </div>
            <p className="text-[#d93025] text-[12px] font-normal leading-tight">
              {error}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default FormField;
