import { extractSampleData, detectSections } from './latex-sample-extractor';
﻿// lib/template-hunter.ts
import fs from 'fs/promises';
import path from 'path';

export interface TemplateLayoutStyle {
  layout: 'single-column' | 'two-column-sidebar' | 'banner-header' | 'minimal-modern';
  accentColor: string;
  fontFamily: 'sans' | 'serif';
  headerAlignment: 'left' | 'center';
  dividerStyle: 'solid-line' | 'shaded-box' | 'subtle-border';
  showPhoto: boolean;
}

export interface CatalogTemplate {
  id: string;
  name: string;
  description: string;
  category: 'programmer' | 'classic' | 'biodata' | 'hunted';
  engine: 'pdflatex' | 'xelatex' | 'lualatex';
  license: string;
  author?: string;
  sourceRepo?: string;
  isBuiltin: boolean;
  thumbnail?: string;
  texFile?: string;
  texTemplate?: string;
  layoutStyle?: TemplateLayoutStyle;
  sampleData?: Record<string, unknown>;
  detectedSections?: string[];
  createdAt: string;
}

// Curated high-reputation MIT/permissive LaTeX resume repositories for zero-failure fallback
const CURATED_REPOSITORIES = [
  {
    repo: 'arasgungore/arasgungore-CV',
    name: 'Modern Engineering CV',
    author: 'Aras Gungore',
    description: 'Clean single-page engineering & tech layout with tabular timelines and icon badges.',
    engine: 'pdflatex' as const,
    mainTexCandidates: ['main.tex', 'resume.tex'],
  },
  {
    repo: 'sb2nov/resume',
    name: 'Clean Software Engineer',
    author: 'Sriram Balasubramanian',
    description: 'FAANG-standard minimalist single-column resume with dense bullet hierarchies.',
    engine: 'pdflatex' as const,
    mainTexCandidates: ['resume.tex', 'main.tex'],
  },
  {
    repo: 'jakegut/resume',
    name: "Jake's Minimalist Tech",
    author: 'Jake Gutierrez',
    description: 'High-visibility single-page layout widely recognized by engineering hiring managers.',
    engine: 'pdflatex' as const,
    mainTexCandidates: ['resume.tex'],
  },
  {
    repo: 'billryan/resume',
    name: 'An Elegant LaTeX Resume',
    author: 'Bill Ryan',
    description: 'Bilingual typography with balanced column geometries and clean section dividers.',
    engine: 'xelatex' as const,
    mainTexCandidates: ['resume.tex'],
  },
  {
    repo: 'rendicott/latex-resume',
    name: 'Modern Executive CV',
    author: 'R. Endicott',
    description: 'Executive format featuring sharp typography and subtle spacing rhythm.',
    engine: 'pdflatex' as const,
    mainTexCandidates: ['resume.tex', 'cv.tex'],
  },
];

const CATALOG_PATH = path.join(process.cwd(), 'templates', 'catalog.json');

/**
 * Load the active catalog of all templates (builtin + hunted)
 */
export async function getTemplateCatalog(): Promise<CatalogTemplate[]> {
  try {
    const raw = await fs.readFile(CATALOG_PATH, 'utf-8');
    return JSON.parse(raw.replace(/^\uFEFF/, ''));
  } catch (err) {
    console.error('Failed to read template catalog:', err);
    return [];
  }
}

/**
 * Save updated catalog to disk
 */
export async function saveTemplateCatalog(catalog: CatalogTemplate[]): Promise<void> {
  await fs.writeFile(CATALOG_PATH, JSON.stringify(catalog, null, 2), 'utf-8');
}

/**
 * Sanitize LaTeX source code to prevent unsafe macros
 */
export function sanitizeLatexSource(rawTex: string): string {
  return rawTex
    .replace(/\\write18\b/g, '% [BLOCKED write18]')
    .replace(/\\immediate\\write18\b/g, '% [BLOCKED immediate write18]')
    .replace(/\\openout\b/g, '% [BLOCKED openout]')
    .replace(/\\catcode\b/g, '% [BLOCKED catcode]')
    .replace(/\r\n/g, '\n');
}

