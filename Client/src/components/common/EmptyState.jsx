import React from 'react';
import GlowButton from './GlowButton';
import { MessageSquareDashed } from 'lucide-react';

export default function EmptyState({
  icon: Icon = MessageSquareDashed,
  title = 'No content found',
  description = 'There are no items in this view yet.',
  actionLabel,
  onAction,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 max-w-sm mx-auto ${className}`}>
      <div className="w-14 h-14 rounded-2xl glass-card flex items-center justify-center text-cyan-400 mb-4 border border-cyan-500/20 shadow-[0_0_30px_-5px_rgba(6,182,212,0.2)]">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="font-display font-semibold text-slate-200 text-lg mb-1">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed mb-5">{description}</p>
      {actionLabel && onAction && (
        <GlowButton variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </GlowButton>
      )}
    </div>
  );
}
