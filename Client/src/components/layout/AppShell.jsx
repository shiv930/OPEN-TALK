import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveChannelId, setActiveServerId } from '../../features/server/serverSlice';
import CosmicAtmosphere from './CosmicAtmosphere';
import ServerRail from './ServerRail';
import ChannelDrawer from './ChannelDrawer';
import MemberDrawer from './MemberDrawer';
import ChatHeader from '../chat/ChatHeader';
import MessageList from '../chat/MessageList';
import MessageComposer from '../chat/MessageComposer';
import { useChannels } from '../../hooks/useChannels';
import { useServers } from '../../hooks/useServers';
import ModalManager from '../modals/ModalManager';
import EmptyState from '../common/EmptyState';
import { openModal } from '../../features/ui/uiSlice';
import { Compass } from 'lucide-react';

export default function AppShell() {
  const dispatch = useDispatch();
  const { activeServerId, activeChannelId } = useSelector((state) => state.server);
  const {
    data: servers = [],
    isLoading: isServersLoading,
    isError: hasServersError,
  } = useServers();
  const { data: channels = [] } = useChannels(activeServerId);

  const [replyToMessage, setReplyToMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setSearchQuery('');
  }, [activeChannelId]);

  useEffect(() => {
    if (
      !isServersLoading &&
      !hasServersError &&
      activeServerId &&
      !servers.some((server) => server._id === activeServerId)
    ) {
      dispatch(setActiveServerId(null));
      dispatch(setActiveChannelId(null));
    }
  }, [activeServerId, dispatch, hasServersError, isServersLoading, servers]);

  const activeChannel = channels.find((c) => c._id === activeChannelId) || channels[0] || null;
  const currentServer = servers.find((s) => s._id === activeServerId) || null;

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col bg-[#07090E] text-slate-100">
      {/* Ambient Cosmic Background */}
      <CosmicAtmosphere />

      {/* Main Suspended Workspace Viewport */}
      <div className="flex-1 flex overflow-hidden p-2 gap-1.5 z-10">
        {/* Left Server Rail */}
        <ServerRail />

        {/* Channels Drawer */}
        <ChannelDrawer />

        {/* Center Main Stage / Chat Viewport */}
        <main className="flex-1 flex flex-col min-w-0 h-full py-4 px-1 z-10">
          <div className="w-full h-full flex flex-col glass-dock rounded-3xl overflow-hidden border border-white/[0.08] relative">
            {/* Floating Channel Header */}
            <ChatHeader
              channel={activeChannel}
              server={currentServer}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />

            {/* Messages Viewport */}
            {activeChannel ? (
              <>
                <MessageList
                  channelId={activeChannel._id}
                  channel={activeChannel}
                  searchQuery={searchQuery}
                  onReply={(msg) => setReplyToMessage(msg)}
                />

                {/* Floating Composer */}
                <MessageComposer
                  channelId={activeChannel._id}
                  channelName={activeChannel.name}
                  replyTo={replyToMessage}
                  onCancelReply={() => setReplyToMessage(null)}
                />
              </>
            ) : (
              <EmptyState
                icon={Compass}
                title={activeServerId ? 'No channel selected' : 'Your next conversation starts here'}
                description={
                  activeServerId
                    ? 'Choose a channel from the sidebar to view its messages.'
                    : 'Select a server or explore public hubs to find a place to chat.'
                }
                actionLabel={activeServerId ? undefined : 'Browse Public Hubs'}
                onAction={
                  activeServerId
                    ? undefined
                    : () => dispatch(openModal({ modal: 'publicHubs' }))
                }
                className="flex-1"
              />
            )}
          </div>
        </main>

        {/* Right Member Drawer */}
        <MemberDrawer />
      </div>

      {/* Floating Modals System */}
      <ModalManager />
    </div>
  );
}
