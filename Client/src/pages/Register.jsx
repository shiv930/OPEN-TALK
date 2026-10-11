import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../features/auth/authSlice';
import authApi from '../api/auth.api';
import AuthLayout from '../components/layout/AuthLayout';
import GlowButton from '../components/common/GlowButton';
import { toast } from 'react-toastify';
import { Lock, Mail, User, Phone, UploadCloud, ArrowRight } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: '',
      fullname: '',
      email: '',
      password: '',
      mobile_no: '',
      dob: '2000-01-01',
    },
  });

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('username', data.username);
      formData.append('fullname', data.fullname);
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('mobile_no', data.mobile_no || '');
      formData.append('dob', data.dob || '2000-01-01');
      if (avatarFile) {
        formData.append('image', avatarFile);
      }

      const res = await authApi.register(formData);
      const user = res.data?.data || res.data?.user || res.data;

      dispatch(setCredentials({ user }));
      toast.success('Identity generated! Welcome aboard OpenTalk.');
      navigate('/app');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration rejected. Please verify details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Set up your profile and find your community on OpenTalk."
      footer={
        <>
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-cyan-500 hover:text-cyan-400 transition-colors"
          >
            Sign in
          </Link>
        </>
      }
    >
      {/* ✅ Remove extra min-h-screen wrapper */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md mx-auto space-y-4 
          bg-white dark:bg-[#111821] 
          p-6 rounded-xl shadow-lg 
          border border-gray-200 dark:border-white/10 
          transition-colors"
      >
        {/* Avatar Upload */}
        <div className="flex flex-col items-center mb-2">
          <label className="cursor-pointer group flex flex-col items-center">
            <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Avatar preview"
                className="w-14 h-14 rounded-xl object-cover border border-cyan-500/40 shadow mb-1"
              />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-gray-100 dark:bg-[#0d1117] border border-gray-300 dark:border-white/10 flex items-center justify-center text-gray-400 dark:text-slate-400 group-hover:text-cyan-500 group-hover:border-cyan-500/30 transition-all mb-1">
                <UploadCloud className="w-5 h-5" />
              </div>
            )}
            <span className="text-[11px] font-medium text-gray-500 dark:text-slate-400 group-hover:text-cyan-500 transition-colors">
              {avatarPreview ? 'Change photo' : 'Add photo'}
            </span>
          </label>
        </div>

        {/* Username & Fullname */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            {...register('username', { required: 'Username is required' })}
            placeholder="Username"
            className="w-full px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-[#0d1117] border border-gray-300 dark:border-white/10 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm text-gray-800 dark:text-slate-100"
          />
          <input
            type="text"
            {...register('fullname', { required: 'Full name is required' })}
            placeholder="Full name"
            className="w-full px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-[#0d1117] border border-gray-300 dark:border-white/10 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm text-gray-800 dark:text-slate-100"
          />
        </div>

        {/* Email */}
        <input
          type="email"
          {...register('email', { required: 'Email is required' })}
          placeholder="Email address"
          className="w-full px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-[#0d1117] border border-gray-300 dark:border-white/10 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm text-gray-800 dark:text-slate-100"
        />

        {/* Password */}
        <input
          type="password"
          {...register('password', { required: 'Password is required' })}
          placeholder="Password"
          className="w-full px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-[#0d1117] border border-gray-300 dark:border-white/10 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm text-gray-800 dark:text-slate-100"
        />

        {/* Phone */}
        <input
          type="text"
          {...register('mobile_no')}
          placeholder="Phone number (optional)"
          className="w-full px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-[#0d1117] border border-gray-300 dark:border-white/10 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm text-gray-800 dark:text-slate-100"
        />

        {/* Submit */}
        <GlowButton
          type="submit"
          variant="primary"
          size="lg"
          icon={ArrowRight}
          isLoading={isLoading}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-md"
        >
          Create account
        </GlowButton>
      </form>
    </AuthLayout>
  );
}
