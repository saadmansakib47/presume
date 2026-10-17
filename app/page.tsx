// app/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import {
  CVData,
  programmerDefaultCVData,
  classicDefaultCVData,
  BiodataData,
  defaultBiodataData,
} from '@/lib/cv-types';
import CVForm from '@/components/CVForm/CVForm';
import BiodataForm from '@/components/BiodataForm/BiodataForm';
import CvPreview from '@/components/CvPreview';
import ClassicCV from '@/components/templates/ClassicCV';
import ProgrammerCV from '@/components/templates/ProgrammerCV';
import MarriageBiodataCV from '@/components/templates/MarriageBiodataCV';
import DynamicHuntedCV from '@/components/templates/DynamicHuntedCV';
import { generateLatex } from '@/lib/latex-template';
import { generateBiodataLatex } from '@/lib/biodata-latex';
import { generateHuntedLatex } from '@/lib/hunted-latex';
import { CatalogTemplate } from '@/lib/template-hunter';
import ContributeModal from '@/components/ContributeModal';
import TemplateBrowserModal from '@/components/TemplateBrowserModal';
import AIChatbot from '@/components/AIChatbot';
import {
  ChevronLeft,
  FileText,
  Printer,
  X,
  Eye,
  PencilLine,
  Globe,
  Home,
  Compass,
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
      <div className="w-14 h-14 rounded-2xl bg-transparent flex items-center justify-center">
        <Image
          src="/assets/Presume.png"
          alt="Presume Logo"
          width={32}
          height={32}
          className="w-8 h-8 object-contain"
          priority
        />
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
  catalog,
  onSelect,
  onClose,
  onBrowse,
  onHunt,
  isHunting,
  huntMessage,
  showHunt = false,
}: {
  catalog: CatalogTemplate[];
  onSelect: (type: string) => void;
  onClose: () => void;
  onBrowse: () => void;
  onHunt: () => void;
  isHunting: boolean;
  huntMessage: string | null;
  showHunt?: boolean;
}) {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const huntedTemplates = catalog.filter((t) => !t.isBuiltin);

  return (
    <div
      className="modal-backdrop fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="modal-panel bg-white rounded-2xl border border-zinc-200 shadow-2xl w-full max-w-2xl p-5 sm:p-7 relative max-h-[90vh] flex flex-col"
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

        <div className="space-y-1 mb-5">
          <div className="flex items-center justify-between pr-8">
            <h2 className="text-lg sm:text-xl font-black tracking-tight text-zinc-950 uppercase">
              Choose a Template
            </h2>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-2 py-0.5 rounded-full bg-zinc-100 border border-zinc-200">
              {catalog.length} Available
            </span>
          </div>
          <p className="text-sm text-zinc-500 font-medium">
            Pick your format: professional resume, matrimonial biodata, or discovered layouts.
          </p>
          {huntMessage && (
            <div className="mt-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-zinc-100 border border-zinc-200 text-zinc-800 animate-fade-in flex items-center gap-2">
              <Compass size={14} className="text-zinc-600" />
              <span>{huntMessage}</span>
            </div>
          )}
        </div>

        <div className="overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-3 sm:gap-5">
            {/* Programmer Card (Row 1, Col 1) */}
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
              <div>
                <h3 className="font-extrabold text-xs sm:text-sm text-zinc-900 uppercase tracking-wide">
                  Programmer
                </h3>
                <p className="text-[10px] sm:text-[11px] text-zinc-400 font-semibold mt-0.5">
                  Single Column
                </p>
              </div>
            </button>

            {/* Classic Card (Row 1, Col 2) */}
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
              <div>
                <h3 className="font-extrabold text-xs sm:text-sm text-zinc-900 uppercase tracking-wide">
                  Classic
                </h3>
                <p className="text-[10px] sm:text-[11px] text-zinc-400 font-semibold mt-0.5">
                  Two-Column
                </p>
              </div>
            </button>

            {/* Marriage Resume Card (Row 2, Col 1 - below programmer) */}
            <button
              onClick={() => onSelect('biodata')}
              className="group text-left bg-white border border-zinc-200 hover:border-zinc-900 rounded-xl p-3 sm:p-4 flex flex-col gap-3 sm:gap-4 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
            >
              <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden bg-zinc-100 border border-zinc-200">
                <Image
                  src="/templates/marriage.png"
                  alt="Marriage Resume Template"
                  fill
                  className="object-cover group-hover:scale-[1.02] transition duration-300"
                  sizes="(max-width: 768px) 45vw, 30vw"
                  priority
                />
              </div>
              <div>
                <h3 className="font-extrabold text-xs sm:text-sm text-zinc-900 uppercase tracking-wide">
                  Marriage Resume
                </h3>
                <p className="text-[10px] sm:text-[11px] text-zinc-400 font-semibold mt-0.5">
                  Two-Column
                </p>
              </div>
            </button>

            {/* Hunted Templates (Dynamically added from GitHub) */}
            {huntedTemplates.map((tmpl) => (
              <button
                key={tmpl.id}
                onClick={() => onSelect(tmpl.id)}
                className="group text-left bg-white border border-zinc-200 hover:border-zinc-900 rounded-xl p-3 sm:p-4 flex flex-col gap-3 sm:gap-4 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
              >
                <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden bg-zinc-100 border border-zinc-200 flex items-center justify-center">
                  {tmpl.thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={tmpl.thumbnail}
                      alt={tmpl.name}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full p-4 flex flex-col justify-between bg-zinc-50/90 text-left">
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 block">
                          Engine: {tmpl.engine}
                        </span>
                        <div className="w-16 h-1.5 bg-zinc-300 rounded-full" />
                        <div className="space-y-1 pt-2">
                          <div className="w-full h-1.5 bg-zinc-200 rounded" />
                          <div className="w-5/6 h-1.5 bg-zinc-200 rounded" />
                          <div className="w-2/3 h-1.5 bg-zinc-200 rounded" />
                        </div>
                      </div>
                      <div className="space-y-1 border-t border-zinc-200 pt-2">
                        <div className="w-full h-1 bg-zinc-200 rounded" />
                        <div className="w-3/4 h-1 bg-zinc-200 rounded" />
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="font-extrabold text-xs sm:text-sm text-zinc-900 uppercase tracking-wide truncate">
                      {tmpl.name}
                    </h3>
                    <span className="text-[8px] px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700 font-bold uppercase shrink-0">
                      Hunted
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-zinc-400 font-semibold mt-0.5 truncate">
                    By {tmpl.author || 'Open Source'}
                  </p>
                </div>
              </button>
            ))}

            {/* Active Hunt Template Card (Admin Only) */}
            {showHunt && (
            <button
              onClick={onHunt}
              disabled={isHunting}
              className="text-left bg-zinc-50 hover:bg-zinc-100 border border-dashed border-zinc-300 hover:border-zinc-950 rounded-xl p-3 sm:p-4 flex flex-col gap-3 sm:gap-4 transition-all duration-200 cursor-pointer shadow-sm group disabled:cursor-wait"
            >
              <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden bg-zinc-100/80 border border-dashed border-zinc-200 flex flex-col items-center justify-center p-4 text-center">
                {isHunting ? (
                  <div className="flex flex-col items-center gap-2">
                    <Compass size={28} className="text-zinc-900 animate-spin" />
                    <span className="text-[10px] font-black text-zinc-800 uppercase tracking-wider">
                      Hunting GitHub...
                    </span>
                    <span className="text-[9px] text-zinc-500 font-medium max-w-[120px] leading-tight">
                      Inspecting TeX & license
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center shadow-xs group-hover:scale-105 transition">
                      <Compass size={20} className="text-zinc-800 group-hover:rotate-45 transition duration-300" />
                    </div>
                    <span className="text-[11px] font-black text-zinc-800 uppercase tracking-wider">
                      Hunt GitHub
                    </span>
                    <span className="text-[9px] text-zinc-400 font-medium">
                      Self Expanding Engine
                    </span>
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center justify-between gap-1">
                  <h3 className="font-extrabold text-xs sm:text-sm text-zinc-900 uppercase tracking-wide">
                    Hunt Template
                  </h3>
                  <span className="text-[8px] px-1.5 py-0.5 rounded bg-zinc-200 text-zinc-800 font-bold uppercase shrink-0">
                    Auto Ingest
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-zinc-400 font-semibold mt-0.5">
                  {isHunting ? 'Analyzing repository...' : 'Click to discover next'}
                </p>
              </div>
            </button>
            )}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-zinc-150 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-zinc-450 font-semibold uppercase tracking-wider">
            Looking for more templates?
          </p>
          <button
            onClick={() => {
              onBrowse();
              onClose();
            }}
            className="px-4 py-2 bg-black hover:bg-black/90 text-white rounded-[10px] text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
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
          className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 text-[10px] font-bold uppercase tracking-wider transition cursor-pointer ${activeTab === 'form'
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
          className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 text-[10px] font-bold uppercase tracking-wider transition cursor-pointer ${activeTab === 'preview'
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
  const [showHunt, setShowHunt] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<string>('programmer');
  const [cvData, setCvData] = useState<CVData>(programmerDefaultCVData);
  const [biodataData, setBiodataData] = useState<BiodataData>(defaultBiodataData);
  // Mobile builder tab
  const [mobileTab, setMobileTab] = useState<'form' | 'preview'>('form');

  const [catalog, setCatalog] = useState<CatalogTemplate[]>([
    {
      id: 'programmer',
      name: 'Programmer',
      description: 'Single-column minimalist resume tailored for software engineers and tech professionals.',
      category: 'programmer',
      engine: 'pdflatex',
      license: 'MIT',
      isBuiltin: true,
      thumbnail: '/templates/programmer.png',
      createdAt: '2026-10-09T00:00:00.000Z',
    },
    {
      id: 'classic',
      name: 'Classic',
      description: 'Two-column editorial CV with sidebar metrics, photo support, and high typography contrast.',
      category: 'classic',
      engine: 'pdflatex',
      license: 'MIT',
      isBuiltin: true,
      thumbnail: '/templates/classic.png',
      createdAt: '2026-10-09T00:00:00.000Z',
    },
    {
      id: 'biodata',
      name: 'Marriage Resume',
      description: 'Two-column traditional matrimonial biodata with photo silhouette, religious background, family, and partner preferences.',
      category: 'biodata',
      engine: 'xelatex',
      license: 'MIT',
      isBuiltin: true,
      thumbnail: '/templates/marriage.png',
      texFile: 'marrieage-biodata.tex',
      createdAt: '2026-10-09T00:00:00.000Z',
    },
  ]);

  const [isHunting, setIsHunting] = useState(false);
  const [huntMessage, setHuntMessage] = useState<string | null>(null);

  // Load template catalog on mount
  useEffect(() => {
    fetch('/api/hunt')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.catalog)) {
          setCatalog(data.catalog);
        }
      })
      .catch((err) => console.error('Failed to load template catalog:', err));
  }, []);

  const handleHuntTemplate = async () => {
    setIsHunting(true);
    setHuntMessage('Searching GitHub for open-source LaTeX templates...');
    try {
      const secretKey = typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('hunt_key') || 'presume-hunt-dev-secret'
        : 'presume-hunt-dev-secret';
      const res = await fetch('/api/hunt', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${secretKey}`,
          'x-hunt-secret': secretKey,
        },
      });
      const data = await res.json();
      if (data.success && data.template) {
        setCatalog((prev) => {
          const filtered = prev.filter((t) => t.id !== data.template.id);
          return [...filtered, data.template];
        });
        setHuntMessage(data.message || `Added ${data.template.name}!`);
      } else {
        setHuntMessage(data.message || 'No new templates found in current pool.');
      }
    } catch (err: unknown) {
      console.error('Hunt failed:', err);
      setHuntMessage('Template hunt request failed. Please check network connection.');
    } finally {
      setIsHunting(false);
    }
  };

  const typedMotto = useLIFOTypewriter(50, 1400, 28);
  const activeHuntedTemplate = catalog.find((t) => t.id === activeTemplate && !t.isBuiltin);

  const latexOutput =
    activeTemplate === 'biodata'
      ? generateBiodataLatex(biodataData)
      : activeHuntedTemplate
      ? generateHuntedLatex(activeHuntedTemplate, cvData)
      : generateLatex(cvData);

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

  const startBuilding = (type: string) => {
    setActiveTemplate(type);
    setCustomLatex(null);
    setShowModal(false);
    setMobileTab('form');
    if (type === 'biodata') {
      // biodata has its own form+data, nothing to set
    } else if (type === 'programmer' || type === 'classic') {
      setCvData(type === 'programmer' ? programmerDefaultCVData : classicDefaultCVData);
    } else {
      // Hunted template: load its sample data if available
      const hunted = catalog.find(t => t.id === type && !t.isBuiltin);
      if (hunted && hunted.sampleData) {
        setCvData(prev => ({ ...prev, ...hunted.sampleData as Partial<typeof prev> }));
      } else {
        setCvData({ ...programmerDefaultCVData, template: 'programmer' });
      }
    }
    setStep('builder');
  };

  const goToLanding = () => {
    setStep('landing');
    setMobileTab('form');
    setCustomLatex(null);
  };

  const handleTemplateSwitch = (type: string) => {
    setCustomLatex(null);
    setActiveTemplate(type);
    if (type === 'programmer' || type === 'classic') {
      const basePreset = type === 'programmer' ? programmerDefaultCVData : classicDefaultCVData;
      setCvData((prev) => ({
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
        },
      }));
    }
  };

  const downloadTeX = () => {
    const isBio = activeTemplate === 'biodata';
    const activeTex = customLatex !== null ? customLatex : latexOutput;
    const blob = new Blob([activeTex], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const filename = isBio
      ? `${(biodataData.personalInfo.fullName || 'Marriage').replace(/\s+/g, '_')}_Biodata.tex`
      : `${cvData.personalInfo.firstName || 'My'}_${cvData.personalInfo.lastName || (activeHuntedTemplate ? activeHuntedTemplate.name.replace(/\s+/g, '_') : 'Resume')}.tex`;
    a.download = filename;
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
          catalog={catalog}
          onSelect={startBuilding}
          onClose={() => setShowModal(false)}
          onBrowse={() => setShowBrowser(true)}
          onHunt={handleHuntTemplate}
          isHunting={isHunting}
          huntMessage={huntMessage}
          showHunt={showHunt}
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
              <div className="w-8 h-8 rounded-[7px] bg-transparent flex items-center justify-center">
                <Image
                  src="/assets/Presume.png"
                  alt="Presume Logo"
                  width={18}
                  height={18}
                  className="w-[18px] h-[18px] object-contain"
                />
              </div>
              <span className="font-black text-sm tracking-tight text-zinc-950 uppercase">
                Presume
              </span>
            </button>

            {/* Builder header actions */}
            {step === 'builder' && (
              <div className="flex items-center gap-1.5 sm:gap-2.5">
                {/* Template switcher or Home button */}
                {activeTemplate === 'biodata' || activeHuntedTemplate ? (
                  <button
                    onClick={() => setShowModal(true)}
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold transition border border-zinc-200 shadow-sm cursor-pointer"
                    title="Choose a Template"
                  >
                    <Home size={14} />
                    <span>{activeHuntedTemplate ? activeHuntedTemplate.name : 'Templates'}</span>
                  </button>
                ) : (
                  <div className="hidden sm:flex bg-zinc-100 p-0.5 rounded-[8px] border border-zinc-200">
                    <button
                      onClick={() => handleTemplateSwitch('programmer')}
                      className={`px-3 py-1 rounded-[6px] text-xs font-bold transition cursor-pointer ${activeTemplate === 'programmer'
                        ? 'bg-white text-zinc-950 shadow-sm'
                        : 'text-zinc-500 hover:text-zinc-800'
                        }`}
                    >
                      Programmer
                    </button>
                    <button
                      onClick={() => handleTemplateSwitch('classic')}
                      className={`px-3 py-1 rounded-[6px] text-xs font-bold transition cursor-pointer ${activeTemplate === 'classic'
                        ? 'bg-white text-zinc-950 shadow-sm'
                        : 'text-zinc-500 hover:text-zinc-800'
                        }`}
                    >
                      Classic
                    </button>
                  </div>
                )}

                {/* Portfolio Website Builder: icon only on xs */}
                <button
                  onClick={handleGeneratePortfolio}
                  disabled={generatingPortfolio || activeTemplate === 'biodata'}
                  className="px-2 sm:px-3.5 py-1.5 bg-white hover:bg-zinc-100 text-zinc-800 rounded-[10px] text-xs font-bold flex items-center gap-1.5 transition border border-zinc-200 shadow-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  title={activeTemplate === 'biodata' ? 'Portfolio builder is for career resumes' : 'Generate Portfolio Website (.zip)'}
                >
                  <Globe size={14} className={generatingPortfolio ? 'animate-spin' : ''} />
                  <span className="hidden sm:inline">
                    {generatingPortfolio ? 'Generating...' : 'Portfolio Website'}
                  </span>
                </button>

                {/* LaTeX download: icon only on xs */}
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

              {/* Action buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  id="build-resume-btn"
                  onClick={() => setShowModal(true)}
                  className="px-7 sm:px-8 py-3 sm:py-3.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-[12px] text-sm font-extrabold transition shadow-lg cursor-pointer"
                >
                  Build Resume →
                </button>
                <button
                  onClick={handleHuntTemplate}
                  disabled={isHunting}
                  className="px-6 py-3 sm:py-3.5 bg-white hover:bg-zinc-100 text-zinc-900 border border-zinc-200 rounded-[12px] text-sm font-extrabold transition shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  title="Search GitHub for new open-source LaTeX templates"
                >
                  <Compass size={16} className={isHunting ? 'animate-spin' : ''} />
                  <span>{isHunting ? 'Hunting...' : 'Hunt Templates'}</span>
                </button>
              </div>

              {huntMessage && (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100 border border-zinc-200 text-xs font-semibold text-zinc-800 animate-fade-in">
                  <Compass size={14} className="text-zinc-600" />
                  <span>{huntMessage}</span>
                </div>
              )}

              {/* Template preview strip */}
              <div className="flex flex-wrap justify-center gap-2.5 sm:gap-4 mt-2 sm:mt-4 max-w-lg w-full opacity-75 hover:opacity-100 transition-opacity">
                {catalog.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => startBuilding(t.id)}
                    className="relative aspect-[3/4] w-[90px] sm:w-[105px] rounded-xl overflow-hidden border border-zinc-200 shadow-sm cursor-pointer group bg-zinc-50"
                  >
                    {t.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={t.thumbnail}
                        alt={t.name}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-300"
                      />
                    ) : (
                      <div className="w-full h-full p-2.5 flex flex-col justify-between bg-zinc-50">
                        <div className="space-y-1">
                          <span className="text-[7px] font-black uppercase text-zinc-400 block">{t.engine}</span>
                          <div className="w-8 h-1 bg-zinc-300 rounded" />
                          <div className="w-full h-1 bg-zinc-200 rounded" />
                          <div className="w-3/4 h-1 bg-zinc-200 rounded" />
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-0 inset-x-0 bg-white/90 py-1 text-[8px] sm:text-[9px] font-bold text-zinc-600 text-center uppercase tracking-wider truncate px-1">
                      {t.name}
                    </div>
                  </button>
                ))}
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

                {/* Mobile template switcher or Home button */}
                {activeTemplate === 'biodata' || activeHuntedTemplate ? (
                  <button
                    onClick={() => setShowModal(true)}
                    className="lg:hidden flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] text-[10px] font-bold bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200 transition cursor-pointer"
                  >
                    <Home size={12} /> Templates
                  </button>
                ) : (
                  <div className="lg:hidden flex bg-zinc-100 p-0.5 rounded-[8px] border border-zinc-200">
                    <button
                      onClick={() => handleTemplateSwitch('programmer')}
                      className={`px-2.5 py-1 rounded-[6px] text-[10px] font-bold transition cursor-pointer ${activeTemplate === 'programmer'
                        ? 'bg-white text-zinc-950 shadow-sm'
                        : 'text-zinc-500'
                        }`}
                    >
                      Programmer
                    </button>
                    <button
                      onClick={() => handleTemplateSwitch('classic')}
                      className={`px-2.5 py-1 rounded-[6px] text-[10px] font-bold transition cursor-pointer ${activeTemplate === 'classic'
                        ? 'bg-white text-zinc-950 shadow-sm'
                        : 'text-zinc-500'
                        }`}
                    >
                      Classic
                    </button>
                  </div>
                )}
              </div>

              {/* Desktop: side-by-side grid */}
              {/* Mobile: single pane controlled by mobileTab */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-start">
                {/* Form pane */}
                <div
                  className={`lg:col-span-6 space-y-6 no-print lg:max-h-[140vh] lg:overflow-y-auto lg:pr-1 ${mobileTab === 'form' ? 'block' : 'hidden lg:block'
                    }`}
                >
                  {activeTemplate === 'biodata' ? (
                    <BiodataForm data={biodataData} setData={setBiodataData} />
                  ) : (
                    <CVForm cvData={cvData} setCvData={setCvData} />
                  )}
                </div>

                {/* Preview pane */}
                <div
                  className={`lg:col-span-6 lg:sticky lg:top-[88px] no-print ${mobileTab === 'preview' ? 'block' : 'hidden lg:block'
                    }`}
                >
                  <CvPreview
                    cvData={cvData}
                    setCvData={setCvData}
                    latexOutput={latexOutput}
                    customLatex={customLatex}
                    setCustomLatex={setCustomLatex}
                    templateType={activeTemplate}
                    biodataData={biodataData}
                    catalogTemplate={activeHuntedTemplate}
                  />
                </div>
              </div>

              {/* Print-only full template */}
              <div className="hidden print:block w-full">
                {activeTemplate === 'biodata' ? (
                  <MarriageBiodataCV data={biodataData} />
                ) : cvData.template === 'classic' ? (
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
            Presume · Instant LaTeX Resumes. Free. Open Source. Minimalist.
          </p>
          <button
            onClick={() => setShowContribute(true)}
            className="text-[11px] text-zinc-550 hover:text-zinc-900 font-bold tracking-widest uppercase transition cursor-pointer"
          >
            Contribute Template
          </button>
        </footer>
      </div>

      {step === 'builder' && (
        <AIChatbot
          latexCode={customLatex !== null ? customLatex : latexOutput}
          onUpdateLatex={(newLatex) => setCustomLatex(newLatex)}
        />
      )}

      {/* Mobile bottom tab bar: only shown in builder */}
      {step === 'builder' && (
        <MobileTabBar activeTab={mobileTab} onTabChange={setMobileTab} />
      )}
    </>
  );
}