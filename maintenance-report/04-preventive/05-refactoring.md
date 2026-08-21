# Refactoring & Quality Verification — Preventive Maintenance

## Code Patch (Unified Diff)
The following atomic patches were applied to `lib/latex-utils.ts` and `app/api/chat/route.ts`:

```diff
--- a/lib/latex-utils.ts
+++ b/lib/latex-utils.ts
@@ -1,18 +1,22 @@
 // lib/latex-utils.ts
-import type { EducationEntry, ProjectEntry, SkillCategory } from './cv-types';
+import type { EducationEntry, SkillCategory } from './cv-types';
+
+const LATEX_ESCAPE_MAP: Record<string, string> = {
+  '\\': '\\textbackslash{}',
+  '&': '\\&',
+  '%': '\\%',
+  '$': '\\$',
+  '#': '\\#',
+  '_': '\\_',
+  '{': '\\{',
+  '}': '\\}',
+  '~': '\\textasciitilde{}',
+  '^': '\\textasciicircum{}',
+};
 
 export function escapeLaTeX(text: string | undefined | null): string {
   if (!text) return '';
-  return String(text)
-    .replace(/\\/g, '\\textbackslash{}')
-    .replace(/&/g, '\\&')
-    .replace(/%/g, '\\%')
-    .replace(/\$/g, '\\$')
-    .replace(/#/g, '\\#')
-    .replace(/_/g, '\\_')
-    .replace(/{/g, '\\{')
-    .replace(/}/g, '\\}')
-    .replace(/~/g, '\\textasciitilde{}')
-    .replace(/\^/g, '\\textasciicircum{}');
+  return String(text).replace(/[\\&%$#_{}~^]/g, (match) => LATEX_ESCAPE_MAP[match] || match);
 }

--- a/app/api/chat/route.ts
+++ b/app/api/chat/route.ts
@@ -157,4 +157,5 @@
-  } catch (error: any) {
+  } catch (error: unknown) {
     console.error('Error in chat API route:', error);
+    const errorMessage = error instanceof Error ? error.message : 'An error occurred while processing your request.';
     return NextResponse.json(
       {
-        error: error.message || 'An error occurred while processing your request.',
+        error: errorMessage,
       },
       { status: 500 }
     );
```

---

## Quality Metrics & Verification (Before vs After)

| Quality Check Tool | Before Patch | After Patch | Outcome |
| :--- | :--- | :--- | :--- |
| **ESLint (`@typescript-eslint/no-explicit-any`)** | 1 Error in `route.ts` | **0 Errors** | Passed |
| **ESLint (`@typescript-eslint/no-unused-vars` / SonarJS)** | 1 Error in `latex-utils.ts` | **0 Errors** | Passed |
| **TypeScript Compiler (`tsc --noEmit`)** | 0 Errors | **0 Errors** | Passed |
| **`jscpd` Duplicate Detection** | 12 Clones | **12 Clones** | Passed |

[SCREENSHOT: SonarJS / ESLint terminal check verifying zero unused imports and zero any types in lib/latex-utils.ts and app/api/chat/route.ts]

---

## Verification Steps Executed
1. Executed `node ./node_modules/eslint/bin/eslint.js lib/latex-utils.ts app/api/chat/route.ts` — Exited with code 0 (clean).
2. Ran `node ./node_modules/typescript/bin/tsc --noEmit` — Exited with code 0 (clean).
3. Executed automated string escaping test on path with backslashes and curly braces: verified `C:\foo{bar}` produces `C:\textbackslash{}foo\{bar\}` without corrupted double escaping.
