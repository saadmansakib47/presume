// app/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import {
  CVData,
  programmerDefaultCVData,
  classicDefaultCVData
} from '@/lib/cv-types';
import CVForm from '@/components/CVForm/CVForm';
import CvPreview from '@/components/CvPreview';
import ClassicCV from '@/components/templates/ClassicCV';
import ProgrammerCV from '@/components/templates/ProgrammerCV';
import { generateLatex } from '@/lib/latex-template';
import {
  ChevronLeft,
  FileText,
  Printer,
  X,
  Code2
} from 'lucide-react';
import Image from 'next/image';

// ─── Loader ─────────────────────────────────────────────────────────────────
function AppLoader({ onDone }: { onDone: () => void }) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const done = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onDone, 450);
    }, 1350);
    return () => clearTimeout(done);
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center gap-6 ${fadeOut ? 'loader-fade-out' : 'loader-fade-in'}`}
    >
      {/* Icon */}
      <div className="w-14 h-14 rounded-2xl bg-zinc-950 flex items-center justify-center shadow-lg">
        <Code2 size={28} className="text-white" strokeWidth={2.5} />
      </div>

      {/* Title */}
      <div className="text-center space-y-1">
        <p className="text-2xl font-black tracking-tight text-zinc-950 uppercase">Presume</p>
        <p className="text-xs text-zinc-400 font-semibold tracking-widest uppercase">Resume Builder</p>
      </div>

      {/* Loading bar */}
      <div className="w-48 h-[3px] bg-zinc-100 rounded-full overflow-hidden">
        <div className="loader-bar h-full bg-zinc-950 rounded-full" />
      </div>
    </div>
  );
}

// ─── LIFO Typewriter ─────────────────────────────────────────────────────────
const MOTTOS = [
  'LaTeX resume precision.',
  'Minimalist design.',
  'Zero complexity.',
];

function useLIFOTypewriter(speed = 50, pauseMs = 1400, deleteSpeed = 30) {
  const [text, setText] = useState('');
  const phraseIdx = useRef(0);
  const charIdx = useRef(0);
  const isDeleting = useRef(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const tick = () => {
      const phrase = MOTTOS[phraseIdx.current];

      if (!isDeleting.current) {
        // Typing forward
        charIdx.current++;
        setText(phrase.slice(0, charIdx.current));

        if (charIdx.current >= phrase.length) {
          // Pause before deleting
          isDeleting.current = true;
          timeout = setTimeout(tick, pauseMs);
          return;
        }
        timeout = setTimeout(tick, speed);
      } else {
        // Backspacing LIFO
        charIdx.current--;
        setText(phrase.slice(0, charIdx.current));

        if (charIdx.current <= 0) {
          isDeleting.current = false;
          phraseIdx.current = (phraseIdx.current + 1) % MOTTOS.length;
          timeout = setTimeout(tick, 300);
          return;
        }
        timeout = setTimeout(tick, deleteSpeed);
      }
    };

    timeout = setTimeout(tick, 600);
    return () => clearTimeout(timeout);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return text;
}

// ─── Template Selection Modal ─────────────────────────────────────────────────
function TemplateModal({
  onSelect,
  onClose,
}: {
  onSelect: (type: 'programmer' | 'classic') => void;
  onClose: () => void;
}) {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="modal-backdrop fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div
        className="modal-panel bg-white rounded-2xl border border-zinc-200 shadow-2xl w-full max-w-2xl p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-900 transition cursor-pointer p-1"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="space-y-1 mb-7">
          <h2 className="text-xl font-black tracking-tight text-zinc-950 uppercase">
            Choose a Template
          </h2>
          <p className="text-sm text-zinc-500 font-medium">
            Pick your style — you can switch at any time in the builder.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Programmer Card */}
          <button
            onClick={() => onSelect('programmer')}
            className="group text-left bg-white border border-zinc-200 hover:border-zinc-900 rounded-xl p-4 flex flex-col gap-4 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
          >
            <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden bg-zinc-100 border border-zinc-200">
              <Image
                src="/templates/programmer.png"
                alt="Programmer Resume Template"
                fill
                className="object-cover group-hover:scale-[1.02] transition duration-300"
                sizes="(max-width: 768px) 100vw, 30vw"
                priority
              />
            </div>
            <div className="flex justify-between items-end">
              <div>
                <h3 className="font-extrabold text-sm text-zinc-900 uppercase tracking-wide">
                  Programmer
                </h3>
                <p className="text-[11px] text-zinc-400 font-semibold mt-0.5">
                  Single Column · Tech Focus
                </p>
              </div>
              <span className="text-xs font-bold text-zinc-300 group-hover:text-zinc-900 transition">
                Select →
              </span>
            </div>
          </button>

          {/* Classic Card */}
          <button
            onClick={() => onSelect('classic')}
            className="group text-left bg-white border border-zinc-200 hover:border-zinc-900 rounded-xl p-4 flex flex-col gap-4 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
          >
            <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden bg-zinc-100 border border-zinc-200">
              <Image
                src="/templates/classic.png"
                alt="Classic Resume Template"
                fill
                className="object-cover group-hover:scale-[1.02] transition duration-300"
                sizes="(max-width: 768px) 100vw, 30vw"
                priority
              />
            </div>
            <div className="flex justify-between items-end">
              <div>
                <h3 className="font-extrabold text-sm text-zinc-900 uppercase tracking-wide">
                  Classic
                </h3>
                <p className="text-[11px] text-zinc-400 font-semibold mt-0.5">
                  Two-Column · Photo Banner
                </p>
              </div>
              <span className="text-xs font-bold text-zinc-300 group-hover:text-zinc-900 transition">
                Select →
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function PresumePage() {
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<'landing' | 'builder'>('landing');
  const [showModal, setShowModal] = useState(false);
  const [cvData, setCvData] = useState<CVData>(programmerDefaultCVData);

  const typedMotto = useLIFOTypewriter(50, 1400, 28);
  const latexOutput = generateLatex(cvData);

  const startBuilding = (type: 'programmer' | 'classic') => {
    setCvData(type === 'programmer' ? programmerDefaultCVData : classicDefaultCVData);
    setShowModal(false);
    setStep('builder');
  };

  const handleTemplateSwitch = (type: 'programmer' | 'classic') => {
    const basePreset = type === 'programmer' ? programmerDefaultCVData : classicDefaultCVData;
    setCvData(prev => ({
      ...basePreset,
      themeColor: prev.themeColor,
      personalInfo: {
        ...basePreset.personalInfo,
        firstName: prev.personalInfo.firstName || basePreset.personalInfo.firstName,
        lastName: prev.personalInfo.lastName || basePreset.personalInfo.lastName,
        email: prev.personalInfo.email || basePreset.personalInfo.email,
        phone: prev.personalInfo.phone || basePreset.personalInfo.phone,
        linkedin: prev.personalInfo.linkedin || basePreset.personalInfo.linkedin,
        github: prev.personalInfo.github || basePreset.personalInfo.github,
        location: prev.personalInfo.location || basePreset.personalInfo.location,
      }
    }));
  };

  const downloadTeX = () => {
    const blob = new Blob([latexOutput], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${cvData.personalInfo.firstName || 'My'}_${cvData.personalInfo.lastName || 'Resume'}.tex`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const printPDF = () => window.print();

  return (
    <>
      {/* Loader overlay */}
      {loading && <AppLoader onDone={() => setLoading(false)} />}

      {/* Template selection modal */}
      {showModal && (
        <TemplateModal
          onSelect={startBuilding}
          onClose={() => setShowModal(false)}
        />
      )}

      <div className="min-h-screen bg-white text-zinc-900 font-sans flex flex-col">

        {/* ── HEADER ────────────────────────────────────────────────────────── */}
        <header className="border-b border-zinc-200 bg-white sticky top-0 z-40 no-print">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

            {/* Logo */}
            <button
              onClick={() => setStep('landing')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-[7px] bg-zinc-950 flex items-center justify-center shadow-sm group-hover:bg-zinc-800 transition">
                <Code2 size={15} className="text-white" strokeWidth={2.5} />
              </div>
              <span className="font-black text-sm tracking-tight text-zinc-950 uppercase">
                Presume
              </span>
            </button>

            {/* Builder header actions */}
            {step === 'builder' && (
              <div className="flex items-center gap-2.5">
                {/* Template switcher */}
                <div className="hidden sm:flex bg-zinc-100 p-0.5 rounded-[8px] border border-zinc-200">
                  <button
                    onClick={() => handleTemplateSwitch('programmer')}
                    className={`px-3 py-1 rounded-[6px] text-xs font-bold transition cursor-pointer ${
                      cvData.template === 'programmer'
                        ? 'bg-white text-zinc-950 shadow-sm'
                        : 'text-zinc-500 hover:text-zinc-800'
                    }`}
                  >
                    Programmer
                  </button>
                  <button
                    onClick={() => handleTemplateSwitch('classic')}
                    className={`px-3 py-1 rounded-[6px] text-xs font-bold transition cursor-pointer ${
                      cvData.template === 'classic'
                        ? 'bg-white text-zinc-950 shadow-sm'
                        : 'text-zinc-500 hover:text-zinc-800'
                    }`}
                  >
                    Classic
                  </button>
                </div>

                {/* Downloads */}
                <button
                  onClick={downloadTeX}
                  className="px-3.5 py-1.5 bg-white hover:bg-zinc-100 text-zinc-800 rounded-[10px] text-xs font-bold flex items-center gap-1.5 transition border border-zinc-200 shadow-sm cursor-pointer"
                >
                  <FileText size={14} /> LaTeX (.tex)
                </button>
                <button
                  onClick={printPDF}
                  className="px-3.5 py-1.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-[10px] text-xs font-bold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                >
                  <Printer size={14} /> Print / PDF
                </button>
              </div>
            )}
          </div>
        </header>

        {/* ── MAIN ─────────────────────────────────────────────────────────── */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8 flex flex-col justify-center">

          {step === 'landing' ? (
            /* ── LANDING ── */
            <div className="flex flex-col items-center text-center gap-8 py-16 md:py-24">

              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 bg-zinc-100 border border-zinc-200 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase text-zinc-500">
                Pure LaTeX · No Signup · Free
              </div>

              {/* Hero heading */}
              <div className="space-y-3 max-w-2xl">
                <h1 className="text-5xl md:text-6xl font-black tracking-tight text-zinc-950 uppercase leading-none">
                  Build Resumes.<br />Instant Compile.
                </h1>

                {/* LIFO Typewriter motto */}
                <div className="min-h-[28px] flex items-center justify-center">
                  <p className="text-base md:text-lg text-zinc-400 font-semibold typing-caret pr-0.5">
                    {typedMotto}
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-zinc-500 text-sm leading-relaxed max-w-md">
                Land, pick a format, fill the form, and get a production-ready resume instantly.
                No signup, no surveys, no bloat. Fast, simple, and clean.
              </p>

              {/* Single CTA */}
              <button
                id="build-resume-btn"
                onClick={() => setShowModal(true)}
                className="px-8 py-3.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-[12px] text-sm font-extrabold transition shadow-lg cursor-pointer"
              >
                Build Resume →
              </button>

              {/* Subtle template preview strip */}
              <div className="grid grid-cols-2 gap-4 mt-4 max-w-sm w-full opacity-70 hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setShowModal(true)}
                  className="relative aspect-[3/4] rounded-xl overflow-hidden border border-zinc-200 shadow-sm cursor-pointer group"
                >
                  <Image
                    src="/templates/programmer.png"
                    alt="Programmer Template Preview"
                    fill
                    className="object-cover group-hover:scale-[1.03] transition duration-300"
                    sizes="200px"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-white/90 py-1.5 text-[10px] font-bold text-zinc-600 text-center uppercase tracking-wider">
                    Programmer
                  </div>
                </button>
                <button
                  onClick={() => setShowModal(true)}
                  className="relative aspect-[3/4] rounded-xl overflow-hidden border border-zinc-200 shadow-sm cursor-pointer group"
                >
                  <Image
                    src="/templates/classic.png"
                    alt="Classic Template Preview"
                    fill
                    className="object-cover group-hover:scale-[1.03] transition duration-300"
                    sizes="200px"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-white/90 py-1.5 text-[10px] font-bold text-zinc-600 text-center uppercase tracking-wider">
                    Classic
                  </div>
                </button>
              </div>
            </div>

          ) : (
            /* ── BUILDER ── */
            <div className="flex flex-col gap-5">
              {/* Back + mobile template switcher */}
              <div className="flex justify-between items-center no-print pb-1">
                <button
                  onClick={() => setStep('landing')}
                  className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900 text-xs font-bold transition uppercase tracking-wider cursor-pointer"
                >
                  <ChevronLeft size={16} /> Back
                </button>

                {/* Mobile template switcher */}
                <div className="sm:hidden flex bg-zinc-100 p-0.5 rounded-[8px] border border-zinc-200">
                  <button
                    onClick={() => handleTemplateSwitch('programmer')}
                    className={`px-3 py-1 rounded-[6px] text-[10px] font-bold transition cursor-pointer ${
                      cvData.template === 'programmer'
                        ? 'bg-white text-zinc-950 shadow-sm'
                        : 'text-zinc-500'
                    }`}
                  >
                    Programmer
                  </button>
                  <button
                    onClick={() => handleTemplateSwitch('classic')}
                    className={`px-3 py-1 rounded-[6px] text-[10px] font-bold transition cursor-pointer ${
                      cvData.template === 'classic'
                        ? 'bg-white text-zinc-950 shadow-sm'
                        : 'text-zinc-500'
                    }`}
                  >
                    Classic
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Form */}
                <div className="lg:col-span-6 space-y-6 no-print max-h-[82vh] overflow-y-auto pr-1">
                  <CVForm cvData={cvData} setCvData={setCvData} />
                </div>

                {/* Preview */}
                <div className="lg:col-span-6 h-full min-h-[500px] lg:sticky lg:top-[88px] no-print">
                  <CvPreview cvData={cvData} setCvData={setCvData} latexOutput={latexOutput} />
                </div>
              </div>

              {/* Print-only full template */}
              <div className="hidden print:block w-full">
                {cvData.template === 'classic' ? (
                  <ClassicCV cvData={cvData} />
                ) : (
                  <ProgrammerCV cvData={cvData} />
                )}
              </div>
            </div>
          )}
        </main>

        {/* ── FOOTER ───────────────────────────────────────────────────────── */}
        <footer className="border-t border-zinc-200 bg-white py-5 text-center no-print">
          <p className="text-[11px] text-zinc-400 font-semibold tracking-widest uppercase">
            Presume — Instant LaTeX Resumes. Free. Open Source. Minimalist.
          </p>
        </footer>
      </div>
    </>
  );
}