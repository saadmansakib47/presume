// lib/latex-sample-extractor.ts
// Parses raw LaTeX resume to extract sample data for populating the builder form.
import {
  CVData,
  PersonalInfo,
  EducationEntry,
  ExperienceEntry,
  ProjectEntry,
  SkillCategory,
  programmerDefaultCVData,
} from './cv-types';

function stripLatex(s: string): string {
  return s
    .replace(/\\[a-zA-Z]+\{([^}]*)\}/g, '$1')
    .replace(/\\[a-zA-Z]+/g, '')
    .replace(/\{|\}/g, '')
    .replace(/~+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function firstMatch(text: string, patterns: RegExp[]): string {
  for (const re of patterns) {
    const m = text.match(re);
    if (m) return stripLatex(m[1] || m[0]).trim();
  }
  return '';
}

function extractPersonalInfo(tex: string): Partial<PersonalInfo> {
  const info: Partial<PersonalInfo> = {};
  const namePair = tex.match(/\\name\{([^}]+)\}\{([^}]+)\}/);
  if (namePair) {
    info.firstName = stripLatex(namePair[1]);
    info.lastName = stripLatex(namePair[2]);
  } else {
    const nameOne = tex.match(/\\name\{([^}]+)\}/);
    if (nameOne) {
      const parts = stripLatex(nameOne[1]).split(/\s+/);
      info.firstName = parts[0] || '';
      info.lastName = parts.slice(1).join(' ');
    }
  }
  info.email = firstMatch(tex, [
    /\\email\{([^}]+)\}/,
    /\b[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}\b/,
  ]);
  info.phone = firstMatch(tex, [
    /\\phone(?:\[mobile\])?\{([^}]+)\}/,
    /\\mobile\{([^}]+)\}/,
    /(?:phone|tel|mobile)[:\s]*([+\d][\d\s\-().]{6,18}\d)/i,
  ]);
  const li = tex.match(/linkedin\.com\/in\/([\w\-]+)/i);
  if (li) info.linkedin = `https://linkedin.com/in/${li[1]}`;
  const gh = tex.match(/github\.com\/([\w\-]+)/i);
  if (gh) info.github = `https://github.com/${gh[1]}`;
  const web = tex.match(/\\homepage\{([^}]+)\}|\\website\{([^}]+)\}/i);
  if (web) info.portfolio = web[1] || web[2] || '';
  info.location = firstMatch(tex, [
    /\\address\{([^}]+)\}/,
    /\\location\{([^}]+)\}/,
    /\b[A-Z][a-z]+,\s*[A-Z]{2}\b/,
    /\b[A-Z][a-z]+,\s*[A-Z][a-z]+\b/,
  ]);
  info.headline = firstMatch(tex, [
    /\\position\{([^}]+)\}/,
    /\\jobtitle\{([^}]+)\}/,
    /\\subtitle\{([^}]+)\}/,
    /\\cvtitle\{([^}]+)\}/,
    /\\role\{([^}]+)\}/,
  ]) || 'Software Engineer';
  return info;
}

function extractEducation(tex: string): EducationEntry[] {
  const results: EducationEntry[] = [];
  const cventryRe = /\\cventry\{([^}]*)\}\{([^}]*)\}\{([^}]*)\}\{([^}]*)\}\{([^}]*)\}/g;
  let m;
  while ((m = cventryRe.exec(tex)) !== null) {
    const eduBlock = tex.slice(0, m.index);
    const prevSection = eduBlock.lastIndexOf('\\section');
    const secLabel = eduBlock.slice(prevSection);
    if (/education|academic/i.test(secLabel) || results.length === 0) {
      results.push({ dates: stripLatex(m[1]), degree: stripLatex(m[2]), institution: stripLatex(m[3]), gpa: m[5] ? stripLatex(m[5]) : undefined });
    }
    if (results.length >= 3) break;
  }
  if (results.length) return results;

  const eduBlock = tex.match(/\\section\{Education[^}]*\}([\s\S]*?)(?=\\section\{|\\end\{document\})/i);
  if (eduBlock) {
    const lines = eduBlock[1].split('\n').filter(l => l.trim());
    for (let i = 0; i < lines.length && results.length < 3; i++) {
      const dm = lines[i].match(/\\textbf\{([^}]+)\}|\\textsc\{([^}]+)\}/);
      if (dm) {
        results.push({ degree: stripLatex(dm[1] || dm[2]), institution: stripLatex(lines[i + 1] || ''), dates: stripLatex(lines[i + 2] || '') });
        i += 2;
      }
    }
  }
  return results.length ? results : [{ degree: 'B.Sc. in Computer Science', institution: 'Your University', dates: '2020 - 2024' }];
}

