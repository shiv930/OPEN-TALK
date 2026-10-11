import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleMute, toggleDeafen } from '../../features/server/serverSlice';
import { openModal } from '../../features/ui/uiSlice';
import { useMyNitro } from '../../hooks/useMyNitro';
import Avatar from '../common/Avatar';
import { Mic, MicOff, Headphones, Settings, Circle } from 'lucide-react';

export default function UserStatusCard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { isMuted, isDeafened } = useSelector((state) => state.server);
  const { data: nitroStatus } = useMyNitro();
  const [userStatus, setUserStatus] = useState('online'); // 'online' | 'idle' | 'dnd' | 'offline'
  const [showStatusPicker, setShowStatusPicker] = useState(false);

  const statuses = [
    { id: 'online', label: 'Online', color: 'text-emerald-400' },
    { id: 'idle', label: 'Idle', color: 'text-amber-400' },
    { id: 'dnd', label: 'Do Not Disturb', color: 'text-red-400' },
    { id: 'offline', label: 'Invisible', color: 'text-slate-400' },
  ];

  return (
    <div className="relative p-2 w-full select-none">
      {/* Floating Status Picker Popup */}
      {showStatusPicker && (
        <div className="absolute bottom-16 left-2 right-2 p-2 rounded-2xl glass-modal z-50 animate-fade-up">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1 block">
            Presence Signal
          </span>
          <div className="space-y-1 mt-1">
            {statuses.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setUserStatus(s.id);
                  setShowStatusPicker(false);
                }}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  userStatus === s.id
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-300 hover:bg-white/[0.05]'
                }`}
              >
                <Circle className={`w-2.5 h-2.5 fill-current ${s.color}`} />
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Control Card */}
      <div className="flex items-center justify-between p-2 rounded-2xl glass-card border border-white/[0.08] shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
        {/* User Details */}
        <div
          onClick={() => setShowStatusPicker(!showStatusPicker)}
          className="flex items-center gap-2.5 cursor-pointer p-1 rounded-xl hover:bg-white/[0.04] transition-colors"
          title="Change Presence"
        >
          <Avatar
            src={user?.profile_pic}
            name={user?.username || 'Observer'}
            size="sm"
            status={userStatus}
            hasNitro={nitroStatus?.hasNitro}
          />
          <div className="flex flex-col text-left">
            <span className="text-xs font-semibold text-slate-200 truncate max-w-[85px] leading-tight">
              {user?.username || 'Observer'}
            </span>
            <span className="text-[10px] text-slate-400 capitalize flex items-center gap-1">
              {userStatus}
            </span>
          </div>
        </div>

        {/* Audio & Settings Control Bar */}
        <div className="flex items-center gap-0.5">
          {/* Mic */}
          <button
            onClick={() => dispatch(toggleMute())}
            title={isMuted ? 'Transmit Audio (Unmute)' : 'Mute Mic'}
            className={`p-1.5 rounded-xl transition-all ${
              isMuted
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.06]'
            }`}
          >
            {isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
          </button>

          {/* Headphones */}
          <button
            onClick={() => dispatch(toggleDeafen())}
            title={isDeafened ? 'Enable Reception' : 'Deafen'}
            className={`p-1.5 rounded-xl transition-all ${
              isDeafened
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.06]'
            }`}
          >
            <Headphones className="w-3.5 h-3.5" />
          </button>

          {/* Settings */}
          <button
            onClick={() => dispatch(openModal({ modal: 'userProfile' }))}
            title="Profile & Node Settings"
            className="p-1.5 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-white/[0.06] transition-all"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
