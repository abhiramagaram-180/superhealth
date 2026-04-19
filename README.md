# Health Sanctuary — Next.js App

A very premium family health records management app built with **Next.js 14 (App Router)**, **TypeScript**, and **Tailwind CSS**.

## Screens
- **`/`** — Home: Family profile selector & recent activity
- **`/dashboard`** — Patient dashboard: metrics, medications, conditions, visit history
- **`/add`** — Add clinical record form
- **`/timeline`** — Health history timeline
- **`/reports`** — Medical repository (lab reports, radiology, vaccinations)
- **`/meds`** — Medication schedule with adherence tracking

## Design System
Follows the **Clinical Sanctuary** design language:
- Color palette: Deep blues (`#00458f`) + surgical greens (`#006b5f`)
- Typography: **Public Sans** (Google Fonts)
- Icons: **Material Symbols Outlined** (Google Fonts)
- No border lines — depth via tonal background shifts
- Ambient shadows, not drop shadows
- Pill-shaped CTAs with gradient fills

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
health-sanctuary/
├── app/
│   ├── layout.tsx          # Root layout (fonts, metadata)
│   ├── globals.css         # Tailwind + custom utilities
│   ├── page.tsx            # Home / family selector
│   ├── dashboard/page.tsx  # Patient dashboard
│   ├── add/page.tsx        # Add clinical record
│   ├── timeline/page.tsx   # Health history
│   ├── reports/page.tsx    # Medical repository
│   └── meds/page.tsx       # Medication schedule
├── components/
│   ├── TopBar.tsx          # Sticky header
│   └── BottomNav.tsx       # Tab navigation
├── tailwind.config.js      # Custom design tokens
└── package.json
```
