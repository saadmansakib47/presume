// lib/portfolio-generator.ts
import JSZip from 'jszip';
import { CVData } from './cv-types';

export async function generatePortfolioZip(cvData: CVData): Promise<Blob> {
  const zip = new JSZip();

  // 1. package.json
  const packageJson = {
    name: `${cvData.personalInfo.firstName.toLowerCase()}-portfolio`,
    version: "0.1.0",
    private: true,
    scripts: {
      "dev": "next dev",
      "build": "next build",
      "start": "next start",
      "lint": "next lint"
    },
    dependencies: {
      "next": "15.1.0",
      "react": "19.0.0",
      "react-dom": "19.0.0",
      "lucide-react": "^0.468.0"
    },
    devDependencies: {
      "typescript": "^5",
      "@types/node": "^20",
      "@types/react": "^19",
      "@types/react-dom": "^19",
      "postcss": "^8",
      "tailwindcss": "^4",
      "@tailwindcss/postcss": "^4"
    }
  };
  zip.file("package.json", JSON.stringify(packageJson, null, 2));

  // 2. tsconfig.json
  const tsconfigJson = {
    compilerOptions: {
      target: "ES2017",
      lib: ["dom", "dom.iterable", "esnext"],
      allowJs: true,
      skipLibCheck: true,
      strict: true,
      noEmit: true,
      esModuleInterop: true,
      module: "esnext",
      moduleResolution: "bundler",
      resolveJsonModule: true,
      isolatedModules: true,
      jsx: "preserve",
      incremental: true,
      plugins: [
        {
          name: "next"
        }
      ],
      paths: {
        "@/*": ["./*"]
      }
    },
    include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
    exclude: ["node_modules"]
  };
  zip.file("tsconfig.json", JSON.stringify(tsconfigJson, null, 2));

  // 3. next.config.ts
  const nextConfig = `import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
`;
  zip.file("next.config.ts", nextConfig);

  // 4. next-env.d.ts
  const nextEnv = `/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/basic-features/typescript for more information.
`;
  zip.file("next-env.d.ts", nextEnv);

  // 5. postcss.config.mjs
  const postcssConfig = `const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
`;
  zip.file("postcss.config.mjs", postcssConfig);

  // 6. data.ts (Data Injection)
  const dataTs = `// Dynamic CV Data config file
export interface PersonalInfo {
  firstName: string;
  lastName: string;
  headline: string;
  photo: string;
  address: string;
  phone: string;
  email: string;
  linkedin: string;
  github: string;
  portfolio: string;
  location: string;
}

export interface EducationEntry {
  degree: string;
  institution: string;
  dates: string;
  gpa?: string;
}

export interface ExperienceEntry {
  title: string;
  organization: string;
  dates: string;
  description: string[];
}

export interface ProjectEntry {
  title: string;
  dates?: string;
  description: string[];
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface ReferenceEntry {
  name: string;
  title: string;
  phone: string;
  email: string;
}

export interface CVData {
  personalInfo: PersonalInfo;
  summary: string;
  education: EducationEntry[];
  experience: ExperienceEntry[];
  projects: ProjectEntry[];
  skills: SkillCategory[];
  achievements: string[];
  languages: string[];
  interests: string[];
  references: ReferenceEntry[];
  showGPA: boolean;
  enabledSections: {
    summary: boolean;
    experience: boolean;
    projects: boolean;
    skills: boolean;
    education: boolean;
    achievements: boolean;
    languages: boolean;
    interests: boolean;
    references: boolean;
  };
}

export const portfolioData: CVData = ${JSON.stringify(cvData, null, 2)};
`;
  zip.file("lib/data.ts", dataTs);

  // 7. app/globals.css
  const globalsCss = `@import "tailwindcss";

:root {
  --background: #fafafa;
  --foreground: #09090b;
}

.dark {
  --background: #09090b;
  --foreground: #fafafa;
}

body {
  background-color: var(--background);
  color: var(--foreground);
  transition: background-color 0.3s, color 0.3s;
}

html {
  scroll-behavior: smooth;
}

/* Custom subtle scrollbar */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(9, 9, 11, 0.15);
  border-radius: 9999px;
}
.dark ::-webkit-scrollbar-thumb {
  background: rgba(250, 250, 250, 0.15);
}

.nav-link {
  position: relative;
}
.nav-link::after {
  content: '';
  position: absolute;
  width: 100%;
  transform: scaleX(0);
  height: 2px;
  bottom: -4px;
  left: 0;
  background-color: currentColor;
  transform-origin: bottom right;
  transition: transform 0.25s ease-out;
}
.nav-link:hover::after {
  transform: scaleX(1);
  transform-origin: bottom left;
}
`;
  zip.file("app/globals.css", globalsCss);

  // 8. app/layout.tsx
  const layoutTsx = `import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "${cvData.personalInfo.firstName} ${cvData.personalInfo.lastName} | Portfolio",
  description: "${cvData.personalInfo.headline} - Personal Portfolio Website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
`;
  zip.file("app/layout.tsx", layoutTsx);

  // 9. app/page.tsx (Interactive modern single-page website)
  const pageTsx = `'use client';

import { useState, useEffect } from 'react';
import { portfolioData } from '../lib/data';
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  ExternalLink,
  Moon,
  Sun,
  Briefcase,
  GraduationCap,
  Trophy,
  Award,
  Globe,
  Heart,
  ChevronUp,
  Send,
  CheckCircle2,
  Menu,
  X
} from 'lucide-react';

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success'>('idle');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const { personalInfo, summary, education, experience, projects, skills, achievements, languages, interests, references, enabledSections } = portfolioData;

  useEffect(() => {
    // Detect system settings
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setFormStatus('sending');
    setTimeout(() => {
      setFormStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setFormStatus('idle'), 4000);
    }, 1200);
  };

  const navItems = [
    ...(enabledSections.summary ? [{ id: 'about', label: 'About' }] : []),
    ...(enabledSections.experience ? [{ id: 'experience', label: 'Experience' }] : []),
    ...(enabledSections.projects ? [{ id: 'projects', label: 'Projects' }] : []),
    ...(enabledSections.skills ? [{ id: 'skills', label: 'Skills' }] : []),
    ...(enabledSections.education ? [{ id: 'education', label: 'Education' }] : []),
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-300">
      
      {/* HEADER NAVBAR */}
      <header className={\`fixed top-0 z-50 w-full transition-all duration-300 \${
        scrolled
          ? 'bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md shadow-sm border-b border-zinc-200/50 dark:border-zinc-800/50 py-3'
          : 'bg-transparent py-5'
      }\`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex justify-between items-center">
          {/* Logo */}
          <a href="#" className="text-lg font-black tracking-tight text-zinc-900 dark:text-white uppercase flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-950 dark:bg-white animate-pulse" />
            {personalInfo.firstName} {personalInfo.lastName}
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={\`#\${item.id}\`}
                className="text-xs font-semibold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition nav-link"
              >
                {item.label}
              </a>
            ))}
            
            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition text-zinc-600 dark:text-zinc-400 cursor-pointer"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </nav>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition text-zinc-600 dark:text-zinc-400 cursor-pointer"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition text-zinc-900 dark:text-white cursor-pointer"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU OVERLAY */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white dark:bg-zinc-950 flex flex-col justify-center px-6 py-12 md:hidden">
          <nav className="flex flex-col gap-6 text-center">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={\`#\${item.id}\`}
                onClick={() => setMobileMenuOpen(false)}
                className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white hover:text-zinc-500"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex flex-col justify-center items-center py-20 px-4 text-center overflow-hidden bg-radial from-zinc-100 to-zinc-50 dark:from-zinc-900 dark:to-zinc-950">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
        
        <div className="z-10 max-w-3xl space-y-6">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 animate-pulse">
            Hello, World! I am
          </p>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-zinc-950 dark:text-white leading-none uppercase">
            {personalInfo.firstName}<br className="sm:hidden" /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 via-zinc-600 to-zinc-800 dark:from-white dark:via-zinc-300 dark:to-zinc-500">{personalInfo.lastName}</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-zinc-500 dark:text-zinc-400 font-semibold max-w-xl mx-auto">
            {personalInfo.headline}
          </p>

          {/* Social Links */}
          <div className="flex justify-center items-center gap-4 pt-2">
            {personalInfo.email && (
              <a href={\`mailto:\${personalInfo.email}\`} className="p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-900 dark:hover:border-white rounded-xl transition shadow-sm hover:shadow-md cursor-pointer" title="Email">
                <Mail size={18} />
              </a>
            )}
            {personalInfo.linkedin && (
              <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-900 dark:hover:border-white rounded-xl transition shadow-sm hover:shadow-md cursor-pointer" title="LinkedIn">
                <Linkedin size={18} />
              </a>
            )}
            {personalInfo.github && (
              <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-900 dark:hover:border-white rounded-xl transition shadow-sm hover:shadow-md cursor-pointer" title="GitHub">
                <Github size={18} />
              </a>
            )}
          </div>

          <div className="pt-8">
            <a
              href="#about"
              className="px-6 py-3 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 hover:bg-zinc-850 dark:hover:bg-zinc-100 rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-lg inline-flex items-center gap-2 cursor-pointer"
            >
              Explore My Work
            </a>
          </div>
        </div>

        {/* Floating Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-50">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Scroll Down</span>
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-bounce" />
        </div>
      </section>

      {/* ABOUT / SUMMARY SECTION */}
      {enabledSections.summary && (
        <section id="about" className="py-24 px-4 max-w-6xl mx-auto w-full border-t border-zinc-200/60 dark:border-zinc-900">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
            <div className="md:col-span-4 space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Who I Am</span>
              <h2 className="text-3xl font-black text-zinc-950 dark:text-white uppercase tracking-tight">About Me</h2>
              <div className="w-12 h-1 bg-zinc-900 dark:bg-white rounded" />
            </div>
            <div className="md:col-span-8 space-y-6">
              <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 font-medium leading-relaxed">
                {summary}
              </p>

              {/* Personal details cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                {personalInfo.location && (
                  <div className="flex items-center gap-3 p-4 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-850 rounded-xl">
                    <MapPin className="text-zinc-400 shrink-0" size={16} />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Location</p>
                      <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">{personalInfo.location}</p>
                    </div>
                  </div>
                )}
                {personalInfo.phone && (
                  <div className="flex items-center gap-3 p-4 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-850 rounded-xl">
                    <Phone className="text-zinc-400 shrink-0" size={16} />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Phone</p>
                      <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">{personalInfo.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* EXPERIENCE TIMELINE SECTION */}
      {enabledSections.experience && experience.length > 0 && (
        <section id="experience" className="py-24 px-4 bg-zinc-100 dark:bg-zinc-900/40 w-full border-t border-b border-zinc-200/60 dark:border-zinc-900">
          <div className="max-w-6xl mx-auto w-full">
            <div className="space-y-3 mb-16 text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">My Path</span>
              <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 dark:text-white uppercase tracking-tight">Work Experience</h2>
              <div className="w-12 h-1 bg-zinc-900 dark:bg-white rounded mx-auto" />
            </div>

            <div className="max-w-3xl mx-auto relative border-l border-zinc-200 dark:border-zinc-800 pl-6 sm:pl-8 space-y-12">
              {experience.map((exp, idx) => (
                <div key={idx} className="relative group">
                  {/* Circle Pin */}
                  <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-white dark:bg-zinc-950 border-2 border-zinc-950 dark:border-white transition-all duration-300 group-hover:scale-125" />
                  
                  <div className="space-y-2">
                    <span className="inline-block px-2.5 py-0.5 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[10px] font-bold tracking-wide text-zinc-500 dark:text-zinc-400 uppercase">
                      {exp.dates}
                    </span>
                    <div>
                      <h3 className="text-lg font-black text-zinc-950 dark:text-white uppercase">{exp.title}</h3>
                      <p className="text-xs font-semibold text-zinc-400">{exp.organization}</p>
                    </div>
                    
                    <ul className="space-y-1.5 pt-2 list-disc list-inside text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
                      {exp.description.map((desc, dIdx) => (
                        <li key={dIdx} className="leading-relaxed">{desc}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PROJECTS SECTION */}
      {enabledSections.projects && projects.length > 0 && (
        <section id="projects" className="py-24 px-4 max-w-6xl mx-auto w-full">
          <div className="space-y-3 mb-16 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">My Creations</span>
            <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 dark:text-white uppercase tracking-tight">Recent Projects</h2>
            <div className="w-12 h-1 bg-zinc-900 dark:bg-white rounded mx-auto" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {projects.map((proj, idx) => (
              <div key={idx} className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 hover:border-zinc-900 dark:hover:border-white rounded-2xl p-5 sm:p-6 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="text-base font-extrabold text-zinc-900 dark:text-white uppercase tracking-wide group-hover:text-black dark:group-hover:text-white transition">
                      {proj.title}
                    </h3>
                    {proj.dates && (
                      <span className="text-[10px] font-bold text-zinc-400 tracking-wide uppercase shrink-0">
                        {proj.dates}
                      </span>
                    )}
                  </div>

                  <ul className="space-y-1.5 list-disc list-inside text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                    {proj.description.map((desc, dIdx) => (
                      <li key={dIdx}>{desc}</li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 flex items-center text-[10px] font-bold uppercase tracking-widest text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition gap-1.5 cursor-pointer">
                  <span>View Project</span>
                  <ExternalLink size={10} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SKILLS SECTION */}
      {enabledSections.skills && skills.length > 0 && (
        <section id="skills" className="py-24 px-4 bg-zinc-100 dark:bg-zinc-900/40 w-full border-t border-b border-zinc-200/60 dark:border-zinc-900">
          <div className="max-w-4xl mx-auto w-full">
            <div className="space-y-3 mb-16 text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Abilities</span>
              <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 dark:text-white uppercase tracking-tight">Skills & Expertise</h2>
              <div className="w-12 h-1 bg-zinc-900 dark:bg-white rounded mx-auto" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {skills.map((skillCat, idx) => (
                <div key={idx} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-2xl p-5 sm:p-6 shadow-sm">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-2">
                    {skillCat.category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skillCat.skills.map((skill, sIdx) => (
                      <span key={sIdx} className="px-3 py-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/70 dark:border-zinc-800 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* EDUCATION SECTION */}
      {enabledSections.education && education.length > 0 && (
        <section id="education" className="py-24 px-4 max-w-6xl mx-auto w-full">
          <div className="space-y-3 mb-16 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Credentials</span>
            <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 dark:text-white uppercase tracking-tight">Education</h2>
            <div className="w-12 h-1 bg-zinc-900 dark:bg-white rounded mx-auto" />
          </div>

          <div className="max-w-2xl mx-auto space-y-6">
            {education.map((edu, idx) => (
              <div key={idx} className="flex gap-4 p-5 sm:p-6 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-850 rounded-2xl shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center shrink-0">
                  <GraduationCap size={20} />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">{edu.dates}</span>
                  <h3 className="text-base font-extrabold text-zinc-900 dark:text-white uppercase tracking-wide">{edu.degree}</h3>
                  <p className="text-xs font-semibold text-zinc-400">{edu.institution}</p>
                  {showGPA && edu.gpa && (
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider pt-1 flex items-center gap-1.5">
                      <Award size={12} /> GPA: {edu.gpa}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ACHIEVEMENTS / EXTRA SECTION */}
      {enabledSections.achievements && achievements.length > 0 && (
        <section className="py-24 px-4 bg-zinc-100 dark:bg-zinc-900/40 w-full border-t border-b border-zinc-200/60 dark:border-zinc-900">
          <div className="max-w-3xl mx-auto w-full">
            <div className="space-y-3 mb-12 text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Recognitions</span>
              <h2 className="text-3xl font-black text-zinc-950 dark:text-white uppercase tracking-tight">Achievements</h2>
              <div className="w-12 h-1 bg-zinc-900 dark:bg-white rounded mx-auto" />
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-850 rounded-2xl p-6 shadow-sm space-y-4">
              {achievements.map((ach, idx) => (
                <div key={idx} className="flex gap-3 items-start text-xs text-zinc-650 dark:text-zinc-400">
                  <Trophy size={14} className="text-yellow-650 dark:text-yellow-500 shrink-0 mt-0.5" />
                  <p className="leading-relaxed font-semibold">{ach}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* LANGUAGES & INTERESTS CONTAINER */}
      {(enabledSections.languages || enabledSections.interests) && (
        <section className="py-24 px-4 max-w-4xl mx-auto w-full grid grid-cols-1 sm:grid-cols-2 gap-8">
          {enabledSections.languages && languages && languages.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 border-b border-zinc-100 dark:border-zinc-850 pb-2">
                Languages
              </h3>
              <div className="flex flex-wrap gap-2">
                {languages.map((lang, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">
                    <Globe size={11} className="inline mr-1.5 text-zinc-400" />
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          )}

          {enabledSections.interests && interests && interests.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 border-b border-zinc-100 dark:border-zinc-850 pb-2">
                Interests
              </h3>
              <div className="flex flex-wrap gap-2">
                {interests.map((interest, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">
                    <Heart size={11} className="inline mr-1.5 text-zinc-450" />
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* REFERENCES SECTION */}
      {enabledSections.references && references && references.length > 0 && (
        <section className="py-24 px-4 bg-zinc-100 dark:bg-zinc-900/40 w-full border-t border-b border-zinc-200/60 dark:border-zinc-900">
          <div className="max-w-4xl mx-auto w-full">
            <div className="space-y-3 mb-12 text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Endorsements</span>
              <h2 className="text-3xl font-black text-zinc-950 dark:text-white uppercase tracking-tight">References</h2>
              <div className="w-12 h-1 bg-zinc-900 dark:bg-white rounded mx-auto" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {references.map((ref, idx) => (
                <div key={idx} className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-850 rounded-2xl p-5 sm:p-6 shadow-sm space-y-3">
                  <div>
                    <h4 className="text-sm font-extrabold text-zinc-900 dark:text-white uppercase tracking-wide">{ref.name}</h4>
                    <p className="text-xs font-semibold text-zinc-400">{ref.title}</p>
                  </div>
                  <div className="space-y-1 pt-2 border-t border-zinc-100 dark:border-zinc-850 text-xs">
                    {ref.phone && <p className="text-zinc-550 dark:text-zinc-400">Phone: {ref.phone}</p>}
                    {ref.email && <p className="text-zinc-550 dark:text-zinc-400">Email: {ref.email}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CONTACT SECTION */}
      <section id="contact" className="py-24 px-4 max-w-4xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-5 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Connection</span>
            <h2 className="text-3xl font-black text-zinc-950 dark:text-white uppercase tracking-tight">Get In Touch</h2>
            <div className="w-12 h-1 bg-zinc-900 dark:bg-white rounded" />
            <p className="text-xs text-zinc-500 dark:text-zinc-400 pt-2 leading-relaxed">
              Have a project, a job opportunity, or just want to chat? Fill out the contact form or send an email. I'll get back to you as soon as possible!
            </p>
          </div>

          <div className="md:col-span-7 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-2xl p-5 sm:p-8 shadow-sm">
            {formStatus === 'success' ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-12 h-12 bg-green-50 dark:bg-green-950/30 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="text-base font-black text-zinc-900 dark:text-white uppercase tracking-wide">Message Sent!</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Thank you for reaching out. I'll read and respond to your message shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="form-name" className="text-[10px] font-bold uppercase tracking-widest text-zinc-450 dark:text-zinc-500">Name</label>
                    <input
                      id="form-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-zinc-700 transition"
                      placeholder="Your Name"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="form-email" className="text-[10px] font-bold uppercase tracking-widest text-zinc-450 dark:text-zinc-500">Email</label>
                    <input
                      id="form-email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-zinc-700 transition"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="form-message" className="text-[10px] font-bold uppercase tracking-widest text-zinc-450 dark:text-zinc-500">Message</label>
                  <textarea
                    id="form-message"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    rows={4}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-zinc-700 transition resize-none"
                    placeholder="Describe your request..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={formStatus === 'sending'}
                  className="w-full py-3 bg-zinc-950 hover:bg-zinc-850 dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {formStatus === 'sending' ? (
                    'Sending...'
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send size={12} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950 py-10 text-center text-zinc-450 dark:text-zinc-500 px-4 space-y-4">
        <p className="text-[10px] font-bold uppercase tracking-widest">
          © {new Date().getFullYear()} {personalInfo.firstName} {personalInfo.lastName}. All Rights Reserved.
        </p>
        <p className="text-[9px] font-semibold uppercase tracking-wider text-zinc-400">
          Generated via Presume Portfolio Builder
        </p>
      </footer>

      {/* SCROLL TO TOP BUTTON */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 p-3 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 rounded-xl shadow-lg border border-zinc-850 dark:border-zinc-100 hover:scale-105 transition cursor-pointer z-50"
          aria-label="Scroll to top"
        >
          <ChevronUp size={16} />
        </button>
      )}
    </div>
  );
}
`;
  zip.file("app/page.tsx", pageTsx);

  // 10. README.md
  const readmeMd = `# My Personal Portfolio Website

This personal portfolio website has been generated automatically from your CV profile using **Presume**.

It is pre-configured as a modern single-page Next.js, Tailwind v4, and TypeScript website.

## Features
- Fully responsive layout (adapted for mobile, tablet, and desktop)
- Dynamic Dark / Light theme selector (respects system preferences on first load)
- Timeline components for Work Experience
- Grids for Projects and Education
- Formatted sections for Skills, Achievements, and Languages
- Interactive Contact Form with status notifications

---

## Getting Started

Follow these instructions to run and customize your portfolio website locally.

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18 or higher is recommended).

### 1. Installation
Unzip the files to a local directory, open your terminal inside the folder, and run:
\`\`\`bash
npm install
\`\`\`

### 2. Run Local Development Server
Launch the development server by running:
\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser to view your live portfolio.

### 3. Customize Data
To update your details or add more projects/experiences directly in code, open and modify:
\`\`\`
lib/data.ts
\`\`\`

---

## Deployment

Deploying your portfolio to the web takes less than a minute.

### Deploy to Vercel (Recommended)
1. Push your portfolio code to a GitHub repository.
2. Sign in to [Vercel](https://vercel.com).
3. Click "Add New Project" and import your repository.
4. Click **Deploy**. Vercel will automatically configure the build settings and launch your website!

### Deploy to Netlify
1. Sign in to [Netlify](https://netlify.com).
2. Connect your GitHub repository.
3. Keep default build settings (Build command: \`npm run build\`, Publish directory: \`.next\` or \`out\` if configured).
4. Click **Deploy Site**.
`;
  zip.file("README.md", readmeMd);

  // Generate the zip as a blob
  const content = await zip.generateAsync({ type: 'blob' });
  return content;
}
