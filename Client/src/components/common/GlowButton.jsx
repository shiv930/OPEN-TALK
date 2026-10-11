import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Reusable Anti-Gravity Glow Button with soft outer illumination,
 * active depression micro-interaction and optional loading state.
 */
export default function GlowButton({
  children,
  type = 'button',
  variant = 'primary', // 'primary' | 'secondary' | 'violet' | 'danger' | 'ghost'
  size = 'md',        // 'sm' | 'md' | 'lg' | 'icon'
  isLoading = false,
  disabled = false,
  icon: Icon,
  className = '',
  onClick,
  ...props
}) {
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs rounded-xl gap-1.5',
    md: 'px-4 py-2.5 text-sm rounded-xl gap-2 font-medium',
    lg: 'px-6 py-3 text-base rounded-2xl gap-2.5 font-medium',
    icon: 'p-2.5 rounded-xl justify-center',
  };

  const variantStyles = {
    primary:
      'bg-[var(--accent-cyan)] text-[#143C3C] border border-[var(--border-highlight)] hover:brightness-95 shadow-[var(--shadow-glow-cyan)]',
    violet:
      'bg-purple-500/15 text-purple-300 border border-purple-500/30 hover:bg-purple-500/25 hover:border-purple-400/50 shadow-[0_0_20px_-3px_rgba(139,92,246,0.25)] hover:shadow-[0_0_25px_0_rgba(139,92,246,0.35)]',
    secondary:
      'bg-white/[0.04] text-slate-200 border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.15]',
    ghost:
      'text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] border border-transparent',
    danger:
      'bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25 hover:border-red-400/50 shadow-[0_0_20px_-3px_rgba(239,68,68,0.25)]',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`inline-flex items-center justify-center transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:transform-none select-none backdrop-blur-md cursor-pointer ${
        sizeStyles[size] || sizeStyles.md
      } ${variantStyles[variant] || variantStyles.primary} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      {children}
    </button>
  );
}
