import React from 'react';
import { useSelector } from 'react-redux';
import { useMembers } from '../../hooks/useMembers';
import Avatar from '../common/Avatar';
import { Shield, Sparkles } from 'lucide-react';

export default function MemberDrawer() {
  const { activeServerId } = useSelector((state) => state.server);
  const { isMemberDrawerOpen } = useSelector((state) => state.ui);
  const { data: members = [], isLoading } = useMembers(activeServerId);

  if (!isMemberDrawerOpen || !activeServerId) {
    return null;
  }

  const onlineMembers = members.filter((m) => m.status === 'online' || m.status === 'idle');
  const offlineMembers = members.filter((m) => m.status === 'offline' || !m.status);

  const getRoleBadgeStyle = (role) => {
    switch (role?.toLowerCase()) {
      case 'owner':
      case 'commander':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
      case 'admin':
      case 'architect':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'moderator':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      default:
        return 'text-slate-400 bg-white/[0.04] border-white/5';
    }
  };

  return (
    <aside
      aria-label="Server Crew"
      className="w-60 h-full py-4 pl-2 pr-4 flex flex-col shrink-0 select-none z-20"
    >
      <div className="w-full h-full glass-dock rounded-3xl p-3 border border-white/[0.08] flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-2 px-2 py-1.5 mb-2 border-b border-white/[0.06]">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-display font-semibold text-xs text-slate-200 tracking-wider uppercase">
            Orbital Crew
          </span>
        </div>

        {/* Member Scroll View */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* ONLINE SECTION */}
          <div>
            <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
              <span>Online</span>
              <span className="text-emerald-400 font-mono text-[9px]">
                {onlineMembers.length}
              </span>
            </div>

            <div className="space-y-1 mt-1">
              {onlineMembers.map((member) => {
                const u = member.user || member;
                return (
                  <div
                    key={member._id || u._id}
                    className="group flex items-center gap-2.5 p-2 rounded-2xl hover:bg-white/[0.04] transition-all cursor-pointer"
                  >
                    <Avatar
                      src={u.profile_pic}
                      name={u.username || 'Crew'}
                      size="sm"
                      status={member.status || 'online'}
                      hasNitro={u.hasNitro}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-medium text-slate-200 truncate group-hover:text-cyan-300 transition-colors">
                          {u.username || 'Member'}
                        </span>
                        {member.role && (
                          <span
                            className={`text-[9px] font-mono px-1.5 py-0.2 rounded-md border ${getRoleBadgeStyle(
                              member.role
                            )}`}
                          >
                            {member.role}
                          </span>
                        )}
                      </div>
                      {member.activity && (
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">
                          {member.activity}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* OFFLINE SECTION */}
          {offlineMembers.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-between">
                <span>Dormant</span>
                <span className="font-mono text-[9px]">{offlineMembers.length}</span>
              </div>

              <div className="space-y-1 mt-1 opacity-70 hover:opacity-100 transition-opacity">
                {offlineMembers.map((member) => {
                  const u = member.user || member;
                  return (
                    <div
                      key={member._id || u._id}
                      className="group flex items-center gap-2.5 p-2 rounded-2xl hover:bg-white/[0.04] transition-all cursor-pointer"
                    >
                      <Avatar
                        src={u.profile_pic}
                        name={u.username || 'Crew'}
                        size="sm"
                        status="offline"
                        hasNitro={u.hasNitro}
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-medium text-slate-400 truncate group-hover:text-slate-200 transition-colors">
                          {u.username || 'Member'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