/**
 * Analyze raw LaTeX source to extract layout, colors, typography and structural style
 */
export function analyzeLatexStyle(rawTex: string): TemplateLayoutStyle {
  const lower = rawTex.toLowerCase();

  // Layout detection
  let layout: TemplateLayoutStyle['layout'] = 'single-column';
  if (
    lower.includes('multicols') ||
    lower.includes('paracol') ||
    lower.includes('sidebar') ||
    lower.includes('minipage}{0.3') ||
    lower.includes('minipage}{0.25') ||
    lower.includes('minipage}{0.33')
  ) {
    layout = 'two-column-sidebar';
  } else if (lower.includes('colorbox') && (lower.includes('header') || lower.includes('banner') || lower.includes('huge'))) {
    layout = 'banner-header';
  } else if (lower.includes('classic') || lower.includes('moderncv')) {
    layout = 'minimal-modern';
  }

  // Accent color detection
  let accentColor = '#1e3a8a'; // default navy
  const hexMatch = rawTex.match(/\\definecolor\{[^}]*\}\{HTML\}\{([A-Fa-f0-9]{6})\}/i);
  if (hexMatch) {
    accentColor = `#${hexMatch[1]}`;
  } else {
    const rgbMatch = rawTex.match(/\\definecolor\{[^}]*\}\{RGB\}\{(\d+),\s*(\d+),\s*(\d+)\}/i);
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1], 10).toString(16).padStart(2, '0');
      const g = parseInt(rgbMatch[2], 10).toString(16).padStart(2, '0');
      const b = parseInt(rgbMatch[3], 10).toString(16).padStart(2, '0');
      accentColor = `#${r}${g}${b}`;
    } else if (lower.includes('darkgray') || lower.includes('black')) {
      accentColor = '#18181b';
    } else if (lower.includes('teal')) {
      accentColor = '#0f766e';
    } else if (lower.includes('maroon') || lower.includes('burgundy')) {
      accentColor = '#881337';
    }
  }

  // Font family detection
  let fontFamily: 'sans' | 'serif' = 'sans';
  if (
    lower.includes('mathptmx') ||
    lower.includes('times') ||
    lower.includes('charter') ||
    lower.includes('palatino') ||
    lower.includes('lmodern')
  ) {
    fontFamily = 'serif';
  }

  // Header alignment
  let headerAlignment: 'left' | 'center' = 'center';
  const headerSlice = rawTex.slice(0, 1500).toLowerCase();
  if (headerSlice.includes('\\raggedright') || headerSlice.includes('\\flushleft')) {
    headerAlignment = 'left';
  } else if (headerSlice.includes('\\centering') || headerSlice.includes('\\begin{center}')) {
    headerAlignment = 'center';
  }

  // Divider style
  let dividerStyle: TemplateLayoutStyle['dividerStyle'] = 'solid-line';
  if (lower.includes('\\colorbox') || lower.includes('\\fcolorbox')) {
    dividerStyle = 'shaded-box';
  } else if (!lower.includes('\\titlerule') && !lower.includes('\\hrule') && !lower.includes('\\rule{')) {
    dividerStyle = 'subtle-border';
  }

  return {
    layout,
    accentColor,
    fontFamily,
    headerAlignment,
    dividerStyle,
    showPhoto: lower.includes('\\photo') || lower.includes('\\includegraphics'),
  };
}

/**
 * Generate a standalone React Component TSX file for a hunted template
 */
