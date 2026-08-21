# Software Maintenance Activity Summary Matrix

## 20-Cell Maintenance Evidence Matrix

| Maintenance Category | 01. Program Comprehension | 02. Change Management | 03. Impact Analysis | 04. Reverse Engineering | 05. Refactoring & Verification |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Corrective Maintenance** | [`01-corrective/01-program-comprehension.md`](01-corrective/01-program-comprehension.md) | [`01-corrective/02-change-management.md`](01-corrective/02-change-management.md) | [`01-corrective/03-impact-analysis.md`](01-corrective/03-impact-analysis.md) | [`01-corrective/04-reverse-engineering.md`](01-corrective/04-reverse-engineering.md) | [`01-corrective/05-refactoring.md`](01-corrective/05-refactoring.md) |
| **Adaptive Maintenance** | [`02-adaptive/01-program-comprehension.md`](02-adaptive/01-program-comprehension.md) | [`02-adaptive/02-change-management.md`](02-adaptive/02-change-management.md) | [`02-adaptive/03-impact-analysis.md`](02-adaptive/03-impact-analysis.md) | [`02-adaptive/04-reverse-engineering.md`](02-adaptive/04-reverse-engineering.md) | [`02-adaptive/05-refactoring.md`](02-adaptive/05-refactoring.md) |
| **Perfective Maintenance** | [`03-perfective/01-program-comprehension.md`](03-perfective/01-program-comprehension.md) | [`03-perfective/02-change-management.md`](03-perfective/02-change-management.md) | [`03-perfective/03-impact-analysis.md`](03-perfective/03-impact-analysis.md) | [`03-perfective/04-reverse-engineering.md`](03-perfective/04-reverse-engineering.md) | [`03-perfective/05-refactoring.md`](03-perfective/05-refactoring.md) |
| **Preventive Maintenance** | [`04-preventive/01-program-comprehension.md`](04-preventive/01-program-comprehension.md) | [`04-preventive/02-change-management.md`](04-preventive/02-change-management.md) | [`04-preventive/03-impact-analysis.md`](04-preventive/03-impact-analysis.md) | [`04-preventive/04-reverse-engineering.md`](04-preventive/04-reverse-engineering.md) | [`04-preventive/05-refactoring.md`](04-preventive/05-refactoring.md) |

---

## Baseline Artifact References

- **Static Analysis Suite**: [`00-baseline/01-static-analysis.md`](00-baseline/01-static-analysis.md) (`eslint` + `eslint-plugin-sonarjs`)
- **Architecture & Dependency Graph**: [`00-baseline/02-dependency-graph.md`](00-baseline/02-dependency-graph.md) (`madge` AST analysis + Mermaid architecture map)
- **API Documentation**: [`00-baseline/03-typedoc-summary.md`](00-baseline/03-typedoc-summary.md) (`TypeDoc` HTML generation under `00-baseline/typedoc-html/`)
- **Code Clone Detection**: [`00-baseline/04-jscpd-clones.md`](00-baseline/04-jscpd-clones.md) (`jscpd` duplicate token & block detection)
- **Code Property Graph Analysis**: [`00-baseline/05-joern-cpg.md`](00-baseline/05-joern-cpg.md) (`js2cpg` / `Joern` AST/CFG/DDG query models)

---

## Tool Substitutions & Methodology Notes

1. **Static Analysis**: `ESLint 9` integrated with `eslint-plugin-sonarjs` and `@typescript-eslint` was utilized as the primary static quality linter in lieu of a heavy remote SonarQube server daemon. This allowed instant, high-precision detection of Cognitive Complexity, React 19 hook purity, and unused symbols locally.
2. **Module Dependency Graphing**: `madge` with TypeScript compiler AST resolution was used instead of native C++ reverse engineering tools (such as IDA Pro or Ghidra) since Presume is an interpreted TypeScript/Next.js frontend application. Graphs were formulated into clean, native Mermaid diagrams for direct inclusion in markdown and LaTeX reports.
3. **API Documentation**: `TypeDoc` was employed instead of Doxygen, as TypeDoc natively parses TypeScript type aliases, interfaces, and JSX components with full AST symbol fidelity.
4. **Code Clone Detection**: `jscpd` was run across all JSX, TS, and CSS files, successfully identifying 12 clone pairs with exact line and token metrics.
5. **Code Property Graph (CPG)**: Joern / `js2cpg` semantic queries were designed and documented to illustrate taint-flow data reachability, state mutator call trees, and cyclomatic branching without stalling build pipelines on heavy JVM container startup overheads.
