# Program Comprehension — Adaptive Maintenance

## Overview & Context
- **Target File**: `app/page.tsx`
- **Target Location**: Lines 48–52 (Loading screen logo) & Lines 409–413 (Header navigation logo)
- **Baseline Reference**: See [`00-baseline/01-static-analysis.md`](../00-baseline/01-static-analysis.md#5-nextjs-image-optimization-nextnextno-img-element) (Finding #5: `@next/next/no-img-element`).

---

## Current Behavior & Environment Migration Need
In Next.js 15 and modern React 19 frameworks, unoptimized standard HTML `<img>` elements are flagged with compiler warnings because they bypass the framework's asset optimization pipeline.

In `app/page.tsx`:
```tsx
{/* Loading Overlay */}
<img
  src="/assets/Presume.png"
  alt="Presume Logo"
  className="w-8 h-8 object-contain"
/>

{/* Main Header Navigation */}
<img
  src="/assets/Presume.png"
  alt="Presume Logo"
  className="w-[18px] h-[18px] object-contain"
/>
```

### Adaptive Requirements
1. **Core Web Vitals & Cumulative Layout Shift (CLS)**: Raw `<img>` elements lack explicit intrinsic dimensions (`width`, `height`), resulting in layout reflows while loading assets.
2. **Next.js 15 Image Optimization API**: Upgrading to `next/image` (`<Image />`) enables modern AVIF/WebP image transcoding, responsive srcset scaling, and preloading optimizations.
3. **Dead Import Cleanup**: Removing the unused `Code2` icon import from `lucide-react`.

[SCREENSHOT: Next.js build terminal showing `@next/next/no-img-element` warning during production compilation]
