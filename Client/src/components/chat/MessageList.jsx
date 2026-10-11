import React, { useEffect, useRef } from 'react';
import { useMessages } from '../../hooks/useMessages';
import { useSocket } from '../../hooks/useSocket';
import MessageItem from './MessageItem';
import { SkeletonMessage } from '../common/Loader';
import ErrorState from '../common/ErrorState';
import { Hash, SearchX } from 'lucide-react';

export default function MessageList({ channelId, channel, onReply, searchQuery = '' }) {
  const { data: messages = [], isLoading, error, refetch } = useMessages(channelId);
  const bottomRef = useRef(null);
  const normalizedQuery = searchQuery.trim().toLocaleLowerCase();
  const visibleMessages = normalizedQuery
    ? messages.filter((message) => {
        const author =
          message.author_details?.username ||
          message.author?.username ||
          (typeof message.author === 'string' ? message.author : '');
        const attachmentNames = (message.attachments || []).map((attachment) => attachment.name || '').join(' ');
        return `${message.content || ''} ${author} ${attachmentNames}`
          .toLocaleLowerCase()
          .includes(normalizedQuery);
      })
    : messages;

  // Bind real-time WebSocket events directly to this channel's query cache!
  useSocket(channelId);

  // Auto-scroll to latest communication
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [visibleMessages.length]);

  if (isLoading) {
    return (
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        <SkeletonMessage />
        <SkeletonMessage />
        <SkeletonMessage />
        <SkeletonMessage />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <ErrorState
          title="Messages could not be loaded"
          message={error.response?.data?.message || error.message || 'Check your connection and try again.'}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  if (messages.length === 0 && !normalizedQuery) {
    return (
      <div className="flex-1 flex flex-col justify-end p-6">
        <div className="mb-8 p-6 rounded-3xl glass-surface border border-white/5 max-w-md">
          <div className="w-12 h-12 rounded-2xl glass-card border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3">
            <Hash className="w-6 h-6" />
          </div>
          <h3 className="font-display font-semibold text-lg text-slate-100 mb-1">
            Initiate #{channel?.name || 'frequency'}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {channel?.topic || channel?.description || 'This is the start of this cosmic communication channel.'}
          </p>
        </div>
        <div ref={bottomRef} />
      </div>
    );
  }

  if (visibleMessages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-2 p-6 text-center">
        <SearchX className="h-8 w-8 text-slate-500" />
        <p className="text-sm font-medium text-slate-300">No matching messages</p>
        <p className="text-xs text-slate-500">Try another word or phrase.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
      {/* Channel Initiation Header */}
      <div className="px-6 py-6 mb-4 border-b border-white/[0.05]">
        <div className="w-10 h-10 rounded-2xl glass-card border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-2">
          <Hash className="w-5 h-5" />
        </div>
        <h3 className="font-display font-semibold text-base text-slate-100">
          Welcome to #{channel?.name}
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          {channel?.topic || channel?.description || 'Orbital communications active.'}
        </p>
      </div>

      {/* Message Sequence */}
      {visibleMessages.map((message, index) => (
        <MessageItem
          key={message._id || `${channelId}-${index}`}
          message={message}
          channelId={channelId}
          onReply={onReply}
        />
      ))}

      <div ref={bottomRef} />
    </div>
  );
}
