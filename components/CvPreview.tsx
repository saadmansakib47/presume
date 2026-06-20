// components/CvPreview.tsx
'use client';

import { useState } from 'react';
import { CVData } from '@/lib/cv-types';
import ClassicCV from './templates/ClassicCV';
import ProgrammerCV from './templates/ProgrammerCV';
import { Eye, Code, Copy, Check, ExternalLink, RotateCcw } from 'lucide-react';


interface Props {
  cvData: CVData;
  setCvData: React.Dispatch<React.SetStateAction<CVData>>;
  latexOutput: string;
  customLatex: string | null;
  setCustomLatex: (val: string | null) => void;
}

export default function CvPreview({
  cvData,
  setCvData,
  latexOutput,
  customLatex,
  setCustomLatex,
}: Props) {
  const [viewMode, setViewMode] = useState<'visual' | 'latex'>('visual');
  const [copied, setCopied] = useState(false);

  const activeLatex = customLatex !== null ? customLatex : latexOutput;
  const isLatexEdited = customLatex !== null;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(activeLatex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const setTheme = (color: 'black' | 'blue') => {
    setCvData(prev => ({ ...prev, themeColor: color }));
  };

  const handleOpenInOverleaf = () => {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://www.overleaf.com/docs';
    form.target = '_blank';

    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'snip';
    input.value = activeLatex;

    form.appendChild(input);
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  };

  return (
    <div className="bg-white rounded-[10px] border border-zinc-200 flex flex-col overflow-hidden shadow-sm">

      {/* Toolbar row 1 — view mode + copy */}
      <div className="flex flex-wrap justify-between items-center gap-2 bg-zinc-50 px-3 sm:px-4 py-2.5 border-b border-zinc-200 no-print">
        {/* View mode toggle */}
        <div className="flex items-center gap-3">
          <div className="flex bg-zinc-200 p-0.5 rounded-[8px]">
            <button
              onClick={() => setViewMode('visual')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-[6px] text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'visual'
                  ? 'bg-white text-zinc-900 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              <Eye size={13} /> Visual
            </button>
            <button
              onClick={() => setViewMode('latex')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-[6px] text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'latex'
                  ? 'bg-white text-zinc-900 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              <Code size={13} /> LaTeX
            </button>
          </div>

          {viewMode === 'latex' && isLatexEdited && (
            <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold uppercase tracking-wider animate-pulse">
              Manual Edits Active
            </span>
          )}
        </div>

        {/* Actions (LaTeX mode) */}
        {viewMode === 'latex' && (
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            {isLatexEdited && (
              <button
                onClick={() => {
                  setCustomLatex(null);
                }}
                className="flex items-center gap-1.5 bg-white hover:bg-zinc-100 text-zinc-600 px-2.5 py-1.5 rounded-[8px] text-xs font-bold transition border border-zinc-200 shadow-sm cursor-pointer"
                title="Reset to match form input"
              >
                <RotateCcw size={13} />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}

            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1.5 bg-zinc-950 hover:bg-zinc-800 text-white px-3 py-1.5 rounded-[8px] text-xs font-bold transition shadow-sm cursor-pointer"
            >
              {copied ? (
                <><Check size={13} className="text-green-400" /> Copied</>
              ) : (
                <><Copy size={13} /> Copy</>
              )}
            </button>

            <button
              onClick={handleOpenInOverleaf}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-[8px] text-xs font-bold transition shadow-sm border border-emerald-700/10 cursor-pointer"
            >
              <ExternalLink size={13} />
              <span>Open in Overleaf</span>
            </button>
          </div>
        )}
      </div>

      {/* Toolbar row 2 — theme color toggle (visual mode only) */}
      {viewMode === 'visual' && (
        <div className="flex flex-wrap items-center gap-2 px-3 sm:px-4 py-2 border-b border-zinc-100 bg-white no-print">
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
                  ? 'bg-zinc-950 text-white shadow-sm'
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
      <div className="flex-1 overflow-auto bg-zinc-100 p-3 sm:p-4 md:p-6 flex justify-center items-start">
        {viewMode === 'visual' ? (
          /* Scale the A4 preview down on small screens so it fits without horizontal scroll */
          <div className="preview-scale-wrapper w-full flex justify-center">
            <div className="w-full max-w-[210mm] shadow-2xl rounded-[4px] overflow-hidden bg-white origin-top preview-cv">
              {cvData.template === 'classic' ? (
                <ClassicCV cvData={cvData} />
              ) : (
                <ProgrammerCV cvData={cvData} />
              )}
            </div>
          </div>
        ) : (
          <textarea
            value={activeLatex}
            onChange={(e) => {
              setCustomLatex(e.target.value);
            }}
            className="w-full max-w-4xl h-[500px] lg:h-[600px] font-mono text-[11px] bg-zinc-950 text-zinc-100 p-4 sm:p-5 rounded-[8px] border border-zinc-800 shadow-inner latex-code-panel focus:outline-none focus:ring-1 focus:ring-zinc-700 resize-none font-normal leading-relaxed overflow-y-auto"
            spellCheck={false}
          />
        )}
      </div>
    </div>
  );
}
