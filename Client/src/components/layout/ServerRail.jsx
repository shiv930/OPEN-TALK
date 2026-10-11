import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveServerId, setActiveChannelId } from '../../features/server/serverSlice';
import { openModal } from '../../features/ui/uiSlice';
import { useServers } from '../../hooks/useServers';
import { Plus, Compass, Sparkles } from 'lucide-react';
import Avatar from '../common/Avatar';

export default function ServerRail() {
  const dispatch = useDispatch();
  const { activeServerId } = useSelector((state) => state.server);
  const { data: servers = [], isLoading } = useServers();

  const handleSelectServer = (serverId) => {
    dispatch(setActiveServerId(serverId));
    // Clear channel so the channel drawer selects the first available channel
    dispatch(setActiveChannelId(null));
  };

  return (
    <aside
      aria-label="Server Navigation"
      className="flex flex-col items-center py-4 px-2 w-[72px] shrink-0 z-30 select-none"
    >
      {/* Floating Glass Rail Dock */}
      <div className="w-full h-full flex flex-col items-center justify-between py-3 glass-dock rounded-3xl relative">
        {/* Top: Home / Direct Communications */}
        <div className="flex flex-col items-center gap-3 w-full">
          <button
            onClick={() => handleSelectServer(null)}
            title="OpenTalk Home"
            className={`group relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-200 cursor-pointer ${
              activeServerId === null
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                : 'bg-white/[0.04] text-slate-300 hover:text-cyan-300 hover:bg-white/[0.08] border border-white/5'
            }`}
          >
            {/* Active Pill Indicator */}
            <span
              className={`absolute -left-2 w-1.5 rounded-r-full bg-cyan-400 shadow-[0_0_10px_#06B6D4] transition-all duration-200 ${
                activeServerId === null ? 'h-7 opacity-100' : 'h-2 opacity-0 group-hover:opacity-60'
              }`}
            />
            <Sparkles className="w-5 h-5" />
          </button>

          {/* Micro separator line */}
          <div className="w-7 h-[1px] bg-white/10 my-0.5 rounded-full" />

          {/* Server List */}
          <div className="flex flex-col items-center gap-2.5 w-full max-h-[50vh] overflow-y-auto no-scrollbar">
            {isLoading ? (
              <div className="w-10 h-10 rounded-2xl bg-white/5 animate-pulse" />
            ) : (
              servers.map((server) => {
                const isActive = activeServerId === server._id;
                return (
                  <button
                    key={server._id}
                    onClick={() => handleSelectServer(server._id)}
                    title={server.name}
                    className={`group relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'border border-cyan-400/50 shadow-[0_0_20px_rgba(6,182,212,0.35)] scale-105'
                        : 'border border-white/5 hover:border-white/20 hover:scale-[1.02]'
                    }`}
                  >
                    {/* Active Pill Indicator */}
                    <span
                      className={`absolute -left-2 w-1.5 rounded-r-full bg-cyan-400 shadow-[0_0_10px_#06B6D4] transition-all duration-200 ${
                        isActive ? 'h-7 opacity-100' : 'h-2 opacity-0 group-hover:opacity-60'
                      }`}
                    />

                    {server.icon ? (
                      <img
                        src={server.icon}
                        alt={server.name}
                        className="w-full h-full object-cover rounded-2xl"
                      />
                    ) : (
                      <Avatar name={server.name} size="md" className="rounded-2xl" />
                    )}
                  </button>
                );
              })
            )}

            {/* Create Server Button */}
            <button
              onClick={() => dispatch(openModal({ modal: 'createServer' }))}
              title="Initialize Server Node"
              className="group relative flex items-center justify-center w-11 h-11 rounded-2xl bg-white/[0.03] hover:bg-emerald-500/15 border border-dashed border-white/15 hover:border-emerald-500/40 text-slate-400 hover:text-emerald-400 transition-all duration-200 hover:shadow-[0_0_16px_rgba(16,185,129,0.25)] cursor-pointer"
            >
              <Plus className="w-5 h-5 transition-transform duration-200 group-hover:rotate-90" />
            </button>

            {/* Explore / Discover Servers */}
            <button
              onClick={() => dispatch(openModal({ modal: 'publicHubs' }))}
              title="Explore Public Coordinates"
              className="group relative flex items-center justify-center w-11 h-11 rounded-2xl bg-white/[0.03] hover:bg-purple-500/15 border border-white/10 hover:border-purple-500/40 text-slate-400 hover:text-purple-300 transition-all duration-200 hover:shadow-[0_0_16px_rgba(139,92,246,0.25)] cursor-pointer"
            >
              <Compass className="w-5 h-5 transition-transform duration-300 group-hover:rotate-45" />
            </button>
          </div>
        </div>

        {/* Bottom Orbit Indicator */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400/80 shadow-[0_0_10px_#06B6D4] animate-pulse" />
        </div>
      </div>
    </aside>
  );
}
