import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FiArrowLeft, FiUser, FiBriefcase, FiBookOpen,
  FiShield, FiInfo, FiCalendar, FiHash,
} from 'react-icons/fi';
import useAuth from '../../auth/useAuth';
import { fetchAllUsers } from '../adminService';
import Avatar from '../../../Components/Shared/Avatar';

// ─── helpers ──────────────────────────────────────────────────────────────────
const formatDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

const formatDateTime = (iso) => {
  if (!iso) return 'Never';
  return new Date(iso).toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
};

// ─── Primitives — identical to ProfileShared + AdminEditUserPage ──────────────

// Sidebar item — same as AdminEditUserPage's SidebarItem
const SidebarItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-4 px-8 py-4">
    <div className="text-indigo-800/80 mt-0.5">
      {Icon && <Icon size={20} strokeWidth={2} />}
    </div>
    <div className="flex flex-col text-left">
      <span className="text-[12.5px] text-slate-500 font-medium mb-1">{label}</span>
      <span className="text-[14px] font-bold text-indigo-900 leading-tight">{value || '—'}</span>
    </div>
  </div>
);

// Read-only field — visually mirrors AdminEditUserPage's DisabledField
const ReadOnlyField = ({ label, value, badge }) => {
  if (value === null || value === undefined || value === '' || value === '—') return null;
  return (
    <div className="px-6 py-5 flex flex-col justify-center h-full hover:bg-slate-50/50 transition-colors">
      <span className="text-[12.5px] text-slate-500 font-medium mb-1.5">{label}</span>
      {badge ? (
        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[12px] font-bold w-max">
          {badge}
        </span>
      ) : (
        <span className="text-[13.5px] font-bold text-indigo-900 break-words">{value}</span>
      )}
    </div>
  );
};

// Section card — same header style as AdminEditUserPage's form card
const ProfileSection = ({ title, icon: Icon, children }) => (
  <div className="mb-4 bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
    <div className="flex items-center gap-2 px-6 py-5 border-b border-slate-100">
      {Icon && (
        <div className="rounded-lg bg-indigo-50 p-2 text-indigo-700">
          <Icon size={16} />
        </div>
      )}
      <h2 className="text-[16px] font-bold text-indigo-950">{title}</h2>
    </div>
    <div className="divide-y divide-slate-100">{children}</div>
  </div>
);

