# NoirCV — LaTeX Resume Builder

> LaTeX resume precision. Minimalist design. Zero friction.

**NoirCV** is a simple, premium, and lightning-fast LaTeX CV generator. Built on top of a B&W (Noir) aesthetic system, it bridges the gap between raw LaTeX precision and visual user-friendliness.

No signups, no surveys, no trackers, and no advertisements. Choose a template, write your info, and instantly download a `.tex` source file or print a pixel-perfect PDF via browser compilation.

---

## 🎨 Visual Identity

- **Theme**: Premium High-Contrast Black & White (Noir) with sleek card containers.
- **Typography**: Set in Google Fonts' **Nunito** and clean sans-serif families for a soft yet professional texture.
- **Borders & Radii**: Harmonized `rounded-[10px]` containers and buttons matching the aesthetics of Apple design guidelines.
- **Transitions**: Subtle typing animation on titles and micro-hover states for interactive elements.

---

## 🚀 Key Features

1. **Dual Templates**:
   - **Programmer CV**: A centered, single-column design focusing heavily on languages, tools, open-source projects, and technical milestones.
   - **Classic CV**: A structured two-column layout with a left sidebar, a circular portrait placeholder, and custom reference sections.
2. **Instant Preview**: Live synchronization between form editing, visual HTML simulation, and real-time LaTeX source generation.
3. **Print-to-PDF Engine**: Pure frontend PDF generation using custom CSS `@media print` directives that scales the visual CV directly onto standard A4 paper without headers or interface styling.
4. **Direct `.tex` Export**: Download fully escaped, compile-ready LaTeX files designed for immediate local rendering or direct compilation in Overleaf.

---

## 📂 Codebase Architecture

```
noircv/
├── app/
│   ├── globals.css          # Noir design system, typing animations & print-css rules
│   ├── layout.tsx           # Google Nunito font loading & global wrappers
│   └── page.tsx             # Interactive landing page & builder state routing
├── components/
│   ├── CVForm/
│   │   ├── CVForm.tsx       # Consolidated form controller
│   │   ├── PersonalInfo.tsx # Personal details form & adaptive photo upload
│   │   └── SectionToggles.tsx font toggle grid
│   │   └── BasicSections.tsx    # Interactive blocks for Job Exp, Projects, Skills, etc.
│   ├── templates/
│   │   ├── ClassicCV.tsx    # Custom HTML two-column template rendering
│   │   └── ProgrammerCV.tsx # Centered single-column template rendering
│   └── CvPreview.tsx        # High-fidelity preview pane & LaTeX code inspector
├── lib/
│   ├── cv-types.ts          # Strongly typed interfaces & preset templates
│   ├── latex-template.ts    # Dual LaTeX code generation engines
│   └── latex-utils.ts       # LaTeX character escaping & formatting helpers
└── public/
    └── templates/           # Visual template preview graphics
```

---

## 🛠️ Local Development

### 1. Installation
Clone the repository and install the dependencies:
```bash
npm install
```

### 2. Run Dev Server
Launch the local Next.js environment:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build
Verify that compilation compiles error-free:
```bash
npm run build
```

---

## 🔮 Roadmap & Extension Plans

### Sprint 2: AI Chatbot Integration
- Introduce an inline chat window powered by the Gemini API.
- Users can write simple conversational prompts (e.g., *"Make my experience descriptions sound more active"* or *"Adjust the sidebar spacing"*).
- The bot will update the `cvData` state or return clean style tweaks automatically.

### Sprint 3: Serverless LaTeX Backend
- Set up an API route that sends the generated `.tex` code to a microservice running a TeXLive Docker container.
- It will return compiled binary PDF attachments directly, maintaining zero local compilation requirements.
