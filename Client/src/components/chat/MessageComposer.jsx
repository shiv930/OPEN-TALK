import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useSendMessage } from '../../hooks/useSendMessage';
import AttachmentPreview from './AttachmentPreview';
import { Plus, Smile, Send, X, CornerUpLeft, Loader2 } from 'lucide-react';

export default function MessageComposer({ channelId, channelName = 'general', replyTo, onCancelReply }) {
  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: { content: '' },
  });

  const [attachments, setAttachments] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const { mutate: sendMessage, isPending } = useSendMessage(channelId);
  const contentValue = watch('content');

  const commonEmojis = ['✨', '🚀', '🌌', '⚡', '💫', '👾', '🛰️', '🔥', '👍', '❤️'];

  const onSubmit = (data) => {
    const trimmed = data.content?.trim();
    if (!trimmed && attachments.length === 0) return;

    let finalContent = trimmed;
    if (replyTo) {
      const targetUser = replyTo.author_details?.username || replyTo.author?.username || 'member';
      finalContent = `> @${targetUser}: "${replyTo.content?.slice(0, 50)}..."\n${finalContent}`;
    }

    sendMessage(
      { content: finalContent, attachments },
      {
        onSuccess: () => {
          reset();
          setAttachments([]);
          if (onCancelReply) onCancelReply();
          if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
          }
        },
      }
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setAttachments((prev) => [...prev, ...files]);
    }
    // reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const addEmoji = (emoji) => {
    const current = contentValue || '';
    setValue('content', current + emoji);
    setShowEmojiPicker(false);
    textareaRef.current?.focus();
  };

  const autoResizeTextarea = (e) => {
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 140) + 'px';
  };

  return (
    <div className="p-4 pt-1 shrink-0 select-none z-10">
      <div className="relative rounded-2xl glass-card border border-white/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.5)] overflow-visible">
        {/* Reply Indicator Bar */}
        {replyTo && (
          <div className="flex items-center justify-between px-4 py-1.5 bg-cyan-500/10 border-b border-cyan-500/20 text-xs text-cyan-300 rounded-t-2xl">
            <div className="flex items-center gap-2 truncate">
              <CornerUpLeft className="w-3.5 h-3.5 shrink-0" />
              <span>
                Transmitting reply to{' '}
                <strong className="text-white">
                  @{replyTo.author_details?.username || replyTo.author?.username || 'user'}
                </strong>
              </span>
            </div>
            <button
              onClick={onCancelReply}
              className="p-1 rounded-md hover:bg-white/10 text-cyan-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Attachment Previews */}
        <AttachmentPreview files={attachments} onRemove={removeAttachment} />

        {/* Floating Emoji Picker Popover */}
        {showEmojiPicker && (
          <div className="absolute bottom-16 right-10 p-2 rounded-2xl glass-modal z-50 animate-fade-up border border-white/10">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-1 block mb-1">
              Cosmic Glyphs
            </span>
            <div className="grid grid-cols-5 gap-1">
              {commonEmojis.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => addEmoji(emoji)}
                  className="p-2 rounded-xl hover:bg-white/[0.08] text-base transition-transform hover:scale-110"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Composer Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex items-end gap-2 p-2">
          {/* File Upload Trigger */}
          <input
            type="file"
            multiple
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,video/*,.pdf,.doc,.docx,.txt"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Attach Data Node (Multer)"
            className="p-2.5 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-white/[0.06] transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
          </button>

          {/* Text Area Input */}
          <div className="flex-1">
            <textarea
              {...register('content')}
              ref={(e) => {
                register('content').ref(e);
                textareaRef.current = e;
              }}
              rows={1}
              onInput={autoResizeTextarea}
              onKeyDown={handleKeyDown}
              placeholder={`Message #${channelName}...`}
              className="w-full max-h-[140px] py-2 px-1 text-sm bg-transparent border-0 focus:outline-none focus:ring-0 text-slate-100 placeholder:text-slate-500 resize-none font-normal leading-relaxed"
            />
          </div>

          {/* Emoji Trigger */}
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            title="Cosmic Glyphs"
            className="p-2.5 rounded-xl text-slate-400 hover:text-amber-300 hover:bg-white/[0.06] transition-all cursor-pointer shrink-0"
          >
            <Smile className="w-4 h-4" />
          </button>

          {/* Send Button */}
          <button
            type="submit"
            disabled={isPending || (!contentValue?.trim() && attachments.length === 0)}
            title="Transmit Message"
            className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 hover:bg-cyan-500/30 hover:shadow-[0_0_20px_rgba(6,182,212,0.35)] active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer shrink-0"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
