import React, { useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';
import { formatStatusText, getStatusStyle } from './recordHelpers';

const DetailsModal = ({
  isOpen,
  onClose,
  recordId,
  recordKind = 'request',
  loadRecordDetails,
}) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && recordId && loadRecordDetails) {
      const fetchDetails = async () => {
        setLoading(true);
        setError('');
        try {
          const data = await loadRecordDetails(recordId);
          setDetails(data);
        } catch {
          setError('Failed to fetch details. Please try again.');
        } finally {
          setLoading(false);
        }
      };

      fetchDetails();
    }
  }, [isOpen, recordId, loadRecordDetails]);

  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-[200] bg-slate-900/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div
        className={`fixed inset-y-0 right-0 z-[210] w-full md:w-[500px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } overflow-y-auto flex flex-col`}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-white sticky top-0 z-10">
          <h2 className="font-['Manrope'] text-xl font-bold text-[#1e1b4b]">
            {recordKind === 'request' ? 'Request Details' : 'Complaint Details'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-[#1e1b4b] bg-slate-50 hover:bg-slate-100 rounded-full transition-colors focus:outline-none"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="flex-1 p-6 bg-slate-50/50">
          {loading ? (
            <div className="flex flex-col justify-center items-center py-20">
              <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <p className="mt-4 text-slate-500 font-medium">Loading details...</p>
            </div>
          ) : error ? (
            <div className="bg-rose-50 text-rose-600 p-4 rounded-xl text-sm font-medium">
              {error}
            </div>
          ) : details ? (
            <div className="space-y-6">
              
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-1">
                <p className="text-xs font-bold text-slate-400">Title</p>
                <div className="text-lg font-bold text-[#1e1b4b] flex items-center justify-between">
                  {details.title}
                  <span className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${getStatusStyle(details.status)}`}>
                    {formatStatusText(details.status)}
                  </span>
                </div>
              </div>

              {recordKind === 'complaint' ? (
                <>
                  {details.description ? (
                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                      <p className="text-xs font-bold text-slate-400 mb-2">Complaint Text</p>
                      <p className="text-[15px] text-slate-600 leading-relaxed whitespace-pre-wrap">
                        {details.description}
                      </p>
                    </div>
                  ) : null}

                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 mb-1">Created on</p>
                    <p className="text-[15px] font-semibold text-slate-700">{details.submittedAt}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-bold text-slate-400 mb-1">Date</p>
                      <p className="text-[15px] font-semibold text-slate-700">{details.submittedAt}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 mb-1">ID</p>
                      <p className="text-[15px] font-mono text-slate-700">{details.id}</p>
                    </div>
                  </div>

                  {details.description && (
                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                      <p className="text-xs font-bold text-slate-400 mb-2">Description</p>
                      <p className="text-[15px] text-slate-600 leading-relaxed whitespace-pre-wrap">
                        {details.description}
                      </p>
                    </div>
                  )}
                </>
              )}

              {recordKind === 'complaint' ? (
                details.isResolved ? (
                  <div className="p-5 rounded-2xl border flex flex-col gap-2 shadow-sm bg-indigo-50/50 border-indigo-100">
                    <p className="text-xs font-bold text-slate-500">Resolution</p>
                    <p className="text-[13px] font-semibold text-slate-500">Resolved on {details.resolvedAt || '-'}</p>
                    {(details.solutionText || details.resolutionNote) ? (
                      <p className="text-[15px] text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">
                        {details.solutionText || details.resolutionNote}
                      </p>
                    ) : null}
                  </div>
                ) : null
              ) : details.isProcessed ? (
                <div className="p-5 rounded-2xl border flex flex-col gap-2 shadow-sm bg-emerald-50/50 border-emerald-100">
                  <p className="text-xs font-bold text-slate-500">Processed on</p>
                  <p className="text-[15px] text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">
                    {details.processedAt}
                  </p>
                </div>
              ) : null}

              {details.comments && details.comments.length > 0 && (
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                  <p className="text-xs font-bold text-slate-400 mb-4">Activity history</p>
                  <div className="flex flex-col gap-4">
                    {details.comments.map((comment, index) => (
                      <div key={index} className="flex flex-col gap-1 border-l-2 border-indigo-100 pl-4 py-1">
                        <span className="text-xs text-slate-400 font-semibold">{comment.date}</span>
                        <span className="text-[14px] text-slate-700">{comment.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default DetailsModal;
