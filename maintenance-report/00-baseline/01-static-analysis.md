# Static Analysis Baseline Report

## Executive Summary
A comprehensive static analysis pass was executed over the Presume repository using **ESLint 9** equipped with **@typescript-eslint**, **eslint-config-next** (Next.js core web vitals and React 19 rules), and **eslint-plugin-sonarjs**.

- **Total Issues Found**: 27 problems (21 errors, 6 warnings)
- **Primary Violation Domains**: React 19 component purity, Cognitive Complexity in template generators, JSX reconciliation key attributes, Next.js Image Optimization rules, and dead code / unused imports.

[SCREENSHOT: ESLint and SonarJS execution terminal output highlighting the 27 identified rule violations]

---

## Top Findings Breakdown

### 1. React 19 Hook Purity & Pseudorandom Generators (`react-hooks/purity`, `sonarjs/pseudo-random`)
- **Target File**: `components/AIChatbot.tsx` (Lines 42, 72, 85)
- **Severity**: Error
- **Description**: Invocation of `Math.random()` during component render/event state creation violates React 19 idempotent execution rules. Impure calls during render or immediate dispatch can produce unstable UI state updates.

### 2. Missing JSX Iterator Keys (`react/jsx-key`)
- **Target File**: `components/templates/ClassicCV.tsx` (Line 112)
- **Severity**: Error
- **Description**: Iteration over skill tags (`cat.skills.map(...)`) returns JSX `<span>` elements missing the mandatory `key` attribute, impairing React's virtual DOM reconciliation and leading to DOM thrashing when skill tags are added or removed.

### 3. Cognitive Complexity & Nested Template Literals (`sonarjs/cognitive-complexity`, `sonarjs/no-nested-template-literals`)
- **Target File**: `lib/latex-template.ts` (Lines 13, 106, 126, 131, 141)
- **Severity**: Error
- **Description**: `generateClassicLatex` and `generateProgrammerLatex` exceed the cognitive complexity threshold (measured at 21 and 49 vs allowed 15). Heavily nested string template interpolations decrease readability and elevate maintenance risk for LaTeX generation.

### 4. Unused Imports & Dead Identifiers (`@typescript-eslint/no-unused-vars`, `sonarjs/unused-import`)
- **Target Files**: `lib/latex-utils.ts` (Line 2: `ProjectEntry`), `components/templates/ClassicCV.tsx` (Line 111: `sIdx`), `app/page.tsx` (Line 23: `Code2`).
- **Severity**: Warning / Error
- **Description**: Redundant symbol imports increase bundle overhead and clutter the developer cognitive load.

### 5. Next.js Image Optimization (`@next/next/no-img-element`)
- **Target File**: `app/page.tsx` (Lines 48, 409)
- **Severity**: Warning
- **Description**: Usage of standard HTML `<img>` elements instead of `next/image` bypasses automatic layout shift prevention, responsive srcset generation, and modern WebP/AVIF format conversions.

---

## Metric Summary Table

| Category | Analyzer | Violations | Target Severity |
| :--- | :--- | :--- | :--- |
| **Code Smells & Complexity** | `eslint-plugin-sonarjs` | 9 | High |
| **Purity & React Conventions** | `react-hooks/purity` | 3 | High |
| **JSX Virtual DOM Integrity** | `eslint-plugin-react` | 1 | High |
| **TypeScript Type & Variable Hygiene** | `@typescript-eslint` | 5 | Medium |
| **Web Performance & Assets** | `@next/next` | 2 | Medium |
| **Syntax & Style Warnings** | Built-in | 7 | Low |
