import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  FiArrowLeft, FiSend, FiAlertCircle, FiCheckCircle,
  FiDollarSign, FiClock, FiUser, FiLock, FiXCircle, FiPaperclip,
} from 'react-icons/fi';
import useAuth from '../../auth/useAuth';
import { fetchRequestTypeByCode } from '../requestService';
import { fetchStudentProfile, fetchStudentStudyInfo } from '../studentService';
import { buildPrefillState } from '../profileFieldMap';
import {
  createFreeRequest,
  previewRequest,
  initiatePayment,
  confirmPayment,
  failPayment,
} from '../paymentService';
import DynamicForm from '../../../Components/Forms/DynamicForm';
import { validateFields } from '../fieldValidation';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatPrice = (price) => {
  const num = Number(price);
  if (Number.isNaN(num)) return 'Free';
  return num === 0 ? 'Free' : `${num.toLocaleString()} EGP`;
};

const isPriceFree = (price) => Number(price) === 0;

// ─── Price Summary Card ───────────────────────────────────────────────────────

const PriceSummaryCard = ({ requestType }) => (
  <div
    className="rounded-2xl border border-slate-100 shadow-sm p-5 mb-6 flex flex-col gap-3"
    style={{
      background: 'radial-gradient(circle at top left, rgba(79,70,229,0.06), transparent 40%), radial-gradient(circle at bottom right, rgba(6,182,212,0.04), transparent 40%), #f8f9ff',
    }}
  >
    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Request Summary</p>
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="text-[16px] font-bold text-indigo-950">{requestType.name}</p>
        {requestType.name_ar && (
          <p className="text-[13px] text-slate-500 mt-0.5" dir="rtl">{requestType.name_ar}</p>
        )}
      </div>
      <div className="flex flex-wrap gap-2 shrink-0">
        <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-bold
          ${isPriceFree(requestType.price)
            ? 'bg-emerald-100 text-emerald-700'
            : 'bg-indigo-100 text-indigo-700'}`}>
          <FiDollarSign size={14} strokeWidth={2.5} />
          {formatPrice(requestType.price)}
        </span>
        {requestType.processing_days != null && (
          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-bold bg-amber-100 text-amber-800">
            <FiClock size={14} strokeWidth={2.5} />
            {requestType.processing_days} day{requestType.processing_days !== 1 ? 's' : ''} processing
          </span>
        )}
      </div>
    </div>
  </div>
);

// ─── Profile Banner ───────────────────────────────────────────────────────────

const ProfileBanner = ({ profile }) => {
  if (!profile) return null;
  const name = [profile.first_name, profile.second_name].filter(Boolean).join(' ');
  return (
    <div className="flex items-center gap-3 bg-indigo-50/70 border border-indigo-100 rounded-2xl px-4 py-3 mb-6">
      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
        <FiUser size={16} className="text-indigo-700" strokeWidth={2} />
      </div>
      <p className="text-[13px] font-medium text-indigo-800">
        Fields marked <span className="font-bold">Auto-filled</span> are pulled from your profile
        {name ? ` (${name})` : ''} and cannot be changed here.
      </p>
    </div>
  );
};

// ─── Attachment Uploader ──────────────────────────────────────────────────────
// Standalone uploader — independent of form schema, always shown below the form.
// Uploads to Cloudinary and maintains an array of secure_urls in parent state.

const AttachmentUploader = ({ accessToken, links, onChange, disabled }) => {
  const [uploading, setUploading] = React.useState(false);
  const [uploadError, setUploadError] = React.useState('');
  const inputRef = React.useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    setUploading(true);
    setUploadError('');
    try {
      const sigRes = await fetch(
        `${import.meta.env.VITE_API_BASE_URL ?? ''}/api/v1/users/photo-signature?folderName=attachments`,
        { headers: { Authorization: `Bearer ${accessToken}` }, credentials: 'include' },
      );
      const sig = await sigRes.json();
      const { signature, timestamp, cloudName, apiKey, folder } = sig.data ?? sig;

      const form = new FormData();
      form.append('file', file);
      form.append('api_key', apiKey);
      form.append('timestamp', timestamp);
      form.append('signature', signature);
      form.append('folder', folder);

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
        { method: 'POST', body: form },
      );
      const uploadData = await uploadRes.json();
      if (!uploadData.secure_url) throw new Error('Upload failed');
      onChange([...links, uploadData.secure_url]);
    } catch (err) {
      setUploadError('فشل رفع الملف. حاول مرة أخرى.');
      console.error('Attachment upload error:', err);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleRemove = (url) => onChange(links.filter((l) => l !== url));

  return (
    <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="text-[13px] font-bold text-slate-600">المرفقات</span>
        <span className="text-[11px] text-slate-400 font-medium">(اختياري — يمكنك إرفاق أكثر من ملف)</span>
      </div>

      {/* Uploaded files */}
      {links.length > 0 && (
        <div className="flex flex-col gap-2">
          {links.map((url) => (
            <div key={url} className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-emerald-200 bg-emerald-50">
              <FiPaperclip size={14} className="text-emerald-600 shrink-0" />
              <a href={url} target="_blank" rel="noreferrer"
                className="flex-1 text-[13px] font-semibold text-emerald-700 truncate underline">
                {url.split('/').pop()}
              </a>
              {!disabled && (
                <button type="button" onClick={() => handleRemove(url)}
                  className="shrink-0 text-slate-400 hover:text-rose-500 transition-colors"
                  aria-label="Remove attachment">
                  <FiXCircle size={15} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload trigger */}
      <label className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed
        transition-all duration-200
        ${disabled || uploading
          ? 'opacity-60 cursor-not-allowed border-slate-200 bg-slate-50'
          : 'cursor-pointer border-indigo-200 bg-indigo-50/40 hover:bg-indigo-50 hover:border-indigo-300'}`}>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          disabled={disabled || uploading}
          onChange={(e) => handleFile(e.target.files?.[0])}
          className="sr-only"
        />
        {uploading ? (
          <>
            <div className="w-4 h-4 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin shrink-0" />
            <span className="text-[13px] font-semibold text-indigo-600">جارٍ الرفع…</span>
          </>
        ) : (
          <>
            <FiPaperclip size={15} className="text-indigo-400 shrink-0" />
            <span className="text-[13px] font-semibold text-indigo-700">إضافة مرفق</span>
            <span className="text-[11px] text-slate-400 mr-auto">PDF, JPG, PNG, DOC</span>
          </>
        )}
      </label>

      {uploadError && (
        <p className="text-[12px] font-semibold text-rose-500 flex items-center gap-1">
          <FiAlertCircle size={12} />{uploadError}
        </p>
      )}
    </div>
  );
};

