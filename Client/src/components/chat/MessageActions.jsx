import React, { useState } from 'react';
import {
  Smile,
  CornerUpLeft,
  Pin,
  MoreHorizontal,
  Pencil,
  Trash2,
} from 'lucide-react';

export default function MessageActions({
  onReact,
  onReply,
  onPin,
  onEdit,
  onDelete,
  canManageMessage,
  isPinned = false,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="absolute -top-3.5 right-4 flex items-center gap-0.5 px-1 py-0.5 rounded-xl glass-modal border border-white/10 shadow-[0_4px_16px_rgba(0,0,0,0.5)] z-20 animate-fade-up">
      {/* Quick Reaction Button */}
      <button
        onClick={() => onReact && onReact('🚀')}
        title="Add Cosmic Reaction"
        className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-white/[0.08] transition-colors"
      >
        <Smile className="w-3.5 h-3.5" />
      </button>

      {/* Reply */}
      <button
        onClick={onReply}
        title="Reply with Reference"
        className="p-1.5 rounded-lg text-slate-400 hover:text-purple-300 hover:bg-white/[0.08] transition-colors"
      >
        <CornerUpLeft className="w-3.5 h-3.5" />
      </button>

      {/* Pin */}
      <button
        onClick={onPin}
        title={isPinned ? 'Unpin' : 'Pin to Frequency'}
        className={`p-1.5 rounded-lg transition-colors ${
          isPinned
            ? 'text-amber-400 hover:bg-amber-400/10'
            : 'text-slate-400 hover:text-amber-300 hover:bg-white/[0.08]'
        }`}
      >
        <Pin className="w-3.5 h-3.5" />
      </button>

      {/* More Options / Copy */}
      <button
        onClick={() => setIsMenuOpen((open) => !open)}
        title="More Actions"
        aria-label="More message actions"
        aria-expanded={isMenuOpen}
        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.08] transition-colors"
      >
        <MoreHorizontal className="w-3.5 h-3.5" />
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 top-full mt-1 min-w-36 rounded-xl border border-white/10 glass-modal p-1 shadow-xl">
          {canManageMessage ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  onEdit();
                }}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs text-slate-300 transition-colors hover:bg-white/[0.07] hover:text-cyan-300"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit message
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  onDelete();
                }}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs text-red-300 transition-colors hover:bg-red-500/10"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete message
              </button>
            </>
          ) : (
            <span className="block px-2.5 py-2 text-[11px] text-slate-400">
              You can edit or delete your own messages.
            </span>
          )}
        </div>
      )}
    </div>
  );
}
