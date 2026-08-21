# Reverse Engineering — Adaptive Maintenance

## Recovered Next.js Image Optimization Pipeline
Reverse engineering of the Next.js 15 Image Optimization lifecycle clarifies how the adapted `<Image />` component interacts with Next.js build-time and run-time optimization services compared to legacy `<img>`.

---

## Image Asset Optimization Pipeline (Mermaid)

```mermaid
flowchart TD
    subgraph ClientBrowser ["Browser Client"]
        DOMReq["DOM Request for /assets/Presume.png"]
        Viewport["Detect Viewport & Device Pixel Ratio (DPR 1x/2x)"]
    end

    subgraph LegacyPath ["Legacy HTML <img> Execution"]
        UnoptimizedImg["Raw <img> Tag"]
        DirectFetch["Direct HTTP fetch of uncompressed PNG"]
        Reflow["Layout Shift / Reflow (No intrinsic aspect ratio reserved)"]
        UnoptimizedImg --> DirectFetch --> Reflow
    end

    subgraph NextAdaptivePath ["Adapted Next.js 15 <Image /> Execution"]
        NextImg["<Image width={32} height={32} priority />"]
        OptimizerServer["Next.js Image Optimization Service /_next/image"]
        WebPConversion["Format Negotiation: WebP / AVIF"]
        ExactRes["Downscale to exact device pixel dimensions"]
        ReservedBox["CSS aspect-ratio container prevents CLS reflow"]

        NextImg --> Viewport
        Viewport --> OptimizerServer
        OptimizerServer --> WebPConversion
        WebPConversion --> ExactRes
        ExactRes --> ReservedBox
    end
```

---

## Recovered Architectural Constraints

1. **Aspect Ratio Preservation**: Explicit `width` and `height` parameters allow the browser's layout engine to compute aspect ratio before binary image payloads arrive over the network, guaranteeing zero Cumulative Layout Shift (CLS).
2. **Preload Priority**: Adding `priority` to the `Loader` image instructs Next.js to inject `<link rel="preload">` in the document head for immediate discovery during initial page load.
