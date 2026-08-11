import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiChevronRight, FiEdit3 } from 'react-icons/fi';
import useAuth from '../../auth/useAuth';
import FilterBar from '../../../Components/Records/FilterBar';
import Avatar from '../../../Components/Shared/Avatar';
import Button from '../../../Components/Shared/Button';
import { fetchAllUsers } from '../adminService';

// ─── constants ────────────────────────────────────────────────────────────────
const ROLE_TABS = [
  { value: 'All',            label: 'All'            },
  { value: 'student',        label: 'Students'       },
  { value: 'academic_staff', label: 'Academic Staff' },
  { value: 'affairs_staff',  label: 'Affairs Staff'  },
];

const ROLE_META = {
  student:        { label: 'Student',        color: 'bg-indigo-50 text-indigo-700' },
  academic_staff: { label: 'Academic Staff', color: 'bg-sky-50 text-sky-700'       },
  affairs_staff:  { label: 'Affairs Staff',  color: 'bg-amber-50 text-amber-700'   },
};

const getUserDescription = (user) => {
  const role = user.role?.role_name;
  if (role === 'student') return user.student?.program?.program_name_en ?? '—';
  if (role === 'academic_staff' || role === 'affairs_staff') return user.staff?.job_title ?? '—';
  return '—';
};

