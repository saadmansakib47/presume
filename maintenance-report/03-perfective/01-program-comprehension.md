# Program Comprehension — Perfective Maintenance

## Overview & Context
- **Target File**: `components/CvPreview.tsx`
- **Target Location**: Lines 28–36 (State derivation) & Lines 86–93 (Preview Toolbar status area)
- **Baseline Reference**: See [`00-baseline/02-dependency-graph.md`](../00-baseline/02-dependency-graph.md) (Section: `CvPreview.tsx` View Synchronizer).

---

## Current Behavior & Feature Opportunity
`CvPreview.tsx` acts as the dual-mode inspector for Presume:
1. **Visual Mode**: Renders real-time HTML simulation templates (`ClassicCV` or `ProgrammerCV`).
2. **LaTeX Mode**: Renders editable TeX source code inside an interactive textarea with one-click copy and Overleaf export actions.

### Problem / User Experience Gap
When editing resumes for academic or industry applications, users face strict 1-page or 2-page hard limits. LaTeX compilers wrap overflow content onto new pages if string volume is excessive. Currently, `CvPreview.tsx` provides no immediate telemetry on document size, line count, or character density. Users must export and compile to discover page overflows.

### Perfective Enhancement
1. Compute derived document metrics:
   - Total lines (`activeLatex.split('\n').length`)
   - Character count (`activeLatex.length`)
2. Display a compact, responsive **Document Metric Badge** in the toolbar (`N lines · X.X KB`) to provide instant feedback as users type.

[SCREENSHOT: UI view of CvPreview toolbar displaying the dynamic document metrics badge alongside the LaTeX mode toggle]
