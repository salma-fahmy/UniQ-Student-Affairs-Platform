import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiUser, FiLock, FiArrowLeft } from 'react-icons/fi';
import FormField from '../../Components/Shared/FormField';
import Button from '../../Components/Shared/Button';
import Logoo from '../../Components/Nav/Logoo';
import LoginImg from '../../assets/Login/Login_img.png';
import { getUserProfileWithPhoto, loginUser } from './authService';
import { getDashboardPath } from './roleRouting';
import useAuth from './useAuth';

const INVALID_CREDENTIALS_MESSAGE = 'Invalid User ID or password. Please try again.';
const LOGIN_ERROR_MESSAGE = 'An error occurred while signing in. Please try again.';

const getLoginErrorMessage = (error) => {
  const status = error?.response?.status;

  if ([400, 401, 404, 422].includes(status)) {
    return INVALID_CREDENTIALS_MESSAGE;
  }

  if (!error?.response) {
    return 'Unable to connect to the server. Check your internet connection and try again.';
  }

  return LOGIN_ERROR_MESSAGE;
};

const Login = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [formData, setFormData] = useState({ userId: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateLoginField = (name, value) => {
    if (!value.trim()) {
      return name === 'userId' ? 'Please enter your User ID' : 'Please enter your password';
    }

    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({
      ...prev,
      form: '',
      [name]: validateLoginField(name, value),
    }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({
      ...prev,
      [name]: validateLoginField(name, value),
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.userId.trim()) newErrors.userId = 'Please enter your User ID';
    if (!formData.password.trim()) newErrors.password = 'Please enter your password';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const userId = formData.userId.trim();

    setIsLoading(true);
    setErrors({});

    try {
      const loginResponse = await loginUser({
        userId,
        password: formData.password.trim(),
      });

      const loginData = loginResponse?.data?.data ?? {};
      const accessToken = loginData?.accessToken;
      const role = String(loginData?.role || 'student').toLowerCase();

      if (!accessToken) {
        throw new Error('Invalid login response from server.');
      }

      const userProfile = await getUserProfileWithPhoto(accessToken);

      if (!userProfile) {
        throw new Error('Invalid profile response from server.');
      }

      setAuth({
        user: userProfile,
        accessToken,
        userRole: role,
        userId,
      });

      navigate(getDashboardPath(role));
    } catch (error) {
      setErrors({ form: getLoginErrorMessage(error) });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#f1f4ff]">
      <div className="w-full max-w-5xl bg-white rounded-[2rem] shadow-xl overflow-hidden flex flex-col md:flex-row h-[600px]">
        <div className="hidden md:flex flex-col justify-between w-1/2 relative bg-indigo-100 overflow-hidden">
          <img
            src={LoginImg}
            alt="Students Studying"
            className="absolute inset-0 w-full h-full object-cover blur-[1px] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/55 via-indigo-900/25 to-indigo-900/10 backdrop-blur-[0.3px] z-10"></div>

          <div className="relative z-20 p-8 flex items-center">
            <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl flex items-center shadow-lg border border-white/30">
              <Logoo textColor="text-white" />
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
            onClick={() => navigate('/')}
            className="absolute top-8 left-8 w-auto rounded-full px-4 py-2 text-sm font-medium"
          >
            <FiArrowLeft />
            <span>Back</span>
          </Button>

          <div className="w-full max-w-sm mt-8">
            <h2 className="text-4xl font-bold text-center text-indigo-900 font-['Playfair_Display'] mb-10">
              Sign in
            </h2>

            {errors.form && (
              <div className="mb-4 flex items-start space-x-2 text-[#d93025] text-sm">
                <div className="mt-0.5 flex-shrink-0 bg-[#FF9800] rounded-sm w-3.5 h-3.5 flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold">!</span>
                </div>
                <p className="font-normal leading-tight">{errors.form}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <FormField
                label="User ID"
                name="userId"
                placeholder="Enter your user ID"
                icon={<FiUser size={18} />}
                defaultValue={formData.userId}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.userId}
                required
              />

              <div className="space-y-2">
                <FormField
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  icon={<FiLock size={18} />}
                  defaultValue={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.password}
                  required
                />

                <div className="flex justify-end">
                  <Link
                    to="/forgot-password"
                    className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                loading={isLoading}
                loadingText="Signing in..."
                className="w-full py-4 mt-4 rounded-full"
              >
                Login
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
