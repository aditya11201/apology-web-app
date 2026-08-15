# Product spec: apology web app

This reference describes the implemented product behavior, copy intent, boundaries, and validation contract for the static apology experience.

## Product intent

Create a soft, playful, sincere apology that Sassy can read as one continuous six-section page. The experience uses Indonesian copy, local assets, small motion effects, and a forgiving final interaction without collecting visitor data.

## Audience and naming

- **Recipient**: `Sassy`
- **Creator**: `user`
- **Primary experience**: Sassy reads the apology and can choose the forgiveness state
- **Product shape**: Personal static page with fixed copy and no account or content editor

## Six-section flow

| Section | Intent | Required behavior |
|---|---|---|
| 1. Greeting | Welcome Sassy with a personal opening | Show staged copy, the opening local GIF, floating hearts, and a CTA that scrolls to section 2 |
| 2. Apology explanation | Explain the failed joke without defensiveness | Reveal chat bubbles, show a typing indicator, then display `Maaf ya…` |
| 3. Reassurance | Confirm that Sassy’s stories, questions, and requests are welcome | Show the reassurance heading and four supporting items |
| 4. Overthinking | Show the creator’s regret and effort | Use a night scene, blinking stars, staggered thought bubbles, a local GIF, and a CTA to section 5 |
| 5. Made for Sassy | Reveal that the page was made for this apology | Show the fixed copy and a progress animation that ends in a completed state |
| 6. Forgiveness question | Ask for forgiveness and close the experience | Show the primary forgiveness button and the secondary runaway button; render the final state inside this section |

The final state is part of section 6, not a seventh section.

## Indonesian copy intent

Keep visible product copy in Indonesian. The tone should combine sincerity, warmth, playful humor, and a clear apology without pressure or defensive wording.

- Address the recipient as `Sassy`.
- Refer to the creator as `user`.
- Keep the copy fixed in the HTML rather than accepting form input.
- Preserve the emotional progression from greeting to apology, reassurance, effort, and forgiveness.

Representative copy includes:

```text
Sassy.
Maaf ya…
Jadi… Mau ya?
Maafin user ini.
Kondisi user saat ini
```

## Interactions

- Scroll through all six sections vertically; CTA buttons move to their target section.
- Reveal sections and content when they enter the viewport. Show content without the observer API as a fallback.
- Play the chat, thought-bubble, and apology-loading sequences once per section.
- Animate ambient hearts, stars, and the scroll progress indicator without blocking reading.
- When the forgiveness button is activated, transition from the question to the final copy, focus the final heading, and fire heart confetti.
- When the secondary button is approached or activated, move it within its safe container and count the attempt.
- After more than five runaway attempts, turn the button into a balloon, pop it, show the funny message, and reset the interaction.

## Accessibility requirements

- Use semantic sections and real buttons with `type="button"`.
- Keep every action keyboard-focusable and keyboard-activatable.
- Show a visible focus state and maintain a minimum 44 px touch target for controls.
- Give each meaningful GIF descriptive `alt` text and mark decorative animation layers as hidden from assistive technology.
- Announce chat, progress, and final-state changes through live regions.
- Move focus to the final heading after forgiveness without forcing an additional scroll.
- Respect `prefers-reduced-motion`, reduce or remove decorative motion, and use non-smooth scrolling in that mode.
- Keep text readable, preserve contrast, and retain layout usability at mobile, tablet, and desktop widths.

## Local asset policy

- Keep application JavaScript in `assets/app.js`.
- Build Tailwind CSS locally from `src/styles.css` with the pinned package lock and write the result to `assets/styles.css`.
- Keep Baloo 2, Nunito, and Patrick Hand font files in `assets/fonts/` with their license notices.
- Keep permitted GIF files in `assets/gifs/` and reference them with relative paths from `index.html`.
- Do not require a runtime request for CSS, JavaScript, fonts, or GIFs.
- Replace a GIF only when its distributor has permission to use it. Update its `src`, `alt` text, and dimensions when needed.
- The repository’s code license does not cover GIF assets. Asset rights remain with their respective rights holders.

## Product boundary

The product is client-only and static. It has no backend, API, database, authentication, accounts, forms, uploads, CMS, analytics, tracking, or visitor-data persistence. A session changes the page in memory only.

This limitation is intentional: the page is a personal static experience for one recipient. It is not a reusable apology builder or a service for storing or sending messages.

## Validation contract

Run the automated checks from the repository root:

```bash
npm ci
npm run build
npm run check
node --check assets/app.js
```

Manual validation must confirm the following:

- All six sections render in order and every CTA reaches its target.
- Chat, thought bubbles, loading progress, runaway behavior, balloon pop, forgiveness, confetti, and GIFs work.
- Keyboard focus and activation work for every button.
- Reduced-motion mode minimizes animation and disables smooth scrolling.
- The layout remains readable at 375 px, 768 px, 1024 px, and 1440 px widths.
- The page works from a local static server and from GitHub Pages publishing `main` at the repository root.
- The app needs no network request for its CSS, fonts, JavaScript, or GIFs.
