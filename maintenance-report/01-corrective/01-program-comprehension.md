# Program Comprehension — Corrective Maintenance

## Overview & Context
- **Target File**: `components/templates/ClassicCV.tsx`
- **Target Location**: Lines 107–118 (Skill tags rendering section)
- **Baseline Reference**: See [`00-baseline/01-static-analysis.md`](../00-baseline/01-static-analysis.md#2-missing-jsx-iterator-keys-reactjsx-key) (Finding #2: `react/jsx-key` error).

---

## Current Behavior & Code Functionality
`ClassicCV.tsx` is the visual HTML simulation component for the two-column "Classic" resume template. It receives `cvData: CVData` as props and renders personal details, sidebar items, and dynamic skill categories into styled DOM nodes.

Inside the sidebar skill category mapping:
```tsx
{skills.map((cat, idx) => (
  <div key={idx} className="flex flex-col gap-1">
    <span className="font-semibold text-[10px] text-zinc-800">{cat.category}</span>
    <div className="flex flex-wrap gap-1 mt-0.5">
      {cat.skills.map((skill, sIdx) => (
        <span style={{ backgroundColor: tagBg, color: tagText, border: `1px solid ${tagBorder}` }} className="text-[9px] px-1.5 py-0.5 rounded-[4px] font-medium">
          {skill}
        </span>
      ))}
    </div>
  </div>
))}
```

### Defect Analysis
1. **Missing Key in Nested Iterator**: The outer category `<div>` specifies `key={idx}`, but the inner `cat.skills.map((skill, sIdx) => ...)` returns `<span>` elements without a `key` prop.
2. **Virtual DOM Reconciliation Flaw**: When a user adds or deletes individual skills dynamically in the form editor (`CVForm.tsx`), React cannot track individual skill tag identity. React is forced to unmount and remount entire DOM subtrees, causing DOM thrashing, potential loss of focus/animation states, and runtime browser console errors.
3. **Unused Parameter**: `sIdx` was accepted in the closure parameter list but omitted from the element props, triggering `@typescript-eslint/no-unused-vars`.

[SCREENSHOT: Browser DevTools console displaying "Warning: Each child in a list should have a unique 'key' prop" during CV skill editing]
