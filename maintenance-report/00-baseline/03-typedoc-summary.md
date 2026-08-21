# TypeDoc API Surface Baseline Summary

## Overview
Automated API documentation was extracted across core TypeScript modules (`lib/cv-types.ts`, `lib/latex-template.ts`, `lib/latex-utils.ts`, `lib/portfolio-generator.ts`) using **TypeDoc 0.28.x**.

The complete multi-page interactive HTML documentation bundle has been generated under:
`maintenance-report/00-baseline/typedoc-html/`

[SCREENSHOT: Browser view of generated TypeDoc index page showing modules, exported interfaces, and functions]

---

## Core Interfaces & Data Contracts (`lib/cv-types.ts`)

| Type / Interface | Description | Properties / Fields |
| :--- | :--- | :--- |
| `CVData` | Central data model storing all resume information | `personalInfo`, `education`, `experience`, `projects`, `skills`, `certificates`, `awards`, `languages`, `references`, `customSections`, `enabledSections`, `templateId`, `themeColor` |
| `PersonalInfo` | Contact and personal profile metadata | `fullName`, `email`, `phone`, `location`, `website`, `linkedin`, `github`, `summary`, `photoUrl`, `roleTitle` |
| `ExperienceEntry` | Work history record | `id`, `company`, `role`, `location`, `dates`, `current`, `bullets` |
| `ProjectEntry` | Open-source/technical project entry | `id`, `title`, `subtitle`, `technologies`, `link`, `dates`, `bullets` |
| `EducationEntry` | Academic qualification model | `id`, `institution`, `degree`, `location`, `dates`, `gpa`, `honors` |
| `SkillCategory` | Categorized technical competencies | `id`, `category`, `skills` (string array) |
| `SectionToggles` | Boolean visibility flags per section | `education`, `experience`, `projects`, `skills`, `certificates`, `awards`, `languages`, `references`, `custom` |

---

## Exported Functions & Transformation Engines

### 1. `lib/latex-template.ts`
- **`generateClassicLatex(data: CVData): string`**: Compiles `CVData` into a two-column modern academic/executive LaTeX document using `article`, `fontawesome5`, and custom macros.
- **`generateProgrammerLatex(data: CVData): string`**: Compiles `CVData` into a sleek single-column developer LaTeX format emphasizing technical projects and categorized skills.

### 2. `lib/latex-utils.ts`
- **`escapeLaTeX(text: string | undefined | null): string`**: Sanitizes string input to prevent LaTeX injection or compilation failures (e.g., `&`, `%`, `$`, `#`, `_`, `{`, `}`, `~`, `^`).
- **`formatBulletPoints(items: string[] | undefined): string`**: Converts string arrays into LaTeX `\item` lists with sanitized entries.
- **`generateEducationContent(education: EducationEntry[]): string`**: Formats academic qualifications into tabular/macro TeX syntax.
- **`generateSkillsContent(skills: SkillCategory[]): string`**: Builds a LaTeX `tabularx` block mapping skill categories to comma-separated tags.
