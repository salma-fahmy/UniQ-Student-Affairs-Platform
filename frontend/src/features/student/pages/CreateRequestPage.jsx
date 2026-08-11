import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiClock, FiDollarSign } from 'react-icons/fi';
import useAuth from '../../auth/useAuth';
import { fetchRequestTypes } from '../requestService';

const formatPrice = (price) => {
  const num = Number(price);
  if (Number.isNaN(num)) return 'Free';
  return num === 0 ? 'Free' : `${num.toLocaleString()} EGP`;
};

// Replace ONLY the RequestTypeCard component in CreateRequestPage.jsx.
// Only the card background color changes — all logic and functionality identical.

const RequestTypeCard = ({ requestType, onSelect }) => {
  const isFree = Number(requestType.price) === 0;

  return (
    <button
      type="button"
      onClick={() => onSelect(requestType)}
      className="group relative w-full text-left rounded-2xl overflow-hidden
                 shadow-lg hover:shadow-2xl
                 hover:-translate-y-2
                 transition-all duration-300"
      style={{
        background: 'radial-gradient(circle at top left, rgba(79,70,229,0.06), transparent 40%), radial-gradient(circle at bottom right, rgba(6,182,212,0.04), transparent 40%), #f8f9ff',
      }}
    >
      {/* Content */}
      <div className="p-6 flex flex-col gap-3">

        {/* English title */}
        <h3 className="font-playfair text-[17px] font-semibold text-indigo-900 leading-snug">
          {requestType.name}
        </h3>

        {/* Arabic name */}
        {requestType.name_ar && (
          <p className="text-[13px] font-medium text-gray-500 text-right leading-snug" dir="rtl">
            {requestType.name_ar}
          </p>
        )}

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 mt-1">
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[12px] font-bold
            ${isFree
              ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-100'
              : 'bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-100'}`}
          >
            <FiDollarSign size={11} className="stroke-[2.5px]" />
            {formatPrice(requestType.price)}
          </span>

          {requestType.processing_days != null && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[12px] font-bold
                             bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-100">
              <FiClock size={11} className="stroke-[2.5px]" />
              {requestType.processing_days}d
            </span>
          )}

          {requestType.requires_approval && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[12px] font-bold
                             bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-100">
              Approval
            </span>
          )}
        </div>

        {/* CTA */}
        <div className="text-indigo-800 font-semibold text-sm inline-flex items-center gap-2
                        group-hover:gap-3 transition-all duration-300 mt-2">
          Apply now
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      {/* Animated bottom gradient bar */}
      <div className="absolute bottom-0 left-0 w-full h-1
                      bg-gradient-to-r from-[#f9f8ff] via-[#c1b8e6] to-[#aba4da]
                      scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
    </button>
  );
};
// ─── Skeleton ────────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-3 animate-pulse">
    <div className="h-5 bg-slate-100 rounded-full w-3/4" />
    <div className="h-3 bg-slate-100 rounded-full w-1/2 ml-auto" />
    <div className="flex gap-2 mt-1">
      <div className="h-6 w-16 bg-slate-100 rounded-full" />
      <div className="h-6 w-12 bg-slate-100 rounded-full" />
    </div>
    <div className="h-4 bg-slate-100 rounded-full w-24 mt-2" />
  </div>
);

// ─── Main Page ───────────────────────────────────────────────────────────────
const CreateRequestPage = () => {
  const { accessToken, isAuthReady } = useAuth();
  const navigate = useNavigate();

  const [requestTypes, setRequestTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!isAuthReady || !accessToken) return;
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const types = await fetchRequestTypes(accessToken);
        if (mounted) setRequestTypes(types);
      } catch (err) {
        console.error('Failed to load request types:', err);
        if (mounted) setError('Failed to load request types. Please try again later.');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [accessToken, isAuthReady]);

  const filtered = requestTypes.filter((rt) => {
    const q = search.toLowerCase();
    return (
      rt.name?.toLowerCase().includes(q) ||
      rt.name_ar?.toLowerCase().includes(q) ||
      rt.code?.toLowerCase().includes(q)
    );
  });

  const handleSelectType = (requestType) => {
    navigate(
      `/dashboard/student/requests/new/${requestType.code}`,
      { state: { requestType } },
    );
  };

  return (
    <div className="bg-slate-50 md:bg-slate-50 md:shadow-sm md:rounded-[32px] md:border border-slate-200
                    p-4 md:p-8 min-h-full flex flex-col pt-6 md:pt-8">

      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center justify-center w-10 h-10 rounded-full bg-white
                       text-slate-500 shadow-sm border border-slate-200
                       hover:bg-slate-100 hover:text-indigo-900 transition-all duration-300"
          >
            <FiArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h1 className="font-['Manrope'] text-2xl md:text-[32px] font-bold text-indigo-950 tracking-tight leading-tight">
              New Request
            </h1>
            <p className="text-slate-500 mt-1 text-[14px] md:text-[15px] font-medium">
              Select a request type to get started
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search request types..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-slate-200 bg-white text-sm
                       font-medium text-slate-700 shadow-sm placeholder:text-slate-400
                       focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300
                       transition-all duration-200"
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : error ? (
        <div className="bg-rose-50 text-rose-600 p-6 rounded-xl text-center font-bold
                        shadow-sm border border-rose-100">
          {error}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white border
                        border-slate-100 rounded-xl shadow-sm">
          <div className="w-20 h-20 mb-4 bg-slate-50 rounded-full flex items-center justify-center">
            <FiDollarSign size={36} className="text-slate-300" />
          </div>
          <p className="text-slate-500 font-medium text-lg">No request types found</p>
          <p className="text-slate-400 text-sm mt-1">
            {search ? `No results for "${search}"` : 'No request types are available right now.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map((rt) => (
            <RequestTypeCard
              key={rt.code ?? rt.request_type_id}
              requestType={rt}
              onSelect={handleSelectType}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CreateRequestPage;