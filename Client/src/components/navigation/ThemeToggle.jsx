import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

const THEME_KEY = 'opentalk_theme_pref_v2';

/**
 * Reusable theme toggle supporting 'dark' | 'light'
 * Persists in localStorage and controls <html> class list.
 */
export default function ThemeToggle({ className = '', showLabel = false }) {
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem(THEME_KEY);
    return storedTheme === 'dark' || storedTheme === 'light' ? storedTheme : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'light');
    root.classList.add(theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const options = [
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'light', label: 'Light', icon: Sun },
  ];

  return (
    <div
      className={`inline-flex items-center p-1 rounded-2xl glass-surface border border-white/10 shadow-sm ${className}`}
      role="group"
      aria-label="Theme selector"
    >
      {options.map((opt) => {
        const Icon = opt.icon;
        const isActive = theme === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => setTheme(opt.id)}
            title={`Switch to ${opt.label} theme`}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer ${
              isActive
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {showLabel && <span>{opt.label}</span>}
          </button>
        );
      })}
    </div>
  );
}
