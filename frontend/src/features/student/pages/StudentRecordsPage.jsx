import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import useAuth from '../../auth/useAuth';
import FilterBar from '../../../Components/Records/FilterBar';
import RecordCard from '../../../Components/Records/RecordCard';
import PaginationFooter from '../../../Components/Records/pagination/PaginationFooter';
import { formatStatusText } from '../../../Components/Records/recordHelpers';
import { FiArrowLeft } from 'react-icons/fi';

const normalizeRecordsResult = (result) => {
  if (Array.isArray(result)) {
    return { items: result, pagination: null };
  }

  if (!result || typeof result !== 'object') {
    return { items: [], pagination: null };
  }

  const items = Array.isArray(result.items)
    ? result.items
    : Array.isArray(result.data)
      ? result.data
      : Array.isArray(result.records)
        ? result.records
        : [];

  const pagination = result.pagination ?? result.meta?.pagination ?? null;

  return { items, pagination };
};

const StudentRecordsPage = ({
  recordKind,
  pageTitle,
  pageSubtitle,
  fetchRecords,
  emptyMessage,
  searchPlaceholder,
  categoryLabel,
  basePath = '/dashboard/student',
  enablePagination = false,
  defaultItemsPerPage = 6,
  pageSizeOptions = [6, 10, 20],
  fetchAllRecords = null,
  headerAction = null,
  excludeStatuses = ['resubmit'],
}) => {
  const { accessToken, isAuthReady } = useAuth();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [sortBy, setSortBy] = useState('latest');

  const useClientSidePagination = enablePagination && typeof fetchAllRecords === 'function';

  useEffect(() => {
    if (!isAuthReady || !accessToken || !useClientSidePagination) return;

    let isMounted = true;

    const loadAllRecords = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchAllRecords(accessToken);
        const normalizedResult = normalizeRecordsResult(data);

        if (isMounted) {
          setItems(normalizedResult.items);
          setPagination(normalizedResult.pagination);
        }
      } catch (err) {
        console.error(`Error loading ${recordKind}s:`, err);
        if (isMounted) {
          setError(`Failed to load ${pageTitle.toLowerCase()}. Please try again later.`);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadAllRecords();

    return () => { isMounted = false; };
  }, [accessToken, isAuthReady, useClientSidePagination]);

  useEffect(() => {
    if (!isAuthReady || !accessToken || useClientSidePagination) return;

    let isMounted = true;

    const loadRecords = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = enablePagination
          ? await fetchRecords(accessToken, page, itemsPerPage)
          : await fetchRecords(accessToken);

        const normalizedResult = normalizeRecordsResult(data);

        if (isMounted) {
          setItems(normalizedResult.items);
          setPagination(normalizedResult.pagination);
        }
      } catch (err) {
        console.error(`Error loading ${recordKind}s:`, err);
        if (isMounted) {
          setError(`Failed to load ${pageTitle.toLowerCase()}. Please try again later.`);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadRecords();

    return () => { isMounted = false; };
  }, [accessToken, enablePagination, isAuthReady, itemsPerPage, page, useClientSidePagination]);

  const serverTotalPages = pagination?.totalPages ?? null;

  const handleViewDetails = (id) => {
    const detailsPath = recordKind === 'complaint'
      ? `${basePath}/complaints/${id}`
      : `${basePath}/requests/${id}`;
    navigate(detailsPath);
  };

  const categories = useMemo(() => {
    const uniqueStatuses = Array.from(new Set(
      items
        .filter(item => !excludeStatuses.includes(String(item.status || '').toLowerCase()))
        .map(item => formatStatusText(item.status))
        .filter(Boolean)
    ));
    return uniqueStatuses;
  }, [items, excludeStatuses]);

  const filterTypes = useMemo(() => {
    const uniqueTypes = Array.from(new Set(
      items
        .filter(item => !excludeStatuses.includes(String(item.status || '').toLowerCase()))
        .map(item => item.title)
        .filter(Boolean)
    ));
    return uniqueTypes;
  }, [items, excludeStatuses]);

  const filteredItems = useMemo(() => {
    let result = items.filter(item => {
      if (excludeStatuses.includes(String(item.status || '').toLowerCase())) {
        return false;
      }

      const activeSearchQuery = searchQuery.toLowerCase();
      const matchesSearch = [
        item.title,
        item.description,
        item.id,
        item.status,
        item.studentName,
        item.studentId,
      ].some((field) => String(field || '').toLowerCase().includes(activeSearchQuery));

      const formattedItemStatus = formatStatusText(item.status);
      const matchesCategory = categoryFilter === 'All' || formattedItemStatus === categoryFilter;
      const matchesType = typeFilter === 'All' || item.title === typeFilter;

      return matchesSearch && matchesCategory && matchesType;
    });

    if (sortBy === 'latest') {
      result.sort((a, b) => new Date(b.submittedAt || b.createdAt || 0) - new Date(a.submittedAt || a.createdAt || 0));
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.submittedAt || a.createdAt || 0) - new Date(b.submittedAt || b.createdAt || 0));
    } else if (sortBy === 'status') {
      result.sort((a, b) => (formatStatusText(a.status) || '').localeCompare(formatStatusText(b.status) || ''));
    }

    return result;
  }, [items, searchQuery, categoryFilter, typeFilter, sortBy, excludeStatuses]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    categoryFilter !== 'All' ||
    typeFilter !== 'All';

  const showAllFilteredItemsOnOnePage = useClientSidePagination && hasActiveFilters;

  const activeTotalPages = useMemo(() => {
    if (!enablePagination) {
      return null;
    }

    if (showAllFilteredItemsOnOnePage) {
      return 1;
    }

    if (useClientSidePagination) {
      return filteredItems.length > 0
        ? Math.max(1, Math.ceil(filteredItems.length / itemsPerPage))
        : 0;
    }

    return serverTotalPages;
  }, [enablePagination, filteredItems.length, itemsPerPage, serverTotalPages, showAllFilteredItemsOnOnePage, useClientSidePagination]);

  const activePage = useMemo(() => {
    if (!enablePagination || !useClientSidePagination) {
      return page;
    }

    if (!activeTotalPages) {
      return 1;
    }

    return Math.min(page, activeTotalPages);
  }, [activeTotalPages, enablePagination, page, useClientSidePagination]);

  const visibleItems = useMemo(() => {
    if (!enablePagination) {
      return filteredItems;
    }

    if (!useClientSidePagination || showAllFilteredItemsOnOnePage) {
      return filteredItems;
    }

    if (!filteredItems.length) {
      return [];
    }

    const startIndex = (activePage - 1) * itemsPerPage;
    return filteredItems.slice(startIndex, startIndex + itemsPerPage);
  }, [activePage, enablePagination, filteredItems, itemsPerPage, showAllFilteredItemsOnOnePage, useClientSidePagination]);

  const hasPreviousPage = useClientSidePagination
    ? activePage > 1
    : pagination?.hasPreviousPage ?? page > 1;

  const hasNextPage = useClientSidePagination
    ? (activeTotalPages ? activePage < activeTotalPages : false)
    : serverTotalPages ? page < serverTotalPages : (pagination?.hasNextPage ?? items.length >= itemsPerPage);

  const handlePageChange = (nextPage) => {
    if (!enablePagination) return;
    if (nextPage < 1) return;
    if (activeTotalPages && nextPage > activeTotalPages) return;
    setPage(nextPage);
  };

  const handleItemsPerPageChange = (value) => {
    if (!enablePagination) return;
    setItemsPerPage(Number(value) || defaultItemsPerPage);
    setPage(1);
  };

  return (
    <div className="bg-slate-50 md:bg-slate-50 md:shadow-sm md:rounded-[32px] md:border border-slate-200 p-4 md:p-8 min-h-full flex flex-col pt-6 md:pt-8">

      <div className="mb-6 md:mb-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="group flex items-center justify-center w-10 h-10 rounded-full bg-white text-slate-500 shadow-sm border border-slate-200 hover:bg-slate-100 hover:text-indigo-900 transition-all duration-300 shrink-0"
            >
              <FiArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <div>
              <h1 className="font-['Manrope'] text-2xl md:text-[32px] font-bold text-indigo-950 tracking-tight leading-tight">
                {pageTitle}
              </h1>
              {pageSubtitle && (
                <p className="text-slate-500 mt-1 max-w-3xl text-[14px] md:text-[15px] font-medium">
                  {pageSubtitle}
                </p>
              )}
            </div>
          </div>

          {headerAction && (
            <div className="flex justify-start md:justify-end shrink-0">
              {headerAction}
            </div>
          )}
        </div>
      </div>

      <div className="mb-6 space-y-6">
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder={searchPlaceholder}
          categoryFilter={categoryFilter}
          categories={categories}
          onCategoryChange={setCategoryFilter}
          categoryLabel={categoryLabel}
          typeFilter={typeFilter}
          types={filterTypes}
          onTypeChange={setTypeFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        <div className="bg-transparent rounded-xl flex flex-col">
          <div className="flex flex-col gap-4 relative min-h-[300px]">
            {loading ? (
              <div className="absolute inset-0 flex justify-center items-center bg-white/50 backdrop-blur-sm rounded-xl z-10 w-full h-[60vh] md:h-[400px]">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-[5px] border-indigo-100 border-t-indigo-600 rounded-full animate-spin shadow-sm" />
                  <span className="font-bold text-slate-400 capitalize tracking-wider">Loading...</span>
                </div>
              </div>
            ) : error ? (
              <div className="bg-rose-50 text-rose-600 p-6 rounded-xl text-center font-bold shadow-sm border border-rose-100">
                {error}
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 bg-white border border-slate-100 rounded-xl shadow-sm h-full">
                <div className="w-20 h-20 mb-4 bg-slate-50 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-slate-500 font-medium text-lg">No records found</p>
                <p className="text-slate-400 text-sm mt-1">{emptyMessage}</p>
              </div>
            ) : (
              <div className="flex flex-col mb-4 bg-transparent rounded-b-xl gap-4">
                {visibleItems.map(item => (
                  <RecordCard
                    key={item.id}
                    id={item.id}
                    type={item.title}
                    date={item.submittedAt}
                    status={item.status}
                    description={item.description}
                    studentName={item.studentName}
                    studentId={item.studentId}
                    kind={recordKind}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            )}
          </div>

          {enablePagination && (useClientSidePagination ? filteredItems.length > 0 : (pagination || items.length > 0)) ? (
            <PaginationFooter
              currentPage={activePage}
              totalPages={activeTotalPages}
              itemsPerPage={itemsPerPage}
              pageSizeOptions={pageSizeOptions}
              onItemsPerPageChange={handleItemsPerPageChange}
              onPageChange={handlePageChange}
              hasPreviousPage={hasPreviousPage}
              hasNextPage={hasNextPage}
              loading={loading}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default StudentRecordsPage;