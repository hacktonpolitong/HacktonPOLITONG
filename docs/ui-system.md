# PilotOps AI UI System

This document describes the frontend skeleton owned by Matteo's setup branch. It is intentionally small and focused on the MVP control-room flow.

## UI Principles

- Operational first: the main output should feel like a working dashboard for an expansion team, not a chat interface or a long report.
- Structured output ready: screens and components consume typed objects so the future AI endpoint can replace mock data without a UI rewrite.
- Low-risk clarity: buyer segment, pilot workflow, trust gaps, offer, proof, Target Account Shortlist and next actions must be visible as separate decision areas.
- Reviewable components: dashboard sections are small, named and reusable.

## Visual Tokens

- Background: warm operational grey `#f4f6f3`.
- Panel: white `#ffffff`.
- Text: near-black green `#17201b`.
- Muted text: `#6b756d`.
- Accent: deep green `#245c47`.
- Amber: `#c57a28`.
- Blue: `#2d5f88`.
- Danger: `#a33a2c`.
- Border: `#d7ded3`.
- Radius: `8px` for panels and controls.

## Typography

- Current stack: `Aptos`, `Segoe UI`, and platform sans-serif fallbacks.
- Screen titles use compact dashboard-scale headings.
- Cards and panels use smaller headings for scanability.
- Uppercase labels are reserved for section context such as `Readiness`, `Target`, or `Execution`.

## Dashboard Layout

- The app flow is a single client-side MVP path: start screen, product intake, analysis loading, Pilot Control Room.
- The Pilot Control Room uses a responsive 12-column grid on desktop and a single column on mobile.
- Each major output area is rendered in a `SectionPanel` so future data can map directly into dashboard regions.
- The layout keeps strategic sections at the top and execution assets lower on the page.
- Target Account Shortlist should be rendered as account rows or compact account cards with company name, region/city, segment/process match, fit score, company-level contact method, recommended buyer roles and outreach angle.

## Main Components

- `Button`: primary, secondary and ghost command button.
- `Badge`: compact status marker with green, amber, blue, red and neutral tones.
- `SectionPanel`: reusable dashboard panel with optional eyebrow and icon.
- `FitScore`: visual score block for pilot readiness.
- `RiskPill` and `ReadinessPill`: status wrappers for trust gaps and proof checklist items.
- Screen components: `StartScreen`, `IntakeScreen`, `AnalysisLoadingScreen`, `ControlRoomScreen`.

## Interaction States

- Empty state: future screens should show a short explanation and one clear next action.
- Loading state: use the analysis module list pattern from `AnalysisLoadingScreen` to communicate progress.
- Error state: future API errors should preserve the current input and show a retry action.
- Disabled state: buttons support disabled styling through the shared `Button` component.

## Future Screen Conventions

- Keep data in typed objects and pass it into components as props.
- Prefer tables for comparison-heavy data and cards for repeated sales assets or action items.
- Keep target-account contacts at company level and role level; do not design UI for private personal contacts or personal email harvesting.
- Use lucide-react icons for recognizable operational cues.
- Avoid adding backend calls directly inside presentational components.
- Keep AI-generated long text segmented into dashboard fields rather than rendering a single report blob.
