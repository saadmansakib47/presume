# Reverse Engineering — Perfective Maintenance

## Recovered Component State & Derivation Flow
Reverse engineering of `CvPreview.tsx` illustrates the synchronization between external generated LaTeX (`latexOutput`) and internal manual edits (`customLatex`), along with the new real-time telemetry pipeline.

---

## State Synchronizer & Derivation Architecture (Mermaid)

```mermaid
graph TD
    subgraph PropsInput ["External Ingress (Props)"]
        RawData["cvData (Form State)"]
        GenLatex["latexOutput (from generateLatex)"]
        CustomLatex["customLatex (Manual User Edits)"]
    end

    subgraph DerivationEngine ["CvPreview Derived State"]
        ActiveLatex{"customLatex !== null ?"}
        UseCustom["activeLatex = customLatex"]
        UseGen["activeLatex = latexOutput"]
        
        ActiveLatex -->|Yes| UseCustom
        ActiveLatex -->|No| UseGen

        MetricsCompute["Compute Metrics: lineCount, byteSize"]
        UseCustom --> MetricsCompute
        UseGen --> MetricsCompute
    end

    subgraph ViewSwitcher ["View Mode Router"]
        Mode{"viewMode === 'visual' ?"}
        VisualView["Render <ClassicCV> / <ProgrammerCV>"]
        LatexView["Render LaTeX Textarea + Toolbar Badge"]

        Mode -->|Visual| VisualView
        Mode -->|LaTeX| LatexView
        MetricsCompute -.->|Display In Toolbar| LatexView
    end
```

---

## User Interaction & Dynamic Telemetry Cycle

```mermaid
sequenceDiagram
    autonumber
    actor User as Resume Author
    participant Textarea as LaTeX Editor (CvPreview)
    participant Derived as Derived Metrics Evaluator
    participant Badge as Toolbar Metric Badge

    User->>Textarea: Enters custom LaTeX section / changes text
    Textarea->>Derived: setCustomLatex(newText)
    Note over Derived: Split lines & calculate Blob byte size
    Derived->>Badge: Re-renders: "142 lines · 4.8 KB"
    Badge-->>User: Instant visual feedback on resume length budget
```
