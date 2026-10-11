import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleMemberDrawer, toggleChannelDrawer } from '../../features/ui/uiSlice';
import ThemeToggle from '../navigation/ThemeToggle';
import {
  Hash,
  Volume2,
  Search,
  X,
  PanelLeft,
  PanelRightClose,
  PanelRightOpen,
} from 'lucide-react';

export default function ChatHeader({ channel, searchQuery, onSearchChange }) {
  const dispatch = useDispatch();
  const { isMemberDrawerOpen, isChannelDrawerOpen } = useSelector((state) => state.ui);
  const { activeServerId } = useSelector((state) => state.server);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef(null);

  const isVoice = channel?.type === 'voice';

  useEffect(() => {
    if (isSearchOpen) searchInputRef.current?.focus();
  }, [isSearchOpen]);

  const toggleSearch = () => {
    if (isSearchOpen) {
      onSearchChange('');
      setIsSearchOpen(false);
    } else {
      setIsSearchOpen(true);
    }
  };

  return (
    <header className="px-4 py-2 shrink-0 select-none z-10">
      <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl glass-card border border-white/[0.08]">
        {/* Left: Channel Info */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Mobile drawer toggle */}
          <button
            onClick={() => dispatch(toggleChannelDrawer())}
            title={isChannelDrawerOpen ? 'Hide Channels' : 'Show Channels'}
            className="md:hidden p-1.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] transition-all"
          >
            <PanelLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            {isVoice ? (
              <Volume2 className="w-5 h-5 text-purple-400 shrink-0" />
            ) : (
              <Hash className="w-5 h-5 text-cyan-400 shrink-0" />
            )}
            <h2 className="font-display font-semibold text-base text-slate-100 truncate tracking-wide">
              {channel?.name || 'select-a-channel'}
            </h2>
          </div>

          {(channel?.topic || channel?.description) && (
            <>
              <div className="hidden sm:block w-[1px] h-4 bg-white/10 shrink-0" />
              <p className="hidden sm:block text-xs text-slate-400 truncate max-w-xs md:max-w-md">
                {channel.topic || channel.description}
              </p>
            </>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Theme Toggle */}
          <ThemeToggle />

          {channel && isSearchOpen && (
            <input
              ref={searchInputRef}
              type="search"
              aria-label="Search messages in this channel"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              className="w-32 sm:w-52 rounded-xl border border-cyan-500/25 bg-white/[0.04] px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 outline-none focus:border-cyan-400/60"
            />
          )}

          {channel && (
            <button
              type="button"
              onClick={toggleSearch}
              title={isSearchOpen ? 'Close message search' : 'Search messages in this channel'}
              aria-label={isSearchOpen ? 'Close message search' : 'Search messages'}
              aria-pressed={isSearchOpen}
              className={`p-2 rounded-xl transition-all ${
                isSearchOpen
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.06]'
              }`}
            >
              {isSearchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
            </button>
          )}

          {/* Member Drawer Toggle */}
          {activeServerId && (
            <button
              type="button"
              onClick={() => dispatch(toggleMemberDrawer())}
              title={isMemberDrawerOpen ? 'Hide member sidebar' : 'Show member sidebar'}
              aria-label={isMemberDrawerOpen ? 'Hide member sidebar' : 'Show member sidebar'}
              aria-pressed={isMemberDrawerOpen}
              className={`p-2 rounded-xl transition-all ${
                isMemberDrawerOpen
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.06]'
              }`}
            >
              {isMemberDrawerOpen ? (
                <PanelRightClose className="w-4 h-4" />
              ) : (
                <PanelRightOpen className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
