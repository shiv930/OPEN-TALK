import React from 'react';
import GlowButton from './GlowButton';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorState({
  title = 'Something suspended unexpectedly',
  message = 'Unable to connect to the node network. Please retry.',
  onRetry,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 max-w-sm mx-auto ${className}`}>
      <div className="w-14 h-14 rounded-2xl glass-card flex items-center justify-center text-red-400 mb-4 border border-red-500/20 shadow-[0_0_30px_-5px_rgba(239,68,68,0.2)]">
        <AlertCircle className="w-7 h-7" />
      </div>
      <h3 className="font-display font-semibold text-slate-200 text-lg mb-1">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed mb-5">{message}</p>
      {onRetry && (
        <GlowButton variant="secondary" size="sm" icon={RefreshCw} onClick={onRetry}>
          Try Again
        </GlowButton>
      )}
    </div>
  );
}
