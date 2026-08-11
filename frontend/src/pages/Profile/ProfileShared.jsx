import React, { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

export const formatDate = (value) => {
  if (!value) return '-';
  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) return String(value);
  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(parsedDate);
};

export const formatDateTime = (value) => {
  if (!value) return '-';
  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) return String(value);
  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(parsedDate);
};

export const maskSensitive = (value) => {
  if (!value) return '-';
  const str = String(value);
  if (str.length > 7) {
    return str.substring(0, 4) + ' *** ' + str.substring(str.length - 4);
  }
  return str.replace(/./g, '*');
};

export const formatDisplayValue = (value, fallback = '-') => (value === null || value === undefined || value === '' ? fallback : value);

export const getLevelText = (level) => {
  if (level === null || level === undefined || level === '') {
    return '-';
  }

  const num = parseInt(level, 10);
  switch (num) {
    case 1: return 'First level';
    case 2: return 'Second level';
    case 3: return 'Third level';
    case 4: return 'Fourth level';
    default: return `Level ${level}`;
  }
};

export const SectionCell = ({ label, value, isSensitive, badge }) => {
  const [isMasked, setIsMasked] = useState(!!isSensitive);
  const displayValue = isMasked ? maskSensitive(value) : formatDisplayValue(value);

  return (
    <div className="px-6 py-5 flex flex-col justify-center h-full hover:bg-slate-50/50 transition-colors">
      <span className="text-[12.5px] text-slate-500 font-medium mb-1.5">{label}</span>
      <div className="flex items-center w-full">
        {badge ? (
          <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[12px] font-bold">
            {badge}
          </span>
        ) : (
          <span className="text-[13.5px] font-bold text-indigo-900 break-words">{displayValue}</span>
        )}
        
        {isSensitive && value && value !== '-' && (
          <button 
            onClick={() => setIsMasked(!isMasked)} 
            className="text-slate-400 hover:text-indigo-600 transition-colors focus:outline-none p-1 rounded-md hover:bg-slate-50 ml-auto"
            title={isMasked ? "Show" : "Hide"}
          >
            {isMasked ? <FiEyeOff size={16} /> : <FiEye size={16} />}
          </button>
        )}
      </div>
    </div>
  );
};

export const ProfileSection = ({ title, icon: Icon, children }) => {
  const headerIcon = Icon ? React.createElement(Icon, { size: 18 }) : null;

  return (
    <div className="mb-6 bg-white border border-slate-200/80 rounded-[1rem] overflow-hidden shadow-sm">
      <div className="flex items-center gap-3 px-6 py-4 bg-slate-50/50">
        <div className="bg-[#F4F1FD] text-indigo-800 p-2 rounded-lg border border-indigo-50">
          {headerIcon}
        </div>
        <h3 className="text-[15px] font-bold text-indigo-900">{title}</h3>
      </div>
      <div className="flex flex-col divide-y divide-slate-100 border-t border-slate-100">
        {children}
      </div>
    </div>
  );
};

export const SidebarItem = ({ Icon, label, value, subValue, isBadge }) => {
  const iconElement = Icon ? React.createElement(Icon, { size: 20, strokeWidth: 2 }) : null;

  return (
    <div className="flex items-start gap-4 px-8 py-4">
      <div className="text-indigo-800/80 mt-0.5">
        {iconElement}
      </div>
      <div className="flex flex-col text-left">
        <span className="text-[12.5px] text-slate-500 font-medium mb-1">{label}</span>
        {isBadge ? (
          <span className="px-3 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[12px] font-bold w-max">
            {value}
          </span>
        ) : (
          <div className="flex flex-col gap-1">
            <span className="text-[14px] font-bold text-indigo-900 leading-tight">{value}</span>
            {subValue && (
              <span className="text-[13px] font-medium text-slate-600" dir="rtl">{subValue}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
