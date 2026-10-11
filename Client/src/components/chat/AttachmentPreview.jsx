import React from 'react';
import { X, FileText, Image as ImageIcon } from 'lucide-react';

export default function AttachmentPreview({ files = [], onRemove }) {
  if (!files || files.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 px-4 py-2 border-b border-white/[0.06] bg-white/[0.02]">
      {files.map((file, idx) => {
        const isImg = file.type?.startsWith('image/');
        const previewUrl = isImg ? URL.createObjectURL(file) : null;

        return (
          <div
            key={idx}
            className="group relative flex items-center gap-2 p-1.5 pr-7 rounded-xl glass-card border border-white/10 text-xs text-slate-200"
          >
            {isImg ? (
              <img
                src={previewUrl}
                alt={file.name}
                className="w-7 h-7 object-cover rounded-lg"
              />
            ) : (
              <FileText className="w-5 h-5 text-cyan-400" />
            )}
            <span className="truncate max-w-[120px] font-mono text-[11px]">{file.name}</span>

            {/* Remove Attachment Button */}
            <button
              type="button"
              onClick={() => onRemove(idx)}
              className="absolute right-1 top-1.5 p-1 rounded-md text-slate-400 hover:text-red-400 hover:bg-white/[0.08] transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
