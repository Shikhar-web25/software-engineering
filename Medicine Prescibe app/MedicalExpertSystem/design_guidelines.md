# Medical Expert System - Design Guidelines

## Design Approach
**System-Based Approach**: Material Design principles adapted for healthcare
**References**: WebMD's clarity, Apple Health's clean data visualization, modern medical portals
**Core Principle**: Trust through professional clarity and structured information hierarchy

## Typography System

**Font Family**: 
- Primary: Inter or System UI stack via Google Fonts
- Accent/Display: Poppins for headings (medical professionalism with approachability)

**Hierarchy**:
- Hero/Main Title: text-5xl font-bold (symptom checker title)
- Section Headers: text-2xl font-semibold
- Subsection Headers: text-xl font-medium
- Body Content: text-base font-normal (leading-relaxed for medical readability)
- Captions/Disclaimers: text-sm font-medium
- Emergency Warnings: text-lg font-bold (uppercase for critical alerts)

## Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 6, 8, 12, 16 for consistent rhythm
- Component padding: p-6 to p-8
- Section spacing: space-y-6 to space-y-8
- Card gaps: gap-4 to gap-6
- Container margins: mx-auto max-w-6xl px-4

**Grid Structure**:
- Main container: Single column max-w-4xl for symptom input/results
- Results grid: 2-column on desktop (conditions | recommendations), single on mobile
- Feature cards: 3-column grid (grid-cols-1 md:grid-cols-3) for symptom categories

## Core Components

### Header
- Fixed navigation with app title, theme toggle, history access
- Prominent medical disclaimer link
- Clean, minimal design (h-16)

### Symptom Input Section
- Centered card design with generous padding (p-8)
- Large textarea with placeholder text
- Autocomplete dropdown showing common symptoms
- Primary "Analyze Symptoms" button (w-full on mobile, w-auto on desktop)
- Clear button as secondary action

### Results Display
**Structure** (appears after analysis):
- Summary card showing analysis status
- Possible Conditions section:
  - List cards with condition name, likelihood language, reasoning
  - Each card includes icon indicator, severity context
- Recommendations Grid (2-column desktop):
  - OTC Categories card (list format, clear category names)
  - Home Remedies card (bulleted suggestions)
- Follow-up Questions section:
  - Interactive question cards
  - Quick-answer buttons or input fields
- Red Flag Warnings:
  - Prominent alert banner at top of results
  - High-contrast treatment with warning icons
  - "Seek immediate medical attention" language

### History Sidebar/Modal
- List of previous symptom checks with timestamps
- Click to reload previous analysis
- Clear history button

### Medical Disclaimer
- Sticky banner on results page OR
- Prominent card before results
- Clear, readable legal text with bold key phrases

## Component Library

**Cards**:
- Elevated shadow design (shadow-md)
- Rounded corners (rounded-lg)
- Consistent padding (p-6)
- Bordered variants for warnings

**Buttons**:
- Primary: Large, rounded (rounded-lg), bold text
- Secondary: Outlined or ghost variants
- Warning/Alert: Distinct treatment for emergency actions
- Icon buttons for theme toggle, history

**Form Elements**:
- Large touch targets (min-h-12)
- Clear focus states (ring-2)
- Helper text below inputs
- Autocomplete with dropdown list

**Alert Banners**:
- Warning level: Standard information banner
- Critical level: High-contrast alert banner with icon
- Dismissible option for non-critical alerts

**Lists**:
- Spaced list items (space-y-3)
- Bullet/numbered format with custom markers
- Card-based lists for conditions

## Accessibility & Safety Features

- High contrast text ratios throughout
- Focus indicators on all interactive elements
- Screen reader optimized labels
- ARIA landmarks for results sections
- Clear visual distinction between information and warnings
- Large minimum font sizes (16px base)

## Animations

**Minimal Usage**:
- Smooth height transitions for expanding results (transition-all duration-300)
- Fade-in for results appearance
- Subtle hover states on cards (transform scale-102)
- NO decorative or distracting animations on medical content

## Images

**No hero image** - Medical tools prioritize immediate utility over visual impact

**Icons**:
- Heroicons via CDN for consistent medical iconography
- Symptom category icons (head, stomach, respiratory, etc.)
- Warning/alert icons (exclamation, medical cross)
- Status indicators (checkmark, info, warning triangle)

## Layout Patterns

**Homepage/Main Interface**:
1. Header with branding and controls
2. Centered symptom input card (hero position but functional, not decorative)
3. Optional: Quick symptom category buttons below input
4. Footer with disclaimer link, privacy policy

**Results Page** (same view, expanded):
1. Persistent header
2. Red flag warning banner (if applicable)
3. Medical disclaimer banner
4. Results grid with conditions and recommendations
5. Follow-up questions section
6. Footer

**Responsive Strategy**:
- Mobile: Single column, full-width cards, stacked layout
- Tablet: 2-column where appropriate, maintained readability
- Desktop: Max-width containers (max-w-4xl to max-w-6xl), optimal line lengths

This design creates a trustworthy, professional medical tool that prioritizes clarity, safety, and usability while maintaining modern web standards.