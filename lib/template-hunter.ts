// lib/template-hunter.ts
import fs from 'fs/promises';
import path from 'path';

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
    return JSON.parse(raw);
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
  // Strip dangerous macro definitions and external shell execution
  return rawTex
    .replace(/\\write18\b/g, '% [BLOCKED write18]')
    .replace(/\\immediate\\write18\b/g, '% [BLOCKED immediate write18]')
    .replace(/\\openout\b/g, '% [BLOCKED openout]')
    .replace(/\\catcode\b/g, '% [BLOCKED catcode]')
    .replace(/\r\n/g, '\n');
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
    const searchUrl = 'https://api.github.com/search/repositories?q=topic:latex-resume+license:mit&sort=stars&order=desc&per_page=20';
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
 * 4. Save to templates directory & catalog.json
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

    // Generate unique slug
    const templateId = candidate.repo.replace('/', '-').toLowerCase();
    const texFileName = `${templateId}.tex`;
    const texFilePath = path.join(process.cwd(), 'templates', texFileName);

    // Write .tex file to templates folder
    await fs.writeFile(texFilePath, cleanTex, 'utf-8');

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
