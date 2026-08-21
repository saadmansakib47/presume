# Change Management — Corrective Maintenance

## Git Configuration & Branch Strategy
- **Branch**: `fix/corrective-classic-cv-key`
- **Base Branch**: `main`
- **Commit SHA**: Generated upon commit execution
- **Commit Message**: `fix(templates): add missing key prop to skill tag elements in ClassicCV`

---

## Changelog Entry
```markdown
### Fixed
- **ClassicCV Template**: Added missing `key={sIdx}` prop to mapped skill tag badges within category groups to resolve React reconciliation defects and eliminate `@typescript-eslint/no-unused-vars` and `react/jsx-key` lint errors.
```

---

## Before / After Diff Summary

| Metric | Before | After | Delta |
| :--- | :--- | :--- | :--- |
| **Target File** | `components/templates/ClassicCV.tsx` | `components/templates/ClassicCV.tsx` | 0 |
| **Lines of Code** | 262 | 262 | 0 |
| **ESLint Errors in File** | 1 error, 1 warning | 0 errors, 0 warnings | -2 |
| **React Reconciliation** | Subtree reconstruction on skill update | Stable keyed node reconciliation | Fixed |

### Code Diff Preview
```diff
--- a/components/templates/ClassicCV.tsx
+++ b/components/templates/ClassicCV.tsx
@@ -111,7 +111,7 @@ export default function ClassicCV({ cvData, isPreview = false }: ClassicCVProps)
                   <span className="font-semibold text-[10px] text-zinc-800">{cat.category}</span>
                   <div className="flex flex-wrap gap-1 mt-0.5">
                     {cat.skills.map((skill, sIdx) => (
-                      <span style={{ backgroundColor: tagBg, color: tagText, border: `1px solid ${tagBorder}` }} className="text-[9px] px-1.5 py-0.5 rounded-[4px] font-medium">
+                      <span key={sIdx} style={{ backgroundColor: tagBg, color: tagText, border: `1px solid ${tagBorder}` }} className="text-[9px] px-1.5 py-0.5 rounded-[4px] font-medium">
                         {skill}
                       </span>
                     ))}
```

[SCREENSHOT: Git diff view in VSCode / Git GUI showing the single-line key attribute insertion]
