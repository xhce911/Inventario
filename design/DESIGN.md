---
name: Kinetic Lab Systems
colors:
  surface: '#f7fafe'
  surface-dim: '#d7dade'
  surface-bright: '#f7fafe'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f4f8'
  surface-container: '#ebeef2'
  surface-container-high: '#e5e8ec'
  surface-container-highest: '#e0e3e7'
  on-surface: '#181c1f'
  on-surface-variant: '#424656'
  inverse-surface: '#2d3134'
  inverse-on-surface: '#eef1f5'
  outline: '#737687'
  outline-variant: '#c3c6d8'
  surface-tint: '#0052dd'
  primary: '#004ccd'
  on-primary: '#ffffff'
  primary-container: '#0f62fe'
  on-primary-container: '#f3f3ff'
  inverse-primary: '#b4c5ff'
  secondary: '#bb0019'
  on-secondary: '#ffffff'
  secondary-container: '#e2252c'
  on-secondary-container: '#fffbff'
  tertiary: '#304db9'
  on-tertiary: '#ffffff'
  tertiary-container: '#4b67d3'
  on-tertiary-container: '#f3f3ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174c'
  on-primary-fixed-variant: '#003da9'
  secondary-fixed: '#ffdad6'
  secondary-fixed-dim: '#ffb3ad'
  on-secondary-fixed: '#410003'
  on-secondary-fixed-variant: '#930011'
  tertiary-fixed: '#dde1ff'
  tertiary-fixed-dim: '#b8c4ff'
  on-tertiary-fixed: '#001453'
  on-tertiary-fixed-variant: '#1a3ca8'
  background: '#f7fafe'
  on-background: '#181c1f'
  surface-variant: '#e0e3e7'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-sm:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-mono:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  headline-md-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style

The design system is engineered for the high-precision environment of a robotics laboratory. It prioritizes utility, clarity, and rapid information retrieval. The brand personality is **technical, reliable, and sophisticated**, evoking the feeling of a mission-control interface while maintaining the accessibility of a modern SaaS platform.

The aesthetic follows a **Corporate / Modern** style with **Minimalist** influences. It utilizes a structured grid, subtle depth through tonal layering, and a "technical blue" foundation. To ensure the interface remains functional under varied lighting conditions common in labs, the system employs high-contrast borders and a clear hierarchy of information. Interactive elements are distinct, using color to signal status and priority—specifically utilizing red accents to highlight critical storage zones (closets) and system alerts.

## Colors

The palette is rooted in "Deep Tech" blues and cool greys to maintain a professional atmosphere. 

- **Primary Blue:** Used for primary actions, navigation indicators, and active inventory selection.
- **Accent Red:** Reserved specifically for the "C" (Closet) storage units as indicated in the laboratory schematic, and for high-priority alerts or "incomplete" status items.
- **Neutral Greys:** A range of cool-toned greys (from F4F7FB to 121619) provides the structural scaffolding, separating the data table rows and floor plan zones.
- **Interactive States:** Hover states use a 10% tint of the primary color; active states use a 20% shade to provide tactile feedback in a mouse-driven environment.

## Typography

This design system utilizes a tiered typography scale to handle complex data density:

1.  **Hanken Grotesk (Headings):** A sharp, contemporary grotesque that provides a "high-tech" feel for dashboard titles and closet identifiers.
2.  **Inter (Body/UI):** Chosen for its exceptional legibility in data-heavy tables and property panels.
3.  **JetBrains Mono (Labels/Status):** A monospaced font used for serial numbers, equipment IDs, and small technical labels. This adds to the "lab" aesthetic and ensures numerical data aligns perfectly in vertical lists.

All type scales are set on a 4px baseline grid to ensure vertical rhythm.

## Layout & Spacing

The layout is a **hybrid-fluid system** designed to balance a spatial floor plan with linear data tables.

- **The Floor Plan View:** Uses a dynamic canvas that scales to fit the viewport, maintaining the aspect ratio of the lab. Elements (Tables, Closets) are placed on a sub-grid of 8px.
- **The Data View:** Uses a 12-column fluid grid. In desktop views, the floor plan can occupy 8 columns (left) with a detail "Closet" panel occupying 4 columns (right).
- **Responsive Behavior:** 
    - **Desktop (>1024px):** Split-pane view (Map + Table/Detail).
    - **Tablet (768px - 1024px):** Stacked view or toggle between Map and Table.
    - **Mobile (<768px):** Priority given to the inventory list, with the floor plan accessible via a "Map View" toggle.

## Elevation & Depth

To maintain a "clean and functional" feel, this design system avoids heavy shadows, opting instead for **Tonal Layers** and **Low-contrast outlines**.

- **Level 0 (Background):** The application canvas uses a light-grey neutral (#F4F7FB).
- **Level 1 (Surface):** Main dashboard cards and the floor plan base use pure white with a 1px border (#DDE1E6).
- **Level 2 (Hover/Active):** Elements being interacted with (like a specific Closet or Kit) use a subtle, diffused shadow (0px 4px 12px rgba(0,0,0,0.05)) to suggest "lift" without cluttering the UI.
- **Level 3 (Modals/Overlays):** Used for detail drill-downs (e.g., viewing the contents of "Lego Ev3"). These use a 15% backdrop blur to focus the user's attention.

## Shapes

The shape language is **Soft (0.25rem)**. 

While the brand is technical, sharp corners are avoided to keep the interface approachable and modern. 
- **Standard UI Elements:** (Buttons, Inputs, Small Cards) use a 4px (0.25rem) radius.
- **Large Containers:** (Floor plan zones, Main Dashboard Cards) use an 8px (0.5rem) radius.
- **Status Chips:** (Complete/Incomplete) use a fully rounded "pill" shape to distinguish them from interactive buttons.

## Components

### Buttons & Inputs
- **Primary Action:** Solid Blue background with white text.
- **Secondary Action:** Ghost style with a 1px Blue border.
- **Closet Selection:** High-contrast Red border (2px) when selected in the layout view.
- **Input Fields:** Flat style with a 1px grey border, turning blue on focus.

### Cards & Panels
- **Equipment Card:** Features a check-list layout for peripheral verification (PC, Keyboard, Mouse). Use JetBrains Mono for the "NOTES" section.
- **Inventory List:** High-density rows with alternating backgrounds.
- **Closet Drill-down:** A vertical "breadcrumb" style transition that moves from Closet -> Category (e.g., Lego Ev3) -> Specific Kit ID.

### Chips & Status Indicators
- **"Complete":** Green (Success) pill with white text.
- **"Incomplete":** Red (Secondary) pill with white text.
- **Inventory Count:** Small circular badges in the top-right corner of category cards.

### Floor Plan Elements
- **Closets (C1-C6):** Rectangular blocks at the top of the map. Highlighted with a red stroke when active.
- **Workstations:** Outlined rectangles with "Equipos de computo" labels using the `label-mono` typography.