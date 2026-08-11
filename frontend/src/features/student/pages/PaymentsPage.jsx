import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiArrowLeft, FiAlertTriangle, FiBookOpen,
  FiCalendar, FiHash, FiClock, FiDollarSign,
} from 'react-icons/fi';
import useAuth from '../../auth/useAuth';
import {
  fetchStudentProfile,
  fetchStudentPayments,
  fetchStudentFailedCourses,
} from '../studentService';
import StudentStatsGrid from '../components/StudentStatsGrid';
import DashboardCard from '../../../Components/Dashboard/DashboardCard';

// ─── Helpers ────────────────────────────────────────────────────────────────

const formatCurrency = (value) => {
  const num = Number(value);
  if (Number.isNaN(num)) return '—';
  return `${num.toLocaleString()} EGP`;
};

const formatDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
};

const StatusBadge = ({ status }) => {
  const styles = {
    paid:    'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-100',
    pending: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-100',
    failed:  'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-100',
  };
  const label = status ? status.charAt(0).toUpperCase() + status.slice(1) : '—';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold
      ${styles[status?.toLowerCase()] ?? 'bg-slate-100 text-slate-600'}`}>
      {label}
    </span>
  );
};

// ─── Failed Courses Card ─────────────────────────────────────────────────────

const FailedCoursesCard = ({ courses, loading }) => {
  const totalDue = courses.length * 100;

  return (
    <DashboardCard
      title="Failed Courses & Dues"
      subtitle={courses.length > 0 ? `${courses.length} course${courses.length > 1 ? 's' : ''} · ${formatCurrency(totalDue)} total due` : 'No failed courses'}
      titleClassName="text-indigo-900 font-bold text-xl"
    >
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
        </div>
      ) : courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 gap-3">
          <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center">
            <FiBookOpen size={24} className="text-emerald-500" />
          </div>
          <p className="text-slate-500 font-semibold">No failed courses</p>
          <p className="text-slate-400 text-sm">You have no outstanding course failure dues.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-rose-100 overflow-hidden">

          {/* ── Course rows ── */}
          <div className="divide-y divide-rose-100">
            {courses.map((item, index) => (
              <div
                key={`${item.course?.course_code ?? index}`}
                className="flex items-center justify-between gap-4 px-5 py-4 bg-rose-50/40"
              >
                {/* Left: icon + info */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="shrink-0 w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center">
                    <FiAlertTriangle size={15} className="text-rose-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[14px] font-bold text-indigo-950 truncate">
                      {item.course?.course_name_en ?? '—'}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5 mt-1">
                      <span className="flex items-center gap-1 text-[12px] font-medium text-slate-400">
                        <FiHash size={10} />
                        {item.course?.course_code ?? '—'}
                      </span>
                      <span className="flex items-center gap-1 text-[12px] font-medium text-slate-400">
                        <FiClock size={10} />
                        {item.course?.credit_hours ?? '—'} hrs
                      </span>
                      <span className="flex items-center gap-1 text-[12px] font-medium text-slate-400">
                        <FiCalendar size={10} />
                        {item.academic_semester?.semester_name ?? '—'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: amount */}
                <div className="shrink-0 text-right">
                  <p className="text-[15px] font-bold text-rose-600">100 EGP</p>
                  <p className="text-[11px] font-medium text-slate-400">per course</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Total row ── */}
          <div className="flex items-center justify-between px-5 py-3.5 bg-indigo-900">
            <span className="text-[13.5px] font-bold text-white">Total Failure Dues</span>
            <span className="text-[15px] font-bold text-white">{formatCurrency(totalDue)}</span>
          </div>

        </div>
      )}
    </DashboardCard>
  );
};

// ─── Transactions Card ────────────────────────────────────────────────────────

const TransactionsCard = ({ payments, loading }) => (
  <DashboardCard
    title="Payment History"
    subtitle="All your transactions"
    titleClassName="text-indigo-900 font-bold text-xl"
  >
    {loading ? (
      <div className="flex justify-center py-8">
        <div className="w-8 h-8 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    ) : payments.length === 0 ? (
      <div className="flex flex-col items-center justify-center py-10 gap-3">
        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
          <FiDollarSign size={24} className="text-slate-300" />
        </div>
        <p className="text-slate-500 font-semibold">No transactions yet</p>
      </div>
    ) : (
      <>
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100">
                {['Payment #', 'Request Type', 'Description', 'Date', 'Amount', 'Status'].map((h) => (
                  <th key={h} className="pb-3 text-[12px] font-bold text-slate-400 uppercase tracking-wider pr-4 last:pr-0">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {payments.map((p) => (
                <tr key={p.payment_number} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 pr-4 text-[13px] font-mono font-semibold text-indigo-700 whitespace-nowrap">
                    {p.payment_number}
                  </td>
                  <td className="py-3.5 pr-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">
                    {p.request?.request_type?.name ?? '—'}
                  </td>
                  <td className="py-3.5 pr-4 text-[13px] text-slate-500 max-w-[200px] truncate">
                    {p.request?.description ?? '—'}
                  </td>
                  <td className="py-3.5 pr-4 text-[13px] text-slate-500 whitespace-nowrap">
                    {formatDate(p.payment_date)}
                  </td>
                  <td className="py-3.5 pr-4 text-[13px] font-bold text-indigo-900 whitespace-nowrap">
                    {formatCurrency(p.amount)}
                  </td>
                  <td className="py-3.5">
                    <StatusBadge status={p.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 md:hidden">
          {payments.map((p) => (
            <div key={p.payment_number}
              className="flex flex-col gap-2 p-4 rounded-2xl border border-slate-100 bg-slate-50/60">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-mono font-bold text-indigo-700">{p.payment_number}</span>
                <StatusBadge status={p.status} />
              </div>
              <p className="text-[14px] font-bold text-slate-800">
                {p.request?.request_type?.name ?? '—'}
              </p>
              {p.request?.description && (
                <p className="text-[13px] text-slate-500">{p.request.description}</p>
              )}
              <div className="flex items-center justify-between mt-1">
                <span className="text-[12px] text-slate-400">{formatDate(p.payment_date)}</span>
                <span className="text-[15px] font-bold text-indigo-900">{formatCurrency(p.amount)}</span>
              </div>
            </div>
          ))}
        </div>
      </>
    )}
  </DashboardCard>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

const PaymentsPage = () => {
  const navigate = useNavigate();
  const { accessToken, isAuthReady } = useAuth();

  const [profile, setProfile]             = useState(null);
  const [payments, setPayments]           = useState([]);
  const [failedCourses, setFailedCourses] = useState([]);
  const [loadingStats, setLoadingStats]   = useState(true);
  const [loadingPayments, setLoadingPayments] = useState(true);
  const [loadingFailed, setLoadingFailed] = useState(true);

  useEffect(() => {
    if (!isAuthReady || !accessToken) return;
    let mounted = true;

    const load = async () => {
      const [profileRes, paymentsRes, failedRes] = await Promise.allSettled([
        fetchStudentProfile(accessToken),
        fetchStudentPayments(accessToken),
        fetchStudentFailedCourses(accessToken),
      ]);

      if (!mounted) return;

      setProfile(profileRes.status === 'fulfilled' ? profileRes.value : null);
      setLoadingStats(false);

      setPayments(
        paymentsRes.status === 'fulfilled' && Array.isArray(paymentsRes.value)
          ? paymentsRes.value : [],
      );
      setLoadingPayments(false);

      setFailedCourses(
        failedRes.status === 'fulfilled' && Array.isArray(failedRes.value)
          ? failedRes.value : [],
      );
      setLoadingFailed(false);
    };

    load();
    return () => { mounted = false; };
  }, [accessToken, isAuthReady]);

  const feesDue          = Number(profile?.student?.fees_due ?? 0);
  const failureDues      = failedCourses.length * 100;
  const totalOutstanding = feesDue + failureDues;

  const statItems = [
    {
      title: 'Total Outstanding',
      value: loadingStats || loadingFailed ? '...' : formatCurrency(totalOutstanding),
      accent: totalOutstanding > 0 ? 'rose' : 'emerald',
      titleClassName: "font-['Manrope'] !text-[15px] !text-indigo-900",
    },
    {
      title: 'Tuition Fees Due',
      value: loadingStats ? '...' : formatCurrency(feesDue),
      accent: feesDue > 0 ? 'amber' : 'emerald',
      titleClassName: "font-['Manrope'] !text-[15px] !text-indigo-900",
    },
    {
      title: 'Failure Dues',
      value: loadingFailed ? '...' : formatCurrency(failureDues),
      accent: failureDues > 0 ? 'rose' : 'emerald',
      titleClassName: "font-['Manrope'] !text-[15px] !text-indigo-900",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center justify-center w-10 h-10 rounded-full bg-white
                     text-slate-500 shadow-sm border border-slate-200
                     hover:bg-slate-100 hover:text-indigo-900 transition-all duration-300 shrink-0"
        >
          <FiArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        </button>
        <div>
          <h1 className="font-['Manrope'] text-2xl md:text-[32px] font-bold text-indigo-950 tracking-tight leading-tight">
            Dues & Payments
          </h1>
          <p className="text-slate-500 mt-0.5 text-[14px] font-medium">
            Your payment history and outstanding dues
          </p>
        </div>
      </div>

      <StudentStatsGrid items={statItems} />

      <div className="flex flex-col gap-6">
        <FailedCoursesCard courses={failedCourses} loading={loadingFailed} />
        <TransactionsCard payments={payments} loading={loadingPayments} />
      </div>
    </div>
  );
};

export default PaymentsPage;