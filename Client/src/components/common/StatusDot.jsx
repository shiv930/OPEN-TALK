import React from 'react';

/**
 * Status indicator dot for user presence
 * status: 'online' | 'idle' | 'dnd' | 'offline'
 */
export default function StatusDot({ status = 'offline', size = 'md', className = '' }) {
  const sizeMap = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
  };

  const statusColors = {
    online: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]',
    idle: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.7)]',
    dnd: 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.7)]',
    offline: 'bg-slate-500/70',
  };

  return (
    <span
      className={`inline-block rounded-full ring-2 ring-[#07090E] dark:ring-[#07090E] light:ring-white transition-all duration-200 shrink-0 ${
        sizeMap[size] || sizeMap.md
      } ${statusColors[status] || statusColors.offline} ${className}`}
      title={`Status: ${status}`}
    />
  );
}
