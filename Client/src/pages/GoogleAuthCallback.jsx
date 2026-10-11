import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setCredentials } from '../features/auth/authSlice';
import userApi from '../api/user.api';
import Loader from '../components/common/Loader';

export default function GoogleAuthCallback() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    let isActive = true;

    userApi.getMe()
      .then((response) => {
        if (!isActive) return;
        const user = response.data?.data || response.data?.user || response.data;
        dispatch(setCredentials({ user }));
        navigate('/app', { replace: true });
      })
      .catch((error) => {
        if (!isActive) return;
        toast.error(error.response?.data?.message || 'Google sign-in could not be completed. Please try again.');
        navigate('/login', { replace: true });
      });

    return () => {
      isActive = false;
    };
  }, [dispatch, navigate]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#07090E] text-slate-100">
      <div className="flex items-center gap-3 text-sm text-slate-300">
        <Loader />
        Signing you in with Google...
      </div>
    </main>
  );
}