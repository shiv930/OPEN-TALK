import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveChannelId, setActiveVoiceChannelId } from '../../features/server/serverSlice';
import { openModal } from '../../features/ui/uiSlice';
import { useChannels } from '../../hooks/useChannels';
import { useServers } from '../../hooks/useServers';
import { useMyNitro } from '../../hooks/useMyNitro';
import UserStatusCard from './UserStatusCard';
import { toast } from 'react-toastify';
import {
  Hash,
  Volume2,
  ChevronDown,
  Plus,
  Settings,
  Share2,
  Sparkles,
  Compass,
  Crown,
  ArrowUpRight,
} from 'lucide-react';
import { SkeletonChannel } from '../common/Loader';

export default function ChannelDrawer() {
  const dispatch = useDispatch();
  const { activeServerId, activeChannelId, activeVoiceChannelId } = useSelector(
    (state) => state.server
  );
  const { isChannelDrawerOpen } = useSelector((state) => state.ui);

  const { data: servers = [] } = useServers();
  const currentServer = servers.find((s) => s._id === activeServerId) || null;

  const {
    data: channels = [],
    isLoading,
    isError: hasChannelsError,
  } = useChannels(activeServerId);
  const { data: nitroStatus, isPending: isNitroPending } = useMyNitro();
  const hasNitro = nitroStatus?.hasNitro === true;

  const [textCollapsed, setTextCollapsed] = useState(false);
  const [voiceCollapsed, setVoiceCollapsed] = useState(false);
  const [serverMenuOpen, setServerMenuOpen] = useState(false);

  const textChannels = channels.filter((c) => c.type !== 'voice');
  const voiceChannels = channels.filter((c) => c.type === 'voice');

  const handleShareInvite = async () => {
    if (!currentServer?.inviteCode) {
      toast.error('Invite code is not available for this server');
      return;
    }

    try {
      await navigator.clipboard.writeText(currentServer.inviteCode);
      toast.success('Server invite code copied');
    } catch {
      toast.error(`Invite code: ${currentServer.inviteCode}`);
    }
  };

  // Restore a valid channel after reload, or select the first available text channel.
  useEffect(() => {
    if (
      activeServerId &&
      !isLoading &&
      !hasChannelsError &&
      !channels.some((channel) => channel._id === activeChannelId)
    ) {
      dispatch(setActiveChannelId(textChannels[0]?._id || null));
    }
  }, [activeServerId, activeChannelId, channels, dispatch, hasChannelsError, isLoading, textChannels]);

  useEffect(() => {
    if (!isNitroPending && !hasNitro && activeVoiceChannelId) {
      dispatch(setActiveVoiceChannelId(null));
    }
  }, [activeVoiceChannelId, dispatch, hasNitro, isNitroPending]);

  if (!isChannelDrawerOpen) {
    return null;
  }

  // If on Home / Direct Communications (activeServerId is null)
  if (!activeServerId) {
    return (
      <nav
        aria-label="Direct Messages"
        className="w-64 h-full py-4 pr-2 flex flex-col shrink-0 select-none z-20"
      >
        <div className="w-full h-full flex flex-col glass-dock rounded-3xl p-3 border border-white/[0.08]">
          <div className="flex flex-col gap-3">
            {/* Header */}
            <div className="flex items-center gap-2.5 p-2 rounded-2xl bg-white/[0.03] border border-white/5">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="font-display font-semibold text-sm text-slate-200">
                Direct Orbit
              </span>
            </div>

            <div className="px-1 text-xs text-slate-400 leading-relaxed">
              Explore public nodes or start a direct neural link with community members.
            </div>

            <button
              onClick={() => dispatch(openModal({ modal: 'publicHubs' }))}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/25 hover:bg-cyan-500/20 text-xs font-medium transition-all"
            >
              <Compass className="w-4 h-4" />
              Browse Public Hubs
            </button>
          </div>

          {!isNitroPending && !hasNitro && (
            <div className="mt-auto px-2">
              <button
                onClick={() => dispatch(openModal({ modal: 'nitro' }))}
                className="w-full flex items-center gap-2.5 rounded-xl border border-amber-400/25 bg-gradient-to-r from-amber-500/15 to-purple-500/15 px-3 py-2.5 text-left transition-all hover:border-amber-300/45 hover:from-amber-500/20 hover:to-purple-500/20"
              >
                <Crown className="h-4 w-4 shrink-0 text-amber-300" />
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-semibold text-amber-100">Get Nitro</span>
                  <span className="block text-[10px] text-slate-400">Unlock your next level</span>
                </span>
                <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-amber-200" />
              </button>
            </div>
          )}

          <UserStatusCard />
        </div>
      </nav>
    );
  }

  return (
    <nav
      aria-label="Channels"
      className="w-64 h-full py-4 pr-2 flex flex-col shrink-0 select-none z-20"
    >
      <div className="w-full h-full flex flex-col justify-between glass-dock rounded-3xl relative border border-white/[0.08]">
        {/* Top: Server Header & Dropdown */}
        <div className="flex flex-col">
          <div className="relative p-2.5 border-b border-white/[0.06]">
            <button
              onClick={() => setServerMenuOpen(!serverMenuOpen)}
              className="w-full flex items-center justify-between p-2 rounded-2xl hover:bg-white/[0.05] transition-all group"
            >
              <div className="flex flex-col text-left truncate mr-2">
                <span className="font-display font-semibold text-sm text-slate-100 truncate tracking-wide">
                  {currentServer?.name || 'OpenTalk Server'}
                </span>
                <span className="text-[10px] text-cyan-400 uppercase tracking-widest font-mono">
                  {currentServer?.category || 'Node Active'}
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                  serverMenuOpen ? 'rotate-180 text-cyan-400' : 'group-hover:text-slate-200'
                }`}
              />
            </button>

            {/* Server Action Popup Menu */}
            {serverMenuOpen && (
              <div className="absolute top-16 left-3 right-3 p-1.5 rounded-2xl glass-modal z-50 animate-fade-up">
                <button
                  onClick={() => {
                    setServerMenuOpen(false);
                    dispatch(openModal({ modal: 'createChannel', data: { serverId: activeServerId } }));
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-cyan-400" />
                  Create Channel
                </button>
                <button
                  onClick={() => {
                    setServerMenuOpen(false);
                    dispatch(openModal({ modal: 'serverSettings', data: { server: currentServer } }));
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-purple-300 hover:bg-purple-500/10 transition-colors"
                >
                  <Settings className="w-3.5 h-3.5 text-purple-400" />
                  Server Settings
                </button>
                <button
                  onClick={() => {
                    setServerMenuOpen(false);
                    handleShareInvite();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-emerald-300 hover:bg-emerald-500/10 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                  Share Invite Coordinates
                </button>
              </div>
            )}
          </div>

          {/* Channels Scroll Area */}
          <div className="p-2 space-y-4 max-h-[calc(100vh-230px)] overflow-y-auto">
            {/* TEXT CHANNELS */}
            <div>
              <div className="flex items-center justify-between px-2 py-1 mb-1">
                <button
                  onClick={() => setTextCollapsed(!textCollapsed)}
                  className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 hover:text-slate-200 uppercase tracking-widest transition-colors"
                >
                  <ChevronDown
                    className={`w-3 h-3 transition-transform ${textCollapsed ? '-rotate-90' : ''}`}
                  />
                  <span>Text Frequencies</span>
                  <span className="text-cyan-400 font-mono text-[9px]">({textChannels.length})</span>
                </button>
                <button
                  onClick={() =>
                    dispatch(openModal({ modal: 'createChannel', data: { serverId: activeServerId, defaultType: 'text' } }))
                  }
                  title="Create Text Channel"
                  className="text-slate-400 hover:text-cyan-400 p-1 hover:bg-white/[0.06] rounded-lg transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {!textCollapsed && (
                <div className="space-y-0.5">
                  {isLoading ? (
                    <>
                      <SkeletonChannel />
                      <SkeletonChannel />
                    </>
                  ) : textChannels.length === 0 ? (
                    <div className="px-3 py-2 text-[11px] text-slate-500 italic">No channels yet</div>
                  ) : (
                    textChannels.map((channel) => {
                      const isActive = activeChannelId === channel._id;
                      return (
                        <button
                          key={channel._id}
                          onClick={() => dispatch(setActiveChannelId(channel._id))}
                          className={`w-full group flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer ${
                            isActive
                              ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_4px_16px_rgba(6,182,212,0.15)] translate-x-1'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                          }`}
                        >
                          <Hash
                            className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                              isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-400'
                            }`}
                          />
                          <span className="truncate">{channel.name}</span>
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            {/* VOICE CHANNELS */}
            {hasNitro && <div>
              <div className="flex items-center justify-between px-2 py-1 mb-1">
                <button
                  onClick={() => setVoiceCollapsed(!voiceCollapsed)}
                  className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 hover:text-slate-200 uppercase tracking-widest transition-colors"
                >
                  <ChevronDown
                    className={`w-3 h-3 transition-transform ${voiceCollapsed ? '-rotate-90' : ''}`}
                  />
                  <span>Voice Lounges</span>
                  <span className="text-purple-400 font-mono text-[9px]">({voiceChannels.length})</span>
                </button>
                <button
                  onClick={() =>
                    dispatch(openModal({ modal: 'createChannel', data: { serverId: activeServerId, defaultType: 'voice' } }))
                  }
                  title="Create Voice Lounge"
                  className="text-slate-400 hover:text-purple-400 p-1 hover:bg-white/[0.06] rounded-lg transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {!voiceCollapsed && (
                <div className="space-y-0.5">
                  {voiceChannels.length === 0 ? (
                    <div className="px-3 py-2 text-[11px] text-slate-500 italic">No voice lounges</div>
                  ) : (
                    voiceChannels.map((channel) => {
                      const isConnected = activeVoiceChannelId === channel._id;
                      return (
                        <button
                          key={channel._id}
                          onClick={() => {
                            dispatch(
                              setActiveVoiceChannelId(isConnected ? null : channel._id)
                            );
                          }}
                          className={`w-full group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer ${
                            isConnected
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/35 shadow-[0_4px_16px_rgba(139,92,246,0.15)] translate-x-1'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <Volume2
                              className={`w-3.5 h-3.5 shrink-0 ${
                                isConnected ? 'text-purple-400 animate-pulse' : 'text-slate-500 group-hover:text-slate-400'
                              }`}
                            />
                            <span className="truncate">{channel.name}</span>
                          </div>
                          {isConnected && (
                            <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/20 px-1.5 py-0.5 rounded-md">
                              LIVE
                            </span>
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>}
          </div>
        </div>

        {/* Bottom User Card */}
        <div className="space-y-1">
          {!isNitroPending && !hasNitro && (
            <div className="px-2">
              <button
                onClick={() => dispatch(openModal({ modal: 'nitro' }))}
                className="w-full flex items-center gap-2.5 rounded-xl border border-amber-400/25 bg-gradient-to-r from-amber-500/15 to-purple-500/15 px-3 py-2.5 text-left transition-all hover:border-amber-300/45 hover:from-amber-500/20 hover:to-purple-500/20"
              >
                <Crown className="h-4 w-4 shrink-0 text-amber-300" />
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-semibold text-amber-100">Get Nitro</span>
                  <span className="block text-[10px] text-slate-400">Unlock your next level</span>
                </span>
                <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-amber-200" />
              </button>
            </div>
          )}
          <UserStatusCard />
        </div>
      </div>
    </nav>
  );
}
