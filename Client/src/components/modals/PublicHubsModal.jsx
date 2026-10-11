import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { Compass, Gamepad2, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import serverApi from '../../api/server.api';
import { useJoinServer } from '../../hooks/useServers';
import { setActiveChannelId, setActiveServerId } from '../../features/server/serverSlice';
import { openModal } from '../../features/ui/uiSlice';
import Modal from './Modal';
import GlowButton from '../common/GlowButton';

export default function PublicHubsModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const [inviteCode, setInviteCode] = useState('');
  const {
    data: publicServers = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['publicServers'],
    queryFn: async () => {
      const response = await serverApi.getPublicServers();
      const servers = response.data?.data;
      if (!Array.isArray(servers)) {
        throw new Error('Public server response was invalid');
      }
      return servers;
    },
    enabled: isOpen,
    staleTime: 60_000,
  });
  const { mutateAsync: joinServer, isPending: isJoining } = useJoinServer();

  const handleJoin = async (code) => {
    const normalizedCode = code.trim();
    if (!normalizedCode) {
      toast.error('Enter a server invite code');
      return;
    }

    try {
      const server = await joinServer(normalizedCode);
      if (server?._id) {
        dispatch(setActiveServerId(server._id));
        dispatch(setActiveChannelId(null));
        onClose();
      }
    } catch {
      // useJoinServer reports the API error with a toast.
    }
  };

  const gamingHubs = publicServers.filter((server) =>
    `${server.category || ''} ${server.name || ''} ${server.description || ''}`
      .toLocaleLowerCase()
      .includes('gam')
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Browse Public Hubs"
      subtitle="Find a public community or join any server with an invite code."
      maxWidth="max-w-2xl"
    >
      <div className="max-h-[70vh] space-y-5 overflow-y-auto pr-1">
        <form
          className="flex flex-col gap-2 rounded-2xl border border-cyan-400/20 bg-cyan-500/[0.05] p-3 sm:flex-row"
          onSubmit={(event) => {
            event.preventDefault();
            handleJoin(inviteCode);
          }}
        >
          <input
            value={inviteCode}
            onChange={(event) => setInviteCode(event.target.value)}
            placeholder="Paste a server invite code"
            aria-label="Server invite code"
            className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 outline-none focus:border-cyan-400/50"
          />
          <GlowButton type="submit" size="sm" variant="primary" isLoading={isJoining}>
            Join with code
          </GlowButton>
        </form>

        <section>
          <div className="mb-3 flex items-center gap-2">
            <Gamepad2 className="h-4 w-4 text-purple-300" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Gaming & simulation
            </h4>
            <span className="text-[10px] text-slate-500">({gamingHubs.length})</span>
          </div>

          {isLoading ? (
            <div className="flex items-center gap-2 py-5 text-xs text-slate-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading public hubs…
            </div>
          ) : isError ? (
            <div className="rounded-xl border border-red-400/15 bg-red-400/[0.04] p-3">
              <p className="text-xs text-red-300">
                {error?.response?.data?.message || error.message || 'Could not load public hubs.'}
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="mt-2 text-xs text-cyan-300 hover:text-cyan-200"
              >
                Try again
              </button>
            </div>
          ) : gamingHubs.length === 0 ? (
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 text-center">
              <p className="text-xs font-medium text-slate-300">No public gaming hubs yet</p>
              <p className="mt-1 text-[11px] text-slate-500">
                Create the first public Gaming & Simulation server, or join one with an invite code above.
              </p>
              <GlowButton
                size="sm"
                variant="violet"
                className="mt-3"
                onClick={() => dispatch(openModal({
                  modal: 'createServer',
                  data: { category: 'Gaming', isPublic: true },
                }))}
              >
                Create public Gaming hub
              </GlowButton>
            </div>
          ) : (
            <div className="space-y-2">
              {gamingHubs.map((server) => (
                <article
                  key={server._id}
                  className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-3"
                >
                  {server.icon ? (
                    <img src={server.icon} alt="" className="h-10 w-10 rounded-xl object-cover" />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-400/20 bg-purple-500/10 text-purple-300">
                      <Gamepad2 className="h-5 w-5" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-slate-100">{server.name}</p>
                    <p className="mt-0.5 truncate text-[10px] text-slate-400">
                      {server.description || server.category || 'Gaming community'}
                    </p>
                  </div>
                  {server.isMember ? (
                    <span className="shrink-0 rounded-lg border border-emerald-400/20 bg-emerald-400/[0.06] px-2 py-1 text-[10px] text-emerald-300">
                      Joined
                    </span>
                  ) : (
                    <GlowButton
                      size="sm"
                      variant="violet"
                      disabled={isJoining}
                      onClick={() => handleJoin(server.inviteCode)}
                    >
                      Join
                    </GlowButton>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>

        <div className="flex items-start gap-2 border-t border-white/[0.06] pt-3 text-[10px] leading-relaxed text-slate-500">
          <Compass className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>
            Public servers are listed here when their owner enables public visibility. Invite codes work for public or private servers.
          </span>
        </div>
      </div>
    </Modal>
  );
}