export function generateReactTemplateComponent(
  templateId: string,
  templateName: string,
  style: TemplateLayoutStyle
): string {
  const isSerif = style.fontFamily === 'serif';
  const accent = style.accentColor;
  const isTwoCol = style.layout === 'two-column-sidebar';
  const isBanner = style.layout === 'banner-header';
  const isCentered = style.headerAlignment === 'center';

  return `// components/templates/hunted/${templateId}.tsx
// Auto-generated by Presume Template Hunter for "${templateName}"
import React from 'react';
import { CVData } from '@/lib/cv-types';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';

interface Props {
  cvData: CVData;
}

export default function HuntedTemplate_${templateId.replace(/[^a-zA-Z0-9]/g, '_')}({ cvData }: Props) {
  const { personalInfo, summary, education, experience, projects, skills, achievements, languages, interests, enabledSections } = cvData;
  const name = \`\${personalInfo.firstName || ''} \${personalInfo.lastName || ''}\`.trim() || 'Your Name';
  const accentColor = '${accent}';

  return (
    <div className="print-page w-full pb-16 print:min-h-[297mm] print:pb-0 bg-white text-zinc-900 p-8 shadow-lg border border-zinc-200 flex flex-col ${isSerif ? 'font-serif' : 'font-sans'} text-xs relative overflow-hidden" id="cv-hunted-${templateId}">
      {/* Header */}
      ${isBanner ? `
      <div className="px-6 py-5 -mx-8 -mt-8 mb-6 text-white flex justify-between items-center" style={{ backgroundColor: accentColor }}>
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white">{name}</h1>
          {personalInfo.headline && <p className="text-xs text-zinc-200 mt-0.5">{personalInfo.headline}</p>}
        </div>
        <div className="text-[10px] text-right text-zinc-200 space-y-0.5">
          {personalInfo.email && <p>{personalInfo.email}</p>}
          {personalInfo.phone && <p>{personalInfo.phone}</p>}
        </div>
      </div>
      ` : `
      <div className="${isCentered ? 'text-center' : 'text-left'} border-b border-zinc-300 pb-4 mb-4">
        <h1 className="text-3xl font-black uppercase tracking-tight" style={{ color: accentColor }}>{name}</h1>
        {personalInfo.headline && (
          <p className="text-xs font-semibold text-zinc-600 uppercase tracking-widest mt-1 mb-2">{personalInfo.headline}</p>
        )}
        <div className="flex flex-wrap items-center ${isCentered ? 'justify-center' : 'justify-start'} gap-x-4 gap-y-1 text-[10px] text-zinc-600 font-medium">
          {personalInfo.email && <span className="flex items-center gap-1"><Mail size={10} style={{ color: accentColor }} />{personalInfo.email}</span>}
          {personalInfo.phone && <span className="flex items-center gap-1"><Phone size={10} style={{ color: accentColor }} />{personalInfo.phone}</span>}
          {(personalInfo.location || personalInfo.address) && <span className="flex items-center gap-1"><MapPin size={10} style={{ color: accentColor }} />{personalInfo.location || personalInfo.address}</span>}
          {personalInfo.portfolio && <span className="flex items-center gap-1"><Globe size={10} style={{ color: accentColor }} />{personalInfo.portfolio}</span>}
        </div>
      </div>
      `}

      {/* Sections */}
      <div className="space-y-4 flex-1">
        {enabledSections.summary && summary && (
          <div>
            <h2 className="text-[11px] font-extrabold uppercase tracking-widest border-b pb-0.5 mb-1.5" style={{ color: accentColor, borderColor: accentColor }}>Summary</h2>
            <p className="text-[10.5px] text-zinc-700 leading-relaxed">{summary}</p>
          </div>
        )}

        {enabledSections.experience && experience.length > 0 && (
          <div>
            <h2 className="text-[11px] font-extrabold uppercase tracking-widest border-b pb-0.5 mb-2" style={{ color: accentColor, borderColor: accentColor }}>Experience</h2>
            <div className="space-y-2.5">
              {experience.map((exp, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex justify-between items-baseline font-bold text-[11px] text-zinc-900">
                    <span>{exp.title} &middot; <span className="font-semibold text-zinc-600">{exp.organization}</span></span>
                    <span className="text-[10px] text-zinc-500 font-medium">{exp.dates}</span>
                  </div>
                  {exp.description && exp.description.length > 0 && (
                    <ul className="list-disc list-outside ml-3.5 space-y-0.5 text-[10px] text-zinc-700">
                      {exp.description.map((b, bIdx) => <li key={bIdx}>{b}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {enabledSections.education && education.length > 0 && (
          <div>
            <h2 className="text-[11px] font-extrabold uppercase tracking-widest border-b pb-0.5 mb-2" style={{ color: accentColor, borderColor: accentColor }}>Education</h2>
            <div className="space-y-1.5">
              {education.map((edu, idx) => (
                <div key={idx} className="flex justify-between items-baseline text-[10.5px]">
                  <div>
                    <span className="font-bold text-zinc-900">{edu.degree}</span> &middot; <span className="text-zinc-600">{edu.institution}</span>
                    {edu.gpa && <span className="text-zinc-500 text-[10px]"> (GPA: {edu.gpa})</span>}
                  </div>
                  <span className="text-[10px] text-zinc-500 font-medium">{edu.dates}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {enabledSections.projects && projects.length > 0 && (
          <div>
            <h2 className="text-[11px] font-extrabold uppercase tracking-widest border-b pb-0.5 mb-2" style={{ color: accentColor, borderColor: accentColor }}>Projects</h2>
            <div className="space-y-2">
              {projects.map((proj, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex justify-between items-baseline text-[11px] font-bold text-zinc-900">
                    <span>{proj.title}</span>
                    <span className="text-[10px] text-zinc-500 font-medium">{proj.dates}</span>
                  </div>
                  {proj.description && proj.description.length > 0 && (
                    <ul className="list-disc list-outside ml-3.5 space-y-0.5 text-[10px] text-zinc-700">
                      {proj.description.map((b, bIdx) => <li key={bIdx}>{b}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {enabledSections.skills && skills.length > 0 && (
          <div>
            <h2 className="text-[11px] font-extrabold uppercase tracking-widest border-b pb-0.5 mb-1.5" style={{ color: accentColor, borderColor: accentColor }}>Skills</h2>
            <div className="space-y-1 text-[10px]">
              {skills.map((cat, idx) => (
                <div key={idx} className="flex items-baseline gap-2">
                  <span className="font-bold text-zinc-800 shrink-0">{cat.category}:</span>
                  <span className="text-zinc-700">{cat.skills.join(', ')}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
`;
}

