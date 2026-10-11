import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import authApi from '../api/auth.api';
import CosmicAtmosphere from '../components/layout/CosmicAtmosphere';
import GlowButton from '../components/common/GlowButton';
import ThemeToggle from '../components/navigation/ThemeToggle';
import { toast } from 'react-toastify';
import { Radio, Mail, ArrowRight, ArrowLeft } from 'lucide-react';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { email: '' } });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // POST /api/auth/forget-password
      await authApi.forgetPassword(data);
      toast.success('Security OTP dispatched to your coordinate!');
      navigate(`/verify-otp?email=${encodeURIComponent(data.email)}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Transmission failed. Verify email coordinate.');
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
            Recover Access Passkey
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Provide your email to receive a recovery telemetry verification token.
          </p>
        </div>

        <div className="glass-card rounded-3xl p-8 border border-white/[0.1] shadow-[0_20px_80px_rgba(0,0,0,0.7)]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                Frequency Coordinate (Email)
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /\S+@\S+\.\S+/, message: 'Valid email required' },
                  })}
                  placeholder="cosmo@opentalk.space"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-cyan-500/50 focus:outline-none text-xs text-slate-100 placeholder:text-slate-500"
                />
              </div>
              {errors.email && (
                <span className="text-[11px] text-red-400 mt-1 block">{errors.email.message}</span>
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
                Transmit OTP Token
              </GlowButton>
            </div>
          </form>

          <div className="mt-4 pt-4 border-t border-white/[0.06] text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-300 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Authentication
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
