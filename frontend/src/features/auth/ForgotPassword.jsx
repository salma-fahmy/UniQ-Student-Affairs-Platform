import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import FormField from '../../Components/Shared/FormField';
import Button from '../../Components/Shared/Button';
import Logoo from '../../Components/Nav/Logoo';
import LoginImg from '../../assets/Login/Login_img.png';
import { requestPasswordResetLink } from './authService';

const getForgotPasswordErrorMessage = (error) => {
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

  if (status === 404 || errorCode === 'ERR_NF') {
    return 'This email address is not found.';
  }

  return 'An error occurred while sending the reset link. Please try again.';
};

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const resetTimerRef = useRef(null);

  const clearResetTimer = () => {
    if (resetTimerRef.current) {
      window.clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      clearResetTimer();
    };
  }, []);

  const validateEmail = (value) => {
    const normalizedValue = value.trim().toLowerCase();

    if (!normalizedValue) {
      return 'Please enter your email';
    }

    if (!normalizedValue.includes('@') || !normalizedValue.includes('.')) {
      return 'Please enter a valid email address';
    }

    return '';
  };

  const handleChange = (e) => {
    const { value } = e.target;
    const normalizedValue = value.toLowerCase();
    clearResetTimer();
    setEmail(normalizedValue);
    setError(validateEmail(normalizedValue));
    setMessage('');
  };

  const handleBlur = () => {
    setError(validateEmail(email));
  };

  const handleSendLink = async (e) => {
    e.preventDefault();
    clearResetTimer();
    const normalizedEmail = email.trim().toLowerCase();
    const emailError = validateEmail(normalizedEmail);

    if (emailError) {
      setError(emailError);
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      await requestPasswordResetLink({ email: normalizedEmail });
      setMessage('A password reset link has been sent to your email address.');
      setError('');
      resetTimerRef.current = window.setTimeout(() => {
        setEmail('');
        setMessage('');
        setError('');
        resetTimerRef.current = null;
      }, 3000);
    } catch (error) {
      setError(getForgotPasswordErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#f1f4ff]">
      <div className="w-full max-w-5xl bg-white rounded-[2rem] shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[600px] md:h-[600px]">
        <div className="hidden md:flex flex-col justify-between w-1/2 relative bg-indigo-900 overflow-hidden">
          <img
            src={LoginImg}
            alt="Students Studying"
            className="absolute inset-0 w-full h-full object-cover blur-[0.3px] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/55 via-indigo-900/25 to-indigo-900/10 backdrop-blur-[1px] z-10"></div>

          <div className="relative z-20 p-8 flex items-center">
            <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl flex items-center shadow-lg border border-white/30">
              <Logoo />
            </div>
          </div>

          <div className="relative z-20 p-8">
            <p className="text-white/80 text-sm font-medium">
              Copyright 2025 Faculty of Computers and Data Science
            </p>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col items-center justify-center bg-white relative">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/login')}
            className="self-start mb-8 md:mb-0 md:absolute md:top-8 md:left-8 w-auto rounded-full px-4 py-2 text-sm font-medium flex items-center gap-2"
          >
            <FiArrowLeft />
            <span>Back to Login</span>
          </Button>

          <div className="w-full max-w-sm mt-2 md:mt-8">
            <h2 className="text-4xl font-bold text-center text-indigo-900 font-['Playfair_Display'] mb-4">
              Forgot Password
            </h2>
            <p className="text-center text-gray-500 mb-8 text-sm">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            {message && (
              <div className="mb-6 flex items-start space-x-2 text-[#166534] text-sm rounded-2xl border border-green-200 bg-green-50 px-4 py-3">
                <div className="mt-0.5 flex-shrink-0 bg-[#22c55e] rounded-sm w-3.5 h-3.5 flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold">✓</span>
                </div>
                <p className="font-normal leading-tight">{message}</p>
              </div>
            )}

            <form onSubmit={handleSendLink} className="space-y-6">
              <FormField
                label="Email Address"
                name="email"
                type="email"
                placeholder="Enter your email"
                icon={<FiMail size={18} />}
                value={email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={error}
                required
              />

              <Button
                type="submit"
                variant="primary"
                loading={isLoading}
                loadingText="Sending..."
                className="w-full py-4 mt-4 rounded-full"
              >
                Send Reset Link
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;