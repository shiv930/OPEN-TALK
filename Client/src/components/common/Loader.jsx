import React from 'react';

/**
 * Anti-Gravity Cosmic Spinner & Skeleton Loader
 */
export default function Loader({ size = 'md', text = '', fullScreen = false }) {
  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative">
        {/* Pulsing orbital aura */}
        <div className="w-12 h-12 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
        <div className="absolute inset-1 rounded-full border-2 border-purple-500/20 border-b-purple-400 animate-spin [animation-direction:reverse]" />
        <div className="absolute inset-3 rounded-full bg-cyan-400/20 animate-pulse" />
      </div>
      {text && (
        <span className="text-xs font-medium text-slate-400 tracking-wider uppercase animate-pulse">
          {text}
        </span>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#07090E]/80 backdrop-blur-xl">
        {spinner}
      </div>
    );
  }

  return <div className="py-8 flex items-center justify-center">{spinner}</div>;
}

export function SkeletonMessage() {
  return (
    <div className="flex items-start gap-3.5 p-3 rounded-2xl animate-pulse">
      <div className="w-10 h-10 rounded-2xl bg-white/5 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <div className="h-4 w-28 rounded bg-white/10" />
          <div className="h-3 w-16 rounded bg-white/5" />
        </div>
        <div className="h-3.5 w-3/4 rounded bg-white/5" />
        <div className="h-3.5 w-1/2 rounded bg-white/5" />
      </div>
    </div>
  );
}

export function SkeletonChannel() {
  return (
    <div className="h-9 w-full rounded-xl bg-white/5 animate-pulse my-1" />
  );
}
