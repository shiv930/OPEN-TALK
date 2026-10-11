import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import Avatar from '../common/Avatar';
import MessageActions from './MessageActions';
import messageApi from '../../api/message.api';
import { FileText, Download, Check, X } from 'lucide-react';

export default function MessageItem({ message, channelId, onReply }) {
  const queryClient = useQueryClient();
  const { user } = useSelector((state) => state.auth);
  const [isHovered, setIsHovered] = useState(false);
  const [reactions, setReactions] = useState([]);
  const [isPinned, setIsPinned] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const authorName =
    message.author_details?.username ||
    message.author?.username ||
    (typeof message.author === 'string' ? message.author : 'Cosmic Observer');

  const profilePic = message.author_details?.profile_pic || message.author?.profile_pic;
  const authorId = message.author_id || message.author_details?._id || message.author?._id;
  const isOwnMessage = Boolean(user?._id && authorId && user._id === authorId);

  const formattedTime = new Date(message.createdAt || Date.now()).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleAddReaction = (emoji) => {
    setReactions((prev) => {
      const existing = prev.find((r) => r.emoji === emoji);
      if (existing) {
        return prev.map((r) => (r.emoji === emoji ? { ...r, count: r.count + 1 } : r));
      }
      return [...prev, { emoji, count: 1 }];
    });
  };

  const handleEdit = async (event) => {
    event.preventDefault();
    const content = editedContent.trim();
    if (!content) {
      toast.error('Message cannot be empty');
      return;
    }

    setIsSaving(true);
    try {
      const response = await messageApi.updateMessage(message._id, content);
      const updatedMessage = response.data?.data || { ...message, content };
      queryClient.setQueryData(['messages', channelId], (messages = []) =>
        messages.map((item) => item._id === message._id ? { ...item, ...updatedMessage } : item)
      );
      setIsEditing(false);
      toast.success('Message updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not update message');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this message? This cannot be undone.')) return;

    setIsDeleting(true);
    try {
      await messageApi.deleteMessage(message._id);
      queryClient.setQueryData(['messages', channelId], (messages = []) =>
        messages.filter((item) => item._id !== message._id)
      );
      toast.success('Message deleted');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not delete message');
      setIsDeleting(false);
    }
  };

  return (
    <article
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative flex items-start gap-3.5 px-4 py-2.5 mx-2 rounded-2xl transition-all duration-150 ${
        isHovered
          ? 'bg-white/[0.03] shadow-[0_4px_20px_rgba(0,0,0,0.2)]'
          : 'bg-transparent'
      } ${message.isOptimistic || isDeleting ? 'opacity-70' : ''}`}
    >
      {/* Floating Action Dock (Visible on hover) */}
      {isHovered && (
        <MessageActions
          onReact={handleAddReaction}
          onReply={() => onReply && onReply(message)}
          onPin={() => setIsPinned(!isPinned)}
          onEdit={() => {
            setEditedContent(message.content || '');
            setIsEditing(true);
          }}
          onDelete={handleDelete}
          canManageMessage={isOwnMessage && !message.isOptimistic && !isDeleting}
          isPinned={isPinned}
        />
      )}

      {/* Author Avatar */}
      <Avatar
        src={profilePic}
        name={authorName}
        size="md"
        className="mt-0.5"
        hasNitro={message.author_details?.hasNitro || message.author?.hasNitro}
      />

      {/* Message Body */}
      <div className="flex-1 min-w-0">
        {/* Author Header */}
        <div className="flex items-center gap-2 mb-1">
          <span className="font-display font-semibold text-xs text-cyan-300 hover:underline cursor-pointer">
            {authorName}
          </span>
          <span className="text-[10px] text-slate-500 font-mono">
            {formattedTime}
          </span>
          {isPinned && (
            <span className="flex items-center gap-1 text-[9px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-full">
              Pinned
            </span>
          )}
          {message.isOptimistic && (
            <span className="text-[10px] text-cyan-400/80 animate-pulse font-mono">
              orbiting...
            </span>
          )}
        </div>

        {/* Text Content */}
        {isEditing ? (
          <form onSubmit={handleEdit} className="mt-2 space-y-2">
            <textarea
              autoFocus
              value={editedContent}
              onChange={(event) => setEditedContent(event.target.value)}
              maxLength={2000}
              rows={Math.min(5, Math.max(2, editedContent.split('\n').length))}
              aria-label="Edit message"
              className="w-full resize-y rounded-xl border border-cyan-400/30 bg-black/20 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-300/60"
            />
            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={isSaving || !editedContent.trim()}
                className="rounded-lg bg-cyan-500/20 px-3 py-1.5 text-xs font-medium text-cyan-200 hover:bg-cyan-500/30 disabled:opacity-50"
              >
                {isSaving ? 'Saving…' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditedContent(message.content || '');
                  setIsEditing(false);
                }}
                className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs text-slate-400 hover:bg-white/[0.06] hover:text-slate-200"
              >
                <X className="h-3 w-3" />
                Cancel
              </button>
            </div>
          </form>
        ) : message.content ? (
          <p className="text-sm text-slate-200 leading-relaxed break-words whitespace-pre-wrap selection:bg-cyan-500/30">
            {message.content}
          </p>
        ) : null}

        {/* Attachments Section */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-2.5">
            {message.attachments.map((att, idx) => {
              if (att.type === 'image' || att.url?.match(/\.(jpeg|jpg|gif|png|webp)/i)) {
                return (
                  <div
                    key={idx}
                    className="relative max-w-sm rounded-2xl overflow-hidden glass-card border border-white/10 group/img"
                  >
                    <img
                      src={att.url}
                      alt={att.name || 'Attachment'}
                      className="max-h-64 object-cover rounded-2xl transition-transform duration-200 group-hover/img:scale-[1.01]"
                      loading="lazy"
                    />
                  </div>
                );
              }

              return (
                <a
                  key={idx}
                  href={att.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={att.name}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl glass-card border border-white/10 hover:border-cyan-500/30 text-xs text-slate-200 transition-all hover:bg-white/[0.06]"
                >
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span className="truncate max-w-[150px] font-medium">{att.name || 'Attachment'}</span>
                  <Download className="w-3.5 h-3.5 text-slate-400" />
                </a>
              );
            })}
          </div>
        )}

        {/* Reactions List */}
        {reactions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {reactions.map((r, i) => (
              <button
                key={i}
                onClick={() => handleAddReaction(r.emoji)}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/[0.04] border border-cyan-500/20 text-xs text-slate-200 hover:bg-white/[0.08] transition-colors"
              >
                <span>{r.emoji}</span>
                <span className="text-[10px] text-cyan-400 font-mono">{r.count}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