// ─── Payment States ───────────────────────────────────────────────────────────

const PAYMENT_STATES = {
  IDLE: 'idle',
  PROCESSING: 'processing',
  CONFIRMING: 'confirming',
  FAILING: 'failing',
};

// ─── Free Confirm Modal ───────────────────────────────────────────────────────

const FreeConfirmModal = ({ requestType, onConfirm, onCancel, submitting }) => (
  <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
    <div
      style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.3)', backdropFilter: 'blur(2px)' }}
      onClick={!submitting ? onCancel : undefined}
    />
    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 flex flex-col gap-6 z-10">
      <div className="flex flex-col items-center text-center gap-3">
        <div className="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center">
          <FiSend size={24} className="text-indigo-700" strokeWidth={2} />
        </div>
        <h2 className="font-['Manrope'] text-[20px] font-bold text-indigo-950">Confirm Submission</h2>
        <p className="text-[14px] text-slate-500 font-medium leading-relaxed">
          You're about to submit a <span className="font-bold text-slate-700">{requestType.name}</span> request.
        </p>
      </div>
      <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between border border-slate-100">
        <span className="text-[13px] font-semibold text-slate-600">Amount due</span>
        <span className="text-[15px] font-bold text-emerald-600">Free</span>
      </div>
      <div className="flex gap-3">
        <button
          type="button" onClick={onCancel} disabled={submitting}
          className="flex-1 py-2.5 rounded-full border border-slate-200 text-[14px] font-semibold
                     text-slate-600 hover:bg-slate-50 transition-all duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed">
          Cancel
        </button>
        <button
          type="button" onClick={onConfirm} disabled={submitting}
          className="flex-1 py-2.5 rounded-full bg-indigo-900 text-white text-[14px] font-semibold
                     hover:bg-indigo-800 shadow-md shadow-indigo-900/20 transition-all duration-200
                     active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed
                     flex items-center justify-center gap-2">
          {submitting
            ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Submitting…</>
            : 'Submit Request'}
        </button>
      </div>
    </div>
  </div>
);