// Two-column read-only row — mirrors the form grid layout
const FieldRow = ({ left, right }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
    {left}
    {right}
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
const UserDetailPage = () => {
  const { userId }      = useParams();
  const { accessToken } = useAuth();
  const navigate        = useNavigate();

  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    if (!accessToken || !userId) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchAllUsers(accessToken, { limit: 1000 })
      .then(({ items }) => {
        if (cancelled) return;
        const found = items.find((u) => u.user_id === userId);
        if (!found) setError('User not found.');
        else setUser(found);
      })
      .catch(() => { if (!cancelled) setError('Could not load user details.'); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [accessToken, userId]);

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <section className="min-h-[calc(100vh-80px)] border-t border-slate-200 bg-[#f0f4f8] py-8">
        <div className="mx-auto max-w-[1240px] px-4 md:px-8">
          <div className="mb-8 px-2">
            <div className="h-4 w-28 bg-slate-200 rounded animate-pulse mb-6" />
            <div className="h-6 w-40 bg-slate-200 rounded animate-pulse" />
          </div>
          <div className="flex flex-col items-start gap-8 lg:flex-row">
            <div className="w-full lg:w-[320px] shrink-0 rounded-2xl bg-white border border-slate-100 overflow-hidden animate-pulse">
              <div className="h-[140px] bg-slate-100" />
              <div className="flex flex-col items-center mt-[-60px] pb-6 px-4">
                <div className="w-24 h-24 rounded-full bg-slate-200 ring-4 ring-white" />
                <div className="mt-3 h-4 w-32 bg-slate-100 rounded" />
                <div className="mt-2 h-3 w-20 bg-slate-100 rounded" />
              </div>
              {[...Array(3)].map((_, i) => <div key={i} className="h-14 mx-6 mb-2 bg-slate-100 rounded-xl" />)}
            </div>
            <div className="flex-1 w-full flex flex-col gap-4">
              {[...Array(3)].map((_, i) => <div key={i} className="h-36 rounded-2xl bg-white border border-slate-100 animate-pulse" />)}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <section className="min-h-[calc(100vh-80px)] border-t border-slate-200 bg-[#f0f4f8] py-8">
        <div className="mx-auto max-w-[1240px] px-4 md:px-8 space-y-4">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-700 transition-colors font-medium">
            <FiArrowLeft size={16} /> Back
          </button>
          <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
        </div>
      </section>
    );
  }

  // ── Derived values ────────────────────────────────────────────────────────
  const role      = user.role?.role_name ?? '';
  const fullName  = [user.first_name, user.second_name, user.third_name, user.fourth_name].filter(Boolean).join(' ');
  const shortName = [user.first_name, user.second_name].filter(Boolean).join(' ') || fullName;

  const isStudent = role === 'student';
  const isStaff   = role === 'academic_staff' || role === 'affairs_staff';

  const student = user.student ?? {};
  const staff   = user.staff   ?? {};
  const program = student.program ?? {};

  const feesDue   = student.fees_due;
  const feesBadge = !feesDue ? 'Free' : null;
  const feesValue = feesDue != null ? `${Number(feesDue).toLocaleString()} EGP` : 'Free';

  return (
    <section className="min-h-[calc(100vh-80px)] border-t border-slate-200 bg-[#f0f4f8] py-8">
      <div className="mx-auto max-w-[1240px] px-4 md:px-8">

        {/* ── Page header ──────────────────────────────────────────────── */}
        <div className="mb-8 flex flex-col gap-3 px-2">
          <button
            onClick={() => navigate('/dashboard/admin/users')}
            className="group flex w-fit items-center gap-2 text-[14px] font-medium text-slate-500 transition-colors hover:text-indigo-700"
          >
            <FiArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to Users
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-[20px] font-bold text-indigo-900">User Details</h1>
            <button
              onClick={() => navigate(`/dashboard/admin/users/${userId}/edit`)}
              className="inline-flex items-center gap-2 rounded-2xl bg-indigo-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-800"
            >
              Edit User
            </button>
          </div>
        </div>

        <div className="flex flex-col items-start gap-8 lg:flex-row">

          {/* ── Sidebar — mirrors AdminEditUserPage sidebar exactly ───────── */}
          <div className="w-full shrink-0 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_2px_15px_rgb(0,0,0,0.015)] lg:w-[320px]">

            <div className="h-[140px] bg-gradient-to-b from-[#EAE1F9] to-[#F4F1FD]" />

            {/* Name + mono ID — same as AdminEditUserPage avatar block */}
            <div className="relative mt-[-60px] flex flex-col items-center border-b border-slate-100/80 pb-6 px-4 text-center">
              <Avatar src={user.photo_url} alt={fullName} name={fullName} size="xl" className="ring-4 ring-white shadow-md" />
              <h2 className="mt-2 text-[18px] font-bold text-indigo-950">{shortName}</h2>
              <p className="mt-1 font-mono text-[12px] text-slate-400">{user.user_id}</p>
            </div>

            {/* Same three SidebarItems as AdminEditUserPage — Role, SSN, Account Status */}
            <div className="flex flex-col divide-y divide-slate-50 py-2">
              <SidebarItem icon={FiShield} label="Role"           value={role}                                    />
              <SidebarItem icon={FiHash}   label="SSN"            value={user.ssn?.trim()}                        />
              <SidebarItem icon={FiUser}   label="Account Status" value={user.is_active ? 'Active' : 'Inactive'}  />
            </div>
          </div>

          {/* ── Main content — read-only version of the edit form ─────────── */}
          <div className="flex-1 w-full">

            {/* Personal Information — mirrors "Editable Information" card */}
            <ProfileSection title="Personal Information" icon={FiUser}>
              <ReadOnlyField label="Full Name" value={fullName} />
              <FieldRow
                left={<ReadOnlyField  label="Email Address" value={user.email}             />}
                right={<ReadOnlyField label="Phone Number"  value={user.phone}             />}
              />
              <FieldRow
                left={<ReadOnlyField  label="Date of Birth" value={formatDate(user.birth)} />}
                right={<ReadOnlyField label="Address"       value={user.address}           />}
              />
            </ProfileSection>

            {/* Student — Academic Information */}
            {isStudent && (
              <ProfileSection title="Academic Information" icon={FiBookOpen}>
                <FieldRow
                  left={<ReadOnlyField  label="Program"       value={program.program_name_en}              />}
                  right={<ReadOnlyField label="Academic Status" value={student.status}                     />}
                />
                <FieldRow
                  left={<ReadOnlyField  label="University ID" value={student.student_id || user.user_id}  />}
                  right={<ReadOnlyField label="Fees Due"      value={feesValue} badge={feesBadge}         />}
                />
              </ProfileSection>
            )}

            {/* Staff — Staff Information */}
            {isStaff && (
              <ProfileSection title="Staff Information" icon={FiBriefcase}>
                <FieldRow
                  left={<ReadOnlyField  label="Job Title"   value={staff.job_title}  />}
                  right={<ReadOnlyField label="Department"  value={staff.department} />}
                />
              </ProfileSection>
            )}

            {/* Info note */}
            <div className="mt-2 flex items-start gap-3 rounded-2xl border border-indigo-100/50 bg-indigo-50/50 p-5 text-indigo-800">
              <FiInfo size={20} className="mt-0.5 shrink-0" />
              <p className="text-sm font-medium leading-relaxed">
                This is a read-only view. To make changes, click <span className="font-bold">Edit User</span> above.
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default UserDetailPage;