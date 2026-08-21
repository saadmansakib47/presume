import type { EducationEntry, SkillCategory } from './cv-types';

const LATEX_ESCAPE_MAP: Record<string, string> = {
  '\\': '\\textbackslash{}',
  '&': '\\&',
  '%': '\\%',
  '$': '\\$',
  '#': '\\#',
  '_': '\\_',
  '{': '\\{',
  '}': '\\}',
  '~': '\\textasciitilde{}',
  '^': '\\textasciicircum{}',
};

export function escapeLaTeX(text: string | undefined | null): string {
  if (!text) return '';
  return String(text).replace(/[\\&%$#_{}~^]/g, (match) => LATEX_ESCAPE_MAP[match] || match);
}

export function formatBulletPoints(items: string[] | undefined): string {
  if (!items || items.length === 0) return '';
  return items
    .map(item => `\\item ${escapeLaTeX(item)}`)
    .join('\n');
}

export function generateEducationContent(education: EducationEntry[]): string {
  if (!education || education.length === 0) return '';
  return education
    .map((edu) => {
      const gpaPart = edu.gpa ? ` (CGPA: ${escapeLaTeX(edu.gpa)})` : '';
      return `\\educationentry{${escapeLaTeX(edu.degree)}${gpaPart}}{${escapeLaTeX(edu.institution)}}{${escapeLaTeX(edu.dates)}}`;
    })
    .join('\n\n');
}

export function generateSkillsContent(skills: SkillCategory[]): string {
  if (!skills || skills.length === 0) return '';
  let content = '\\begin{tabularx}{\\textwidth}{>{\\bfseries}l@{\\hskip 2mm}L}\n';
  skills.forEach((cat) => {
    content += `${escapeLaTeX(cat.category)} & ${escapeLaTeX(cat.skills.join(', '))} \\\\\n`;
  });
  content += '\\end{tabularx}\n';
  return content;
}