function extractExperience(tex: string): ExperienceEntry[] {
  const results: ExperienceEntry[] = [];
  const expBlock = tex.match(/\\section\{(?:Experience|Work|Employment)[^}]*\}([\s\S]*?)(?=\\section\{|\\end\{document\})/i);
  if (!expBlock) return results;
  const block = expBlock[1];
  const cventryRe = /\\cventry\{([^}]*)\}\{([^}]*)\}\{([^}]*)\}\{[^}]*\}\{[^}]*\}\{([\s\S]*?)(?=\\cventry\{|$)/g;
  let m;
  while ((m = cventryRe.exec(block)) !== null && results.length < 3) {
    const bullets = m[4].split(/\\item\s*/).map(s => stripLatex(s).trim()).filter(s => s.length > 5).slice(0, 4);
    results.push({ title: stripLatex(m[2]), organization: stripLatex(m[3]), dates: stripLatex(m[1]), description: bullets.length ? bullets : ['Contributed to key deliverables.'] });
  }
  if (!results.length) {
    const items = [...block.matchAll(/\\item\s+(.+)/g)].map(im => stripLatex(im[1]).trim()).filter(s => s.length > 5).slice(0, 4);
    if (items.length) results.push({ title: 'Role', organization: 'Company', dates: '', description: items });
  }
  return results;
}

function extractProjects(tex: string): ProjectEntry[] {
  const results: ProjectEntry[] = [];
  const projBlock = tex.match(/\\section\{(?:Projects?|Portfolio)[^}]*\}([\s\S]*?)(?=\\section\{|\\end\{document\})/i);
  if (!projBlock) return results;
  const block = projBlock[1];
  const cvitemRe = /\\cvitem\{([^}]+)\}\{([^}]+)\}/g;
  let m;
  while ((m = cvitemRe.exec(block)) !== null && results.length < 4) {
    results.push({ title: stripLatex(m[1]), description: [stripLatex(m[2])] });
  }
  if (!results.length) {
    const lines = block.split('\n');
    for (let i = 0; i < lines.length && results.length < 4; i++) {
      const tm = lines[i].match(/\\textbf\{([^}]+)\}/);
      if (tm) {
        const desc = lines.slice(i + 1, i + 5).filter(l => l.includes('\\item')).map(l => stripLatex(l).trim()).filter(Boolean);
        results.push({ title: stripLatex(tm[1]), description: desc.length ? desc : ['Open-source project.'] });
        i += 4;
      }
    }
  }
  return results;
}

function extractSkills(tex: string): SkillCategory[] {
  const results: SkillCategory[] = [];
  const skillBlock = tex.match(/\\section\{(?:Skills?|Technical[^}]*)[^}]*\}([\s\S]*?)(?=\\section\{|\\end\{document\})/i);
  if (!skillBlock) return results;
  const block = skillBlock[1];
  const cvitemRe = /\\cvitem\{([^}]+)\}\{([^}]+)\}/g;
  let m;
  while ((m = cvitemRe.exec(block)) !== null && results.length < 6) {
    results.push({ category: stripLatex(m[1]), skills: m[2].split(/[,;]/).map(s => stripLatex(s).trim()).filter(Boolean) });
  }
  if (!results.length) {
    for (const match of block.matchAll(/\{([^}]+)\}:\s*([^\n\\]+)/g)) {
      if (results.length >= 6) break;
      const cat = stripLatex(match[1]).trim();
      const skills = match[2].split(/[,;]/).map(s => stripLatex(s).trim()).filter(Boolean);
      if (cat && skills.length) results.push({ category: cat, skills });
    }
  }
  return results;
}

function extractAchievements(tex: string): string[] {
  const block = tex.match(/\\section\{(?:Honors?|Awards?|Achievements?|Distinctions?)[^}]*\}([\s\S]*?)(?=\\section\{|\\end\{document\})/i);
  if (!block) return [];
  return block[1].split(/\\item\s*/).map(s => stripLatex(s).trim()).filter(s => s.length > 5).slice(0, 5);
}

function extractSummary(tex: string): string {
  const block = tex.match(/\\section\{(?:Summary|Objective|Profile|About)[^}]*\}([\s\S]*?)(?=\\section\{|\\end\{document\})/i);
  if (!block) return '';
  return stripLatex(block[1]).replace(/\s+/g, ' ').trim().slice(0, 500);
}

export function detectSections(tex: string): string[] {
  return [...new Set([...tex.matchAll(/\\section\*?\{([^}]+)\}/g)].map(m => m[1].trim()))];
}

export function extractSampleData(rawTex: string): Partial<CVData> {
  const pi = extractPersonalInfo(rawTex);
  const education = extractEducation(rawTex);
  const experience = extractExperience(rawTex);
  const projects = extractProjects(rawTex);
  const skills = extractSkills(rawTex);
  const achievements = extractAchievements(rawTex);
  const summary = extractSummary(rawTex);
  const hasSummary = summary.length > 10;
  const hasExp = experience.length > 0;
  const hasProj = projects.length > 0;
  const hasSkills = skills.length > 0;
  const hasAch = achievements.length > 0;
  return {
    template: 'programmer',
    themeColor: 'black',
    personalInfo: { ...programmerDefaultCVData.personalInfo, ...pi },
    summary: hasSummary ? summary : programmerDefaultCVData.summary,
    education: education.length ? education : programmerDefaultCVData.education,
    experience: hasExp ? experience : programmerDefaultCVData.experience,
    projects: hasProj ? projects : programmerDefaultCVData.projects,
    skills: hasSkills ? skills : programmerDefaultCVData.skills,
    achievements: hasAch ? achievements : programmerDefaultCVData.achievements,
    languages: programmerDefaultCVData.languages,
    interests: programmerDefaultCVData.interests,
    technicalWriting: [],
    problemSolving: '',
    references: [],
    showPhoto: rawTex.toLowerCase().includes('\\photo') || rawTex.toLowerCase().includes('\\includegraphics'),
    showGPA: true,
    enabledSections: {
      summary: hasSummary, experience: true, projects: hasProj || true, skills: hasSkills || true,
      education: true, achievements: hasAch, languages: true, interests: true,
      technicalWriting: false, problemSolving: false, references: false,
    },
  };
}
