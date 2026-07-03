# Apologies Web App

An interactive single-page apology letter built with **plain HTML, Tailwind CSS (Play CDN), and vanilla JavaScript**. No build step, no framework, no `npm install`.

## How to run

Just open `index.html` in a browser:

```bash
open index.html
```

That's it. No server required (GIFs and fonts load from local files / Google Fonts CDN).

## Tech stack

- **HTML5** — single `index.html` file with all markup
- **Tailwind CSS v3** — via [Play CDN](https://tailwindcss.com/docs/installation/play-cdn), configured inline in `<head>`
- **Vanilla JavaScript** — all interactions (no React, no jQuery)
- **Google Fonts** — Baloo 2 (headings), Nunito (body), Patrick Hand (handwritten)

## Structure

```
├── index.html                    ← the entire app (HTML + Tailwind + CSS + JS)
├── opening.gif                   ← Section 1 greeting GIF
├── mr42aipu-midnightgif300.gif   ← Section 4 overthinking GIF
├── mochi-peachcat-cute-cat.gif   ← Final state "Kondisi Adit saat ini" GIF
├── PRD.md                        ← functional specification
└── README.md
```

## Deployment

Push to GitHub and enable GitHub Pages (Settings → Pages → deploy from `main` branch root). Since there's no build step, Pages serves `index.html` directly. No base path configuration needed — relative GIF paths work at any URL.

## Replacing GIFs

Drop the new GIF file in the project root and update the `src="..."` attribute in `index.html`. The three GIFs are referenced by bare filename (e.g. `src="opening.gif"`).
