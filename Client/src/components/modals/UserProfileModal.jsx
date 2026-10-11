import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Modal from './Modal';
import GlowButton from '../common/GlowButton';
import Avatar from '../common/Avatar';
import { logout, updateCurrentUser } from '../../features/auth/authSlice';
import authApi from '../../api/auth.api';
import userApi from '../../api/user.api';
import { toast } from 'react-toastify';
import { Crown, LogOut } from 'lucide-react';
import { useMyNitro } from '../../hooks/useMyNitro';

export default function UserProfileModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { data: nitroStatus, isPending: isNitroLoading, isError: hasNitroError } = useMyNitro();

  const [fullname, setFullname] = useState(user?.fullname || '');
  const [mobileNo, setMobileNo] = useState(user?.mobile_no || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // POST /api/user/update-profile
      const response = await userApi.updateProfile({ fullname, mobile_no: mobileNo });
      dispatch(updateCurrentUser(response.data?.data || { fullname, mobile_no: mobileNo }));
      toast.success('Cosmic profile coordinates updated');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      // continue client logout regardless
    }
    dispatch(logout());
    toast.info('Disconnected from orbital transmission');
    onClose();
    window.location.href = '/login';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="User Identity & Frequency Link"
      subtitle="Manage your personal credentials and presence status."
    >
      <form onSubmit={handleUpdate} className="space-y-4">
        {/* Profile Card Header */}
        <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/[0.03] border border-white/5">
          <Avatar
            src={user?.profile_pic}
            name={user?.username || 'Observer'}
            size="lg"
            status="online"
            hasNitro={nitroStatus?.hasNitro}
          />
          <div>
            <div className="text-sm font-semibold text-slate-100">
              {user?.username || 'Observer'}
            </div>
            <div className="text-xs text-cyan-400 font-mono">
              {user?.email || 'unlinked@opentalk.space'}
            </div>
          </div>
        </div>

        <section className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
            <Crown className="h-4 w-4 text-sky-300" />
            Nitro subscription
          </div>
          {isNitroLoading ? (
            <p className="mt-2 text-xs text-slate-400">Loading subscription details…</p>
          ) : hasNitroError ? (
            <p className="mt-2 text-xs text-amber-300">Subscription details are currently unavailable.</p>
          ) : nitroStatus?.hasNitro ? (
            <div className="mt-2 space-y-1 text-xs text-slate-300">
              <p>Purchased: {new Date(nitroStatus.nitro.createdAt || nitroStatus.nitro.startDate).toLocaleDateString()}</p>
              <p>Expires: {new Date(nitroStatus.nitro.endDate).toLocaleDateString()}</p>
              <p>
                {Math.max(0, Math.ceil((new Date(nitroStatus.nitro.endDate).getTime() - Date.now()) / 86400000))} days remaining
              </p>
            </div>
          ) : (
            <p className="mt-2 text-xs text-slate-400">No active Nitro subscription.</p>
          )}
        </section>

        <div>
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1">
            Display Name
          </label>
          <input
            type="text"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            placeholder="Your full name"
            className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 focus:border-cyan-500/50 text-xs text-slate-100"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1">
            Transmission Contact (Mobile)
          </label>
          <input
            type="text"
            value={mobileNo}
            onChange={(e) => setMobileNo(e.target.value)}
            placeholder="+1 (555) 000-0000"
            className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 focus:border-cyan-500/50 text-xs text-slate-100"
          />
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
          <GlowButton variant="danger" size="sm" icon={LogOut} onClick={handleLogout}>
            Sever Link (Logout)
          </GlowButton>
          <div className="flex items-center gap-2">
            <GlowButton variant="ghost" size="sm" onClick={onClose}>
              Close
            </GlowButton>
            <GlowButton type="submit" variant="primary" size="sm" isLoading={isSaving}>
              Save Profile
            </GlowButton>
          </div>
        </div>
      </form>
    </Modal>
  );
}
