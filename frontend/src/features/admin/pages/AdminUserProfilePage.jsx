import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FiArrowLeft,
  FiBook,
  FiBriefcase,
  FiCalendar,
  FiClock,
  FiEdit3,
  FiInfo,
  FiSave,
  FiShield,
  FiUser,
  FiX,
} from 'react-icons/fi';

import useAuth from '../../auth/useAuth';
import AuthGateLoader from '../../../Components/Shared/AuthGateLoader';
import Avatar from '../../../Components/Shared/Avatar';
import EditableAvatar from '../../../Components/Shared/EditableAvatar';
import Button from '../../../Components/Shared/Button';
import FormField from '../../../Components/Shared/FormField';
import {
  ProfileSection,
  SectionCell,
  SidebarItem,
  formatDate,
  formatDateTime,
} from '../../../pages/Profile/ProfileShared';

import {
  fetchAdminUserDetails,
  formatAdminMoney,
  formatDateInputValue,
  updateAdminUserProfile,
} from '../adminService';

const EDITABLE_FIELDS = [
  'first_name',
  'second_name',
  'third_name',
  'fourth_name',
  'email',
  'phone',
  'birth',
  'address',
  'is_active',
];

const createFormState = (source = {}) => ({
  first_name: source.first_name || '',
  second_name: source.second_name || '',
  third_name: source.third_name || '',
  fourth_name: source.fourth_name || '',
  email: source.email || '',
  phone: source.phone || '',
  birth: formatDateInputValue(source.birth),
  address: source.address || '',
  is_active: source.is_active ?? false,
});

const buildPayload = (currentState, originalState) => {
  const payload = {};

  EDITABLE_FIELDS.forEach((fieldName) => {
    const currentValue = fieldName === 'is_active'
      ? Boolean(currentState[fieldName])
      : String(currentState[fieldName] ?? '').trim();

    const originalValue = fieldName === 'is_active'
      ? Boolean(originalState[fieldName])
      : String(originalState[fieldName] ?? '').trim();

    if (currentValue !== originalValue) {
      payload[fieldName] = currentValue;
    }
  });

  return payload;
};

const formatStudentContactName = (studentUser = {}) =>
  [studentUser.first_name, studentUser.second_name].filter(Boolean).join(' ').trim() || '-';

const buildStudentInfoRows = (student = {}) => {
  const academicContact = student.academic_staff?.staff?.user || {};

  return [
    { label: 'status', value: student.status || '-' },
    { label: 'fees due', value: formatAdminMoney(student.fees_due) },
    { label: 'program', value: student.program?.program_name_en || student.program?.program_name_ar || '-' },
    { label: 'enrollment date', value: formatDate(student.enrollment_date) },
    { label: 'country', value: student.country || '-' },
    { label: 'secondary school', value: student.secondary_school || '-' },
    { label: 'secondary grade', value: student.secondary_grade ?? '-' },
    { label: 'secondary qualification', value: student.secondary_qualification || '-' },
    { label: 'academic contact', value: formatStudentContactName(academicContact) },
  ];
};

