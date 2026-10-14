// lib/hunted-latex.ts
import { CatalogTemplate } from './template-hunter';
import { CVData } from './cv-types';
import { escapeLaTeX } from './latex-utils';

/**
 * Generate full LaTeX code for any hunted template using user's CVData
 */
export function generateHuntedLatex(template: CatalogTemplate, cvData: CVData): string {
  let tex = template.texTemplate || '';
  const pi = cvData.personalInfo;
  const fullName = `${pi.firstName || ''} ${pi.lastName || ''}`.trim() || 'Your Name';

  // If template has {{TAGS}}, replace them
  if (tex.includes('{{FULL_NAME}}') || tex.includes('{{FIRST_NAME}}')) {
    tex = tex
      .replace(/{{FULL_NAME}}/g, escapeLaTeX(fullName))
      .replace(/{{FIRST_NAME}}/g, escapeLaTeX(pi.firstName || ''))
      .replace(/{{LAST_NAME}}/g, escapeLaTeX(pi.lastName || ''))
      .replace(/{{EMAIL}}/g, escapeLaTeX(pi.email || ''))
      .replace(/{{PHONE}}/g, escapeLaTeX(pi.phone || ''))
      .replace(/{{LOCATION}}/g, escapeLaTeX(pi.location || pi.address || ''))
      .replace(/{{LINKEDIN}}/g, escapeLaTeX(pi.linkedin || ''))
      .replace(/{{GITHUB}}/g, escapeLaTeX(pi.github || ''))
      .replace(/{{WEBSITE}}/g, escapeLaTeX(pi.portfolio || ''))
      .replace(/{{SUMMARY}}/g, escapeLaTeX(cvData.summary || ''));
  } else {
    // Inject user details into author/candidate header
    if (template.author) {
      const authorRegex = new RegExp(template.author.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      tex = tex.replace(authorRegex, escapeLaTeX(fullName));
    }

    // Replace header contact lines if present
    if (pi.email) {
      tex = tex.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, escapeLaTeX(pi.email));
    }
    if (pi.phone) {
      tex = tex.replace(/\+?\d[\d\s-]{7,}\d/g, escapeLaTeX(pi.phone));
    }
    if (pi.linkedin) {
      tex = tex.replace(/linkedin\.com\/in\/[\w-]+/g, escapeLaTeX(pi.linkedin.replace(/^https?:\/\//, '')));
    }
    if (pi.github) {
      tex = tex.replace(/github\.com\/[\w-]+/g, escapeLaTeX(pi.github.replace(/^https?:\/\//, '')));
    }
  }

  return tex;
}
