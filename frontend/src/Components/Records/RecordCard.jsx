import React from 'react';
import { getStatusStyle, formatStatusText, getStatusIcon } from './recordHelpers';
import { FiChevronRight, FiUser, FiInfo } from 'react-icons/fi';

const RecordCard = ({ id, type, date, status, description, onViewDetails, kind = 'request', studentName, studentId }) => {
  const isComplaint = kind === 'complaint';
  const statusIcon = getStatusIcon(status, { size: 20, className: 'stroke-[2px]' });

  return (
    <div className="group bg-white border border-slate-200/70 border-b-[4px] border-b-[#2a266f]/20 hover:border-indigo-200 hover:border-b-[#2a266f] rounded-[16px] p-5 shadow-[0_4px_16px_-8px_rgba(0,0,0,0.08)] hover:-translate-y-1 hover:shadow-[0_12px_24px_-8px_rgba(42,38,111,0.15)] transition-all duration-300 ease-out flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
      
      {/* Decorative hover gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#2a266f]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Left Area: Icon + Details */}
      <div className="flex items-start gap-4 flex-1 relative z-10">
        
        {/* Icon Container - Updated hover colors */}
        <div className="mt-0.5 shrink-0 p-2.5 bg-[#F4F1FD] rounded-full text-[#2a266f] group-hover:bg-[#2a266f] group-hover:text-white transition-colors duration-300 shadow-sm">
          {statusIcon}
        </div>

        <div className="space-y-1 w-full">
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-3 mb-1.5">
              <h3 className="font-['Manrope'] text-[16px] font-bold text-indigo-950 leading-tight">
                {type}
              </h3>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide whitespace-nowrap ${getStatusStyle(status)}`}>
                {formatStatusText(status)}
              </span>
            </div>
            
            {studentName || studentId ? (
              <div className="mt-1 space-y-0.5 mb-1">
                {studentName && (
                  <div className="flex items-center gap-1.5 text-[14px]">
                     <FiUser className="text-slate-400 stroke-[2.5px]" size={14}/>
                     <span className="font-bold text-slate-700">{studentName}</span>
                  </div>
                )}
                {studentId && (
                  <div className="flex items-center gap-1.5 text-[13px]">
                     <FiInfo className="text-slate-400 stroke-[2px]" size={14}/>
                     <span className="font-medium text-slate-500">ID: {studentId}</span>
                  </div>
                )}
              </div>
            ) : null}
            
            {description ? (
              <p className="mt-1 text-[14px] font-medium text-slate-500 line-clamp-2 max-w-3xl leading-relaxed">
                {description}
              </p>
            ) : null}
            
            <div className="mt-2.5 text-[13px] font-medium text-slate-400">
              {isComplaint ? `Created Date: ${date}` : `Submitted Date: ${date}`}
            </div>
          </div>
        </div>
      </div>

      {/* Right Area: Action Button */}
      <div className="flex md:flex-col items-center justify-center shrink-0 border-t border-slate-200/60 md:border-0 pt-4 md:pt-0 mt-2 md:mt-0 relative z-10 w-full md:w-auto">
        <button 
          onClick={() => onViewDetails(id)}
          className="flex items-center justify-center gap-1.5 w-full md:w-auto text-[14px] font-semibold bg-indigo-800 text-white px-7 py-2.5 rounded-full shadow-md shadow-[#2a266f]/20 hover:bg-[#201d54] transition-all duration-300 transform active:scale-95 group-hover:scale-[1.02]"
        >
          View Details
          <FiChevronRight size={16} className="stroke-[2.5px] transition-transform group-hover:translate-x-1" />
        </button>
      </div>

    </div>
  );
};

export default RecordCard;