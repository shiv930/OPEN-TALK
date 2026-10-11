import React from 'react';
import StatusDot from './StatusDot';

/**
 * Reusable Anti-Gravity Avatar component with fallback initials and status badge
 */
export default function Avatar({
  src,
  alt = 'Avatar',
  name = '',
  size = 'md', // 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  status,      // 'online' | 'idle' | 'dnd' | 'offline' | null
  hasNitro = false,
  className = '',
}) {
  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const getInitials = (text) => {
    if (!text) return '?';
    const parts = text.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return text.slice(0, 2).toUpperCase();
  };

  return (
    <div className={`relative inline-flex shrink-0 ${sizeClasses[size] || sizeClasses.md} ${className}`}>
      <div
        className={`w-full h-full rounded-2xl overflow-hidden glass-card flex items-center justify-center border bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-transparent ${
          hasNitro
            ? 'border-sky-100 ring-2 ring-sky-400/80 shadow-[0_0_12px_rgba(56,189,248,0.45)]'
            : 'border-white/10'
        }`}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover transition-opacity duration-200"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <span className="font-display font-semibold text-slate-300 select-none">
            {getInitials(name || alt)}
          </span>
        )}
      </div>

      {status && (
        <span className="absolute -bottom-0.5 -right-0.5">
          <StatusDot status={status} size={size === 'xs' || size === 'sm' ? 'sm' : 'md'} />
        </span>
      )}
    </div>
  );
}
