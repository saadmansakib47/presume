# Code Duplication Baseline (`jscpd` Clone Report)

## Executive Summary
Copy-paste detection was performed using **jscpd** across all application source directories (`components/`, `lib/`, `app/`).

- **Files Analyzed**: 19 files (4,733 total lines, 24,501 tokens)
- **Clones Found**: 12 duplicate code fragments
- **Duplicated Lines**: 130 lines (2.75% duplication rate)
- **Duplicated Tokens**: 799 tokens (3.26% duplication rate)

[SCREENSHOT: Terminal output of jscpd duplication matrix showing duplicate file pairs and line ranges]

---

## Duplication Clusters & Clone Pairs

### 1. Template Rendering Redundancy (Type 1 & Type 2 Clones)
- **File Pair A**: `components/templates/ClassicCV.tsx` vs `components/templates/ProgrammerCV.tsx`
  - **Lines**: `ClassicCV.tsx` [193:113 - 207:28] & `ProgrammerCV.tsx` [108:115 - 122:28] (15 lines, 81 tokens)
  - **Pattern**: Identical JSX block structure for rendering experience bullet points, date badges, and company headings.
  - **Lines**: `ClassicCV.tsx` [217:113 - 231:28] & `ProgrammerCV.tsx` [132:115 - 146:28] (15 lines, 81 tokens)
  - **Pattern**: Project card layout and bullet point iteration logic replicated between the two templates.

### 2. Modal Overlay Duplication (Type 2 Clones)
- **File Pair B**: `components/ContributeModal.tsx` vs `components/TemplateBrowserModal.tsx`
  - **Lines**: `ContributeModal.tsx` [17:53 - 25:17] vs `TemplateBrowserModal.tsx` [23:46 - 31:17] (9 lines, 61 tokens)
  - **Lines**: `ContributeModal.tsx` [94:9 - 106:24] vs `TemplateBrowserModal.tsx` [53:9 - 65:24] (13 lines, 55 tokens)
  - **Pattern**: Backdrop blur backdrop, close button layout, and modal animation wrapper styling.

### 3. Dynamic Form Field Redundancy (Type 1 Clones)
- **File Pair C**: `components/CVForm/BasicSections.tsx` (Internal clone pairs)
  - **Lines**: [353:57 - 363:31] vs [377:54 - 387:31] vs [401:54 - 411:31] (11 lines each, 54 tokens)
  - **Pattern**: Replicated input field wrapper and deletion button handlers across awards, certificates, and language sections.

### 4. Preset Model Schema Clones
- **File Pair D**: `lib/cv-types.ts`
  - **Lines**: [143:19 - 156:16] vs [248:18 - 261:16] (14 lines, 50 tokens)
  - **Pattern**: Duplicate dummy project data objects within the preset template initializers.

---

## Clone Metrics Summary

| Component Domain | Files Involved | Clone Count | Token Count | Primary Cause |
| :--- | :--- | :--- | :--- | :--- |
| **CV Templates** | `ClassicCV.tsx`, `ProgrammerCV.tsx` | 5 | 362 | Split template implementations without shared atomic UI components |
| **Form Inputs** | `BasicSections.tsx` | 3 | 166 | Repeated form item layout boilerplate for dynamic list arrays |
| **Modals** | `ContributeModal.tsx`, `TemplateBrowserModal.tsx` | 2 | 116 | Replicated modal shell styling without an abstracted `Dialog` wrapper |
| **Presets / Types** | `cv-types.ts` | 2 | 155 | Sample data repetition across template seeds |
