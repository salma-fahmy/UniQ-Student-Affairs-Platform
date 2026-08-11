import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiUser, FiLock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import useAuth from '../../auth/useAuth';
import {
    fetchAdminUserDetails,
    updateAdminUser,
    updateAdminUserPhoto,
} from '../adminService';
import FormField from '../../../Components/Shared/FormField';
import EditableAvatar from '../../../Components/Shared/EditableAvatar';
import { getPhotoUploadSignature } from '../../student/studentService';

// ─── Fields the backend allows to be edited ──────────────────────────────────
const EDITABLE_FIELDS = [
    'first_name', 'second_name', 'third_name', 'fourth_name',
    'email', 'phone', 'address', 'birth', 'is_active',
];

// ─── Small helpers ────────────────────────────────────────────────────────────
const DisabledField = ({ label, value }) => (
    <div className="flex flex-col space-y-1.5 w-full">
        <label className="text-sm font-medium ml-0.5 text-slate-400 flex items-center gap-1.5">
            <FiLock size={11} />
            {label}
        </label>
        <div className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-[15px] font-medium text-slate-400 cursor-not-allowed select-none">
            {value || '-'}
        </div>
    </div>
);

const PhotoStatusMessage = ({ status }) => {
    if (!status) return null;
    const isSuccess = status === 'updated';
    return (
        <div
            className={`mt-2 flex items-center gap-1.5 text-[12px] font-medium transition-all duration-300 ${
                isSuccess ? 'text-indigo-600' : 'text-red-500'
            }`}
        >
            {isSuccess ? <FiCheckCircle size={13} /> : <FiAlertCircle size={13} />}
            {isSuccess ? 'Photo updated successfully.' : 'Failed to update photo. Please try again.'}
        </div>
    );
};