// ─── Simulated Payment Modal ──────────────────────────────────────────────────

const SimulatedPaymentModal = ({ requestType, paymentNumber, cardholderName, onConfirm, onCancel, processingState }) => {
  const isProcessing =
    processingState === PAYMENT_STATES.PROCESSING ||
    processingState === PAYMENT_STATES.CONFIRMING ||
    processingState === PAYMENT_STATES.FAILING;
  const [cardNumber, setCardNumber] = React.useState('');
  const [expiry, setExpiry]         = React.useState('');
  const [cvv, setCvv]               = React.useState('');
  const [cardErrors, setCardErrors] = React.useState({});

  const formatCardNumber = (raw) => {
    const digits = raw.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const detectBrand = (raw) => {
    const d = raw.replace(/\D/g, '');
    if (/^4/.test(d))      return 'VISA';
    if (/^5[1-5]/.test(d)) return 'MC';
    if (/^3[47]/.test(d))  return 'AMEX';
    if (/^6/.test(d))      return 'DISCOVER';
    return null;
  };
  const brand = detectBrand(cardNumber);
  const brandLabel = { VISA: 'VISA', MC: 'Mastercard', AMEX: 'Amex', DISCOVER: 'Discover' }[brand] ?? '';
  const brandColor = {
    VISA: 'text-indigo-700 bg-indigo-50', MC: 'text-orange-700 bg-orange-50',
    AMEX: 'text-sky-700 bg-sky-50', DISCOVER: 'text-amber-700 bg-amber-50',
  }[brand] ?? 'text-slate-400 bg-slate-50';

  const luhn = (num) => {
    let sum = 0, alt = false;
    for (let i = num.length - 1; i >= 0; i--) {
      let n = parseInt(num[i], 10);
      if (alt) { n *= 2; if (n > 9) n -= 9; }
      sum += n; alt = !alt;
    }
    return sum % 10 === 0;
  };

  const validate = () => {
    const errs = {};
    const rawCard = cardNumber.replace(/\D/g, '');
    const rawCvv = cvv.trim();
    if (rawCard.length !== 16) {
      errs.cardNumber = 'يجب أن يكون رقم البطاقة 16 رقماً';
    } else if (!luhn(rawCard)) {
      errs.cardNumber = 'رقم البطاقة غير صحيح';
    }
    if (!expiry) {
      errs.expiry = 'تاريخ انتهاء غير مكتمل';
    } else {
      const [yyyy, mm] = expiry.split('-').map(Number);
      const now = new Date();
      if (new Date(yyyy, mm - 1, 1) < new Date(now.getFullYear(), now.getMonth(), 1)) {
        errs.expiry = 'البطاقة منتهية الصلاحية';
      }
    }
    const cvvLen = brand === 'AMEX' ? 4 : 3;
    if (!/^\d+$/.test(rawCvv) || rawCvv.length !== cvvLen) {
      errs.cvv = `CVV يجب أن يكون ${cvvLen} أرقام`;
    }
    return errs;
  };

  const handlePay = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setCardErrors(errs); return; }
    setCardErrors({});
    onConfirm();
  };

  const inputBase =
    'bg-white border rounded-xl px-4 py-2.5 text-[14px] font-mono font-medium text-slate-700 ' +
    'focus:outline-none focus:ring-2 transition-all duration-150 w-full';
  const inputOk  = 'border-slate-200 focus:ring-indigo-200 focus:border-indigo-300';
  const inputErr = 'border-rose-300 focus:ring-rose-200 focus:border-rose-400 bg-rose-50/40';

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', overflowY: 'auto' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)' }} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm z-10 my-auto overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between" style={{ background: '#1a1f71' }}>
          <div className="flex items-center gap-3">
            <span className="text-white font-black text-[22px] italic tracking-tight" style={{ fontFamily: 'serif' }}>PAYMENT</span>
            <span className="text-white/20 text-lg">|</span>
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full opacity-90" style={{ background: '#eb001b' }} />
              <div className="w-6 h-6 rounded-full opacity-90 -ml-2" style={{ background: '#f79e1b' }} />
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: 'rgba(255,255,255,0.6)' }}>
            <FiLock size={11} strokeWidth={2.5} />Secure Payment
          </div>
        </div>
        <div className="px-6 py-3 flex items-center justify-between bg-slate-50 border-b border-slate-100">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Amount Due</p>
            <p className="text-[20px] font-bold text-indigo-950 mt-0.5">{formatPrice(requestType.price)}</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Reference</p>
            <p className="text-[12px] font-mono font-bold text-slate-600 mt-0.5">{paymentNumber}</p>
          </div>
        </div>
        <div className="px-6 py-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Cardholder Name</label>
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] font-medium text-slate-400">{cardholderName}</div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Card Number</label>
            <div className="relative">
              <input
                type="text" inputMode="numeric" autoComplete="cc-number"
                placeholder="1234 5678 9012 3456" maxLength={19} value={cardNumber}
                disabled={isProcessing}
                onChange={(e) => { setCardNumber(formatCardNumber(e.target.value)); if (cardErrors.cardNumber) setCardErrors((p) => ({ ...p, cardNumber: undefined })); }}
                className={`${inputBase} ${cardErrors.cardNumber ? inputErr : inputOk} pr-16`}
              />
              {brand && <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold px-2 py-0.5 rounded-md ${brandColor}`}>{brandLabel}</span>}
            </div>
            {cardErrors.cardNumber && <p className="text-[11px] font-semibold text-rose-500 flex items-center gap-1"><FiAlertCircle size={11} />{cardErrors.cardNumber}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Expiry</label>
              <input
                type="month" value={expiry} disabled={isProcessing}
                onChange={(e) => { setExpiry(e.target.value); if (cardErrors.expiry) setCardErrors((p) => ({ ...p, expiry: undefined })); }}
                className={`${inputBase} ${cardErrors.expiry ? inputErr : inputOk}`}
              />
              {cardErrors.expiry && <p className="text-[11px] font-semibold text-rose-500 flex items-center gap-1"><FiAlertCircle size={11} />{cardErrors.expiry}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">CVV {brand === 'AMEX' ? '(4 digits)' : ''}</label>
              <input
                type="password" inputMode="numeric" autoComplete="cc-csc"
                placeholder={brand === 'AMEX' ? '••••' : '•••'} maxLength={brand === 'AMEX' ? 4 : 3}
                value={cvv} disabled={isProcessing}
                onChange={(e) => { setCvv(e.target.value.replace(/\D/g, '')); if (cardErrors.cvv) setCardErrors((p) => ({ ...p, cvv: undefined })); }}
                className={`${inputBase} ${cardErrors.cvv ? inputErr : inputOk}`}
              />
              {cardErrors.cvv && <p className="text-[11px] font-semibold text-rose-500 flex items-center gap-1"><FiAlertCircle size={11} />{cardErrors.cvv}</p>}
            </div>
          </div>
          <p className="text-[11px] text-slate-400 text-center font-medium border-t border-slate-100 pt-3">
            🔒 256-bit SSL encrypted · Simulation only — no real charge
          </p>
        </div>
        <div className="px-6 pb-6 flex gap-3">
          <button type="button" onClick={onCancel} disabled={isProcessing}
            className="flex-1 py-2.5 rounded-full border border-slate-200 text-[13px] font-bold text-slate-600
                       hover:bg-slate-50 hover:text-rose-600 transition-all
                       disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5">
            {processingState === PAYMENT_STATES.FAILING
              ? <><div className="w-3.5 h-3.5 border-2 border-slate-300 border-t-rose-500 rounded-full animate-spin" />Cancelling…</>
              : <><FiXCircle size={14} strokeWidth={2} />Cancel</>}
          </button>
          <button type="button" onClick={handlePay} disabled={isProcessing}
            className="flex-[2] py-2.5 rounded-full text-white text-[13px] font-bold
                       hover:opacity-90 transition-all active:scale-95
                       disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
            style={{ background: '#1a1f71' }}>
            {processingState === PAYMENT_STATES.CONFIRMING
              ? <><div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />Processing…</>
              : <><FiLock size={13} strokeWidth={2.5} />Pay {formatPrice(requestType.price)}</>}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Success Banner ───────────────────────────────────────────────────────────

const SuccessBanner = ({ requestNumber, paymentNumber, isFreeRequest }) => (
  <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
    <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center shadow-sm">
      <FiCheckCircle size={40} className="text-emerald-500" strokeWidth={1.5} />
    </div>
    <div>
      <h3 className="font-['Manrope'] text-[22px] font-bold text-indigo-950">
        {isFreeRequest ? 'Request Submitted!' : 'Payment Confirmed!'}
      </h3>
      {requestNumber && <p className="text-[14px] font-mono text-slate-500 mt-1">{requestNumber}</p>}
      {paymentNumber && <p className="text-[13px] font-mono text-slate-400 mt-1">{paymentNumber}</p>}
      <p className="text-[14px] text-slate-500 mt-2 font-medium">Redirecting you to your requests…</p>
    </div>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

const RequestFormPage = () => {
  const { requestTypeCode } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { accessToken, isAuthReady, userId } = useAuth();

  const [requestType, setRequestType] = useState(null);
  const [loadingType, setLoadingType] = useState(true);
  const [loadError, setLoadError]     = useState(null);
  const [profile, setProfile]               = useState(null);
  const [studyInfo, setStudyInfo]           = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [values, setValues]     = useState({});
  const [readOnly, setReadOnly] = useState(new Set());
  const [errors, setErrors]     = useState({});
  const [attachmentLinks, setAttachmentLinks] = useState([]);
  const [showFreeConfirm, setShowFreeConfirm]   = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentNumber, setPaymentNumber]       = useState(null);
  const [paymentState, setPaymentState]         = useState(PAYMENT_STATES.IDLE);
  const [submitting, setSubmitting]             = useState(false);
  const [submitError, setSubmitError]           = useState('');
  const [success, setSuccess]                   = useState(null);
  const [hasSubmitted, setHasSubmitted]         = useState(false);

  useEffect(() => {
    if (!isAuthReady || !accessToken) return;
    let mounted = true;
    const load = async () => {
      try {
        const found = await fetchRequestTypeByCode(accessToken, requestTypeCode);
        if (!found) throw new Error('Not found');
        if (mounted) setRequestType(found);
      } catch {
        if (mounted) setLoadError('Could not load request type. Please go back and try again.');
      } finally {
        if (mounted) setLoadingType(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [accessToken, isAuthReady, requestTypeCode]);

  useEffect(() => {
    if (!isAuthReady || !accessToken) return;
    let mounted = true;
    const load = async () => {
      try {
        const [profileData, studyData] = await Promise.allSettled([
          fetchStudentProfile(accessToken),
          fetchStudentStudyInfo(accessToken),
        ]);
        if (mounted) {
          setProfile(profileData.status === 'fulfilled' ? profileData.value : null);
          setStudyInfo(studyData.status === 'fulfilled' ? studyData.value : null);
        }
      } finally {
        if (mounted) setLoadingProfile(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [accessToken, isAuthReady]);

  useEffect(() => {
    if (!requestType || loadingProfile) return;
    const fields = requestType.form_schema?.fields ?? [];
    const { values: prefilled, readOnly: ro } = buildPrefillState(fields, profile, studyInfo);
    setValues(prefilled);
    setReadOnly(ro);
  }, [requestType, profile, studyInfo, loadingProfile]);

  const fields = requestType?.form_schema?.fields ?? [];
  const isLoading = loadingType || loadingProfile;
  const isFreeRequest = isPriceFree(requestType?.price ?? 0);

  const cardholderName = [profile?.first_name, profile?.second_name]
    .filter(Boolean).join(' ').toUpperCase() || 'CARDHOLDER NAME';

  const buildPayload = () => ({
    studentId: userId,
    requestTypeId: requestType.request_type_id,
    price: Number(requestType.price),
    body: values,
    description: `${requestType.name} request`,
    attachmentLinks,
  });

  const handleChange = (name, value) => {
    if (readOnly.has(name)) return;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => { const e = { ...prev }; delete e[name]; return e; });
  };

  const handleSubmitClick = () => {
    if (hasSubmitted) return;
    const validationErrors = validateFields(fields, values, readOnly);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstErrorName = Object.keys(validationErrors)[0];
      document.getElementById(firstErrorName)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setErrors({});
    setSubmitError('');
    if (isFreeRequest) {
      setShowFreeConfirm(true);
    } else {
      handleInitiatePaidFlow();
    }
  };

  const handleFreeConfirm = async () => {
    if (hasSubmitted) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      const result = await createFreeRequest(buildPayload());
      setHasSubmitted(true);
      setShowFreeConfirm(false);
      setSuccess({ requestNumber: result?.request_number ?? '', isFreeRequest: true });
      setTimeout(() => navigate('/dashboard/student/requests'), 2500);
    } catch (err) {
      setSubmitError(err?.response?.data?.message ?? 'Submission failed. Please try again.');
      setShowFreeConfirm(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleInitiatePaidFlow = async () => {
    if (hasSubmitted) return;
    setSubmitting(true);
    setSubmitError('');
    setPaymentState(PAYMENT_STATES.PROCESSING);
    try {
      await previewRequest(buildPayload());
      const paymentData = await initiatePayment(buildPayload());
      const pNumber = paymentData?.payment_number ?? paymentData?.paymentNumber;
      if (!pNumber) throw new Error('No payment number returned from server.');
      setPaymentNumber(pNumber);
      setPaymentState(PAYMENT_STATES.IDLE);
      setShowPaymentModal(true);
    } catch (err) {
      setSubmitError(err?.response?.data?.message ?? 'Could not initiate payment. Please try again.');
      setPaymentState(PAYMENT_STATES.IDLE);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePaymentConfirm = async () => {
    if (hasSubmitted || !paymentNumber) return;
    setPaymentState(PAYMENT_STATES.CONFIRMING);
    try {
      const transactionId = `TXN-${Date.now()}`;
      const payload = buildPayload();
      const result = await confirmPayment(paymentNumber, transactionId, {
        studentId: payload.studentId,
        requestTypeId: payload.requestTypeId,
        price: payload.price,
        body: payload.body,
        attachmentLinks: payload.attachmentLinks,
      });
      setHasSubmitted(true);
      setShowPaymentModal(false);
      setSuccess({
        requestNumber: result?.request_number ?? result?.request?.request_number ?? '',
        paymentNumber,
        isFreeRequest: false,
      });
      setTimeout(() => navigate('/dashboard/student/requests'), 2500);
    } catch (err) {
      setSubmitError(err?.response?.data?.message ?? 'Payment confirmation failed. Please try again.');
      setShowPaymentModal(false);
      setPaymentState(PAYMENT_STATES.IDLE);
    }
  };

  const handlePaymentCancel = async () => {
    if (!paymentNumber) { setShowPaymentModal(false); return; }
    setPaymentState(PAYMENT_STATES.FAILING);
    try { await failPayment(paymentNumber); } catch { /* best-effort */ }
    finally {
      setPaymentState(PAYMENT_STATES.IDLE);
      setPaymentNumber(null);
      setShowPaymentModal(false);
      setSubmitError('Payment was cancelled. You can try again.');
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="bg-slate-50 md:bg-slate-50 md:shadow-sm md:rounded-[32px] md:border border-slate-200
                    p-4 md:p-8 min-h-full flex flex-col pt-6 md:pt-8">

      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center justify-center w-10 h-10 rounded-full bg-white
                       text-slate-500 shadow-sm border border-slate-200
                       hover:bg-slate-100 hover:text-indigo-900 transition-all duration-300 shrink-0">
            <FiArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h1 className="font-['Manrope'] text-2xl md:text-[28px] font-bold text-indigo-950 tracking-tight leading-tight">
              {requestType?.name ?? 'Request Form'}
            </h1>
            <p className="text-slate-500 mt-0.5 text-[14px] font-medium">
              Fill in all required fields and submit your request
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      {isLoading ? (
        <div className="flex justify-center items-center h-60">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
            <span className="text-[13px] font-semibold text-slate-400">Loading your profile…</span>
          </div>
        </div>
      ) : loadError ? (
        <div className="bg-rose-50 border border-rose-100 text-rose-600 p-6 rounded-xl font-bold text-center">
          {loadError}
        </div>
      ) : success ? (
        <SuccessBanner
          requestNumber={success.requestNumber}
          paymentNumber={success.paymentNumber}
          isFreeRequest={success.isFreeRequest}
        />
      ) : (
        <>
          {requestType && <PriceSummaryCard requestType={requestType} />}
          {readOnly.size > 0 && <ProfileBanner profile={profile} />}

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
            <DynamicForm
              fields={fields}
              values={values}
              onChange={handleChange}
              errors={errors}
              disabled={submitting || paymentState !== PAYMENT_STATES.IDLE}
              readOnly={readOnly}
              accessToken={accessToken}
            />

            <AttachmentUploader
              accessToken={accessToken}
              links={attachmentLinks}
              onChange={setAttachmentLinks}
              disabled={submitting || paymentState !== PAYMENT_STATES.IDLE}
            />

            {submitError && (
              <div className="mt-5 flex items-center gap-2 bg-rose-50 border border-rose-100
                              text-rose-600 text-[13px] font-semibold p-4 rounded-xl">
                <FiAlertCircle size={16} className="shrink-0" />
                {submitError}
                {!isFreeRequest && submitError.includes('cancelled') && (
                  <button
                    type="button"
                    onClick={() => { setSubmitError(''); setHasSubmitted(false); }}
                    className="ml-auto text-indigo-700 underline text-[13px] font-bold whitespace-nowrap">
                    Try again
                  </button>
                )}
              </div>
            )}

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={handleSubmitClick}
                disabled={submitting || hasSubmitted || paymentState !== PAYMENT_STATES.IDLE}
                className="group flex items-center gap-2 rounded-full px-8 py-3
                           bg-indigo-900 text-white text-[14px] font-semibold
                           shadow-[0_10px_20px_-10px_rgba(49,46,129,0.5)]
                           hover:bg-indigo-800 hover:shadow-[0_15px_25px_-10px_rgba(49,46,129,0.7)]
                           transition-all duration-300 active:scale-95
                           disabled:opacity-60 disabled:cursor-not-allowed">
                {submitting && paymentState === PAYMENT_STATES.PROCESSING ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Preparing payment…
                  </>
                ) : (
                  <>
                    <FiSend size={16} strokeWidth={2} className="group-hover:translate-x-0.5 transition-transform" />
                    {isFreeRequest ? 'Submit Request' : `Pay & Submit — ${formatPrice(requestType?.price)}`}
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}

      {showFreeConfirm && requestType && (
        <FreeConfirmModal
          requestType={requestType}
          onConfirm={handleFreeConfirm}
          onCancel={() => setShowFreeConfirm(false)}
          submitting={submitting}
        />
      )}

      {showPaymentModal && requestType && paymentNumber && (
        <SimulatedPaymentModal
          requestType={requestType}
          paymentNumber={paymentNumber}
          cardholderName={cardholderName}
          onConfirm={handlePaymentConfirm}
          onCancel={handlePaymentCancel}
          processingState={paymentState}
        />
      )}
    </div>
  );
};

export default RequestFormPage;