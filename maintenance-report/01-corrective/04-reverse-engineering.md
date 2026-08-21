# Reverse Engineering — Corrective Maintenance

## Recovered Component Behavior & Data Flow
Reverse engineering of `ClassicCV.tsx` reveals the two-column document layout architecture and the React component lifecycle flow during state synchronization.

---

## Component Architecture & Rendering Flow (Mermaid)

```mermaid
sequenceDiagram
    autonumber
    actor User as User (Form Input)
    participant Form as CVForm / BasicSections
    participant Page as app/page.tsx (Root State)
    participant Preview as CvPreview.tsx
    participant Classic as ClassicCV.tsx (DOM Renderer)

    User->>Form: Modifies Skill Tag ("TypeScript")
    Form->>Page: setCvData(updatedSkills)
    Page->>Preview: Passes new cvData prop
    Preview->>Classic: Renders <ClassicCV cvData={cvData} />
    Note over Classic: React Virtual DOM Reconciliation
    Classic->>Classic: Iterates skills.map (Category: idx)
    alt Fixed with key={sIdx}
        Classic->>Classic: Reconciles <span> with key={sIdx}
        Note over Classic: Diffing engine patches only modified skill node
    else Before Bug Fix (Missing Key)
        Classic->>Classic: Virtual DOM identity missing
        Note over Classic: Destroys & recreates whole skill container + console warning
    end
```

---

## Recovered Control & DOM Structure

```mermaid
classDiagram
    class ClassicCVProps {
        +CVData cvData
        +boolean isPreview
    }

    class ClassicCVLayout {
        +renderSidebar()
        +renderMainContent()
        +renderHeader()
        +renderSkillsSection()
        +renderExperienceSection()
        +renderEducationSection()
    }

    ClassicCVLayout ..> ClassicCVProps : consumes
```

- **Sidebar Composition**: Left 33% column (`w-[33%]`) rendering Contact Details, Skill Badges, Languages, and References.
- **Main Column Composition**: Right 67% column (`w-[67%]`) rendering Summary, Work Experience, Projects, and Education.
- **Color Theming Strategy**: Dynamic inline styling derived from `cvData.themeColor` (Black `#18181b` vs Blue `#1e40af`) computing `tagBg`, `tagBorder`, and `tagText`.