// ─── Main component ───────────────────────────────────────────────────────────
const AdminEditUserPage = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { accessToken, isAuthReady } = useAuth();

    const [userData, setUserData]   = useState(null);
    const [formValues, setFormValues] = useState({});
    const [errors, setErrors]       = useState({});
    const [loading, setLoading]     = useState(true);
    const [saving, setSaving]       = useState(false);
    const [fetchError, setFetchError] = useState('');
    const [saveSuccess, setSaveSuccess] = useState(false);

    // photo state
    const [currentAvatar, setCurrentAvatar] = useState('');
    const [photoStatus, setPhotoStatus]     = useState(null);
    const photoTimerRef = useRef(null);

    // ── load user ──────────────────────────────────────────────────────────────
    useEffect(() => {
        if (!isAuthReady || !accessToken || !userId) return;

        let isMounted = true;
        const load = async () => {
            setLoading(true);
            try {
                const data = await fetchAdminUserDetails(userId, accessToken);
                if (!isMounted) return;
                setUserData(data);
                setCurrentAvatar(data.photo_url || '');
                setFormValues({
                    first_name:  data.first_name  || '',
                    second_name: data.second_name || '',
                    third_name:  data.third_name  || '',
                    fourth_name: data.fourth_name || '',
                    email:       data.email       || '',
                    phone:       data.phone       || '',
                    address:     data.address     || '',
                    birth:       data.birth ? data.birth.slice(0, 10) : '',
                    is_active:   data.is_active   ?? true,
                });
            } catch {
                if (isMounted) setFetchError('Failed to load user data.');
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        load();
        return () => { isMounted = false; };
    }, [userId, accessToken, isAuthReady]);

    useEffect(() => () => { if (photoTimerRef.current) clearTimeout(photoTimerRef.current); }, []);

    // ── photo upload ───────────────────────────────────────────────────────────
    const showPhotoStatus = (status) => {
        setPhotoStatus(status);
        if (photoTimerRef.current) clearTimeout(photoTimerRef.current);
        photoTimerRef.current = setTimeout(() => setPhotoStatus(null), 3500);
    };

    // EditableAvatar calls this with (secureUrl, publicId)
    const handlePhotoUpdated = async (imageUrl, publicId) => {
        try {
            await updateAdminUserPhoto(userId, imageUrl, publicId, accessToken);
            setCurrentAvatar(imageUrl);
            showPhotoStatus('updated');
        } catch {
            showPhotoStatus('error');
        }
    };

    // ── form helpers ───────────────────────────────────────────────────────────
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormValues((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const errs = {};
        if (!formValues.first_name?.trim())  errs.first_name  = 'First name is required.';
        if (!formValues.second_name?.trim()) errs.second_name = 'Second name is required.';
        if (!formValues.email?.trim())       errs.email       = 'Email is required.';
        if (formValues.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email))
            errs.email = 'Invalid email format.';
        return errs;
    };

    // only send fields that actually changed
    const getDirtyFields = () => {
        const dirty = {};
        EDITABLE_FIELDS.forEach((key) => {
            const original = key === 'birth'
                ? (userData[key] ? userData[key].slice(0, 10) : '')
                : (userData[key] ?? '');
            const current = formValues[key] ?? '';
            if (String(current) !== String(original)) dirty[key] = current;
        });
        return dirty;
    };

    const handleSubmit = async () => {
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }

        const dirtyFields = getDirtyFields();
        if (Object.keys(dirtyFields).length === 0) {
            navigate(`/dashboard/admin/users/${userId}`);
            return;
        }

        setSaving(true);
        try {
            await updateAdminUser(userId, dirtyFields, accessToken);
            setSaveSuccess(true);
            setTimeout(() => navigate(`/dashboard/admin/users/${userId}`), 800);
        } catch {
            setErrors({ submit: 'Failed to save changes. Please try again.' });
        } finally {
            setSaving(false);
        }
    };

    // ── loading / error states ─────────────────────────────────────────────────
    if (loading) return (
        <div className="flex min-h-[320px] items-center justify-center p-8">
            <div className="flex flex-col items-center gap-4">
                <div className="h-12 w-12 animate-spin rounded-full border-[5px] border-slate-200 border-t-indigo-600" />
                <span className="text-sm font-semibold tracking-wide text-slate-400">Loading user...</span>
            </div>
        </div>
    );
    if (fetchError) return <div className="p-8 text-center text-rose-500">{fetchError}</div>;
    if (!userData)  return <div className="p-8 text-center text-slate-500">No user data found.</div>;

    const role      = userData.role?.role_name;
    const shortName = [userData.first_name, userData.second_name].filter(Boolean).join(' ');

    return (
        <section className="min-h-[calc(100vh-80px)] border-t border-slate-200 bg-[#f0f4f8] py-8">
            <div className="mx-auto max-w-[1240px] px-4 md:px-8">

                {/* ── Page Header ────────────────────────────────────────────── */}
                <div className="mb-8 flex flex-col gap-3 px-2">
                    <button
                        onClick={() => navigate(`/dashboard/admin/users/${userId}`)}
                        className="flex w-fit items-center gap-2 text-[14px] font-medium text-slate-500 transition-colors hover:text-indigo-700"
                    >
                        <FiArrowLeft className="h-4 w-4" /> Back to Profile
                    </button>
                    <h1 className="text-[20px] font-bold text-indigo-900">Edit User</h1>
                </div>

                <div className="flex flex-col items-start gap-8 lg:flex-row">

                    {/* ── Sidebar ────────────────────────────────────────────── */}
                    <div className="w-full shrink-0 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_2px_15px_rgb(0,0,0,0.015)] lg:w-[300px]">
                        {/* banner */}
                        <div className="h-[120px] bg-gradient-to-b from-[#EAE1F9] to-[#F4F1FD]" />

                        {/* avatar — editable */}
                        <div className="relative mt-[-60px] flex flex-col items-center border-b border-slate-100/80 pb-6 px-4 text-center">
                            <EditableAvatar
                                src={currentAvatar}
                                alt={shortName}
                                accessToken={accessToken}
                                onPhotoUpdated={handlePhotoUpdated}
                            />
                            <PhotoStatusMessage status={photoStatus} />
                            <h2 className="mt-1 text-[17px] font-bold text-indigo-950">{shortName}</h2>
                            <span className="mt-0.5 text-[12px] font-medium text-slate-400">{userData.user_id}</span>
                        </div>

                        {/* read-only fields */}
                        <div className="flex flex-col gap-3 p-5">
                            <DisabledField label="User ID" value={userData.user_id} />
                            <DisabledField label="Role"    value={role} />
                            <DisabledField label="SSN"     value={userData.ssn} />
                        </div>

                        
                    </div>

                    {/* ── Form ───────────────────────────────────────────────── */}
                    <div className="flex-1 w-full">
                        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">

                            <div className="mb-6 flex items-center gap-2">
                                <div className="rounded-lg bg-indigo-50 p-2 text-indigo-700">
                                    <FiUser size={16} />
                                </div>
                                <h2 className="text-[16px] font-bold text-indigo-950">Editable Information</h2>
                            </div>

                            {/* Name fields */}
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <FormField
                                    label="First Name"
                                    name="first_name"
                                    value={formValues.first_name}
                                    onChange={handleChange}
                                    error={errors.first_name}
                                    required
                                />
                                <FormField
                                    label="Second Name"
                                    name="second_name"
                                    value={formValues.second_name}
                                    onChange={handleChange}
                                    error={errors.second_name}
                                    required
                                />
                                <FormField
                                    label="Third Name"
                                    name="third_name"
                                    value={formValues.third_name}
                                    onChange={handleChange}
                                    error={errors.third_name}
                                />
                                <FormField
                                    label="Fourth Name"
                                    name="fourth_name"
                                    value={formValues.fourth_name}
                                    onChange={handleChange}
                                    error={errors.fourth_name}
                                />
                            </div>

                            {/* Contact fields */}
                            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <FormField
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={formValues.email}
                                    onChange={handleChange}
                                    error={errors.email}
                                    required
                                />
                                <FormField
                                    label="Phone"
                                    name="phone"
                                    value={formValues.phone}
                                    onChange={handleChange}
                                    error={errors.phone}
                                />
                            </div>

                            {/* Personal fields */}
                            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <FormField
                                    label="Date of Birth"
                                    name="birth"
                                    type="date"
                                    value={formValues.birth}
                                    onChange={handleChange}
                                    error={errors.birth}
                                />
                                <FormField
                                    label="Address"
                                    name="address"
                                    value={formValues.address}
                                    onChange={handleChange}
                                    error={errors.address}
                                />
                            </div>

                            {/* is_active toggle */}
                            <div className="mt-6 flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/60 px-5 py-4">
                                <div className="flex flex-col">
                                    <span className="text-[14px] font-bold text-indigo-950">Account Status</span>
                                    <span className="text-[12px] font-medium text-slate-800">
                                        {formValues.is_active ? 'User is currently active' : 'User is currently inactive'}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setFormValues((prev) => ({ ...prev, is_active: !prev.is_active }))
                                    }
                                    aria-label="Toggle account status"
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                                        formValues.is_active ? 'bg-indigo-800' : 'bg-slate-300'
                                    }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-300 ${
                                            formValues.is_active ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                    />
                                </button>
                            </div>

                            {/* Error / success feedback */}
                            {errors.submit && (
                                <p className="mt-4 text-[13px] font-medium text-rose-500">{errors.submit}</p>
                            )}
                            {saveSuccess && (
                                <p className="mt-4 flex items-center gap-1.5 text-[13px] font-medium text-emerald-600">
                                    <FiCheckCircle size={14} /> Changes saved successfully!
                                </p>
                            )}

                            {/* Action buttons */}
                            <div className="mt-8 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => navigate(`/dashboard/admin/users/${userId}`)}
                                    className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-[14px] font-semibold text-slate-600 transition hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={saving}
                                    className="flex items-center gap-2 rounded-full bg-indigo-900 px-6 py-2.5 text-[14px] font-semibold text-white shadow-md transition-all hover:bg-indigo-800 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AdminEditUserPage;