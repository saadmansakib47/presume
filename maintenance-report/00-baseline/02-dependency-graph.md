# Module Dependency Graph Baseline

## Architecture Overview
The module architecture of **Presume** was extracted using `madge` with TypeScript AST resolution (`tsconfig.json`). Presume follows a modular Next.js App Router architecture with strict unidirectional flow: top-level page controllers orchestrate interactive form sub-components, real-time template renderers, and LaTeX transformation engines.

- **Total Module Files Scanned**: 15 key TypeScript/TSX modules
- **Circular Dependencies**: 0 (Clean Directed Acyclic Graph)
- **Central Data Contract**: `lib/cv-types.ts` is the root data model consumed by 80% of application modules.

[SCREENSHOT: Madge visual dependency graph representation or interactive dependency visualization]

---

## Architectural Dependency Diagram (Mermaid)

```mermaid
graph TD
    subgraph AppLayer ["App Entry Layer"]
        Page["app/page.tsx"]
        Layout["app/layout.tsx"]
    end

    subgraph ComponentLayer ["UI & Component Layer"]
        Form["CVForm.tsx"]
        PersonalInfo["PersonalInfo.tsx"]
        SectionToggles["SectionToggles.tsx"]
        BasicSections["BasicSections.tsx"]
        CvPreview["CvPreview.tsx"]
        ClassicCV["ClassicCV.tsx"]
        ProgrammerCV["ProgrammerCV.tsx"]
        AIChatbot["AIChatbot.tsx"]
        TemplateModal["TemplateBrowserModal.tsx"]
        ContributeModal["ContributeModal.tsx"]
    end

    subgraph LibLayer ["Core Logic & Engine Layer"]
        CVTypes["lib/cv-types.ts"]
        LatexTemplate["lib/latex-template.ts"]
        LatexUtils["lib/latex-utils.ts"]
        PortfolioGen["lib/portfolio-generator.ts"]
    end

    %% Page connections
    Page --> Form
    Page --> CvPreview
    Page --> AIChatbot
    Page --> TemplateModal
    Page --> ContributeModal
    Page --> ClassicCV
    Page --> ProgrammerCV
    Page --> LatexTemplate
    Page --> PortfolioGen
    Page --> CVTypes

    %% Form hierarchy
    Form --> PersonalInfo
    Form --> SectionToggles
    Form --> BasicSections
    Form --> CVTypes
    PersonalInfo --> CVTypes
    SectionToggles --> CVTypes
    BasicSections --> CVTypes

    %% Preview & Templates
    CvPreview --> ClassicCV
    CvPreview --> ProgrammerCV
    CvPreview --> CVTypes
    ClassicCV --> CVTypes
    ProgrammerCV --> CVTypes

    %% Latex generation engine
    LatexTemplate --> LatexUtils
    LatexTemplate --> CVTypes
    LatexUtils --> CVTypes
    PortfolioGen --> CVTypes
```

---

## Structural Metrics & Coupling Analysis

| Module | In-Degree (Fan-In) | Out-Degree (Fan-Out) | Coupling Classification | Role in Architecture |
| :--- | :--- | :--- | :--- | :--- |
| `lib/cv-types.ts` | 10 | 0 | Pure Stable Abstraction | Canonical schema for resume state, preset templates, section models |
| `lib/latex-utils.ts` | 1 | 1 | Utility Engine | Character escaping, tabular tabularx builders, list formatters |
| `lib/latex-template.ts` | 1 | 2 | Code Generation Service | Compiles JSON CVData into compilable TeX source code |
| `components/CVForm/CVForm.tsx` | 1 | 4 | Sub-System Coordinator | Manages form sections and dispatch actions |
| `components/CvPreview.tsx` | 1 | 3 | View Synchronizer | Toggles visual DOM rendering and raw LaTeX editor views |
| `app/page.tsx` | 0 | 10 | High-Level Orchestrator | Root client component holding root state and global action handlers |
