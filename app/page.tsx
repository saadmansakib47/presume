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
import ContributeModal from '@/components/ContributeModal';
import TemplateBrowserModal from '@/components/TemplateBrowserModal';
import {
  ChevronLeft,
  FileText,
  Printer,
  X,
  Code2,
  Eye,
  PencilLine,
  Globe,
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
  onBrowse,
}: {
  onSelect: (type: 'programmer' | 'classic') => void;
  onClose: () => void;
  onBrowse: () => void;
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
      className="modal-backdrop fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="modal-panel bg-white rounded-2xl border border-zinc-200 shadow-2xl w-full max-w-2xl p-5 sm:p-8 relative"
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

        <div className="space-y-1 mb-6">
          <h2 className="text-lg sm:text-xl font-black tracking-tight text-zinc-950 uppercase">
            Choose a Template
          </h2>
          <p className="text-sm text-zinc-500 font-medium">
            Pick your style — you can switch at any time in the builder.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-5">
          {/* Programmer Card */}
          <button
            onClick={() => onSelect('programmer')}
            className="group text-left bg-white border border-zinc-200 hover:border-zinc-900 rounded-xl p-3 sm:p-4 flex flex-col gap-3 sm:gap-4 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
          >
            <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden bg-zinc-100 border border-zinc-200">
              <Image
                src="/templates/programmer.png"
                alt="Programmer Resume Template"
                fill
                className="object-cover group-hover:scale-[1.02] transition duration-300"
                sizes="(max-width: 768px) 45vw, 30vw"
                priority
              />
            </div>
            <div className="flex justify-between items-end">
              <div>
                <h3 className="font-extrabold text-xs sm:text-sm text-zinc-900 uppercase tracking-wide">
                  Programmer
                </h3>
                <p className="text-[10px] sm:text-[11px] text-zinc-400 font-semibold mt-0.5">
                  Single Column · Tech
                </p>
              </div>
              <span className="text-xs font-bold text-zinc-300 group-hover:text-zinc-900 transition hidden sm:block">
                Select →
              </span>
            </div>
          </button>

          {/* Classic Card */}
          <button
            onClick={() => onSelect('classic')}
            className="group text-left bg-white border border-zinc-200 hover:border-zinc-900 rounded-xl p-3 sm:p-4 flex flex-col gap-3 sm:gap-4 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
          >
            <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden bg-zinc-100 border border-zinc-200">
              <Image
                src="/templates/classic.png"
                alt="Classic Resume Template"
                fill
                className="object-cover group-hover:scale-[1.02] transition duration-300"
                sizes="(max-width: 768px) 45vw, 30vw"
                priority
              />
            </div>
            <div className="flex justify-between items-end">
              <div>
                <h3 className="font-extrabold text-xs sm:text-sm text-zinc-900 uppercase tracking-wide">
                  Classic
                </h3>
                <p className="text-[10px] sm:text-[11px] text-zinc-400 font-semibold mt-0.5">
                  Two-Column · Photo
                </p>
              </div>
              <span className="text-xs font-bold text-zinc-300 group-hover:text-zinc-900 transition hidden sm:block">
                Select →
              </span>
            </div>
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-zinc-150 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-zinc-450 font-semibold uppercase tracking-wider">
            Looking for more configurations?
          </p>
          <button
            onClick={() => {
              onBrowse();
              onClose();
            }}
            className="px-4 py-2 bg-black hover:bg-zinc-200 text-white rounded-[10px] text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            Browse Community Presets
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Mobile Bottom Tab Bar ────────────────────────────────────────────────────
function MobileTabBar({
  activeTab,
  onTabChange,
}: {
  activeTab: 'form' | 'preview';
  onTabChange: (tab: 'form' | 'preview') => void;
}) {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-zinc-200 no-print safe-area-bottom">
      <div className="flex">
        <button
          onClick={() => onTabChange('form')}
          className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 text-[10px] font-bold uppercase tracking-wider transition cursor-pointer ${
            activeTab === 'form'
              ? 'text-zinc-950 bg-zinc-50'
              : 'text-zinc-400 hover:text-zinc-700'
          }`}
        >
          <PencilLine size={18} strokeWidth={activeTab === 'form' ? 2.5 : 2} />
          <span>Edit</span>
        </button>
        <div className="w-px bg-zinc-200 my-2" />
        <button
          onClick={() => onTabChange('preview')}
          className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 text-[10px] font-bold uppercase tracking-wider transition cursor-pointer ${
            activeTab === 'preview'
              ? 'text-zinc-950 bg-zinc-50'
              : 'text-zinc-400 hover:text-zinc-700'
          }`}
        >
          <Eye size={18} strokeWidth={activeTab === 'preview' ? 2.5 : 2} />
          <span>Preview</span>
        </button>
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
  // Mobile builder tab
  const [mobileTab, setMobileTab] = useState<'form' | 'preview'>('form');

  const typedMotto = useLIFOTypewriter(50, 1400, 28);
  const latexOutput = generateLatex(cvData);
  const [customLatex, setCustomLatex] = useState<string | null>(null);
  const [showContribute, setShowContribute] = useState(false);
  const [showBrowser, setShowBrowser] = useState(false);

  const [generatingPortfolio, setGeneratingPortfolio] = useState(false);

  const handleGeneratePortfolio = async () => {
    setGeneratingPortfolio(true);
    try {
      const { generatePortfolioZip } = await import('@/lib/portfolio-generator');
      const blob = await generatePortfolioZip(cvData);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${cvData.personalInfo.firstName || 'My'}_Portfolio.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to generate portfolio:', err);
      alert('Failed to generate portfolio. Please try again.');
    } finally {
      setGeneratingPortfolio(false);
    }
  };

  const startBuilding = (type: 'programmer' | 'classic') => {
    setCvData(type === 'programmer' ? programmerDefaultCVData : classicDefaultCVData);
    setCustomLatex(null);
    setShowModal(false);
    setMobileTab('form');
    setStep('builder');
  };

  const goToLanding = () => {
    setStep('landing');
    setMobileTab('form');
    setCustomLatex(null);
  };

  const handleTemplateSwitch = (type: 'programmer' | 'classic') => {
    setCustomLatex(null);
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
    const blob = new Blob([customLatex !== null ? customLatex : latexOutput], { type: 'text/plain' });
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
          onBrowse={() => setShowBrowser(true)}
        />
      )}

      {showContribute && <ContributeModal onClose={() => setShowContribute(false)} />}

      {showBrowser && (
        <TemplateBrowserModal
          onSelect={(presetData) => {
            setCvData(presetData);
            setCustomLatex(null);
          }}
          onClose={() => setShowBrowser(false)}
        />
      )}

      <div className="min-h-screen bg-white text-zinc-900 font-sans flex flex-col">

        {/* ── HEADER ────────────────────────────────────────────────────────── */}
        <header className="border-b border-zinc-200 bg-white sticky top-0 z-40 no-print">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center gap-3">

            {/* Logo */}
            <button
              onClick={goToLanding}
              className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group shrink-0"
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
              <div className="flex items-center gap-1.5 sm:gap-2.5">
                {/* Template switcher — hidden on xs, visible sm+ */}
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

                {/* Portfolio Website Builder — icon only on xs */}
                <button
                  onClick={handleGeneratePortfolio}
                  disabled={generatingPortfolio}
                  className="px-2 sm:px-3.5 py-1.5 bg-white hover:bg-zinc-100 text-zinc-800 rounded-[10px] text-xs font-bold flex items-center gap-1.5 transition border border-zinc-200 shadow-sm cursor-pointer disabled:opacity-50"
                  title="Generate Portfolio Website (.zip)"
                >
                  <Globe size={14} className={generatingPortfolio ? 'animate-spin' : ''} />
                  <span className="hidden sm:inline">
                    {generatingPortfolio ? 'Generating...' : 'Portfolio Website'}
                  </span>
                </button>

                {/* LaTeX download — icon only on xs */}
                <button
                  onClick={downloadTeX}
                  className="px-2 sm:px-3.5 py-1.5 bg-white hover:bg-zinc-100 text-zinc-800 rounded-[10px] text-xs font-bold flex items-center gap-1.5 transition border border-zinc-200 shadow-sm cursor-pointer"
                  title="Download LaTeX (.tex)"
                >
                  <FileText size={14} />
                  <span className="hidden sm:inline">LaTeX (.tex)</span>
                </button>
                <button
                  onClick={printPDF}
                  className="px-2 sm:px-3.5 py-1.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-[10px] text-xs font-bold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                  title="Print / Save as PDF"
                >
                  <Printer size={14} />
                  <span className="hidden sm:inline">Print / PDF</span>
                </button>
              </div>
            )}
          </div>
        </header>

        {/* ── MAIN ─────────────────────────────────────────────────────────── */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col justify-center">

          {step === 'landing' ? (
            /* ── LANDING ── */
            <div className="flex flex-col items-center text-center gap-6 sm:gap-8 py-10 sm:py-16 md:py-24">

              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 bg-zinc-100 border border-zinc-200 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase text-zinc-500">
                Pure LaTeX · No Signup · Free
              </div>

              {/* Hero heading */}
              <div className="space-y-3 max-w-2xl">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-zinc-950 uppercase leading-none">
                  Build Resumes.<br />Instant Compile.
                </h1>

                {/* LIFO Typewriter motto */}
                <div className="min-h-[28px] flex items-center justify-center">
                  <p className="text-sm sm:text-base md:text-lg text-zinc-400 font-semibold typing-caret pr-0.5">
                    {typedMotto}
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-zinc-500 text-sm leading-relaxed max-w-sm sm:max-w-md px-2">
                Land, pick a format, fill the form, and get a production-ready resume instantly.
                No signup, no surveys, no bloat. Fast, simple, and clean.
              </p>

              {/* Single CTA */}
              <button
                id="build-resume-btn"
                onClick={() => setShowModal(true)}
                className="px-7 sm:px-8 py-3 sm:py-3.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-[12px] text-sm font-extrabold transition shadow-lg cursor-pointer"
              >
                Build Resume →
              </button>

              {/* Subtle template preview strip */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-2 sm:mt-4 max-w-[280px] sm:max-w-sm w-full opacity-70 hover:opacity-100 transition-opacity">
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
                  <div className="absolute bottom-0 inset-x-0 bg-white/90 py-1.5 text-[9px] sm:text-[10px] font-bold text-zinc-600 text-center uppercase tracking-wider">
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
                  <div className="absolute bottom-0 inset-x-0 bg-white/90 py-1.5 text-[9px] sm:text-[10px] font-bold text-zinc-600 text-center uppercase tracking-wider">
                    Classic
                  </div>
                </button>
              </div>
            </div>

          ) : (
            /* ── BUILDER ── */
            <div className="flex flex-col gap-4 sm:gap-5 pb-16 lg:pb-0">
              {/* Back + desktop mobile template switcher row */}
              <div className="flex justify-between items-center no-print pb-1">
                <button
                  onClick={goToLanding}
                  className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900 text-xs font-bold transition uppercase tracking-wider cursor-pointer"
                >
                  <ChevronLeft size={16} /> Back
                </button>

                {/* Mobile template switcher (visible on xs/sm, hidden on lg+) */}
                <div className="lg:hidden flex bg-zinc-100 p-0.5 rounded-[8px] border border-zinc-200">
                  <button
                    onClick={() => handleTemplateSwitch('programmer')}
                    className={`px-2.5 py-1 rounded-[6px] text-[10px] font-bold transition cursor-pointer ${
                      cvData.template === 'programmer'
                        ? 'bg-white text-zinc-950 shadow-sm'
                        : 'text-zinc-500'
                    }`}
                  >
                    Programmer
                  </button>
                  <button
                    onClick={() => handleTemplateSwitch('classic')}
                    className={`px-2.5 py-1 rounded-[6px] text-[10px] font-bold transition cursor-pointer ${
                      cvData.template === 'classic'
                        ? 'bg-white text-zinc-950 shadow-sm'
                        : 'text-zinc-500'
                    }`}
                  >
                    Classic
                  </button>
                </div>
              </div>

              {/* Desktop: side-by-side grid */}
              {/* Mobile: single pane controlled by mobileTab */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-start">
                {/* Form pane */}
                <div
                  className={`lg:col-span-6 space-y-6 no-print lg:max-h-[82vh] lg:overflow-y-auto lg:pr-1 ${
                    mobileTab === 'form' ? 'block' : 'hidden lg:block'
                  }`}
                >
                  <CVForm cvData={cvData} setCvData={setCvData} />
                </div>

                {/* Preview pane */}
                <div
                  className={`lg:col-span-6 lg:sticky lg:top-[88px] no-print ${
                    mobileTab === 'preview' ? 'block' : 'hidden lg:block'
                  }`}
                >
                  <CvPreview
                    cvData={cvData}
                    setCvData={setCvData}
                    latexOutput={latexOutput}
                    customLatex={customLatex}
                    setCustomLatex={setCustomLatex}
                  />
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
        <footer className="border-t border-zinc-200 bg-white py-5 text-center no-print flex flex-col sm:flex-row justify-between items-center px-6 max-w-7xl mx-auto w-full gap-3">
          <p className="text-[11px] text-zinc-400 font-semibold tracking-widest uppercase">
            Presume — Instant LaTeX Resumes. Free. Open Source. Minimalist.
          </p>
          <button
            onClick={() => setShowContribute(true)}
            className="text-[11px] text-zinc-550 hover:text-zinc-900 font-bold tracking-widest uppercase transition cursor-pointer"
          >
            Contribute Template
          </button>
        </footer>
      </div>

      {/* Mobile bottom tab bar — only shown in builder */}
      {step === 'builder' && (
        <MobileTabBar activeTab={mobileTab} onTabChange={setMobileTab} />
      )}
    </>
  );
}