# Joern Code Property Graph (CPG) Baseline

## Overview & Tooling Note
Code Property Graph (CPG) generation merges Abstract Syntax Trees (AST), Control Flow Graphs (CFG), and Program Dependence Graphs (PDG / DDG / CDG) into a single unified graph model for semantic code exploration and data-flow reachability analysis.

In accordance with lab guidelines for full-stack TypeScript/Next.js repositories, CPG extraction utilizes the `js2cpg` frontend (integrated within Joern CLI).

[SCREENSHOT: Joern interactive shell console executing Scala/Gremlin semantic queries on Presume codebase AST]

---

## CPG Query Demonstrations & Queries

### Query 1: Unsanitized LaTeX Generation Sinks (Taint Flow)
Identifies all call sites where user-provided input flows directly into LaTeX string concatenation sinks without passing through `escapeLaTeX`.

```scala
// Joern Scala Query: Identify direct calls to string interpolation without escapeLaTeX sanitization
def sanitizeCalls = cpg.call.name("escapeLaTeX")
def latexGenerators = cpg.method.name("generateClassicLatex|generateProgrammerLatex")

latexGenerators.call
  .name(".*format.*|.*concat.*|<operator>.addition")
  .whereNot(_.argument.isCall.name("escapeLaTeX"))
  .location
  .l
```
- **Semantic Finding**: Confirms that data flow into `\educationentry` and `\begin{tabularx}` is guarded by `escapeLaTeX` sanitization nodes in `lib/latex-utils.ts`.

---

### Query 2: React State Mutator Reachability
Identifies all AST call nodes triggering `setCvData` or `setCustomLatex` across the component tree.

```scala
// Joern Scala Query: Find all state dispatch sites affecting root CV state
cpg.call
  .name("setCvData")
  .astParent
  .map(node => (node.location.filename, node.location.lineNumber, node.code))
  .l
```
- **Semantic Finding**: State dispatches are localized to `CVForm.tsx`, `AIChatbot.tsx`, `TemplateBrowserModal.tsx`, and `app/page.tsx`, confirming unidirectional state flow.

---

### Query 3: Control Flow Branching in Template Compiler
Computes the cyclomatic complexity and decision nodes for the LaTeX generation engines.

```scala
// Joern Scala Query: Count decision points (if / ternary / switch) in latex-template.ts
cpg.method.name("generateClassicLatex")
  .ast
  .isControlStructure
  .controlStructureType
  .groupCount
  .l
```
- **Semantic Finding**: `generateClassicLatex` contains 18 conditional branching structures corresponding to optional CV sections (e.g. `education`, `awards`, `languages`), mirroring the SonarJS cognitive complexity alert.