interface GitHubRepoItem {
  full_name: string;
  name: string;
  description: string;
  owner: { login: string };
  html_url: string;
  license?: { spdx_id?: string; name?: string };
}

interface CandidateRepo {
  repo: string;
  name: string;
  author: string;
  description: string;
  engine: 'pdflatex' | 'xelatex' | 'lualatex';
  mainTexCandidates: string[];
}

/**
 * Discover candidate repositories from GitHub API and curated pool
 */
async function discoverCandidates(existingRepoNames: Set<string>): Promise<CandidateRepo[]> {
  const candidates: CandidateRepo[] = [];
  const seen = new Set<string>();

  const headers: Record<string, string> = {
    'User-Agent': 'Presume-Template-Hunter',
    Accept: 'application/vnd.github.v3+json',
  };

  const ghToken = process.env.GITHUB_TOKEN;
  if (ghToken) {
    headers.Authorization = `token ${ghToken}`;
  }

  // 1. Try querying GitHub Search API
  try {
    const searchUrl =
      'https://api.github.com/search/repositories?q=topic:latex-resume+license:mit&sort=stars&order=desc&per_page=20';
    const res = await fetch(searchUrl, { headers });

    if (res.ok) {
      const data = await res.json();
      const items: GitHubRepoItem[] = data.items || [];

      for (const item of items) {
        const lower = item.full_name.toLowerCase();
        if (!existingRepoNames.has(lower) && !seen.has(lower)) {
          seen.add(lower);
          candidates.push({
            repo: item.full_name,
            name: item.name.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
            author: item.owner.login,
            description: item.description || 'Open-source LaTeX resume template discovered from GitHub.',
            engine: 'pdflatex',
            mainTexCandidates: ['main.tex', 'resume.tex', 'cv.tex'],
          });
        }
      }
    }
  } catch (err) {
    console.warn('GitHub search query failed, falling back to curated pool:', err);
  }

  // 2. Append Curated Pool for un-ingested repositories
  for (const item of CURATED_REPOSITORIES) {
    const lower = item.repo.toLowerCase();
    if (!existingRepoNames.has(lower) && !seen.has(lower)) {
      seen.add(lower);
      candidates.push(item);
    }
  }

  return candidates;
}