const Th = ({ children, className = '' }) => (
  <th className={`px-5 py-4 text-left text-[13px] font-bold text-indigo-900 tracking-widest uppercase ${className}`}>
    {children}
  </th>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
const UsersManagementPage = () => {
  const { accessToken, isAuthReady } = useAuth();
  const navigate = useNavigate();

  const [allUsers,    setAllUsers]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages,  setTotalPages]  = useState(1);
  const [totalItems,  setTotalItems]  = useState(0);
  const LIMIT = 20;

  const [searchQuery,    setSearchQuery]    = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [typeFilter,     setTypeFilter]     = useState('All');
  const [sortBy,         setSortBy]         = useState('latest');

  // ── fetch ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isAuthReady || !accessToken) return;
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const role = categoryFilter === 'All' ? '' : categoryFilter;
        const result = await fetchAllUsers(accessToken, { page: currentPage, limit: LIMIT, role });
        if (cancelled) return;
        setAllUsers(result.items);
        setTotalPages(result.pagination.totalPages);
        setTotalItems(result.pagination.total);
      } catch {
        if (!cancelled) setError('Failed to load users. Please try again.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [accessToken, isAuthReady, currentPage, categoryFilter]);

  useEffect(() => { setCurrentPage(1); }, [categoryFilter]);

  // ── derived ─────────────────────────────────────────────────────────────────
  const typeOptions = useMemo(() => {
    const set = new Set(
      allUsers.map((u) => {
        const role = u.role?.role_name;
        if (role === 'student') return u.student?.program?.program_name_en;
        return [u.staff?.job_title, u.staff?.department].filter(Boolean).join(' · ') || null;
      }).filter(Boolean),
    );
    return [...set].sort();
  }, [allUsers]);

  const filteredUsers = useMemo(() => {
    let result = allUsers.filter((u) => {
      if (u.role?.role_name === 'admin') return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const fullName = [u.first_name, u.second_name].filter(Boolean).join(' ').toLowerCase();
        if (!fullName.includes(q) && !u.user_id?.toLowerCase().includes(q) && !u.email?.toLowerCase().includes(q)) return false;
      }
      if (typeFilter && typeFilter !== 'All') {
        const role = u.role?.role_name;
        const desc = role === 'student'
          ? u.student?.program?.program_name_en
          : [u.staff?.job_title, u.staff?.department].filter(Boolean).join(' · ');
        if (desc !== typeFilter) return false;
      }
      return true;
    });

    if (sortBy === 'latest')
      result = [...result].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    else if (sortBy === 'oldest')
      result = [...result].sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0));
    else if (sortBy === 'status')
      result = [...result].sort((a, b) => (a.is_active === b.is_active ? 0 : a.is_active ? -1 : 1));

    return result;
  }, [allUsers, searchQuery, typeFilter, sortBy]);

  const handleViewDetails = (userId) => navigate(`/dashboard/admin/users/${userId}`);

  const roleCategories = ROLE_TABS.slice(1).map((t) => ({ value: t.value, label: t.label }));

  // ── render ──────────────────────────────────────────────────────────────────
  return (
    <div className="bg-slate-50 md:bg-slate-50 md:shadow-sm md:rounded-[32px] md:border border-slate-200 p-4 md:p-8 min-h-full flex flex-col pt-6 md:pt-8">

      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center justify-center w-10 h-10 rounded-full bg-white text-slate-500 shadow-sm border border-slate-200 hover:bg-slate-100 hover:text-indigo-900 transition-all duration-300 shrink-0"
          >
            <FiArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h1 className="font-['Manrope'] text-2xl md:text-[32px] font-bold text-indigo-950 tracking-tight leading-tight">
              Users Management
            </h1>
            <p className="text-slate-500 mt-1 text-[14px] md:text-[15px] font-medium">
              {loading ? 'Loading...' : `${totalItems} users total`}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={(e) => setSearchQuery(typeof e === 'string' ? e : e.target.value)}
          searchPlaceholder="Search by name, ID, or email…"
          categoryFilter={categoryFilter}
          categories={roleCategories}
          onCategoryChange={setCategoryFilter}
          typeFilter={typeFilter}
          types={typeOptions.map((t) => ({ value: t, label: t }))}
          onTypeChange={(e) => setTypeFilter(typeof e === 'string' ? e : e.target.value)}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4">

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center h-[40vh]">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-[5px] border-indigo-100 border-t-indigo-600 rounded-full animate-spin shadow-sm" />
              <span className="font-bold text-slate-400 tracking-wider">Loading...</span>
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-rose-50 text-rose-600 p-6 rounded-2xl text-center font-bold border border-rose-100">
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filteredUsers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-100 rounded-2xl shadow-sm">
            <div className="w-20 h-20 mb-4 bg-slate-50 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-slate-500 font-semibold text-lg">No users found</p>
            <p className="text-slate-400 text-sm mt-1">Try adjusting your search or filter.</p>
          </div>
        )}

        {/* Table */}
        {!loading && !error && filteredUsers.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-[#f0f0f8] sticky top-0 z-10 border-b border-slate-200">
                  <tr className="border-b border-slate-200">
                    <Th className="pl-6">User</Th>
                    <Th className="hidden sm:table-cell">ID</Th>
                    <Th className="hidden md:table-cell">Role</Th>
                    <Th className="hidden lg:table-cell">Program / Job Title</Th>
                    <Th className="hidden sm:table-cell">Status</Th>
                    <Th className="pr-6" />
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, idx) => {
                    const role     = user.role?.role_name ?? '';
                    const meta     = ROLE_META[role] ?? { label: role, color: 'bg-slate-100 text-slate-600' };
                    const fullName = [user.first_name, user.second_name].filter(Boolean).join(' ');
                    const desc     = getUserDescription(user);
                    const avatar   = user.photo_url || '';
                    const isLast   = idx === filteredUsers.length - 1;

                    return (
                      <tr
                        key={user.user_id}
                        onClick={() => handleViewDetails(user.user_id)}
                        className={`group cursor-pointer transition-colors duration-100 hover:bg-indigo-50/50
                          ${!isLast ? 'border-b border-slate-100' : ''}`}
                      >
                        {/* User */}
                        <td className="pl-6 pr-4 py-3.5">
                          <div className="flex items-center gap-3.5">
                            <Avatar
                              src={avatar}
                              alt={fullName}
                              name={fullName}
                              size="sm"
                              className="shrink-0 ring-2 ring-slate-100"
                            />
                            <p className="text-[15px] font-bold text-indigo-950 truncate">
                              {fullName || '—'}
                            </p>
                          </div>
                        </td>

                        {/* ID */}
                        <td className="px-5 py-3.5 hidden sm:table-cell">
                          <p className="text-[15px] text-slate-400 font-mono whitespace-nowrap">
                            {user.user_id}
                          </p>
                        </td>

                        {/* Role */}
                        <td className="px-5 py-3.5 hidden md:table-cell">
                          <span className={`px-3 py-1 rounded-full text-[13px] font-semibold whitespace-nowrap ${meta.color}`}>
                            {meta.label}
                          </span>
                        </td>

                        {/* Program / Job Title */}
                        <td className="px-5 py-3.5 hidden lg:table-cell max-w-[220px]">
                          <p className="text-[13px] text-slate-500 truncate">{desc}</p>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-3.5 hidden sm:table-cell whitespace-nowrap">
                          <span className={`inline-flex items-center gap-2 text-[12.5px] font-semibold ${user.is_active ? 'text-emerald-600' : 'text-slate-400'}`}>
                            <span className={`h-2 w-2 rounded-full shrink-0 ${user.is_active ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                            {user.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>

                        {/* Action */}
                        <td className="pl-5 pr-6 py-3.5">
                          <Button
                             variant="primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetails(user.user_id);
                            }}
                            className="px-3 py-1.5 rounded-full text-[12.5px] shadow-sm hover:shadow-md transition-all duration-300 group"
                          >
                            <span className="inline-flex items-center gap-1.5">
                              Edit
                            </span>
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
            <div className="text-sm font-semibold text-slate-500">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-indigo-900 transition-colors hover:border-indigo-200 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => {
                const p = i + 1;
                const isActive = p === currentPage;
                if (p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1) {
                  return (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className={`min-w-10 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                        isActive
                          ? 'bg-indigo-800 text-white shadow-sm'
                          : 'border border-slate-200 bg-white text-indigo-900 hover:border-indigo-200 hover:bg-indigo-50'
                      }`}
                    >
                      {p}
                    </button>
                  );
                }
                if (Math.abs(p - currentPage) === 2) return <span key={p} className="px-2 text-slate-400">...</span>;
                return null;
              })}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-indigo-900 transition-colors hover:border-indigo-200 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default UsersManagementPage;