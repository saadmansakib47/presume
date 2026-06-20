// components/TemplateBrowserModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { X, User, ArrowRight, Loader2 } from 'lucide-react';
import { CVData } from '@/lib/cv-types';

interface TemplateItem {
  id: string;
  name: string;
  description: string;
  contributor: string;
  data: CVData;
}

interface Props {
  onSelect: (data: CVData) => void;
  onClose: () => void;
}

export default function TemplateBrowserModal({ onSelect, onClose }: Props) {
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  useEffect(() => {
    fetch('/community-templates.json')
      .then((res) => res.json())
      .then((data) => {
        setTemplates(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load community templates:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div
      className="modal-backdrop fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="modal-panel bg-white rounded-2xl border border-zinc-200 shadow-2xl w-full max-w-2xl p-5 sm:p-8 relative flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-900 transition cursor-pointer p-1"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="space-y-1 mb-6 pr-6">
          <h2 className="text-lg sm:text-xl font-black tracking-tight text-zinc-950 uppercase flex items-center gap-2">
            Community Templates
          </h2>
          <p className="text-sm text-zinc-500 font-medium">
            Browse and load pre-configured design presets and professional structures built by other users.
          </p>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-zinc-400">
              <Loader2 className="animate-spin text-zinc-500" size={32} />
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Loading templates...</p>
            </div>
          ) : templates.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-zinc-200 rounded-xl space-y-2">
              <p className="text-sm font-bold text-zinc-450 uppercase tracking-wide">No Templates Found</p>
              <p className="text-xs text-zinc-500">Be the first to contribute a LaTeX preset!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {templates.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => {
                    onSelect(tpl.data);
                    onClose();
                  }}
                  className="group text-left bg-white border border-zinc-200 hover:border-zinc-900 rounded-xl p-5 flex flex-col justify-between gap-4 transition duration-200 shadow-sm hover:shadow-md cursor-pointer"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-sm font-extrabold text-zinc-900 uppercase tracking-wide group-hover:text-zinc-950 transition">
                        {tpl.name}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-zinc-100 border border-zinc-200 text-[8px] font-bold text-zinc-500 uppercase shrink-0">
                        {tpl.data.template}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 font-semibold leading-relaxed">
                      {tpl.description}
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-zinc-150">
                    <span className="text-[9px] font-bold text-zinc-450 flex items-center gap-1.5 uppercase">
                      <User size={10} />
                      {tpl.contributor}
                    </span>
                    <span className="text-[10px] font-bold text-zinc-400 group-hover:text-zinc-900 transition flex items-center gap-1 uppercase tracking-wider">
                      Apply <ArrowRight size={10} />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
