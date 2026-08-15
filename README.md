# Apology web app

This repository contains a personal static apology experience for Sassy. It uses one HTML document, vanilla JavaScript, a locally generated Tailwind stylesheet, and local font and GIF assets. The app has no backend or runtime CDN dependency.

## Prerequisites

Install the following before working in the repository:

- Node.js 18 or newer with npm
- Python 3 for local static preview
- A modern browser for manual checks

## Setup and checks

Run these commands from the repository root:

```bash
npm ci
npm run build
npm run check
node --check assets/app.js
```

`npm ci` installs the pinned Tailwind CSS CLI from `package-lock.json`. `npm run build` writes the production stylesheet to `assets/styles.css`. `npm run check` verifies required files, local asset references, and release rules.

## Preview the built page

Use a static server bound to this computer so relative paths behave as they do on GitHub Pages without exposing the repository to the local network:

```bash
python3 -m http.server --bind 127.0.0.1 4173
```

Open [the local preview](http://localhost:4173/) in a browser. Stop the server with `Ctrl-C`.

## Architecture

The app keeps markup, behavior, and generated styles in separate files:

```text
index.html                  # document structure and Indonesian copy
assets/
  app.js                    # browser interactions
  styles.css                # generated Tailwind CSS output
  fonts/                    # self-hosted font files and license notices
  gifs/                     # permitted local GIF assets
src/
  styles.css                # Tailwind input and residual CSS
scripts/
  build.mjs                 # local Tailwind build
  check.mjs                 # release smoke checks
package.json
package-lock.json
README.md
PRD.md
LICENSE
CONTRIBUTING.md
CODE_OF_CONDUCT.md
```

The browser loads CSS, JavaScript, fonts, and GIFs from relative local paths. The build does not add a framework or a development server.

## Deploy with GitHub Pages

GitHub Pages publishes the repository root from `main`:

1. Run `npm run build` and `npm run check` on the release tree.
2. Publish the `main` branch from the `/ (root)` folder in **Settings → Pages**.
3. Verify `index.html`, `assets/styles.css`, `assets/app.js`, fonts, and GIFs at the published URL.

GitHub Pages serves the committed files directly. Commit the generated `assets/styles.css` before publishing. Relative paths keep the root `index.html` deployable without a base-path setting.

## Media and performance limitation

`assets/gifs/opening.gif` is intentionally retained in its original form. It may be heavy on slow mobile networks, but the page keeps the original GIF media visible as part of the personal experience.

## Privacy and data collection

The app does not collect, store, submit, analyze, or track visitor data. It has no forms, cookies, analytics, backend, or third-party runtime requests. A hosting provider may keep ordinary request logs under its own policies. The page contains personal copy for Sassy, so share the published URL intentionally.

## Replace a permitted GIF

Replace an existing file or update its relative `src` in `index.html`, then rebuild and check:

```bash
cp your_gif.gif assets/gifs/opening.gif
npm run build
npm run check
```

Use only GIFs that you have permission to distribute. Update the image `alt` text and dimensions when the replacement needs different description or sizing. The GIF files are separate assets and are not covered by the MIT license for the code.

## Limitation

This is a personal static experience, not a general-purpose apology builder. The recipient, Indonesian copy, interactions, and assets are maintained in repository files. It has no editor, accounts, persistence, backend, or content-management layer.

See [CONTRIBUTING.md](CONTRIBUTING.md) for change rules and [LICENSE](LICENSE) for the code license.
