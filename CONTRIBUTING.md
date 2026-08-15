# Contributing

Keep contributions focused on the personal static experience. Read this guide before changing copy, styles, behavior, or local assets.

## Prerequisites

- Node.js 18 or newer with npm
- Python 3 for local static preview
- A modern browser for manual checks

## Setup, build, check, and preview

Run these commands from the repository root:

```bash
npm ci
npm run build
npm run check
node --check assets/app.js
python3 -m http.server --bind 127.0.0.1 4173
```

The preview server binds to this computer only. Open [http://localhost:4173/](http://localhost:4173/) in a browser after starting it. Stop the server with `Ctrl-C`.

## Refresh generated CSS

`assets/styles.css` is generated output. Do not edit it by hand. Run the build after changing `src/styles.css`, `tailwind.config.js`, or Tailwind utility classes in `index.html` or `assets/app.js`:

```bash
npm run build
npm run check
```

Review the generated diff and keep `assets/styles.css` in sync with the source change.

## Review identity and privacy

Before opening a change for review:

- Keep the recipient name as `Sassy` and the creator name as `user` in copy, labels, metadata, and alternative text.
- Read every changed copy string for unintended personal information or a change in the Indonesian apology tone.
- Confirm that the app still makes no analytics, tracking, cookie, form, or data-submission request.
- Confirm that local fonts and GIFs still resolve through relative paths.

## Contribution boundaries

Do not add:

- Secrets, credentials, API keys, or committed environment values
- Analytics, tracking pixels, cookies, or other visitor profiling
- A backend, API, database, authentication, account, CMS, or upload flow
- Runtime CDNs for styles, scripts, fonts, or GIFs
- GIF assets that you do not have permission to distribute

The code is covered by the MIT license. GIF assets remain separate and are not covered by that code license. Keep their existing rights and notices intact.
