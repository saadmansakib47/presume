# Presume : LaTeX Resume Builder

> LaTeX resume precision. Minimalist design. Zero friction.

**Presume** is a modern, premium, and lightning-fast LaTeX CV and portfolio generator. Built on top of a clean B&W aesthetic system, it bridges the gap between raw LaTeX typography precision and visual user-friendliness.

No signups, no surveys, no trackers, and no advertisements. Choose a template, customize your information, and instantly download a `.tex` source file, export an entire responsive portfolio website, or print a pixel-perfect PDF via browser compilation.

---

## Visual Identity

- **Theme**: Premium High-Contrast Black & White (Noir) with sleek card containers.
- **Typography**: Set in Google Fonts' **Nunito** and clean sans-serif families for a soft yet professional texture.
- **Borders & Radii**: Harmonized `rounded-[10px]` containers and buttons matching the aesthetics of Apple design guidelines.
- **Transitions**: Subtle typing animation on titles and micro-hover states for interactive elements.

---

## Key Features

1. **Dual Core Templates & Template Gallery**:
   - **Programmer CV**: A centered, single-column design focusing heavily on languages, tools, open-source projects, and technical milestones.
   - **Classic CV**: A structured two-column layout with a left sidebar, circular portrait placeholder, and custom reference sections.
   - **Template Browser**: Visual preview gallery to switch styles smoothly.
2. **Instant Preview & Dual Inspection**: Live synchronization between dynamic form inputs, visual HTML simulation, and real-time LaTeX source code viewer.
3. **Print-to-PDF Engine**: Pure frontend PDF generation using custom CSS `@media print` directives that scales the visual CV directly onto standard A4 paper without interface styling or artifacts.
4. **Direct `.tex` Export**: Download fully escaped, compile-ready LaTeX files designed for immediate local rendering or compilation on Overleaf.
5. **Portfolio Website Generator**: One-click generation of a fully responsive personal Next.js & Tailwind CSS portfolio website packaged as a downloadable `.zip` file.
6. **Integrated AI Assistant**: Inline AI chatbot powered by Gemini / OpenRouter to assist with resume refinement, content enhancement, and LaTeX style adjustments.

---

## Codebase Architecture

```
presume/
├── app/
│   ├── api/
│   │   ├── chat/
│   │   │   └── route.ts         # AI assistant endpoint (Gemini / OpenRouter) with rate limiting
│   │   └── generate-cv/
│   │       └── route.ts         # Server-side LaTeX generation endpoint
│   ├── globals.css              # Noir design system, typing animations & print-CSS rules
│   ├── layout.tsx               # Google Nunito font loading & global metadata
│   └── page.tsx                 # Interactive landing page, builder state & export actions
├── components/
│   ├── AIChatbot.tsx            # Floating AI assistant dialog
│   ├── ContributeModal.tsx      # Open-source contribution modal
│   ├── CvPreview.tsx            # High-fidelity live preview pane & LaTeX code inspector
│   ├── TemplateBrowserModal.tsx # Template gallery selector modal
│   ├── CVForm/
│   │   ├── CVForm.tsx           # Main CV form container orchestrator
│   │   ├── PersonalInfo.tsx     # Personal details form & adaptive photo upload
│   │   ├── SectionToggles.tsx   # Section visibility and reordering grid
│   │   └── BasicSections.tsx    # Dynamic blocks for Experience, Education, Projects, Skills, etc.
│   └── templates/
│       ├── ClassicCV.tsx        # HTML two-column template rendering
│       └── ProgrammerCV.tsx     # HTML centered single-column template rendering
├── hooks/
│   └── useCVData.ts             # State management hook for CV data
├── lib/
│   ├── cv-types.ts              # TypeScript interfaces & default preset templates
│   ├── latex-template.ts        # LaTeX code generation engines (Classic & Programmer)
│   ├── latex-utils.ts           # TeX character escaping & formatting helpers
│   └── portfolio-generator.ts   # Interactive Next.js portfolio website packager (JSZip)
└── public/
    ├── assets/                  # Brand logos and iconography
    └── templates/               # Visual template preview graphics
```

---

## Local Development

### 1. Installation

Clone the repository and install dependencies:

```bash
npm install
```

### 2. Run Dev Server

Launch the local Next.js development server:

```bash
npm run dev
```

> **Note for Windows users**: If your workspace directory path contains an ampersand (e.g. `E:\R&D\presume`), run `npx next dev` directly in PowerShell or move the directory to a path without `&` to prevent the Windows cmd script runner from misinterpreting `&` as a command separator.

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build

Verify that compilation builds error-free:

```bash
npm run build
```

---

## Roadmap & Extension Plans

- [x] **Sprint 1: Core LaTeX Generation & Visual Previews**
- [x] **Sprint 2: AI Chatbot Integration** (Gemini & OpenRouter prompt assistant)
- [x] **Sprint 3: Portfolio Site Generator** (Instant responsive Next.js site download)
- [ ] **Sprint 4: Serverless LaTeX Compilation Backend** (TeXLive Docker container returning binary PDFs)
- [ ] **Sprint 5: JSON Resume & LinkedIn Data Import**

