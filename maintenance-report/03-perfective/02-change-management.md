# Change Management — Perfective Maintenance

## Git Configuration & Branch Strategy
- **Branch**: `perf/latex-preview-counter-badge`
- **Base Branch**: `main`
- **Commit SHA**: Generated upon commit execution
- **Commit Message**: `feat(preview): add real-time LaTeX lines and size metric badge to CvPreview toolbar`

---

## Changelog Entry
```markdown
### Added
- **Preview Inspector**: Integrated a real-time LaTeX document metrics badge (line count and payload size in KB) in `components/CvPreview.tsx` to provide immediate document budget telemetry during editing.
```

---

## Before / After Diff Summary

| Metric | Before | After | Delta |
| :--- | :--- | :--- | :--- |
| **Target File** | `components/CvPreview.tsx` | `components/CvPreview.tsx` | 0 |
| **Lines of Code** | 191 | 199 | +8 |
| **User Feedback** | Blind text area editing | Real-time line and byte size feedback | Enhanced UX |

### Code Diff Preview
```diff
--- a/components/CvPreview.tsx
+++ b/components/CvPreview.tsx
@@ -29,6 +29,9 @@ export default function CvPreview({
   const activeLatex = customLatex !== null ? customLatex : latexOutput;
   const isLatexEdited = customLatex !== null;
+  const lineCount = activeLatex ? activeLatex.split('\n').length : 0;
+  const byteSize = activeLatex ? (new Blob([activeLatex]).size / 1024).toFixed(1) : '0';
 
   const copyToClipboard = () => {
@@ -85,6 +88,10 @@ export default function CvPreview({
           </div>
 
+          {viewMode === 'latex' && (
+            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-[6px] bg-zinc-100 border border-zinc-200 text-zinc-600 text-[11px] font-medium">
+              {lineCount} lines · {byteSize} KB
+            </span>
+          )}
```

[SCREENSHOT: Git commit diff showing the added metric computation and toolbar badge in CvPreview.tsx]
