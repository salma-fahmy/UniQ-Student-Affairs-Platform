import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FiCheck, FiChevronDown } from 'react-icons/fi';

const normalizeOptions = (options = []) =>
  options
    .map((option) => {
      if (typeof option === 'string') {
        return { value: option, label: option };
      }

      if (typeof option === 'number') {
        return { value: option, label: String(option) };
      }

      if (option && typeof option === 'object') {
        return {
          value: option.value ?? option.label ?? '',
          label: option.label ?? option.value ?? '',
        };
      }

      return { value: '', label: '' };
    })
    .filter((option) => option.value !== '' && option.label !== '');

const buildVisiblePages = (currentPage, totalPages) => {
  if (!totalPages || totalPages <= 7) {
    return Array.from({ length: totalPages || 0 }, (_, index) => index + 1);
  }

  const pages = [1];
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  if (start > 2) pages.push('start-ellipsis');

  for (let pageNumber = start; pageNumber <= end; pageNumber += 1) {
    pages.push(pageNumber);
  }

  if (end < totalPages - 1) pages.push('end-ellipsis');

  pages.push(totalPages);

  return pages;
};

const PageSizeDropdown = ({ value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  const normalizedOptions = useMemo(() => normalizeOptions(options), [options]);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSelect = (nextValue) => {
    onChange(nextValue);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setIsOpen((currentState) => !currentState)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="flex h-10 min-w-[88px] items-center justify-between gap-2 rounded-full border border-indigo-100 bg-white px-4 text-left text-sm font-medium text-indigo-900 shadow-sm transition-all duration-200 hover:border-indigo-200 hover:shadow-md focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-100/50"
      >
        <span className="min-w-0 truncate">{value}</span>
        <FiChevronDown
          size={16}
          className={`shrink-0 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-indigo-600' : ''}`}
        />
      </button>

      {isOpen ? (
        <div className="absolute left-0 top-full z-50 mt-2 w-[112px] overflow-hidden rounded-2xl border border-indigo-100 bg-white shadow-[0_12px_40px_-12px_rgba(49,46,129,0.15)]">
          <div className="max-h-72 overflow-y-auto p-2">
            {normalizedOptions.map((option) => {
              const isSelected = String(option.value) === String(value);

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`flex w-full items-center justify-between rounded-[1rem] px-4 py-3 text-sm font-medium transition-colors ${
                    isSelected
                      ? 'bg-indigo-50 text-indigo-900'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span className="truncate pr-3">{option.label}</span>
                  {isSelected ? <FiCheck size={16} className="shrink-0 text-indigo-700" /> : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
};

const PaginationFooter = ({
  currentPage,
  totalPages,
  itemsPerPage,
  pageSizeOptions = [6, 10, 20],
  onItemsPerPageChange,
  onPageChange,
  hasPreviousPage,
  hasNextPage,
  loading = false,
}) => {
  const safeCurrentPage = Number(currentPage) || 1;
  const visiblePages = useMemo(() => buildVisiblePages(safeCurrentPage, totalPages), [safeCurrentPage, totalPages]);

  return (
    <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm lg:gap-2">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-600">
          <span className="whitespace-nowrap">Rows per page</span>

          <PageSizeDropdown
            value={itemsPerPage}
            options={pageSizeOptions}
            onChange={onItemsPerPageChange}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onPageChange(safeCurrentPage - 1)}
            disabled={!hasPreviousPage || loading}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-indigo-900 transition-colors hover:border-indigo-200 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>

          {visiblePages.map((pageItem) => {
            if (typeof pageItem === 'string') {
              return <span key={pageItem} className="px-2 text-slate-400">...</span>;
            }

            const isActive = pageItem === safeCurrentPage;

            return (
              <button
                key={pageItem}
                type="button"
                onClick={() => onPageChange(pageItem)}
                aria-current={isActive ? 'page' : undefined}
                disabled={loading}
                className={`min-w-10 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-indigo-800 text-white shadow-sm'
                    : 'border border-slate-200 bg-white text-indigo-900 hover:border-indigo-200 hover:bg-indigo-50'
                } disabled:cursor-not-allowed disabled:opacity-60`}
              >
                {pageItem}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => onPageChange(safeCurrentPage + 1)}
            disabled={!hasNextPage || loading}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-indigo-900 transition-colors hover:border-indigo-200 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      <div className="text-sm font-semibold text-slate-400">
        Page {safeCurrentPage}{totalPages ? ` of ${totalPages}` : ''}
      </div>
    </div>
  );
};

export default PaginationFooter;