import React from 'react';

/**
 * Reusable Anti-Gravity Glass Card with suspended elevation, subtle border reflection and optional hover glow.
 */
export default function GlassCard({
  children,
  className = '',
  hoverEffect = false,
  glowColor = 'cyan', // 'cyan' | 'violet' | 'emerald' | 'none'
  onClick,
  ...props
}) {
  const glowStyles = {
    cyan: 'hover:border-cyan-500/30 hover:shadow-[0_12px_40px_rgba(6,182,212,0.15)]',
    violet: 'hover:border-purple-500/30 hover:shadow-[0_12px_40px_rgba(139,92,246,0.15)]',
    emerald: 'hover:border-emerald-500/30 hover:shadow-[0_12px_40px_rgba(16,185,129,0.15)]',
    none: 'hover:border-white/10',
  };

  return (
    <div
      onClick={onClick}
      className={`glass-card rounded-2xl p-4 transition-all duration-200 ${
        hoverEffect ? `cursor-pointer ${glowStyles[glowColor] || glowStyles.cyan} hover:-translate-y-0.5` : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
