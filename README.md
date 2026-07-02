# Apologies Web App

An interactive single-page apology letter built with **React + Vite**, styled with **Tailwind CSS v4**, and animated with **Framer Motion**. Deployable as a static site on GitHub Pages.

## Stack

- **React 19** + **Vite** — SPA scaffold
- **Tailwind CSS v4** — styling via `@theme` design tokens
- **Framer Motion** — scroll reveal, chat sequencing, the forgiveness climax
- **Vitest** — unit tests for the runaway-button geometry + state machine

## Getting started

```bash
npm install
npm run dev      # local dev server
npm run build    # production build to dist/
npm run preview  # preview the production build
npm test         # run unit tests
```

## Structure

```
src/
├─ data/copy.js          # all Indonesian copy + GIF paths (single source)
├─ lib/                  # geometry, motion variants, scroll, svg helpers
├─ hooks/                # useReducedMotion, useRunaway
├─ components/
│  ├─ layout/            # SectionWrapper, PageTab, Reveal, ScrollProgress
│  ├─ decorative/        # FloatingHearts, StarsLayer, ConfettiHearts
│  ├─ sections/          # the six sections + final state
│  └─ interactions/      # RunawayButton (ngambek button + balloon pop)
└─ tests/                # geometry + runaway state machine tests
```

## Deployment

The app is configured for GitHub Pages project-page deployment with `base: '/apologies-web-app/'` in `vite.config.js`. Pushing to `main` triggers the GitHub Actions workflow (`.github/workflows/deploy.yml`) which builds and deploys automatically.

After enabling, the app will be live at:

```
https://<username>.github.io/apologies-web-app/
```

> **Note:** if the repository name differs from `apologies-web-app`, update the `base` path in `vite.config.js` accordingly (RISK-04).

## GIF assets

Local GIFs live in `public/gifs/`. To replace a GIF, drop the new file in and update the path in `src/data/copy.js` (`GIFS` map). The PRD references `final-adit.gif` as the final-state GIF; the provided asset is `mochi-peachcat-cute-cat.gif` (treated as its alias until replaced — DEP-04).

## Reference

- `reference/index.html` — the original single-file mockup; the UI/UX source of truth.
- `PRD.md` — the functional specification; the requirements source of truth.
