import React, { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * Anti-Gravity Modal Shell
 * Overlay: bg-black/60 backdrop-blur-md
 * Modal: bg-[#0F121A]/95 backdrop-blur-2xl border-white/[0.08] rounded-3xl shadow-[0_20px_80px_rgba(0,0,0,0.65)]
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-lg',
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md transition-opacity duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`w-full ${maxWidth} glass-modal rounded-3xl p-6 border border-white/[0.1] shadow-[0_20px_80px_rgba(0,0,0,0.7)] animate-fade-up relative`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          title="Close dialog (Esc)"
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-white/[0.06] transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        {(title || subtitle) && (
          <div className="mb-5 pr-8">
            {title && (
              <h3 className="font-display font-bold text-lg text-slate-100 tracking-wide">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Modal Content */}
        {children}
      </div>
    </div>
  );
}
