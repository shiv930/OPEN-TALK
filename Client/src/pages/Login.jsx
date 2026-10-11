import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../features/auth/authSlice';
import authApi from '../api/auth.api';
import AuthLayout from '../components/layout/AuthLayout';
import GlowButton from '../components/common/GlowButton';
import { toast } from 'react-toastify';
import { Lock, Mail, ArrowRight } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res = await authApi.login(data);
      const user = res.data?.data || res.data?.user || res.data;

      dispatch(setCredentials({ user }));
      toast.success(`Welcome back, ${user?.username || 'Pilot'}!`);
      navigate('/app');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Authentication rejected. Verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="🚀 Welcome Back!"
      subtitle="Pick up your conversations with style."
      footer={
        <>
          New to OpenTalk?{" "}
          <Link
            to="/register"
            className="font-semibold text-cyan-500 hover:text-cyan-400 transition-colors"
          >
            Create an account
          </Link>
        </>
      }
    >
      <div className="animate-fade-up">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 
            bg-white dark:bg-[#0d1117] 
            p-6 rounded-xl shadow-lg 
            border border-gray-200 dark:border-white/10 
            transition-colors"
        >
          {/* Email Field */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-slate-200 block mb-2">
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-cyan-500 dark:text-cyan-400" />
              <input
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: 'Enter a valid email address',
                  },
                })}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-lg 
                  bg-gray-50 dark:bg-[#0d1117] 
                  border border-gray-300 dark:border-cyan-400/30 
                  focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 
                  text-sm text-gray-800 dark:text-slate-100 
                  placeholder:text-gray-400 dark:placeholder:text-slate-500 
                  transition-all"
              />
            </div>
            {errors.email && (
              <span className="text-[11px] text-red-500 dark:text-red-400 mt-1 block">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-[11px] text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-cyan-500 dark:text-cyan-400" />
              <input
                type="password"
                {...register('password', {
                  required: 'Password is required',
                })}
                placeholder="Enter your password"
                className="w-full pl-10 pr-4 py-3 rounded-lg 
                  bg-gray-50 dark:bg-[#0d1117] 
                  border border-gray-300 dark:border-cyan-400/30 
                  focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 
                  text-sm text-gray-800 dark:text-slate-100 
                  placeholder:text-gray-400 dark:placeholder:text-slate-500 
                  transition-all"
              />
            </div>
            {errors.password && (
              <span className="text-[11px] text-red-500 dark:text-red-400 mt-1 block">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <GlowButton
              type="submit"
              variant="primary"
              size="lg"
              icon={ArrowRight}
              isLoading={isLoading}
              className="w-full 
                bg-gradient-to-r from-cyan-500 to-blue-600 
                hover:from-cyan-400 hover:to-blue-500 
                text-white shadow-md"
            >
              Sign in
            </GlowButton>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}
