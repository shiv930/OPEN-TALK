import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import authApi from '../api/auth.api';
import CosmicAtmosphere from '../components/layout/CosmicAtmosphere';
import GlowButton from '../components/common/GlowButton';
import ThemeToggle from '../components/navigation/ThemeToggle';
import { toast } from 'react-toastify';
import { Radio, Lock, ArrowRight } from 'lucide-react';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const emailParam = searchParams.get('email') || '';
  const otpParam = searchParams.get('otp') || '';

  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: emailParam,
      otp: otpParam,
      newPassword: '',
      confirmPassword: '',
    },
  });

  const newPasswordValue = watch('newPassword');

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // POST /api/auth/resetPassword
      await authApi.resetPassword(data);
      toast.success('Passkey updated successfully! Authenticate with new key.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update passkey.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#07090E] text-slate-100 flex flex-col justify-center items-center px-4 selection:bg-cyan-500/30">
      <CosmicAtmosphere />
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md z-10 animate-fade-up">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl glass-card border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.35)] mb-3">
            <Radio className="w-7 h-7 animate-pulse" />
          </div>
          <h2 className="font-display font-bold text-2xl text-slate-100 tracking-wide">
            Reset Cosmic Passkey
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Synthesize a new access passkey for {emailParam}
          </p>
        </div>

        <div className="glass-card rounded-3xl p-8 border border-white/[0.1] shadow-[0_20px_80px_rgba(0,0,0,0.7)]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1">
                New Passkey
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  {...register('newPassword', {
                    required: 'New passkey is required',
                    minLength: { value: 6, message: 'Minimum 6 characters' },
                  })}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-cyan-500/50 focus:outline-none text-xs text-slate-100 placeholder:text-slate-500"
                />
              </div>
              {errors.newPassword && (
                <span className="text-[11px] text-red-400 mt-1 block">
                  {errors.newPassword.message}
                </span>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1">
                Confirm Passkey
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  {...register('confirmPassword', {
                    required: 'Please confirm passkey',
                    validate: (val) => val === newPasswordValue || 'Passkeys do not match',
                  })}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-cyan-500/50 focus:outline-none text-xs text-slate-100 placeholder:text-slate-500"
                />
              </div>
              {errors.confirmPassword && (
                <span className="text-[11px] text-red-400 mt-1 block">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>

            <div className="pt-2">
              <GlowButton
                type="submit"
                variant="primary"
                size="lg"
                icon={ArrowRight}
                isLoading={isLoading}
                className="w-full"
              >
                Establish New Passkey
              </GlowButton>
            </div>
          </form>

          <div className="mt-4 pt-4 border-t border-white/[0.06] text-center">
            <Link to="/login" className="text-xs text-slate-400 hover:text-cyan-300">
              Return to Authentication
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
