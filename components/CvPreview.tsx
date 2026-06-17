// components/CvPreview.tsx
'use client';

import { useState } from 'react';
import { CVData } from '@/lib/cv-types';
import ClassicCV from './templates/ClassicCV';
import ProgrammerCV from './templates/ProgrammerCV';
import { Eye, Code, Copy, Check } from 'lucide-react';

interface Props {
  cvData: CVData;
  setCvData: React.Dispatch<React.SetStateAction<CVData>>;
  latexOutput: string;
}

export default function CvPreview({ cvData, setCvData, latexOutput }: Props) {
  const [viewMode, setViewMode] = useState<'visual' | 'latex'>('visual');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(latexOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const setTheme = (color: 'black' | 'blue') => {
    setCvData(prev => ({ ...prev, themeColor: color }));
  };

  return (
    <div className="bg-white rounded-[10px] border border-zinc-200 flex flex-col h-full overflow-hidden shadow-sm">

      {/* Toolbar row 1 — view mode + copy */}
      <div className="flex justify-between items-center bg-zinc-50 px-4 py-2.5 border-b border-zinc-200 no-print">
        {/* View mode toggle */}
        <div className="flex bg-zinc-200 p-0.5 rounded-[8px]">
          <button
            onClick={() => setViewMode('visual')}
            className={`px-3 py-1.5 rounded-[6px] text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'visual'
                ? 'bg-white text-zinc-900 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <Eye size={13} /> Visual
          </button>
          <button
            onClick={() => setViewMode('latex')}
            className={`px-3 py-1.5 rounded-[6px] text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'latex'
                ? 'bg-white text-zinc-900 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <Code size={13} /> LaTeX
          </button>
        </div>

        {/* Copy button (LaTeX mode) */}
        {viewMode === 'latex' && (
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1.5 bg-zinc-950 hover:bg-zinc-800 text-white px-3 py-1.5 rounded-[8px] text-xs font-bold transition shadow-sm cursor-pointer"
          >
            {copied ? (
              <><Check size={13} className="text-green-400" /> Copied</>
            ) : (
              <><Copy size={13} /> Copy LaTeX</>
            )}
          </button>
        )}
      </div>

      {/* Toolbar row 2 — theme color toggle (visual mode only) */}
      {viewMode === 'visual' && (
        <div className="flex items-center gap-2 px-4 py-2 border-b border-zinc-100 bg-white no-print">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Accent</span>
          <div className="flex bg-zinc-100 p-0.5 rounded-[7px] border border-zinc-200">
            <button
              onClick={() => setTheme('black')}
              className={`px-2.5 py-1 rounded-[5px] text-[10px] font-bold transition cursor-pointer flex items-center gap-1.5 ${
                cvData.themeColor === 'black'
                  ? 'bg-zinc-950 text-white shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-zinc-950 inline-block border border-zinc-700" />
              Black
            </button>
            <button
              onClick={() => setTheme('blue')}
              className={`px-2.5 py-1 rounded-[5px] text-[10px] font-bold transition cursor-pointer flex items-center gap-1.5 ${
                cvData.themeColor === 'blue'
                  ? 'bg-[#1A3A5C] text-white shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#1A3A5C] inline-block border border-blue-900" />
              Navy
            </button>
          </div>
          <span className="text-[10px] text-zinc-400 font-medium hidden sm:block">
            Also changes LaTeX output colors
          </span>
        </div>
      )}

      {/* Preview / LaTeX area */}
      <div className="flex-1 overflow-auto bg-zinc-100 p-4 md:p-6 flex justify-center items-start">
        {viewMode === 'visual' ? (
          <div className="w-full max-w-[210mm] shadow-2xl rounded-[4px] overflow-hidden bg-white">
            {cvData.template === 'classic' ? (
              <ClassicCV cvData={cvData} />
            ) : (
              <ProgrammerCV cvData={cvData} />
            )}
          </div>
        ) : (
          <div className="w-full max-w-4xl font-mono text-[11px] bg-zinc-950 text-zinc-100 p-5 rounded-[8px] overflow-auto border border-zinc-800 shadow-inner max-h-[72vh]">
            <pre className="whitespace-pre-wrap leading-relaxed">{latexOutput}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
