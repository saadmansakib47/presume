// lib/latex-template.ts
import { CVData } from './cv-types';
import { escapeLaTeX, formatBulletPoints, generateEducationContent, generateSkillsContent } from './latex-utils';

export function generateLatex(cvData: CVData): string {
  let template = `%%%%%%%%%%%%%%%%%
% Generated CV - Moderncv Banking Theme
%%%%%%%%%%%%%%%%%

\\documentclass[11pt,a4paper]{moderncv}
\\moderncvtheme[blue]{banking}
\\nopagenumbers{}

\\usepackage[T1]{fontenc}
\\usepackage[utf8]{inputenc}
\\usepackage[scale=0.9]{geometry}
\\usepackage{tabularx}
\\usepackage{mathpazo}
\\usepackage{fontawesome5}

\\renewcommand*{\\labelitemi}{-}

\\newcolumntype{L}{>{\\raggedright\\arraybackslash}X}
\\newcolumntype{C}{>{\\centering\\arraybackslash}X}
\\newcolumntype{R}{>{\\raggedleft\\arraybackslash}X}

\\newcommand*{\\educationentry}[4][0.5mm]{
    \\begin{tabularx}{\\textwidth}{LR}
        {\\bfseries #3} & {\\bfseries #4} \\\\
    \\end{tabularx}
    {\\itshape #2}
    \\par\\addvspace{#1}
}

\\firstname{${escapeLaTeX(cvData.personalInfo.firstName)}}
\\familyname{${escapeLaTeX(cvData.personalInfo.lastName)}}
\\address{${escapeLaTeX(cvData.personalInfo.address)}}{${escapeLaTeX(cvData.personalInfo.location)}}

\\begin{document}

\\maketitle
\\vspace{-9.0mm}

\\begin{tabularx}{\\textwidth}{C C C}
    \\emailsymbol\\enspace \\emaillink{${escapeLaTeX(cvData.personalInfo.email)}} &`;

  if (cvData.personalInfo.phone) {
    template += `\\mobilephonesymbol\\enspace ${escapeLaTeX(cvData.personalInfo.phone)} &`;
  } else {
    template += ' &';
  }

  template += `
    ${cvData.personalInfo.github ? `\\faGithub\\enspace \\href{${cvData.personalInfo.github}}{${escapeLaTeX(cvData.personalInfo.github)}}` : ''} \\\\
    & & ${cvData.personalInfo.linkedin ? `\\faLinkedin\\enspace \\href{${cvData.personalInfo.linkedin}}{${escapeLaTeX(cvData.personalInfo.linkedin)}}` : ''}
\\end{tabularx}

\\vspace{-2.0mm}

% Left Column
\\begin{minipage}[t]{0.62\\textwidth}
`;

  // Summary
  if (cvData.enabledSections.summary && cvData.summary?.trim()) {
    template += `\\section{SUMMARY}\n${escapeLaTeX(cvData.summary)}\n\\vspace{2.0mm}\n`;
  }

  // Projects
  if (cvData.enabledSections.projects && cvData.projects.length > 0) {
    template += `\\section{PROJECTS}\n`;
    cvData.projects.forEach((proj) => {
      template += `\\textbf{${escapeLaTeX(proj.title)}}`;
      if (proj.dates) template += ` \\hfill ${escapeLaTeX(proj.dates)}\n`;
      template += `\\\\\n`;
      if (proj.description && proj.description.length > 0) {
        template += `\\begin{itemize}\n${formatBulletPoints(proj.description)}\n\\end{itemize}\n`;
      }
      template += `\\vspace{1.0mm}\n`;
    });
  }

  // Achievements
  if (cvData.enabledSections.achievements && cvData.achievements.length > 0) {
    template += `\\section{ACHIEVEMENTS}\n\\begin{itemize}\n${cvData.achievements.map(a => `\\item ${escapeLaTeX(a)}`).join('\n')}\n\\end{itemize}\n\\vspace{2.0mm}\n`;
  }

  template += `\\end{minipage}
\\hfill
\\begin{minipage}[t]{0.35\\textwidth}
`;

  // Skills
  if (cvData.enabledSections.skills && cvData.skills.length > 0) {
    template += `\\section{SKILLS}\n${generateSkillsContent(cvData.skills)}\\vspace{2.0mm}\n`;
  }

  // Education
  if (cvData.enabledSections.education && cvData.education.length > 0) {
    template += `\\section{EDUCATION}\n${generateEducationContent(cvData.education)}\n\\vspace{2.0mm}\n`;
  }

  // Languages
  if (cvData.enabledSections.languages && cvData.languages.length > 0) {
    template += `\\section{LANGUAGES}\n\\begin{itemize}\n${cvData.languages.map(lang => `\\item ${escapeLaTeX(lang)}`).join('\n')}\n\\end{itemize}\n\\vspace{2.0mm}\n`;
  }

  // Interests
  if (cvData.enabledSections.interests && cvData.interests.length > 0) {
    template += `\\section{INTERESTS}\n\\begin{itemize}\n${cvData.interests.map(int => `\\item ${escapeLaTeX(int)}`).join('\n')}\n\\end{itemize}\n\\vspace{2.0mm}\n`;
  }

  template += `\\end{minipage}

\\end{document}`;

  return template;
}