const AdminUserProfilePage = ({ startInEditMode = false }) => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { accessToken, isAuthReady } = useAuth();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [isEditing, setIsEditing] = useState(startInEditMode);
  const [formState, setFormState] = useState(createFormState());
  const originalFormRef = useRef(createFormState());

  const editRoute = `/dashboard/admin/users/${userId}/edit`;
  const viewRoute = `/dashboard/admin/users/${userId}`;

  useEffect(() => {
    setIsEditing(startInEditMode);
  }, [startInEditMode, userId]);

  useEffect(() => {
    if (!isAuthReady || !accessToken || !userId) {
      return;
    }

    let isMounted = true;

    const loadUserDetails = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await fetchAdminUserDetails(userId, accessToken);

        if (!isMounted) return;

        setUser(response);

        const nextFormState = createFormState(response);
        setFormState(nextFormState);
        originalFormRef.current = nextFormState;
      } catch {
        if (isMounted) {
          setError('unable to load user details.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadUserDetails();

    return () => {
      isMounted = false;
    };
  }, [accessToken, isAuthReady, userId]);

  useEffect(() => {
    if (!notice) return undefined;

    const timer = setTimeout(() => {
      setNotice('');
    }, 3500);

    return () => clearTimeout(timer);
  }, [notice]);

  const student = user?.student || null;
  const staff = user?.staff || null;
  const academicStaff = student?.academic_staff?.staff?.user || staff?.academic_staff || null;

  const fullName = user?.fullName || 'User';
  const shortName = user?.shortName || fullName;
  const avatar = user?.avatar || '';

  const summaryItems = useMemo(() => {
    if (!user) return [];

    return [
      {
        label: 'account status',
        icon: FiShield,
        value: user.accountStatus,
        isBadge: true,
      },
      {
        label: 'role',
        icon: FiInfo,
        value: user.roleLabel,
      },
      {
        label: 'last login',
        icon: FiClock,
        value: user.last_login || user.lastLogin ? formatDateTime(user.last_login || user.lastLogin) : 'never',
      },
      {
        label: 'user id',
        icon: FiUser,
        value: user.user_id || user.userId || '-',
      },
    ];
  }, [user]);

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormState((currentState) => ({
      ...currentState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (!userId || !accessToken) {
      return;
    }

    const payload = buildPayload(formState, originalFormRef.current);

    if (Object.keys(payload).length === 0) {
      setNotice('no changes to save.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      await updateAdminUserProfile(userId, payload, accessToken);
      const refreshedUser = await fetchAdminUserDetails(userId, accessToken);

      setUser(refreshedUser);

      const nextFormState = createFormState(refreshedUser);
      setFormState(nextFormState);
      originalFormRef.current = nextFormState;
      setIsEditing(false);
      setNotice('profile updated successfully.');
      navigate(viewRoute, { replace: true });
    } catch {
      setError('unable to save changes. please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpdated = async (imageUrl) => {
    if (!userId || !accessToken) {
      return;
    }

    try {
      await updateAdminUserProfile(userId, { photo_url: imageUrl }, accessToken);
      const refreshedUser = await fetchAdminUserDetails(userId, accessToken);

      setUser(refreshedUser);

      const nextFormState = createFormState(refreshedUser);
      setFormState(nextFormState);
      originalFormRef.current = nextFormState;
      setNotice('photo updated successfully.');
    } catch {
      setError('unable to update photo. please try again.');
      throw new Error('unable to update photo. please try again.');
    }
  };

  if (!isAuthReady) {
    return <AuthGateLoader title="loading user profile" subtitle="fetching user details..." />;
  }

  if (loading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center p-8">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-[5px] border-slate-200 border-t-indigo-600" />
          <span className="text-sm font-semibold tracking-wide text-slate-400">loading profile...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-center text-rose-500">{error}</div>;
  }

  if (!user) {
    return <div className="p-8 text-center text-slate-500">no user details available.</div>;
  }

  return (
    <section className="min-h-[calc(100vh-80px)] border-t border-slate-200 bg-[#f0f4f8] py-8">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <div className="mb-8 flex flex-col gap-4 px-2 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <button
              type="button"
              onClick={() => navigate('/dashboard/admin/users')}
              className="mb-3 inline-flex items-center gap-2 text-[14px] font-medium text-slate-500 transition-colors hover:text-indigo-700"
            >
              <FiArrowLeft className="h-4 w-4" /> back to users
            </button>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-indigo-500">
              admin user profile
            </p>
            <h1 className="mt-2 text-[28px] font-bold text-indigo-950">
              {isEditing ? 'edit profile' : 'user details'}
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-500">
              review the user account, inspect their profile data, and edit only the fields allowed by the backend.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {!isEditing ? (
              <Button
                type="button"
                onClick={() => navigate(editRoute)}
                className="px-5 py-3"
              >
                <FiEdit3 size={16} />
                edit profile
              </Button>
            ) : (
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate(viewRoute, { replace: true })}
                className="px-5 py-3"
              >
                <FiX size={16} />
                cancel edit
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[320px_1fr]">
          <div className="w-full overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
            <div className="h-[140px] bg-gradient-to-b from-[#EAE1F9] to-[#F4F1FD]" />

            <div className="relative -mt-[60px] flex flex-col items-center border-b border-slate-100/80 pb-6">
              {isEditing ? (
                <EditableAvatar
                  src={avatar}
                  alt={shortName}
                  accessToken={accessToken}
                  onPhotoUpdated={handlePhotoUpdated}
                />
              ) : (
                <Avatar src={avatar} alt={shortName} size="xl" />
              )}

              {isEditing && (
                <p className="mt-2 text-center text-[12px] font-medium text-slate-500">
                  click the avatar to update the photo.
                </p>
              )}

              <h2 className="mt-2 text-[20px] font-bold text-indigo-950">{shortName}</h2>
              <p className="mt-1 text-[13px] font-medium text-slate-500">{user.roleLabel}</p>
            </div>

            <div className="flex flex-col divide-y divide-slate-50 py-2">
              {summaryItems.map((item) => (
                <SidebarItem
                  key={item.label}
                  Icon={item.icon}
                  label={item.label}
                  value={item.value}
                  isBadge={item.isBadge}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <ProfileSection title="basic information" icon={FiUser}>
              <div className="grid grid-cols-1 divide-slate-100 border-b border-slate-100 md:grid-cols-2 md:divide-x md:divide-y-0">
                <SectionCell label="full name" value={fullName} />
                <SectionCell label="user id" value={user.user_id || user.userId || '-'} />
              </div>

              <div className="grid grid-cols-1 divide-slate-100 border-b border-slate-100 md:grid-cols-2 md:divide-x md:divide-y-0">
                <SectionCell label="email address" value={user.email || '-'} />
                <SectionCell label="phone number" value={user.phone || '-'} isSensitive />
              </div>

              <div className="grid grid-cols-1 divide-slate-100 md:grid-cols-2 md:divide-x md:divide-y-0">
                <SectionCell label="date of birth" value={formatDate(user.birth)} />
                <SectionCell label="address" value={user.address || '-'} />
              </div>
            </ProfileSection>

            <ProfileSection title="audit information" icon={FiCalendar}>
              <div className="grid grid-cols-1 divide-slate-100 border-b border-slate-100 md:grid-cols-2 md:divide-x md:divide-y-0">
                <SectionCell label="created at" value={formatDateTime(user.created_at || user.createdAt)} />
                <SectionCell label="updated at" value={formatDateTime(user.updated_at || user.updatedAt)} />
              </div>

              <div className="grid grid-cols-1 divide-slate-100 md:grid-cols-2 md:divide-x md:divide-y-0">
                <SectionCell label="last login" value={formatDateTime(user.last_login || user.lastLogin)} />
                <SectionCell label="account state" value={user.accountStatus} badge={user.accountStatus} />
              </div>
            </ProfileSection>

            {student && (
              <ProfileSection title="student information" icon={FiBook}>
                <div className="grid grid-cols-1 divide-slate-100 border-b border-slate-100 md:grid-cols-2 md:divide-x md:divide-y-0">
                  <SectionCell label="program" value={student.program?.program_name_en || student.program?.program_name_ar || '-'} />
                  <SectionCell label="student status" value={student.status || '-'} badge={student.status || '-'} />
                </div>

                <div className="grid grid-cols-1 divide-slate-100 border-b border-slate-100 md:grid-cols-2 md:divide-x md:divide-y-0">
                  <SectionCell label="fees due" value={formatAdminMoney(student.fees_due)} />
                  <SectionCell label="enrollment date" value={formatDate(student.enrollment_date)} />
                </div>

                <div className="grid grid-cols-1 divide-slate-100 md:grid-cols-2 md:divide-x md:divide-y-0">
                  <SectionCell label="secondary school" value={student.secondary_school || '-'} />
                  <SectionCell label="country" value={student.country || '-'} />
                </div>

                <div className="grid grid-cols-1 divide-slate-100 border-b border-slate-100 md:grid-cols-2 md:divide-x md:divide-y-0">
                  <SectionCell label="secondary qualification" value={student.secondary_qualification || '-'} />
                  <SectionCell label="secondary grade" value={student.secondary_grade ?? '-'} />
                </div>

                <div className="grid grid-cols-1 divide-slate-100 border-t border-slate-100 md:grid-cols-2 md:divide-x md:divide-y-0">
                  <SectionCell label="academic contact" value={academicStaff ? [academicStaff.first_name, academicStaff.second_name].filter(Boolean).join(' ') : '-'} />
                  <SectionCell label="student id" value={student.student_id || user.user_id || user.userId || '-'} />
                </div>
              </ProfileSection>
            )}

            {staff && (
              <ProfileSection title="staff information" icon={FiBriefcase}>
                <div className="grid grid-cols-1 divide-slate-100 border-b border-slate-100 md:grid-cols-2 md:divide-x md:divide-y-0">
                  <SectionCell label="job title" value={staff.job_title || '-'} />
                  <SectionCell label="department" value={staff.department || '-'} />
                </div>

                <div className="grid grid-cols-1 divide-slate-100 border-b border-slate-100 md:grid-cols-2 md:divide-x md:divide-y-0">
                  <SectionCell label="hire date" value={formatDate(staff.hire_date)} />
                  <SectionCell label="academic rank" value={staff.academic_staff?.academic_rank || '-'} />
                </div>

                <div className="grid grid-cols-1 divide-slate-100 md:grid-cols-2 md:divide-x md:divide-y-0">
                  <SectionCell label="specialization" value={staff.academic_staff?.specialization || '-'} />
                  <SectionCell label="office location" value={staff.academic_staff?.office_location || '-'} />
                </div>

                <div className="grid grid-cols-1 divide-slate-100 border-t border-slate-100 md:grid-cols-2 md:divide-x md:divide-y-0">
                  <SectionCell label="office hours" value={staff.academic_staff?.office_hours || '-'} />
                  <SectionCell label="staff user id" value={user.user_id || user.userId || '-'} />
                </div>
              </ProfileSection>
            )}

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-[16px] font-bold text-indigo-950">editable fields</h3>
                  <p className="text-sm text-slate-500">
                    only allowed profile fields can be updated here.
                  </p>
                </div>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-[12px] font-bold text-slate-600">
                  route: {isEditing ? 'edit' : 'view'}
                </span>
              </div>

              {notice && (
                <div className="mb-5 rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm font-medium text-indigo-800">
                  {notice}
                </div>
              )}

              {isEditing ? (
                <form onSubmit={handleSave} className="space-y-6">
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <FormField
                      label="first name"
                      name="first_name"
                      value={formState.first_name}
                      onChange={handleInputChange}
                      placeholder="first name"
                    />
                    <FormField
                      label="second name"
                      name="second_name"
                      value={formState.second_name}
                      onChange={handleInputChange}
                      placeholder="second name"
                    />
                    <FormField
                      label="third name"
                      name="third_name"
                      value={formState.third_name}
                      onChange={handleInputChange}
                      placeholder="third name"
                    />
                    <FormField
                      label="fourth name"
                      name="fourth_name"
                      value={formState.fourth_name}
                      onChange={handleInputChange}
                      placeholder="fourth name"
                    />
                    <FormField
                      label="email"
                      name="email"
                      type="email"
                      value={formState.email}
                      onChange={handleInputChange}
                      placeholder="name@university.edu.eg"
                    />
                    <FormField
                      label="phone"
                      name="phone"
                      value={formState.phone}
                      onChange={handleInputChange}
                      placeholder="phone number"
                    />
                    <FormField
                      label="date of birth"
                      name="birth"
                      type="date"
                      value={formState.birth}
                      onChange={handleInputChange}
                    />
                    <div className="flex flex-col space-y-1.5 w-full group">
                      <label htmlFor="is_active" className="text-sm font-medium ml-0.5 text-indigo-900">
                        account status
                      </label>
                      <select
                        id="is_active"
                        name="is_active"
                        value={formState.is_active ? 'true' : 'false'}
                        onChange={(event) => {
                          setFormState((currentState) => ({
                            ...currentState,
                            is_active: event.target.value === 'true',
                          }));
                        }}
                        className="h-[52px] w-full rounded-2xl border border-[color:var(--brand-border)] bg-[var(--brand-surface-strong)] px-4 text-base text-[var(--brand-text)] shadow-sm outline-none transition-all duration-200 focus:border-[color:var(--brand-accent)] focus:shadow-[0_0_0_4px_rgba(79,70,229,0.10)]"
                      >
                        <option value="true">active</option>
                        <option value="false">inactive</option>
                      </select>
                    </div>
                    <FormField
                      label="address"
                      name="address"
                      value={formState.address}
                      onChange={handleInputChange}
                      placeholder="address"
                      isTextArea
                    />
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-slate-500">
                      role, academic records, and uploaded photo stay read-only in this admin screen.
                    </p>

                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => navigate(viewRoute, { replace: true })}
                      >
                          cancel
                      </Button>
                      <Button
                        type="submit"
                        loading={saving}
                          loadingText="saving..."
                      >
                        <FiSave size={16} />
                          save changes
                      </Button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-sm leading-relaxed text-slate-600">
                  click <span className="font-bold text-indigo-900">edit profile</span> to update the allowed fields for this user.
                </div>
              )}

              {error && (
                <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminUserProfilePage;
