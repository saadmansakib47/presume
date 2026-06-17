// lib/latex-template.ts
import { CVData } from './cv-types';
import { escapeLaTeX, formatBulletPoints, generateEducationContent, generateSkillsContent } from './latex-utils';

export function generateLatex(cvData: CVData): string {
  if (cvData.template === 'classic') {
    return generateClassicLatex(cvData);
  } else {
    return generateProgrammerLatex(cvData);
  }
}

function generateProgrammerLatex(cvData: CVData): string {
  let template = `%%%%%%%%%%%%%%%%%
% Generated CV - Moderncv Banking Theme (Programmer CV)
%%%%%%%%%%%%%%%%%

\\documentclass[11pt,a4paper]{moderncv}
\\moderncvtheme[${cvData.themeColor === 'blue' ? 'blue' : 'black'}]{banking}
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

  // Experience
  if (cvData.enabledSections.experience && cvData.experience.length > 0) {
    template += `\\section{EXPERIENCE}\n`;
    cvData.experience.forEach((exp) => {
      template += `\\textbf{${escapeLaTeX(exp.title)}} \\hfill ${escapeLaTeX(exp.dates)}\n`;
      template += `{\\itshape ${escapeLaTeX(exp.organization)}}\n`;
      if (exp.description && exp.description.length > 0) {
        template += `\\begin{itemize}\n${formatBulletPoints(exp.description)}\n\\end{itemize}\n`;
      }
      template += `\\vspace{1.5mm}\n`;
    });
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

function generateClassicLatex(cvData: CVData): string {
  const name = `${cvData.personalInfo.firstName} ${cvData.personalInfo.lastName}`.trim();
  
  let template = `%% Classic B&W CV - Custom Two-Column Layout
%% Compile: pdflatex cv.tex (run twice for paracol/eso-pic overlays)
\\documentclass[10pt, a4paper]{article}

\\usepackage[a4paper, top=0pt, bottom=0pt, left=0pt, right=0pt]{geometry}
\\usepackage{graphicx}
\\usepackage{xcolor}
\\usepackage{enumitem}
\\usepackage{hyperref}
\\usepackage{fontawesome5}
\\usepackage{parskip}
\\usepackage{lato}
\\usepackage[T1]{fontenc}
\\usepackage{microtype}
\\usepackage{paracol}
\\usepackage{tikz}
\\usetikzlibrary{calc}
\\usepackage{eso-pic}

% Colors — theme: ${cvData.themeColor}
\\definecolor{topbg}{HTML}{${cvData.themeColor === 'blue' ? '1A3A5C' : '18181B'}} % Banner
\\definecolor{sidebg}{HTML}{${cvData.themeColor === 'blue' ? 'EAEEF2' : 'F4F4F5'}} % Sidebar BG
\\definecolor{sidelabel}{HTML}{${cvData.themeColor === 'blue' ? '1A3A5C' : '18181B'}}
\\definecolor{sidetext}{HTML}{2B2B2B}
\\definecolor{accent}{HTML}{${cvData.themeColor === 'blue' ? '1A3A5C' : '18181B'}}
\\definecolor{rulecolor}{HTML}{${cvData.themeColor === 'blue' ? 'AABBCC' : 'CCCCCC'}}
\\definecolor{body}{HTML}{2B2B2B}

\\hypersetup{colorlinks=true, urlcolor=accent, linkcolor=accent}

\\setlist[itemize]{leftmargin=1.2em, itemsep=0pt, topsep=1pt, parsep=0pt}
\\setlist[enumerate]{leftmargin=1.4em, itemsep=1pt, topsep=1pt, parsep=0pt}
\\pagestyle{empty}
\\parskip=0pt
\\parindent=0pt

\\newlength{\\sideW}
\\setlength{\\sideW}{0.33\\paperwidth}
\\newlength{\\bannerH}
\\setlength{\\bannerH}{2.6cm}
\\newlength{\\innerSideW}
\\setlength{\\innerSideW}{\\dimexpr\\sideW - 20pt\\relax}
\\newlength{\\innerMainW}
\\setlength{\\innerMainW}{\\dimexpr\\paperwidth - \\sideW - 24pt\\relax}

\\AddToShipoutPictureBG{%
  \\AtPageLowerLeft{\\color{sidebg}\\rule{\\sideW}{\\paperheight}}%
  \\AtPageUpperLeft{\\raisebox{-\\bannerH}{\\color{topbg}\\rule{\\paperwidth}{\\bannerH}}}%
}

\\newcommand{\\rsection}[1]{%
  \\vspace{7pt}%
  {\\large\\bfseries\\color{accent}#1}\\\\[-5pt]%
  {\\color{rulecolor}\\rule{\\innerMainW}{0.5pt}}%
  \\vspace{2pt}%
}

\\newcommand{\\ssection}[1]{%
  \\vspace{7pt}%
  {\\small\\bfseries\\color{sidelabel}\\MakeUppercase{#1}}\\\\[-4pt]%
  {\\color{sidelabel!40}\\rule{\\innerSideW}{0.4pt}}%
  \\vspace{3pt}%
}

\\newcommand{\\rentry}[3]{%
  \\noindent{\\bfseries\\small #1}\\\\[0pt]%
  {\\footnotesize\\color{accent}\\textit{#2}}%
  \\ifx&#3&\\else\\\\[-1pt]{\\footnotesize\\color{body}#3}\\fi%
  \\\\[3pt]%
}

\\newcommand{\\scontact}[2]{%
  {\\small\\color{topbg}#1}\\enspace{\\small\\color{sidetext}#2}\\\\[3pt]%
}

\\newcommand{\\stag}[1]{%
  \\colorbox{topbg!15}{\\footnotesize\\color{topbg}\\strut\\ #1\\}\\,%
}

\\begin{document}
\\color{body}

% TOP BANNER
\\noindent
\\begin{minipage}[c][\\bannerH][c]{\\paperwidth}
  \\hspace{\\dimexpr\\sideW + 0.5cm\\relax}%
  \\begin{minipage}[c]{\\dimexpr\\paperwidth - \\sideW - 1.2cm\\relax}
    {\\fontsize{22}{26}\\bfseries\\color{white} ${escapeLaTeX(name)}}\\\\[4pt]
    {\\large\\color{white!70} ${escapeLaTeX(cvData.personalInfo.headline)}}
  \\end{minipage}
\\end{minipage}

\\columnratio{0.33}
\\begin{paracol}{2}

% LEFT COLUMN (Sidebar)
\\begin{leftcolumn}
\\vspace{0pt}

`;

  // Profile image if showPhoto is enabled
  if (cvData.showPhoto) {
    template += `% Circular profile photo
\\begin{center}
  \\vspace{-1.3cm}
  \\begin{tikzpicture}
    \\clip (0,0) circle (1.35cm);
    \\node at (0,0) {\\includegraphics[width=2.7cm, height=2.7cm, keepaspectratio=false]{photo.png}};
    \\draw[white, line width=2.5pt] (0,0) circle (1.35cm);
  \\end{tikzpicture}
\\end{center}
`;
  } else {
    // If no photo, add simple top padding
    template += `\\vspace{10pt}\n`;
  }

  template += `
\\hspace{10pt}%
\\begin{minipage}{\\innerSideW}

\\ssection{Contact}
`;

  if (cvData.personalInfo.phone) {
    template += `\\scontact{\\faPhone}{${escapeLaTeX(cvData.personalInfo.phone)}}\n`;
  }
  if (cvData.personalInfo.email) {
    template += `\\scontact{\\faEnvelope}{\\href{mailto:${cvData.personalInfo.email}}{${escapeLaTeX(cvData.personalInfo.email)}}}\n`;
  }
  if (cvData.personalInfo.linkedin) {
    // extract username or display cleaned link
    const displayLinkedin = cvData.personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '');
    template += `\\scontact{\\faLinkedin}{\\href{${cvData.personalInfo.linkedin}}{${escapeLaTeX(displayLinkedin)}}}\n`;
  }
  if (cvData.personalInfo.github) {
    const displayGithub = cvData.personalInfo.github.replace(/^https?:\/\/(www\.)?github\.com\//, '');
    template += `\\scontact{\\faGithub}{\\href{${cvData.personalInfo.github}}{${escapeLaTeX(displayGithub)}}}\n`;
  }
  if (cvData.personalInfo.address || cvData.personalInfo.location) {
    const loc = [cvData.personalInfo.address, cvData.personalInfo.location].filter(Boolean).join(', ');
    template += `\\scontact{\\faMapMarker*}{${escapeLaTeX(loc)}}\n`;
  }

  // Skills section in sidebar
  if (cvData.enabledSections.skills && cvData.skills.length > 0) {
    template += `\n\\ssection{Skills}\n`;
    cvData.skills.forEach((cat) => {
      template += `{\\small\\bfseries\\color{sidelabel} ${escapeLaTeX(cat.category)}}\\\\[2pt]\n`;
      template += cat.skills.map(skill => `\\stag{${escapeLaTeX(skill)}}`).join(' ') + `\\\\[5pt]\n`;
    });
  }

  // Languages in sidebar
  if (cvData.enabledSections.languages && cvData.languages.length > 0) {
    template += `\n\\ssection{Languages}\n{\\small\\color{sidetext}%\n`;
    cvData.languages.forEach((lang, i) => {
      // Split native / professional if contains "—" or " - "
      const parts = lang.split(/[—\-]/);
      if (parts.length > 1) {
        template += `\\textbf{${escapeLaTeX(parts[0].trim())}} — ${escapeLaTeX(parts[1].trim())}${i < cvData.languages.length - 1 ? '\\\\[2pt]%\n' : '%\n'}`;
      } else {
        template += `\\textbf{${escapeLaTeX(lang)}}${i < cvData.languages.length - 1 ? '\\\\[2pt]%\n' : '%\n'}`;
      }
    });
    template += `}\n`;
  }

  // Interests in sidebar
  if (cvData.enabledSections.interests && cvData.interests.length > 0) {
    template += `\n\\ssection{Interests}\n{\\small\\color{sidetext} ${cvData.interests.map(escapeLaTeX).join(' \\textbullet\\ ')}}\n`;
  }

  template += `
\\end{minipage}
\\end{leftcolumn}

% RIGHT COLUMN (Main Content)
\\begin{rightcolumn}
\\vspace{5pt}
\\hspace{8pt}%
\\begin{minipage}{\\innerMainW}
`;

  // Profile / Summary
  if (cvData.enabledSections.summary && cvData.summary?.trim()) {
    template += `\\rsection{Profile}\n{\\small ${escapeLaTeX(cvData.summary)}}\n`;
  }

  // Education
  if (cvData.enabledSections.education && cvData.education.length > 0) {
    template += `\\rsection{Education}\n`;
    cvData.education.forEach((edu) => {
      const gpa = edu.gpa ? `CGPA: ${edu.gpa}` : '';
      template += `\\rentry{${escapeLaTeX(edu.degree)}}{${escapeLaTeX(edu.institution)} \\textbullet\\ ${escapeLaTeX(edu.dates)}}{${escapeLaTeX(gpa)}}\n`;
    });
  }

  // Experience
  if (cvData.enabledSections.experience && cvData.experience.length > 0) {
    template += `\\rsection{Work Experience}\n`;
    cvData.experience.forEach((exp) => {
      template += `\\rentry{${escapeLaTeX(exp.title)}}{${escapeLaTeX(exp.organization)} \\textbullet\\ ${escapeLaTeX(exp.dates)}}{}\n`;
      if (exp.description && exp.description.length > 0) {
        template += `\\begin{itemize}\\small\n`;
        exp.description.forEach((desc) => {
          template += `  \\item ${escapeLaTeX(desc)}\n`;
        });
        template += `\\end{itemize}\n\\vspace{3pt}\n`;
      }
    });
  }

  // Projects
  if (cvData.enabledSections.projects && cvData.projects.length > 0) {
    template += `\\rsection{Projects}\n`;
    cvData.projects.forEach((proj) => {
      const dates = proj.dates ? ` \\textbullet\\ ${proj.dates}` : '';
      template += `\\rentry{${escapeLaTeX(proj.title)}}{${escapeLaTeX(dates)}}{}\n`;
      if (proj.description && proj.description.length > 0) {
        template += `\\begin{itemize}\\small\n`;
        proj.description.forEach((desc) => {
          template += `  \\item ${escapeLaTeX(desc)}\n`;
        });
        template += `\\end{itemize}\n\\vspace{3pt}\n`;
      }
    });
  }

  // Achievements
  if (cvData.enabledSections.achievements && cvData.achievements.length > 0) {
    template += `\\rsection{Achievements \\& Volunteering}\n{\\small\n\\begin{itemize}\n`;
    cvData.achievements.forEach((ach) => {
      template += `  \\item ${escapeLaTeX(ach)}\n`;
    });
    template += `\\end{itemize}\n}\n`;
  }

  // References
  if (cvData.enabledSections.references && cvData.references.length > 0) {
    template += `\\rsection{References}\n{\\small\n`;
    
    // We render references in pairs side-by-side using minipages
    for (let i = 0; i < cvData.references.length; i += 2) {
      const ref1 = cvData.references[i];
      const ref2 = cvData.references[i + 1];
      
      template += `\\begin{minipage}[t]{0.47\\innerMainW}\n`;
      template += `  \\textbf{${escapeLaTeX(ref1.name)}}\\\\\n`;
      template += `  ${escapeLaTeX(ref1.title)}\\\\\n`;
      if (ref1.phone) template += `  {\\footnotesize\\faPhone\\ ${escapeLaTeX(ref1.phone)}}\\\\\n`;
      if (ref1.email) template += `  {\\footnotesize\\href{mailto:${ref1.email}}{${escapeLaTeX(ref1.email)}}}\n`;
      template += `\\end{minipage}`;
      
      if (ref2) {
        template += `\\hfill\n\\begin{minipage}[t]{0.47\\innerMainW}\n`;
        template += `  \\textbf{${escapeLaTeX(ref2.name)}}\\\\\n`;
        template += `  ${escapeLaTeX(ref2.title)}\\\\\n`;
        if (ref2.phone) template += `  {\\footnotesize\\faPhone\\ ${escapeLaTeX(ref2.phone)}}\\\\\n`;
        if (ref2.email) template += `  {\\footnotesize\\href{mailto:${ref2.email}}{${escapeLaTeX(ref2.email)}}}\n`;
        template += `\\end{minipage}`;
      }
      
      template += `\n\\vspace{5pt}\n`;
    }
    template += `}\n`;
  }

  template += `
\\end{minipage}
\\end{rightcolumn}
\\end{paracol}

\\end{document}
`;

  return template;
}