import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FiLock, FiCheckCircle } from 'react-icons/fi';
import FormField from '../../Components/Shared/FormField';
import Button from '../../Components/Shared/Button';
import { resetPassword as resetPasswordRequest } from './authService';

const getResetPasswordErrorMessage = (error) => {
  const status = error?.response?.status;
  const responseData = error?.response?.data ?? {};
  const errorCode =
    responseData.code ??
    responseData.errorCode ??
    responseData.data?.code ??
    responseData.data?.errorCode ??
    responseData.error?.code ??
    responseData.error?.errorCode ??
    '';

  if (!error?.response) {
    return 'Unable to connect to the server. Check your internet connection and try again.';
  }

  if (status === 401 || errorCode === 'ERR_VALID') {
    return 'The password reset link is invalid or has expired. Please request a new link.';
  }

  return 'An error occurred while resetting the password. Please try again.';
};

const theme = {
  shell: 'relative min-h-screen overflow-hidden px-4 py-10 flex items-center justify-center',
  shellBackdrop:
    'absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(79,70,229,0.12),transparent_35%),linear-gradient(135deg,var(--brand-bg-start)_0%,var(--brand-bg-mid)_48%,var(--brand-bg-end)_100%)]',
  shellGlowLeft: 'absolute -left-24 top-12 h-72 w-72 rounded-full bg-[rgba(79,70,229,0.12)] blur-3xl',
  shellGlowRight: 'absolute bottom-0 right-0 h-[30rem] w-[30rem] rounded-full bg-[rgba(49,46,129,0.08)] blur-3xl',
  wrapper: 'relative z-10 w-full max-w-2xl',
  card: 'overflow-hidden rounded-[2rem] border border-[color:var(--brand-border)] bg-[var(--brand-surface)] shadow-[0_32px_100px_-35px_rgba(49,46,129,0.35)] backdrop-blur-xl',
  rail: 'h-2 bg-gradient-to-r from-[var(--brand-primary)] via-[var(--brand-accent)] to-[#818cf8]',
  inner: 'p-8 md:p-12',
  headerRow: 'mb-8 flex items-start justify-between gap-4',
  title: "text-4xl font-bold text-[var(--brand-primary)] font-['Playfair_Display'] mb-3",
  subtitle: 'text-sm text-[var(--brand-muted)] max-w-lg',
  successBox: 'mb-6 flex items-start space-x-2 rounded-2xl border border-[rgba(22,163,74,0.18)] bg-[var(--brand-success-bg)] px-4 py-3 text-sm text-[var(--brand-success)]',
  successIcon: 'mt-0.5 flex-shrink-0 rounded-sm w-3.5 h-3.5 flex items-center justify-center bg-[var(--brand-success)]',
  errorBox: 'mb-6 flex items-start space-x-2 rounded-2xl border border-[rgba(185,28,28,0.16)] bg-[var(--brand-danger-bg)] px-4 py-3 text-sm text-[var(--brand-danger)]',
  errorIcon: 'mt-0.5 flex-shrink-0 rounded-sm w-3.5 h-3.5 flex items-center justify-center bg-[var(--brand-warning)]',
  successTitle: 'text-2xl font-bold text-[var(--brand-primary)] mb-4',
  successCopy: 'text-[var(--brand-muted)] mb-8 max-w-md',
};

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validatePassword = (value) => {
    if (!value.trim()) {
      return 'Please enter a new password';
    }

    if (value.length < 8) {
      return 'Password must be at least 8 characters long';
    }

    if (value.length > 64) {
      return 'Password cannot exceed 64 characters';
    }

    return '';
  };
  const validateConfirmPassword = (passwordValue, confirmValue) => {
    if (!confirmValue.trim()) {
      return 'Please confirm your password';
    }

    if (passwordValue !== confirmValue) {
      return 'Passwords do not match';
    }

    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nextFormData = { ...formData, [name]: value };

    setFormData(nextFormData);
    setFormError('');
    setErrors((prev) => {
      const nextErrors = { ...prev };

      if (name === 'password') {
        nextErrors.password = validatePassword(value);

        if (nextFormData.confirmPassword.trim() || prev.confirmPassword) {
          nextErrors.confirmPassword = validateConfirmPassword(nextFormData.password, nextFormData.confirmPassword);
        }
      } else {
        nextErrors.confirmPassword = validateConfirmPassword(nextFormData.password, value);
      }

      return nextErrors;
    });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setFormError('');

    if (name === 'password') {
      setErrors((prev) => {
        const nextErrors = { ...prev, password: validatePassword(value) };

        if (formData.confirmPassword.trim() || prev.confirmPassword) {
          nextErrors.confirmPassword = validateConfirmPassword(value, formData.confirmPassword);
        }

        return nextErrors;
      });
    } else {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: validateConfirmPassword(formData.password, value),
      }));
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();

    if (!token) {
      setFormError('The password reset link is invalid or has expired. Please request a new link.');
      return;
    }

    const newErrors = {};
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmPassword);

    if (passwordError) newErrors.password = passwordError;
    if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      await resetPasswordRequest({
        token,
        newPassword: formData.password,
      });

      setIsSuccess(true);
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 3000);
    } catch (error) {
      setFormError(getResetPasswordErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={theme.shell}>
      <div className={theme.shellBackdrop} aria-hidden="true"></div>
      <div className={theme.shellGlowLeft} aria-hidden="true"></div>
      <div className={theme.shellGlowRight} aria-hidden="true"></div>

      <div className={theme.wrapper}>
        <div className={theme.card}>
          <div className={theme.rail}></div>
          <div className={theme.inner}>
            <div className={theme.headerRow}>
              <div>
                <h2 className={theme.title}>
                  Set New Password
                </h2>
                <p className={theme.subtitle}>
                  This page is opened from your email reset link. Create a new password below.
                </p>
              </div>
            </div>

            {formError && !isSuccess && (
              <div className={theme.errorBox}>
                <div className={theme.errorIcon}>
                  <span className="text-white text-[10px] font-bold">!</span>
                </div>
                <p className="font-normal leading-tight">{formError}</p>
              </div>
            )}

            {isSuccess ? (
              <div className="flex flex-col items-center text-center py-6 animate-fade-in-up">
                <div className="w-16 h-16 bg-[rgba(22,163,74,0.12)] text-[var(--brand-success)] rounded-full flex items-center justify-center mb-6">
                  <FiCheckCircle size={32} />
                </div>
                <h3 className={theme.successTitle}>Password changed successfully</h3>
                <p className={theme.successCopy}>
                  You can now log in using your new password.
                </p>
              </div>
            ) : (
              <form onSubmit={handleReset} className="space-y-6 mt-8">
                <FormField
                  label="New Password"
                  name="password"
                  type="password"
                  placeholder="Enter new password"
                  icon={<FiLock size={18} />}
                  defaultValue={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.password}
                  required
                />

                <FormField
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  icon={<FiLock size={18} />}
                  defaultValue={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.confirmPassword}
                  required
                />

                <Button
                  type="submit"
                  variant="primary"
                  loading={isLoading}
                  loadingText="Resetting..."
                  className="w-full py-4 mt-4 rounded-full"
                >
                  Reset Password
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