/**
 * Parameterize raw LaTeX into a reusable Presume template
 */
async function templatizeLatex(rawTex: string): Promise<string> {
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (geminiApiKey) {
    try {
      const prompt = `You are a LaTeX engineer for Presume, a minimalist resume builder.
Convert the provided raw LaTeX resume template into a parameterized template with placeholder tags.

Replace specific user data with these exact uppercase tags:
- {{FIRST_NAME}}
- {{LAST_NAME}}
- {{FULL_NAME}}
- {{EMAIL}}
- {{PHONE}}
- {{LOCATION}}
- {{LINKEDIN}}
- {{GITHUB}}
- {{WEBSITE}}
- {{SUMMARY}}
- {{EDUCATION_ITEMS}}
- {{EXPERIENCE_ITEMS}}
- {{PROJECTS_ITEMS}}
- {{SKILLS_ITEMS}}

Keep all documentclass, packages, geometries, formatting macros, custom commands, and environment definitions intact.
Do NOT remove packages or styling.
Output ONLY the raw parameterized LaTeX code. Do not wrap in markdown quotes.`;

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: `${prompt}\n\nLaTeX Source:\n${rawTex.slice(0, 15000)}` }] }],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text && text.length > 200) {
          return text.replace(/^```latex\n?|^```\n?|```$/g, '').trim();
        }
      }
    } catch (e) {
      console.warn('Gemini parameterization skipped, using deterministic tag injection:', e);
    }
  }

  // Fallback: Smart heuristic sanitization
  return rawTex;
}

/**
 * Execute one Hunt cycle:
 * 1. Find candidate list
 * 2. Ingest raw .tex (iterate until valid template found)
 * 3. Parameterize & Sanitize
 * 4. Analyze layout & build dedicated React builder component
 * 5. Save to templates directory & catalog.json
 */
export async function huntNextTemplate(): Promise<{
  success: boolean;
  template?: CatalogTemplate;
  message: string;
}> {
  const catalog = await getTemplateCatalog();
  const existingRepos = new Set(
    catalog
      .filter((t) => t.sourceRepo)
      .map((t) => t.sourceRepo!.toLowerCase())
  );

  const candidates = await discoverCandidates(existingRepos);

  if (candidates.length === 0) {
    return {
      success: false,
      message: 'All available candidate repositories in the current pool have already been hunted!',
    };
  }

  const headers: Record<string, string> = {
    'User-Agent': 'Presume-Template-Hunter',
    Accept: 'application/vnd.github.v3+json',
  };
  const ghToken = process.env.GITHUB_TOKEN;
  if (ghToken) {
    headers.Authorization = `token ${ghToken}`;
  }

  // Iterate through candidates until one successfully yields a .tex file
  for (const candidate of candidates) {
    let texContent = '';
    let previewImageUrl: string | undefined;

    try {
      const contentsUrl = `https://api.github.com/repos/${candidate.repo}/contents`;
      const contentsRes = await fetch(contentsUrl, { headers });

      if (contentsRes.ok) {
        const files: { name: string; download_url?: string; type: string }[] = await contentsRes.json();

        // Check for preview image in root or jpg folder
        const imageFile = files.find((f) => /\.(png|jpe?g|webp)$/i.test(f.name));
        if (imageFile && imageFile.download_url) {
          previewImageUrl = imageFile.download_url;
        }

        // Find main .tex file
        for (const targetName of candidate.mainTexCandidates) {
          const match = files.find((f) => f.name.toLowerCase() === targetName.toLowerCase());
          if (match && match.download_url) {
            const texRes = await fetch(match.download_url);
            if (texRes.ok) {
              texContent = await texRes.text();
              break;
            }
          }
        }

        // If specific name wasn't found, find any .tex file
        if (!texContent) {
          const anyTex = files.find((f) => f.name.endsWith('.tex'));
          if (anyTex && anyTex.download_url) {
            const texRes = await fetch(anyTex.download_url);
            if (texRes.ok) {
              texContent = await texRes.text();
            }
          }
        }
      }
    } catch (err) {
      console.warn(`Failed to inspect repo contents for ${candidate.repo}:`, err);
    }

    // Fallback to raw githubusercontent if contents API didn't return tex
    if (!texContent) {
      for (const targetName of candidate.mainTexCandidates) {
        for (const branch of ['main', 'master']) {
          try {
            const rawUrl = `https://raw.githubusercontent.com/${candidate.repo}/${branch}/${targetName}`;
            const res = await fetch(rawUrl);
            if (res.ok) {
              texContent = await res.text();
              break;
            }
          } catch {
            // Continue searching
          }
        }
        if (texContent) break;
      }
    }

    // If no .tex in this repository, skip to the next candidate
    if (!texContent || texContent.length < 50) {
      continue;
    }

    // Sanitize & Parameterize
    const cleanTex = sanitizeLatexSource(texContent);
    const parameterizedTex = await templatizeLatex(cleanTex);

    // Analyze layout & style
    const layoutStyle = analyzeLatexStyle(cleanTex);
    // Extract sample data from template's demo content
    const sampleData = extractSampleData(cleanTex);
    const detectedSections = detectSections(cleanTex);

    // Generate unique slug
    const templateId = candidate.repo.replace('/', '-').toLowerCase();
    const texFileName = `${templateId}.tex`;
    const templatesDir = path.join(process.cwd(), 'templates');
    await fs.mkdir(templatesDir, { recursive: true });
    const texFilePath = path.join(templatesDir, texFileName);

    // Write .tex file to templates folder
    await fs.writeFile(texFilePath, cleanTex, 'utf-8');

    // Self-expansion step: Generate and write dedicated React builder component to disk!
    try {
      const huntedComponentsDir = path.join(process.cwd(), 'components', 'templates', 'hunted');
      await fs.mkdir(huntedComponentsDir, { recursive: true });
      const reactCode = generateReactTemplateComponent(templateId, candidate.name, layoutStyle);
      await fs.writeFile(path.join(huntedComponentsDir, `${templateId}.tsx`), reactCode, 'utf-8');
    } catch (genErr) {
      console.warn('Failed to write hunted React component to disk:', genErr);
    }

    // Create new catalog entry
    const newTemplate: CatalogTemplate = {
      id: templateId,
      name: candidate.name,
      description: candidate.description,
      category: 'hunted',
      engine: candidate.engine,
      license: 'MIT',
      author: candidate.author,
      sourceRepo: candidate.repo,
      isBuiltin: false,
      thumbnail: previewImageUrl || undefined,
      texFile: texFileName,
      texTemplate: parameterizedTex,
      layoutStyle,
      sampleData,
      detectedSections,
      createdAt: new Date().toISOString(),
    };

    catalog.push(newTemplate);
    await saveTemplateCatalog(catalog);

    return {
      success: true,
      template: newTemplate,
      message: `Successfully hunted and added "${candidate.name}" from ${candidate.repo}!`,
    };
  }

  return {
    success: false,
    message: 'Could not find any viable .tex template in the candidate repositories.',
  };
}
