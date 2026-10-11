import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import authApi from '../api/auth.api';
import CosmicAtmosphere from '../components/layout/CosmicAtmosphere';
import GlowButton from '../components/common/GlowButton';
import ThemeToggle from '../components/navigation/ThemeToggle';
import { toast } from 'react-toastify';
import { Radio, KeyRound, ArrowRight, RefreshCw } from 'lucide-react';

export default function VerifyOTP() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const emailParam = searchParams.get('email') || '';

  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: emailParam, otp: '' },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // POST /api/auth/verify-otp
      await authApi.verifyOtp(data);
      toast.success('Security token validated successfully!');
      navigate(`/reset-password?email=${encodeURIComponent(data.email)}&otp=${encodeURIComponent(data.otp)}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or expired OTP token.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!emailParam) {
      toast.error('Email parameter missing.');
      return;
    }
    setIsResending(true);
    try {
      // POST /api/auth/resend-otp
      await authApi.resendOtp({ email: emailParam });
      toast.success('A new OTP token has been transmitted.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend token.');
    } finally {
      setIsResending(false);
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
            Verify Security Token
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Input the 6-digit transmission code sent to {emailParam || 'your frequency coordinate'}.
          </p>
        </div>

        <div className="glass-card rounded-3xl p-8 border border-white/[0.1] shadow-[0_20px_80px_rgba(0,0,0,0.7)]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                Frequency Coordinate (Email)
              </label>
              <input
                type="email"
                {...register('email', { required: 'Email coordinate is required' })}
                className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-cyan-500/50 text-xs text-slate-100"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                OTP Code
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  maxLength={6}
                  {...register('otp', {
                    required: 'OTP token is required',
                    minLength: { value: 4, message: 'Invalid length' },
                  })}
                  placeholder="123456"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-cyan-500/50 focus:outline-none text-xs text-slate-100 tracking-widest font-mono text-center placeholder:text-slate-600"
                />
              </div>
              {errors.otp && (
                <span className="text-[11px] text-red-400 mt-1 block">{errors.otp.message}</span>
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
                Validate Token
              </GlowButton>
            </div>
          </form>

          <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center justify-between">
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
              Resend OTP
            </button>
            <Link to="/login" className="text-xs text-slate-400 hover:text-slate-200">
              Back
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
