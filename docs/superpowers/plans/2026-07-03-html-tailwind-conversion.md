# Convert to Plain HTML + Tailwind Play CDN Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the broken React/Vite app with a single `index.html` file styled by Tailwind Play CDN, eliminating the build step and the blank-screen bug.

**Architecture:** One `index.html` containing all HTML markup, Tailwind utility classes (via Play CDN), a small `<style>` block for keyframes/special-case CSS the JS depends on, and the reference's vanilla JS kept verbatim. No `src/`, no `package.json`, no `node_modules`, no build step. GIFs at root alongside `index.html`.

**Tech Stack:** Plain HTML5, Tailwind CSS v3 (Play CDN), vanilla JavaScript (no framework). Google Fonts for Baloo 2 / Nunito / Patrick Hand.

**Source of truth:** `reference/index.html` (the original working single-file mockup) — its copy, JS behavior, and visual design are preserved. Tailwind utilities replace the bulk of its hand-written CSS; a residual `<style>` block keeps what Tailwind can't express (keyframes, pseudo-elements, SVG transitions, `clamp()` fluid type, `prefers-reduced-motion`).

---

## Critical JS-CSS coupling (must be preserved)

The reference's JS creates elements and toggles classes at runtime. **These classes and their CSS must survive the conversion** or the app breaks:

| JS action | Class(es) | CSS needed |
|-----------|-----------|------------|
| Creates chat bubbles | `.bubble`, `.bubble.lost`, `.sorry`, `.typing` | background, border-radius, `bubbleIn`/`blink` keyframes |
| Reveals on scroll | `.reveal`, `.reveal.in`, `.reveal.d1–d4` | opacity/transform transitions + delays |
| Toggles thoughts | `.thought`, `.thought.in` | opacity/transform transition |
| Confetti hearts | `.confetti-heart` | absolute positioning, `confettiFall` keyframe |
| Balloon pop | `.ngambek-face.popping` | balloon `border-radius`, `balloonInflate` keyframe, `::after` knot |
| Pop burst | `.pop-flash`, `.shard` | `popFlash`/`shardFly` keyframes, CSS custom props `--bx/--by/--rot/--dx` |
| Funny message | `.funny`, `.funny.show` | opacity/transform transition |
| Loading bar | `#progressBar`, `#progressPct`, `#progressStatus`, `#doneTag` | `.done-tag.show`, `.progress > i` width transition |
| Forgiveness swap | `#qState`, `#finalState` | `.final.show` display swap + `bubbleIn` |
| Tick check-off | `.tick-ring`, `.tick-mark` (SVG) | `stroke-dashoffset` + `transform-box` transitions |
| Stars | `.star`, `.star.big` | `twinkle` keyframe |

**Decision:** Rather than risk breaking any of these by converting mid-flight, the `<style>` block keeps **all** animation/state/pseudo-element CSS intact. Tailwind utilities handle layout, spacing, colors, typography, and responsive — the "static" visual layer. This is the safest conversion path: the JS keeps working because its CSS contracts are untouched.

---

## File structure (final state)

```
apology-web-app/
├─ index.html              ← the entire app (HTML + Tailwind CDN + <style> + <script>)
├─ opening.gif             ← moved from public/gifs/
├─ mr42aipu-midnightgif300.gif
├─ mochi-peachcat-cute-cat.gif
├─ PRD.md                  ← unchanged
├─ README.md               ← rewritten for the new stack
├─ .gitignore              ← simplified (no node_modules/dist)
└─ docs/superpowers/plans/ ← this plan
```

**Deleted entirely:** `src/`, `public/`, `reference/`, `package.json`, `package-lock.json`, `vite.config.js`, `node_modules/`, `dist/`, `.github/workflows/`, `.oxlintrc.json`, `cat-meme-strawberry-cat.gif`, `midnightgif300.gif` (the two unused large GIFs).

---

## Task 1: Create a clean branch and move GIFs to root

**Files:**
- Move: `public/gifs/opening.gif` → `opening.gif`
- Move: `public/gifs/mr42aipu-midnightgif300.gif` → `mr42aipu-midnightgif300.gif`
- Move: `public/gifs/mochi-peachcat-cute-cat.gif` → `mochi-peachcat-cute-cat.gif`

- [ ] **Step 1: Create a fresh branch off the current state**

```bash
git checkout -b feat/html-tailwind-conversion
```

- [ ] **Step 2: Move the three used GIFs to the project root**

```bash
mv public/gifs/opening.gif .
mv public/gifs/mr42aipu-midnightgif300.gif .
mv public/gifs/mochi-peachcat-cute-cat.gif .
```

The reference HTML references GIFs by bare filename (`src="opening.gif"`), so they must sit next to `index.html` at the root.

- [ ] **Step 3: Verify the three GIFs are at root**

```bash
ls *.gif
```
Expected output includes `opening.gif`, `mr42aipu-midnightgif300.gif`, `mochi-peachcat-cute-cat.gif`.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: move GIF assets to project root for single-file deployment"
```

---

## Task 2: Create the new index.html with Tailwind Play CDN + config

**Files:**
- Create: `index.html` (overwrites the Vite entry HTML)

This task sets up the HTML skeleton: `<!doctype>`, `<head>` with fonts + Tailwind CDN + config + a placeholder `<style>`, and an empty `<body>`. Subsequent tasks fill in each section.

- [ ] **Step 1: Write the new `index.html` skeleton**

Create `index.html` with this content:

```html
<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<meta name="theme-color" content="#FFF1F5" />
<title>Untuk Kakak Cantik — Stasya Annesty</title>

<!-- Google Fonts: Baloo 2 (head), Nunito (body), Patrick Hand (hand) -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Nunito:wght@400;500;600;700;800&family=Patrick+Hand&display=swap" rel="stylesheet" />

<!-- Tailwind Play CDN — zero build step, utility classes in the browser -->
<script src="https://cdn.tailwindcss.com"></script>
<script>
  tailwind.config = {
    theme: {
      extend: {
        colors: {
          bg:        '#FFF7F0',
          'bg-pink': '#FFF1F5',
          primary:   '#FF8FAB',
          secondary: '#B388EB',
          text:      '#3A2E39',
          accent:    '#FFD6E0',
          btn:       '#FF5C8A',
          'btn-press':'#E8477A',
          card:      '#FFFFFF',
          'text-soft':'#6E5C6B',
          line:      '#F2DDE3',
          star:      '#FFE7B0',
        },
        fontFamily: {
          head: ['"Baloo 2"', 'Trebuchet MS', 'system-ui', 'sans-serif'],
          body: ['Nunito', 'system-ui', '-apple-system', 'sans-serif'],
          hand: ['"Patrick Hand"', '"Comic Sans MS"', 'cursive'],
        },
        borderRadius: { xl: '30px', lg: '22px', md: '14px' },
      },
    },
  }
</script>

<!-- Residual CSS: keyframes, pseudo-elements, SVG transitions, JS-coupled state classes.
     These CANNOT be expressed as Tailwind utilities and must stay here. -->
<style>
/* placeholder — filled in Task 3 */
</style>
</head>
<body>
<!-- scroll progress bar -->
<div id="scroll-progress" aria-hidden="true"></div>

<!-- sections filled in Tasks 4–9 -->

<!-- confetti layer -->
<div id="confetti-layer" aria-hidden="true"></div>

<!-- script filled in Task 10 -->
</body>
</html>
```

- [ ] **Step 2: Open `index.html` in a browser**

```bash
open index.html   # macOS
```
Expected: a blank cream-colored page with the correct title in the tab. No errors in the console. The Tailwind CDN script loads (check the `<head>` — you should see a `<style>` element injected by Tailwind).

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add index.html skeleton with Tailwind Play CDN + design tokens"
```

---

## Task 3: Port the residual CSS (keyframes, state classes, pseudo-elements)

**Files:**
- Modify: `index.html` — replace the `<style>` placeholder

This is the CSS the JS depends on. It is copied from `reference/index.html` lines 100–539 and **must be kept verbatim** — every class the JS creates or toggles is in here. The only changes: (a) the `:root` custom-property block is removed (Tailwind config replaces it), (b) the `body`/`html`/`*` base rules are removed (Tailwind's preflight + utility classes handle them).

- [ ] **Step 1: Replace the `<style>` block**

Replace the entire `<style>...</style>` content with this (everything except `:root` and the `*`/`html`/`body`/`h1,h2,h3` base rules, which Tailwind now handles):

```css
/* ============================================================
   Residual CSS — keyframes, JS-coupled state classes, pseudo-elements.
   Transcribed from reference/index.html. Tailwind utilities handle
   layout/spacing/colors/typography; this block holds what they can't.
   ============================================================ */

/* -- base helpers kept as CSS vars (some inline styles reference these) -- */
:root{
  --primary:   #FF8FAB;
  --secondary: #B388EB;
  --text:      #3A2E39;
  --text-soft: #6E5C6B;
  --line:      #F2DDE3;
  --btn:       #FF5C8A;
  --btn-press: #E8477A;
  --accent:    #FFD6E0;
  --star:      #FFE7B0;
  --night-1:   #241638;
  --night-2:   #140C24;
  --night-3:   #0C0818;
  --bg:        #FFF7F0;
  --bg-pink:   #FFF1F5;
  --shadow-soft: 0 24px 60px -28px rgba(179,136,235,.45);
  --shadow-card: 0 30px 70px -34px rgba(255,92,138,.40);
  --r-lg: 30px; --r-md: 22px; --r-sm: 14px;
  --ease: cubic-bezier(0.22,1,0.36,1);
}

/* -- scroll progress bar -- */
#scroll-progress{
  position:fixed; top:0; left:0; height:3px; width:100%;
  transform: scaleX(0); transform-origin:0 50%;
  background: linear-gradient(90deg, var(--primary), var(--secondary));
  box-shadow: 0 0 8px rgba(179,136,235,.45);
  z-index:80; pointer-events:none;
}

/* -- reveal-on-scroll (JS toggles .in) -- */
.reveal{ opacity:0; transform: translateY(26px); transition: opacity .9s var(--ease), transform .9s var(--ease); }
.reveal.in{ opacity:1; transform:none; }
.reveal.d1{ transition-delay:.08s; } .reveal.d2{ transition-delay:.16s; }
.reveal.d3{ transition-delay:.24s; } .reveal.d4{ transition-delay:.32s; }

/* -- floating hearts (ambient, s1 + s6) -- */
.hearts-layer{ position:absolute; inset:0; overflow:hidden; pointer-events:none; z-index:0; }
.heart-float{ position:absolute; bottom:-40px; width:18px; height:18px; opacity:0; animation: floatUp linear infinite; }
.heart-float svg{ width:100%; height:100%; display:block; }
@keyframes floatUp{
  0%{ transform: translateY(0) rotate(0deg) scale(.7); opacity:0; }
  10%{ opacity:.55; }
  90%{ opacity:.45; }
  100%{ transform: translateY(-110vh) rotate(40deg) scale(1); opacity:0; }
}

/* -- scroll-hint -- */
.scroll-hint{
  position:absolute; bottom: 22px; left:50%; transform: translateX(-50%);
  font-family: var(--font-hand, 'Patrick Hand', cursive); color: var(--text-soft); font-size: 15px;
  display:flex; flex-direction:column; align-items:center; gap:6px; opacity:.8;
}
.scroll-hint .mouse{ width:22px; height:34px; border:2px solid var(--text-soft); border-radius: 12px; position:relative; }
.scroll-hint .mouse::after{ content:""; position:absolute; left:50%; top:7px; width:3px; height:7px; background:var(--text-soft); border-radius:2px; transform:translateX(-50%); animation: wheeldown 1.6s infinite; }
@keyframes wheeldown{ 0%{opacity:0;transform:translate(-50%,0)} 30%{opacity:1} 100%{opacity:0;transform:translate(-50%,9px)} }

/* -- SECTION 2: chat -- */
.bubble{
  align-self:flex-start; background: var(--bg-pink); color: var(--text);
  padding: 13px 17px; border-radius: 20px 20px 20px 5px; max-width: 84%;
  font-size: clamp(16px, 2.2vw, 18px);
  box-shadow: 0 8px 18px -14px rgba(58,46,57,.4);
  opacity:0; transform: translateY(10px) scale(.96);
  animation: bubbleIn .5s var(--ease) forwards;
}
.bubble.lost{ background:#FFE7C2; font-style:italic; }
@keyframes bubbleIn{ to{ opacity:1; transform:none; } }
.sorry{
  font-family: 'Patrick Hand', cursive; font-size: clamp(26px, 5vw, 38px); color: var(--btn);
  text-align:center; margin-top: 16px; opacity:0; transform: scale(.8);
  animation: bubbleIn .6s var(--ease) forwards;
}
.typing{ align-self:flex-start; display:inline-flex; gap:5px; background: var(--bg-pink); padding:14px 18px; border-radius: 20px 20px 20px 5px; }
.typing i{ width:8px;height:8px;border-radius:50%;background:var(--primary); display:inline-block; animation: blink 1.2s infinite; }
.typing i:nth-child(2){ animation-delay:.2s } .typing i:nth-child(3){ animation-delay:.4s }
@keyframes blink{ 0%,60%,100%{ transform: translateY(0); opacity:.4 } 30%{ transform: translateY(-5px); opacity:1 } }

/* -- SECTION 3: tick check-off (SVG stroke animation) -- */
.tick-ring{
  fill:rgba(255,255,255,.6); stroke:var(--secondary); stroke-width:2;
  transform-box:fill-box; transform-origin:center;
  transition:fill .4s var(--ease), stroke .4s var(--ease), transform .45s var(--ease);
}
.tick-mark{
  fill:none; stroke:#fff; stroke-width:2.6; stroke-linecap:round; stroke-linejoin:round;
  stroke-dasharray:1; stroke-dashoffset:1;
  transition:stroke-dashoffset .45s var(--ease) .2s;
}
.reveal.in .tick-ring{ fill:var(--btn); stroke:var(--btn); transform:scale(1.06); }
.reveal.in .tick-mark{ stroke-dashoffset:0; }

/* -- SECTION 4: night stars -- */
.star{ position:absolute; width:3px; height:3px; background: var(--star); border-radius:50%; box-shadow:0 0 6px var(--star); animation: twinkle 3s infinite var(--ease); }
.star.big{ width:5px; height:5px; }
@keyframes twinkle{ 0%,100%{ opacity:.2; transform:scale(.7) } 50%{ opacity:1; transform:scale(1.15) } }

/* -- SECTION 4: thought bubbles -- */
.thought{
  position:relative; background: rgba(255,255,255,.94); color: var(--text);
  padding: 13px 22px; border-radius: 24px; max-width: 80%; font-size: clamp(15px,2.2vw,17px);
  box-shadow: 0 14px 30px -18px rgba(0,0,0,.6);
  opacity:0; transform: translateY(12px); transition: opacity .6s var(--ease), transform .6s var(--ease);
}
.thought.in{ opacity:1; transform:none; }
.thought::after{ content:""; position:absolute; bottom:-7px; left:24px; width:12px; height:12px; background:inherit; border-radius:50%; box-shadow:18px 6px 0 -1px rgba(255,255,255,.7), 30px 12px 0 -3px rgba(255,255,255,.5); }
.thought:nth-child(even){ align-self:flex-end; }
.thought:nth-child(even)::after{ left:auto; right:24px; box-shadow:-18px 6px 0 -1px rgba(255,255,255,.7), -30px 12px 0 -3px rgba(255,255,255,.5); }

/* -- SECTION 5: loading bar -- */
.progress{ height:14px; background: rgba(255,255,255,.12); border-radius:999px; overflow:hidden; margin:10px 0; }
.progress > i{ display:block; height:100%; width:0; background: linear-gradient(90deg, var(--primary), var(--secondary)); border-radius:999px; transition: width .18s linear; }
.done-tag{ display:none; align-items:center; gap:8px; color:#8EE6A8; font-family:'Baloo 2',sans-serif; font-weight:700; margin-top:10px; }
.done-tag.show{ display:inline-flex; animation: bubbleIn .5s var(--ease) forwards; }

/* -- SECTION 6: runaway button + balloon pop -- */
.roam{ position:relative; width:100%; min-height: clamp(168px, 26vh, 240px); }
.ngambek-wrap{
  position:absolute; left:50%; top:0; transform: translateX(-50%);
  border:none; background:transparent; padding:0; cursor:pointer;
  transition: transform .42s cubic-bezier(.16,1,.3,1);
  z-index:3;
}
.ngambek-face{
  display:inline-flex; align-items:center; justify-content:center;
  background:#fff; color: var(--text); border:2px solid var(--line);
  font-family: 'Baloo 2',sans-serif; font-weight:600; font-size: clamp(14px,2vw,16px);
  padding: 12px 20px; border-radius: 14px; max-width: 86vw; text-align:center;
  transition: background .3s var(--ease), color .3s var(--ease), border-color .3s, box-shadow .2s var(--ease), transform .12s var(--ease);
}
.ngambek-wrap:hover .ngambek-face{ border-color: var(--primary); }
.ngambek-wrap:active .ngambek-face{ transform: scale(.97); }
.ngambek-face.popping{
  position:relative;
  background: radial-gradient(circle at 30% 25%, #FFCADB, var(--btn) 64%);
  color:#fff; border:none;
  border-radius: 48% 48% 50% 50% / 44% 44% 58% 58%;
  box-shadow: inset -5px -7px 12px rgba(150,20,60,.12), inset 4px 5px 10px rgba(255,255,255,.45), 0 12px 22px -12px rgba(255,92,138,.7);
  animation: balloonInflate .9s var(--ease) forwards;
}
.ngambek-face.popping::after{
  content:""; position:absolute; left:50%; bottom:-6px; width:14px; height:9px;
  background: var(--btn); transform: translateX(-50%);
  border-radius: 2px 2px 50% 50%;
  box-shadow: inset -2px -1px 3px rgba(150,20,60,.18);
}
@keyframes balloonInflate{
  0%   { transform: scale(1)    rotate(0); }
  40%  { transform: scale(1.20) rotate(-2deg); }
  65%  { transform: scale(1.45) rotate(2deg); }
  82%  { transform: scale(1.62) rotate(-1.5deg); }
  100% { transform: scale(1.82) rotate(0); }
}
.funny{
  position:absolute; left:50%; top:50%; transform: translate(-50%,-40%) scale(.9);
  width: 86%; background:#fff; color: var(--text);
  padding: 16px 20px; border-radius: var(--r-md);
  box-shadow: var(--shadow-card); font-family:'Patrick Hand', cursive;
  font-size: clamp(16px,2.4vw,20px); text-align:center;
  opacity:0; pointer-events:none; transition: opacity .4s var(--ease), transform .4s var(--ease);
}
.funny.show{ opacity:1; transform: translate(-50%,-50%) scale(1); }

/* -- SECTION 6: final state -- */
.final{ display:none; text-align:center; }
.final.show{ display:block; animation: bubbleIn .7s var(--ease) forwards; }

/* -- confetti -- */
#confetti-layer{ position:fixed; inset:0; pointer-events:none; z-index:60; overflow:hidden; }
.confetti-heart{ position:absolute; top:-6%; will-change: transform; animation: confettiFall linear forwards; }
.confetti-heart svg{ width:100%; height:100%; display:block; }
@keyframes confettiFall{
  0%{ transform: translate(0,0) rotate(0); opacity:1; }
  100%{ transform: translate(var(--dx), 108vh) rotate(var(--rot)); opacity:.9; }
}

/* -- burst particles (balloon pop) -- */
.pop-flash{ position:fixed; width:34px; height:34px; border-radius:50%; pointer-events:none; transform: translate(-50%,-50%) scale(.2);
  background: radial-gradient(circle, rgba(255,255,255,.95), rgba(255,143,171,.55) 58%, transparent 72%);
  animation: popFlash .36s var(--ease) forwards; }
@keyframes popFlash{ 0%{ transform: translate(-50%,-50%) scale(.2); opacity:.9 } 60%{ opacity:.6 } 100%{ transform: translate(-50%,-50%) scale(3.6); opacity:0 } }
.shard{ position:fixed; width:17px; height:17px; pointer-events:none; transform: translate(-50%,-50%) scale(.5);
  animation: shardFly .8s cubic-bezier(.18,.7,.3,1) forwards; }
.shard svg{ width:100%; height:100%; display:block; filter: drop-shadow(0 1px 1px rgba(0,0,0,.12)); }
@keyframes shardFly{
  0%  { transform: translate(-50%,-50%) scale(.5) rotate(0); opacity:1; }
  70% { opacity:1; }
  100%{ transform: translate(calc(-50% + var(--bx)), calc(-50% + var(--by) + 80px)) scale(1) rotate(var(--rot)); opacity:0; }
}

/* -- responsive -- */
@media (max-width: 560px){
  .bubble{ max-width: 92%; }
}

/* -- motion safety -- */
@media (prefers-reduced-motion: reduce){
  *{ animation-duration:.001ms !important; animation-iteration-count:1 !important; transition-duration:.05ms !important; }
  html{ scroll-behavior:auto; }
  .reveal{ opacity:1; transform:none; }
}
```

- [ ] **Step 2: Reload `index.html` in the browser**

```bash
open index.html
```
Expected: still a blank page visually (no sections yet), but the CSS is loaded. Open DevTools → Elements → `<style>` — you should see all the keyframes and state classes. No console errors.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: port residual CSS (keyframes, state classes, pseudo-elements)"
```

---

## Task 4: Section 1 — Opening Greeting

**Files:**
- Modify: `index.html` — add the S1 `<section>` inside `<body>` after the scroll-progress div

- [ ] **Step 1: Add Section 1 markup**

Insert this directly after `<div id="scroll-progress">...</div>` and before the confetti-layer comment:

```html
<!-- ===================== SECTION 1 ===================== -->
<section id="s1" class="relative min-h-[100dvh] flex items-center justify-center overflow-hidden"
  style="background:
    radial-gradient(120% 90% at 15% 10%, #FFE3EC 0%, transparent 55%),
    radial-gradient(120% 90% at 90% 20%, #F1E6FF 0%, transparent 50%),
    linear-gradient(180deg, var(--bg) 0%, var(--bg-pink) 100%);
    padding-block: clamp(16px,3.5vh,36px);">
  <span class="pagetab absolute top-5 right-0 z-[4] -rotate-3 rounded-l-[9px] rounded-r-none px-3.5 py-1.5 font-hand text-sm leading-none"
    style="background: var(--secondary); box-shadow:0 8px 18px -12px rgba(0,0,0,.4);">hal. 01</span>
  <div class="hearts-layer" id="hearts-s1" aria-hidden="true"></div>
  <div class="relative z-[1] w-full max-w-[920px] mx-auto px-[clamp(20px,5vw,40px)]">
    <div class="letter reveal mx-auto max-w-[560px] text-center" style="padding: clamp(4px,1vw,12px) clamp(14px,5vw,30px);">
      <div class="stamp mx-auto mb-2.5 grid h-11 w-11 -rotate-[8deg] place-items-center rounded-full" aria-hidden="true"
        style="background: var(--btn); box-shadow: 0 8px 20px -8px rgba(255,92,138,.7), inset 0 2px 6px rgba(255,255,255,.35);">
        <svg viewBox="0 0 24 24" width="30" height="30"><path fill="#fff" d="M12 21s-7.5-4.9-10-9.3C.4 8.4 2 5 5.2 5c2 0 3.3 1.1 4 2.2.7-1.1 2-2.2 4-2.2 3.2 0 4.8 3.4 3.2 6.7C19 16.1 12 21 12 21z"/></svg>
      </div>
      <div class="eyebrow reveal d1 font-hand" style="font-size:clamp(15px,1.9vw,21px); color:var(--btn); letter-spacing:.5px;">Untuk My very very very biutiful pro max plus Girl</div>
      <h1 class="reveal d1 font-head font-extrabold mt-2" style="font-size:clamp(24px,4.4vw,40px); line-height:1.05; letter-spacing:-.02em;">Halo Perempuan yang di Jumat ini terlihat paling cantik di kantor bahkan di dunia</h1>
      <div class="who reveal d2 font-hand mt-1.5" style="font-size:clamp(22px,4vw,32px); line-height:1.1;">Stasya Annesty.</div>
      <p class="ask reveal d3 font-hand mt-2.5" style="font-size:clamp(15px,1.9vw,21px); color:var(--text-soft);">Hmm… kamu masih marah ya?</p>

      <div class="scene scene--media reveal d3 mx-auto mt-3.5" role="img" aria-label="Adit lagi semangat nungguin kamu baca ini"
        style="background:transparent; box-shadow:none;">
        <img class="scene-img" src="opening.gif" alt="Kucing strawberry-cat lucu lagi semangat" loading="lazy"
          style="border-radius:var(--r-md); box-shadow:0 18px 40px -28px rgba(255,92,138,.45); max-height:34vh; width:auto; max-width:100%;" />
      </div>

      <div class="reveal d4" style="margin-top:26px;">
        <button class="cta inline-flex items-center gap-2.5 rounded-full border-none px-7 py-4 font-head font-bold text-white"
          data-scroll="#s2"
          style="font-size:clamp(17px,2.4vw,20px); background:var(--btn); box-shadow:0 18px 34px -16px rgba(255,92,138,.85); cursor:pointer; transition:transform .18s var(--ease), box-shadow .25s, background .2s;">
          Iya, lanjut baca dulu… <span class="arr">→</span>
        </button>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Add the `.cta` and `.scene`/`.scene-img` CSS to the `<style>` block**

Add these rules to the `<style>` block (after the `.scroll-hint` rules, before the chat section):

```css
/* -- CTA button hover (needs :hover pseudo, kept as CSS) -- */
.cta:hover{ background: var(--btn-press); transform: translateY(-2px); box-shadow: 0 22px 40px -16px rgba(255,92,138,.9); }
.cta:active{ transform: translateY(1px) scale(.98); }
.cta .arr{ transition: transform .25s var(--ease); }
.cta:hover .arr{ transform: translateX(4px); }

/* -- focus rings (WCAG 2.4.7) -- */
.cta:focus-visible{ outline:none; box-shadow:0 0 0 4px rgba(179,136,235,.42), 0 18px 34px -16px rgba(255,92,138,.85); }
.btn-primary:focus-visible{ outline:none; box-shadow:0 0 0 4px rgba(179,136,235,.45), 0 20px 36px -16px rgba(255,92,138,.9); }
.ngambek-wrap:focus-visible .ngambek-face{ outline:none; box-shadow:0 0 0 4px rgba(179,136,235,.45); border-color: var(--secondary); }

/* -- scene drop-zones (kept as CSS — used by multiple sections) -- */
.scene{
  position:relative; margin:24px auto 0; width:100%; max-width:300px; aspect-ratio:4/3;
  border-radius:var(--r-md); overflow:hidden;
  background:radial-gradient(120% 80% at 50% 25%, #ffffff 0%, #fff3f8 100%);
  box-shadow:inset 0 0 0 1.5px var(--line), 0 18px 40px -30px rgba(255,92,138,.55);
  display:grid; place-items:center;
}
.scene::before{
  content:""; position:absolute; inset:9px; border-radius:calc(var(--r-md) - 7px);
  border:1.5px dashed color-mix(in srgb, var(--primary) 42%, transparent); pointer-events:none;
}
.scene-art{ width:60%; position:relative; z-index:1; }
.scene-art svg{ width:100%; height:auto; display:block; }
.scene-cap{
  position:absolute; left:0; right:0; bottom:7px; z-index:2;
  font-family:'Patrick Hand',cursive; font-size:13px; color:var(--text-soft); text-align:center;
}
.scene--lg{ max-width:340px; aspect-ratio:1/1; }
.scene--media{ aspect-ratio:auto; }
.scene--media::before{ content:none; }
.scene-img{ display:block; width:100%; height:auto; border-radius:var(--r-md); }

/* -- pagetab variants -- */
.pagetab--night{ background:rgba(255,255,255,.16); color:#FFE7B0; }
.pagetab--pink{ background:var(--btn); color:var(--text); }
```

- [ ] **Step 3: Reload `index.html` in the browser**

```bash
open index.html
```
Expected: the greeting section renders with the pink/cream gradient, the heading "Halo Perempuan…", the name "Stasya Annesty.", the cat GIF, and the pink CTA button. Floating hearts won't appear yet (the JS is added in Task 10).

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: add Section 1 — Opening Greeting with Tailwind utilities"
```

---

## Task 5: Section 2 — Playful Apology Chat

**Files:**
- Modify: `index.html` — add S2 after S1

- [ ] **Step 1: Add Section 2 markup**

Insert after the S1 `</section>`:

```html
<!-- ===================== SECTION 2 ===================== -->
<section id="s2" class="relative min-h-[100dvh] flex items-center justify-center"
  style="background: linear-gradient(180deg, var(--bg-pink) 0%, #FBEEFF 100%); padding-block: clamp(64px,12vh,120px);">
  <span class="pagetab absolute top-5 right-0 z-[4] -rotate-3 rounded-l-[9px] rounded-r-none px-3.5 py-1.5 font-hand text-sm leading-none"
    style="background: var(--secondary); box-shadow:0 8px 18px -12px rgba(0,0,0,.4);">hal. 02</span>
  <div class="relative z-[1] w-full max-w-[920px] mx-auto px-[clamp(20px,5vw,40px)]">
    <div class="chat reveal mx-auto max-w-[560px]"
      style="background:#fff; border-radius:var(--r-lg); box-shadow:var(--shadow-soft); padding:clamp(22px,4vw,34px); border:1px solid #fff;">
      <div class="chat-head mb-[18px] flex items-center gap-3 border-b pb-4" style="border-color:var(--line);">
        <div class="ava grid h-11 w-11 place-items-center rounded-full font-head font-extrabold text-white"
          style="background: linear-gradient(135deg, var(--primary), var(--secondary));">A</div>
        <div>
          <b class="font-head text-lg">Adit</b>
          <span class="block text-[13px]" style="color:var(--text-soft);">sedang mengetik…</span>
        </div>
      </div>
      <div class="chat-stage flex min-h-[40px] flex-col gap-3" id="chatStage"></div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Reload and verify**

Expected: the chat card renders with the "Adit / sedang mengetik…" header and an empty chat stage (bubbles appear once JS is wired in Task 10).

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add Section 2 — Apology Chat structure"
```

---

## Task 6: Section 3 — Reassurance

**Files:**
- Modify: `index.html` — add S3 after S2

- [ ] **Step 1: Add Section 3 markup**

Insert after the S2 `</section>`:

```html
<!-- ===================== SECTION 3 ===================== -->
<section id="s3" class="relative min-h-[100dvh] flex items-center justify-center"
  style="background: linear-gradient(180deg, #FBEEFF 0%, #F3FBFF 100%); padding-block: clamp(64px,12vh,120px);">
  <span class="pagetab absolute top-5 right-0 z-[4] -rotate-3 rounded-l-[9px] rounded-r-none px-3.5 py-1.5 font-hand text-sm leading-none"
    style="background: var(--secondary); box-shadow:0 8px 18px -12px rgba(0,0,0,.4);">hal. 03</span>
  <div class="relative z-[1] w-full max-w-[920px] mx-auto px-[clamp(20px,5vw,40px)]">
    <div class="reassure-head reveal mx-auto mb-[34px] max-w-[640px] text-center">
      <h2 class="font-head font-extrabold" style="font-size:clamp(26px,5vw,40px);">Aku nggak pernah keganggu sama kamu.</h2>
      <p class="mt-3.5" style="color:var(--text-soft); font-size:clamp(16px,2.2vw,18px);">Aku nggak kesel karena kamu banyak ngomong. Aku justru senang waktu kamu cerita, nanya hal random, atau nge-request apa pun ke aku.</p>
    </div>
    <ul class="moments flex flex-col list-none p-0" style="max-width:560px; margin-inline:auto;">
      <li class="moment reveal d1 flex items-start gap-4 py-[18px]">
        <span class="tick mt-0.5 h-[34px] w-[34px] flex-none" aria-hidden="true">
          <svg class="h-full w-full overflow-visible" viewBox="0 0 24 24"><circle class="tick-ring" cx="12" cy="12" r="10"/><path class="tick-mark" pathLength="1" d="M7 12.5 L10.5 16 L17 9"/></svg>
        </span>
        <span><b class="block font-head font-bold leading-tight" style="font-size:clamp(18px,2.6vw,22px);">Kamu cerita</b><span class="mt-0.5 block text-[15px]" style="color:var(--text-soft);">Aku diem-diem senyum dengerin.</span></span>
      </li>
      <li class="moment reveal d2 flex items-start gap-4 py-[18px] border-t" style="border-color:rgba(179,136,235,.20);">
        <span class="tick mt-0.5 h-[34px] w-[34px] flex-none" aria-hidden="true">
          <svg class="h-full w-full overflow-visible" viewBox="0 0 24 24"><circle class="tick-ring" cx="12" cy="12" r="10"/><path class="tick-mark" pathLength="1" d="M7 12.5 L10.5 16 L17 9"/></svg>
        </span>
        <span><b class="block font-head font-bold leading-tight" style="font-size:clamp(18px,2.6vw,22px);">Kamu nanya random</b><span class="mt-0.5 block text-[15px]" style="color:var(--text-soft);">Pertanyaan paling ngalir pun aku suka.</span></span>
      </li>
      <li class="moment reveal d3 flex items-start gap-4 py-[18px] border-t" style="border-color:rgba(179,136,235,.20);">
        <span class="tick mt-0.5 h-[34px] w-[34px] flex-none" aria-hidden="true">
          <svg class="h-full w-full overflow-visible" viewBox="0 0 24 24"><circle class="tick-ring" cx="12" cy="12" r="10"/><path class="tick-mark" pathLength="1" d="M7 12.5 L10.5 16 L17 9"/></svg>
        </span>
        <span><b class="block font-head font-bold leading-tight" style="font-size:clamp(18px,2.6vw,22px);">Kamu request sesuatu</b><span class="mt-0.5 block text-[15px]" style="color:var(--text-soft);">Bikin aku merasa dibutuhin.</span></span>
      </li>
      <li class="moment reveal d4 flex items-start gap-4 py-[18px] border-t" style="border-color:rgba(179,136,235,.20);">
        <span class="tick mt-0.5 h-[34px] w-[34px] flex-none" aria-hidden="true">
          <svg class="h-full w-full overflow-visible" viewBox="0 0 24 24"><circle class="tick-ring" cx="12" cy="12" r="10"/><path class="tick-mark" pathLength="1" d="M7 12.5 L10.5 16 L17 9"/></svg>
        </span>
        <span><b class="block font-head font-bold leading-tight" style="font-size:clamp(18px,2.6vw,22px);">Aku merasa berguna</b><span class="mt-0.5 block text-[15px]" style="color:var(--text-soft);">Buat kamu, itu cukup buat aku.</span></span>
      </li>
    </ul>
    <p class="plea reveal font-hand mx-auto mt-7 text-center" style="font-size:clamp(18px,2.6vw,24px); max-width:560px; line-height:1.5;">Plisssss bangetttt janjiiii jangan berubah aku pengen kamu kaya kemarin aku seneng bangetttt kalo di gituinnnnn</p>
  </div>
</section>
```

- [ ] **Step 2: Reload and verify**

Expected: the reassurance heading, four moment rows with tick SVGs (ticks check off on scroll once JS is wired), and the plea paragraph.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add Section 3 — Reassurance with checked-off moments"
```

---

## Task 7: Section 4 — Overthinking (night)

**Files:**
- Modify: `index.html` — add S4 after S3

- [ ] **Step 1: Add Section 4 markup**

Insert after the S3 `</section>`:

```html
<!-- ===================== SECTION 4 ===================== -->
<section id="s4" class="relative min-h-[100dvh] flex items-center justify-center overflow-hidden"
  style="background:
    radial-gradient(120% 80% at 70% 0%, #2C1A47 0%, transparent 60%),
    linear-gradient(180deg, var(--night-1), var(--night-2) 60%, var(--night-3));
    color:#F4ECFF; padding-block: clamp(64px,12vh,120px);">
  <span class="pagetab pagetab--night absolute top-5 right-0 z-[4] -rotate-3 rounded-l-[9px] rounded-r-none px-3.5 py-1.5 font-hand text-sm leading-none"
    style="box-shadow:0 8px 18px -12px rgba(0,0,0,.4);">hal. 04</span>
  <div class="stars-layer absolute inset-0 z-0 pointer-events-none" id="starsLayer" aria-hidden="true"></div>
  <div class="relative z-[1] w-full max-w-[920px] mx-auto px-[clamp(20px,5vw,40px)]">
    <div class="night-inner relative z-[1] mx-auto max-w-[680px] text-center">
      <svg class="moon reveal mx-auto mb-3.5 h-16 w-16" viewBox="0 0 24 24" aria-hidden="true"
        style="filter: drop-shadow(0 0 18px rgba(255,231,176,.6));">
        <path fill="#FFE7B0" d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.6 6.6 0 1 0 9.8 9.8z"/>
      </svg>
      <h2 class="reveal font-head font-bold text-white" style="font-size:clamp(24px,4.4vw,36px);">Dari semalam aku kepikiran terus sampai susah tidur, hehe.</h2>
      <p class="reveal d1 mt-3.5" style="color:#D9CCF2; font-size:clamp(16px,2.2vw,18px); white-space:pre-line;">Iya, aku overthinking sendiri karena takut kamu masih marah sama aku.
Terus akhirnya aku bikin ini deh.</p>
      <div class="thoughts mt-[30px] flex flex-col items-center gap-3.5">
        <div class="thought">Dia masih marah nggak ya?</div>
        <div class="thought">Aduh aku salah…</div>
        <div class="thought">Gimana cara minta maaf yang lucu ya?</div>
        <div class="thought">Bikin ini aja deh…</div>
      </div>
      <div class="scene scene--media reveal d3 mx-auto mt-3.5" role="img" aria-label="Adit belum bisa tidur, overthinking soal kamu">
        <img class="scene-img" src="mr42aipu-midnightgif300.gif" alt="Kucing midnight lagi begadang overthinking belum tidur" loading="lazy"
          style="border-radius:var(--r-md); box-shadow:0 18px 40px -26px rgba(0,0,0,.6);" />
      </div>
      <div class="reveal d4" style="margin-top:30px;">
        <button class="cta inline-flex items-center gap-2.5 rounded-full border-none px-7 py-4 font-head font-bold text-white"
          data-scroll="#s5"
          style="font-size:clamp(17px,2.4vw,20px); background:var(--btn); box-shadow:0 18px 34px -16px rgba(255,92,138,.85); cursor:pointer; transition:transform .18s var(--ease), box-shadow .25s, background .2s;">
          Lihat hasil overthinking-ku <span class="arr">→</span>
        </button>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Reload and verify**

Expected: dark night gradient, moon SVG, heading, thought bubbles (hidden until JS reveals them), the midnight cat GIF, and the CTA button.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add Section 4 — Overthinking night section"
```

---

## Task 8: Section 5 — Made Especially for You

**Files:**
- Modify: `index.html` — add S5 after S4

- [ ] **Step 1: Add Section 5 markup**

Insert after the S4 `</section>`:

```html
<!-- ===================== SECTION 5 ===================== -->
<section id="s5" class="relative min-h-[100dvh] flex items-center justify-center"
  style="background: linear-gradient(180deg, #F3FBFF 0%, #FFF7F0 100%); padding-block: clamp(64px,12vh,120px);">
  <span class="pagetab absolute top-5 right-0 z-[4] -rotate-3 rounded-l-[9px] rounded-r-none px-3.5 py-1.5 font-hand text-sm leading-none"
    style="background: var(--secondary); box-shadow:0 8px 18px -12px rgba(0,0,0,.4);">hal. 05</span>
  <div class="relative z-[1] w-full max-w-[920px] mx-auto px-[clamp(20px,5vw,40px)]">
    <div class="made-inner mx-auto max-w-[640px] text-center">
      <h2 class="reveal font-head font-extrabold" style="font-size:clamp(26px,5vw,40px);">Aku bikin ini khusus buat kamu.</h2>
      <p class="reveal d1 mt-3.5" style="color:var(--text-soft); font-size:clamp(16px,2.2vw,18px);">Aku harap hal kecil ini bisa bikin marah kamu sedikit reda, bikin kamu senyum lagi, dan bikin kamu mau maafin aku.</p>
      <div class="laptop reveal d2 relative mx-auto mt-[34px]" style="max-width:440px; background:#1c1430; border-radius:16px 16px 8px 8px; padding:16px 14px 22px; box-shadow:var(--shadow-card);">
        <div class="screen text-left" style="background:#120C22; border-radius:10px; padding:20px 18px; color:#E8DEF8;">
          <div class="dots mb-3.5 flex gap-1.5">
            <i class="h-[9px] w-[9px] rounded-full" style="background:#3a2c55;"></i>
            <i class="h-[9px] w-[9px] rounded-full" style="background:#3a2c55;"></i>
            <i class="h-[9px] w-[9px] rounded-full" style="background:#3a2c55;"></i>
          </div>
          <div class="load-label" style="font-family:'Patrick Hand',monospace; color:#FFD6E0; font-size:15px;">Apology loading…</div>
          <div class="progress"><i id="progressBar"></i></div>
          <div class="progress-row flex justify-between" style="font-family:'Patrick Hand',cursive; font-size:15px; color:#CBB9EC;">
            <span></span><span id="progressPct">0%</span>
          </div>
          <div class="status" id="progressStatus" style="font-family:'Patrick Hand',cursive; color:#FFE7B0; font-size:16px; margin-top:8px; min-height:22px;">menyiapkan permintaan maaf…</div>
          <span class="done-tag" id="doneTag">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M20 6 9 17l-5-5"/></svg>
            done
          </span>
        </div>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Reload and verify**

Expected: the heading, body text, and the dark laptop visual with the "Apology loading…" label. The progress bar stays at 0% until JS is wired.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add Section 5 — Made Especially for You with laptop visual"
```

---

## Task 9: Section 6 — Forgiveness Question + Final State

**Files:**
- Modify: `index.html` — add S6 after S5

- [ ] **Step 1: Add Section 6 markup**

Insert after the S5 `</section>`:

```html
<!-- ===================== SECTION 6 ===================== -->
<section id="s6" class="relative min-h-[100dvh] flex items-center justify-center overflow-hidden"
  style="background:
    radial-gradient(120% 90% at 50% 0%, #FFD9E6 0%, transparent 55%),
    linear-gradient(180deg, #FFC2D6 0%, #FF9DBB 100%);
    padding-block: clamp(64px,12vh,120px);">
  <span class="pagetab pagetab--pink absolute top-5 right-0 z-[4] -rotate-3 rounded-l-[9px] rounded-r-none px-3.5 py-1.5 font-hand text-sm leading-none"
    style="box-shadow:0 8px 18px -12px rgba(0,0,0,.4);">hal. 06 ♡</span>
  <div class="hearts-layer" id="hearts-s6" aria-hidden="true"></div>
  <div class="relative z-[1] w-full max-w-[920px] mx-auto px-[clamp(20px,5vw,40px)]">
    <div class="q-card relative mx-auto max-w-[600px] text-center" id="qCard" style="padding:clamp(10px,4vw,28px) clamp(14px,5vw,40px);">

      <!-- question state -->
      <div class="q-state reveal" id="qState">
        <h2 class="font-head font-extrabold" style="font-size:clamp(34px,7vw,54px); line-height:1.04; letter-spacing:-.02em;">Jadi…<br>Mau ya?</h2>
        <div class="font-hand mt-3.5" style="font-size:clamp(22px,3.4vw,28px); color:var(--text);">Maafin Aditya Ardiansyah Ramadhan ini.</div>
        <div class="q-flourish my-[22px] flex items-center justify-center gap-2.5" style="color:var(--btn);" aria-hidden="true">
          <span style="width:44px; height:2px; border-radius:2px; background:linear-gradient(90deg,transparent,rgba(255,92,138,.65),transparent);"></span>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 21s-7.5-4.9-10-9.3C.4 8.4 2 5 5.2 5c2 0 3.3 1.1 4 2.2.7-1.1 2-2.2 4-2.2 3.2 0 4.8 3.4 3.2 6.7C19 16.1 12 21 12 21z"/></svg>
          <span style="width:44px; height:2px; border-radius:2px; background:linear-gradient(90deg,transparent,rgba(255,92,138,.65),transparent);"></span>
        </div>

        <div class="btn-area mt-7 flex flex-col items-center gap-[18px]">
          <button class="btn-primary w-full cursor-pointer" id="forgiveBtn"
            style="max-width:420px; background:var(--btn); color:#fff; border:2px solid rgba(255,255,255,.92); font-family:'Baloo 2',sans-serif; font-weight:700; font-size:clamp(16px,2.3vw,19px); line-height:1.35; padding:17px 24px; border-radius:18px; box-shadow:0 20px 36px -16px rgba(255,92,138,.9); transition:transform .18s var(--ease), box-shadow .25s, background .2s;">
            Iya deh, aku maafin kamu.<br>Tapi jangan ngelakuin hal itu lagi ya ke aku.
          </button>

          <div class="roam" id="roam">
            <button class="ngambek-wrap" id="ngambekBtn" type="button">
              <span class="ngambek-face" id="ngambekFace">Nggak mau, aku mau ngambek seminggu lagi.</span>
            </button>
            <div class="funny" id="funnyMsg">Eh, balon ngambek-nya pecah! Waktu ngambek-nya kelihatannya udah abis deh… yuk, maafin aku?</div>
          </div>
        </div>
      </div>

      <!-- final state -->
      <div class="final" id="finalState">
        <h2 class="font-head font-extrabold" style="font-size:clamp(30px,6vw,46px);">Yeay…</h2>
        <p class="mx-auto mt-3.5" style="font-size:clamp(16px,2.3vw,19px); max-width:52ch; margin-inline:auto; white-space:pre-line;">Makasih ya, kakak cantik. Aku senang banget kamu mau maafin aku.
Aku janji bakal lebih hati-hati, lebih peka, dan nggak pura-pura ngambek dengan cara yang bikin kamu sedih lagi.</p>
        <div class="gif-label font-hand mt-6" style="font-size:clamp(20px,3vw,26px); color:var(--text);">Kondisi Adit saat ini</div>
        <div class="scene scene--lg scene--media mx-auto" id="finalGif" role="img" aria-label="Kondisi Adit saat ini: senang banget dimaafin" style="max-width:340px;">
          <img class="scene-img" src="mochi-peachcat-cute-cat.gif" alt="Kucing mochi peachcat lucu lagi senyum senang" loading="lazy" />
        </div>
      </div>

    </div>
  </div>
</section>
```

- [ ] **Step 2: Add the `.btn-primary:hover` CSS rule**

Add to the `<style>` block (after the `.cta:active` rule):

```css
/* -- primary button hover -- */
.btn-primary:hover{ background: var(--btn-press); transform: translateY(-2px); box-shadow: 0 26px 44px -16px rgba(255,92,138,1); }
.btn-primary:active{ transform: translateY(2px) scale(.985); }
```

- [ ] **Step 3: Reload and verify**

Expected: the pink gradient, the "Jadi… Mau ya?" heading, the name, both buttons (forgive + ngambek), floating hearts container. The final state is hidden (`display:none`).

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: add Section 6 — Forgiveness Question + Final state"
```

---

## Task 10: Port the vanilla JavaScript

**Files:**
- Modify: `index.html` — add the `<script>` before `</body>`

This is the entire interaction layer from `reference/index.html` lines 714–1032, kept **verbatim**. It powers: reveal-on-scroll, smooth-scroll CTAs, floating hearts, chat sequencing, thought staggering, loading bar, stars, runaway button + balloon pop, forgiveness climax + confetti, scroll progress bar.

- [ ] **Step 1: Add the `<script>` block**

Insert this immediately before `</body>`:

```html
<script>
/* ============================================================
   Interactions — reveal, smooth scroll, chat, thoughts,
   loading bar, stars/hearts, runaway button, balloon pop,
   forgiveness climax + confetti.
   Ported verbatim from reference/index.html (l. 714–1032).
   ============================================================ */
(function(){
  "use strict";
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- helpers ---------- */
  function $(s, c){ return (c||document).querySelector(s); }
  function $all(s, c){ return Array.prototype.slice.call((c||document).querySelectorAll(s)); }
  function heartSVG(color){
    return '<svg viewBox="0 0 24 24" width="100%" height="100%"><path fill="'+color+'" d="M12 21s-7.5-4.9-10-9.3C.4 8.4 2 5 5.2 5c2 0 3.3 1.1 4 2.2.7-1.1 2-2.2 4-2.2 3.2 0 4.8 3.4 3.2 6.7C19 16.1 12 21 12 21z"/></svg>';
  }
  function scrollToSel(sel){
    var el = $(sel);
    if(!el) return;
    var top = el.getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop);
    window.scrollTo({ top: top, behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  /* ---------- reveal on scroll ---------- */
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){
        e.target.classList.add('in');
        if(e.target.id === 's2' && !e.target.dataset.played){ e.target.dataset.played='1'; playChat(); }
        if(e.target.id === 's4' && !e.target.dataset.played){ e.target.dataset.played='1'; playThoughts(); }
        if(e.target.id === 's5' && !e.target.dataset.played){ e.target.dataset.played='1'; playLoading(); }
      }
    });
  }, { threshold: 0.25 });
  $all('section').forEach(function(s){ io.observe(s); });
  $all('.reveal').forEach(function(el){ io.observe(el); });

  /* ---------- CTA smooth scroll ---------- */
  $all('[data-scroll]').forEach(function(b){
    b.addEventListener('click', function(){ scrollToSel(b.getAttribute('data-scroll')); });
  });

  /* ---------- SECTION 1 & 6 floating hearts ---------- */
  function seedHearts(layerId, count, colors){
    var layer = document.getElementById(layerId); if(!layer) return;
    for(var i=0;i<count;i++){
      var s = document.createElement('span');
      s.className = 'heart-float';
      var size = 12 + Math.random()*16;
      s.style.width = size+'px'; s.style.height = size+'px';
      s.style.left = (Math.random()*100)+'%';
      s.style.animationDuration = (7 + Math.random()*7)+'s';
      s.style.animationDelay = (-Math.random()*10)+'s';
      var c = colors[i % colors.length];
      s.innerHTML = heartSVG(c);
      layer.appendChild(s);
    }
  }
  seedHearts('hearts-s1', 8, ['#FF8FAB','#FFD6E0','#B388EB','#FF5C8A']);
  seedHearts('hearts-s6', 10, ['#FF5C8A','#FFFFFF','#FFD6E0','#FF8FAB']);

  /* ---------- SECTION 2 chat sequence ---------- */
  function playChat(){
    var stage = $('#chatStage');
    var lines = [
      { t:'Aku tadi niatnya bercanda…' },
      { t:'Aku cuma pura-pura ngambek…' },
      { t:'Tapi ternyata kamu yang beneran ngambek…' },
      { t:'Dan aku kalah.', lost:true }
    ];
    var i = 0;
    function typing(on){
      if(on){ var t=document.createElement('div'); t.className='typing'; t.id='curTyping'; t.innerHTML='<i></i><i></i><i></i>'; stage.appendChild(t); stage.scrollTop = stage.scrollHeight; }
      else { var ex=$('#curTyping'); if(ex) ex.remove(); }
    }
    function next(){
      if(i >= lines.length){ var s=document.createElement('div'); s.className='sorry'; s.textContent='Maaf ya…'; stage.appendChild(s); return; }
      typing(true);
      setTimeout(function(){
        typing(false);
        var b=document.createElement('div');
        b.className = 'bubble' + (lines[i].lost ? ' lost' : '');
        b.textContent = lines[i].t;
        stage.appendChild(b);
        stage.scrollTop = stage.scrollHeight;
        i++; setTimeout(next, 650);
      }, reduceMotion ? 200 : 850);
    }
    next();
  }

  /* ---------- SECTION 4 thoughts stagger ---------- */
  function playThoughts(){
    var ts = $all('#s4 .thought');
    ts.forEach(function(t, idx){
      setTimeout(function(){ t.classList.add('in'); }, reduceMotion ? 60 : 700*idx + 300);
    });
  }

  /* ---------- SECTION 5 loading bar ---------- */
  function playLoading(){
    var bar = $('#progressBar'), pct = $('#progressPct'), status = $('#progressStatus'), done = $('#doneTag');
    var statuses = [
      'menyiapkan permintaan maaf…',
      'merangkai kata-kata yang jujur…',
      'menimbang rasa salah…',
      'mencari cara biar kamu senyum…',
      'mengetik dengan tulus…'
    ];
    var p = 0, dur = reduceMotion ? 600 : 2300, start = null;
    function step(ts){
      if(!start) start = ts;
      var k = Math.min(1, (ts - start)/dur);
      var eased = 1 - Math.pow(1 - k, 2);
      p = Math.round(eased*100);
      bar.style.width = p + '%';
      pct.textContent = p + '%';
      status.textContent = statuses[Math.min(statuses.length-1, Math.floor(eased*statuses.length))];
      if(k < 1){ requestAnimationFrame(step); }
      else { status.textContent='Status: masih berharap dimaafin kakak cantik'; done.classList.add('show'); }
    }
    requestAnimationFrame(step);
  }

  /* ---------- SECTION 4 stars ---------- */
  (function(){
    var layer = $('#starsLayer'); if(!layer) return;
    var n = reduceMotion ? 18 : 46;
    for(var i=0;i<n;i++){
      var st = document.createElement('span');
      st.className = 'star' + (Math.random()>0.8 ? ' big':'');
      st.style.left = (Math.random()*100)+'%';
      st.style.top = (Math.random()*100)+'%';
      st.style.animationDelay = (-Math.random()*3)+'s';
      st.style.animationDuration = (2 + Math.random()*3)+'s';
      layer.appendChild(st);
    }
  })();

  /* ---------- Runaway button + balloon pop ---------- */
  var attempts = 0, popping = false, lastAttemptAt = 0;
  var ATTEMPT_COOLDOWN = 360, FLEE_RADIUS = 120, ROAM_PAD = 12;
  var roam = $('#roam'), wrap = $('#ngambekBtn'), face = $('#ngambekFace');
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  function clampPos(x, y){
    var rw = roam.clientWidth, rh = roam.clientHeight;
    var bw = wrap.offsetWidth, bh = wrap.offsetHeight;
    var maxX = Math.max(ROAM_PAD, rw - bw - ROAM_PAD);
    var maxY = Math.max(ROAM_PAD, rh - bh - ROAM_PAD);
    return { x: Math.min(Math.max(x, ROAM_PAD), maxX),
             y: Math.min(Math.max(y, ROAM_PAD), maxY) };
  }
  function applyPos(x, y){
    var rw = roam.clientWidth;
    wrap.style.transform = 'translate(' + (x - rw/2) + 'px,' + y + 'px)';
  }
  function farPoint(px, py){
    var bw = wrap.offsetWidth, bh = wrap.offsetHeight;
    var rw = roam.clientWidth, rh = roam.clientHeight;
    var cs = [
      {x: ROAM_PAD, y: ROAM_PAD},
      {x: rw - bw - ROAM_PAD, y: ROAM_PAD},
      {x: ROAM_PAD, y: rh - bh - ROAM_PAD},
      {x: rw - bw - ROAM_PAD, y: rh - bh - ROAM_PAD},
      {x: (rw - bw)/2, y: (rh - bh)/2}
    ].map(function(c){ return clampPos(c.x, c.y); });
    var best = cs[0], bd = -1;
    cs.forEach(function(c){
      var d = Math.hypot((c.x + bw/2) - (px||0), (c.y + bh/2) - (py||0));
      if(d > bd){ bd = d; best = c; }
    });
    return best;
  }
  function placeInitial(){
    wrap.style.transition = 'none';
    var p = clampPos((roam.clientWidth - wrap.offsetWidth)/2, ROAM_PAD);
    applyPos(p.x, p.y);
    void wrap.offsetWidth;
    wrap.style.transition = '';
  }
  function tryFlee(px, py){
    if(popping) return;
    var now = performance.now();
    if(now - lastAttemptAt < ATTEMPT_COOLDOWN) return;
    lastAttemptAt = now;
    attempts++;
    if(attempts > 5){ popBalloon(); return; }
    var p = farPoint(px, py);
    applyPos(p.x, p.y);
  }

  if(finePointer && !reduceMotion){
    roam.addEventListener('pointermove', function(ev){
      if(popping) return;
      var r = roam.getBoundingClientRect();
      var wr = wrap.getBoundingClientRect();
      var bx = wr.left - r.left + wr.width/2, by = wr.top - r.top + wr.height/2;
      if(Math.hypot((ev.clientX - r.left) - bx, (ev.clientY - r.top) - by) < FLEE_RADIUS){
        tryFlee(ev.clientX - r.left, ev.clientY - r.top);
      }
    });
  }
  wrap.addEventListener('pointerdown', function(ev){
    var r = roam.getBoundingClientRect();
    tryFlee(ev.clientX - r.left, ev.clientY - r.top);
  });
  wrap.addEventListener('click', function(){ tryFlee(); });

  function popBalloon(){
    popping = true;
    face.classList.add('popping');
    face.addEventListener('animationend', function(){
      face.style.visibility = 'hidden';
      spawnBurst();
      $('#funnyMsg').classList.add('show');
    }, { once:true });
    setTimeout(function(){
      face.classList.remove('popping');
      face.style.visibility = '';
      attempts = 0; popping = false; lastAttemptAt = 0;
      $('#funnyMsg').classList.remove('show');
      placeInitial();
    }, 3600);
  }
  function spawnBurst(){
    var colors = ['#FF5C8A','#FF8FAB','#FFB3C6','#B388EB','#FFD6E0'];
    var rect = wrap.getBoundingClientRect();
    var cx = rect.left + rect.width/2, cy = rect.top + rect.height/2;
    var shard = '<svg viewBox="0 0 10 10"><path d="M1 1 Q7 0 8 5 Q9 9 3 9 Q0 6 1 1 Z"/></svg>';
    var flash = document.createElement('span'); flash.className='pop-flash';
    flash.style.left = cx+'px'; flash.style.top = cy+'px';
    document.body.appendChild(flash);
    setTimeout(function(){ flash.remove(); }, 400);
    var n = 20;
    for(var i=0;i<n;i++){
      var p = document.createElement('span'); p.className='shard';
      p.innerHTML = shard;
      p.querySelector('path').setAttribute('fill', colors[i % colors.length]);
      p.style.left = cx+'px'; p.style.top = cy+'px';
      var ang = (Math.PI*2*i)/n + (Math.random()-0.5)*0.5;
      var dist = 52 + Math.random()*72;
      p.style.setProperty('--bx', (Math.cos(ang)*dist)+'px');
      p.style.setProperty('--by', (Math.sin(ang)*dist)+'px');
      p.style.setProperty('--rot', (Math.random()*540-270)+'deg');
      p.style.animationDuration = (0.6 + Math.random()*0.35)+'s';
      document.body.appendChild(p);
      (function(el){ setTimeout(function(){ el.remove(); }, 1000); })(p);
    }
  }

  placeInitial();
  window.addEventListener('resize', function(){ if(!popping) placeInitial(); });

  /* ---------- Forgiveness climax ---------- */
  $('#forgiveBtn').addEventListener('click', function(){
    var q = $('#qState'), f = $('#finalState');
    q.style.transition = 'opacity .5s ease, transform .5s ease';
    q.style.opacity = '0'; q.style.transform = 'scale(.96)';
    setTimeout(function(){
      q.style.display = 'none';
      f.classList.add('show');
      fireConfetti();
      scrollToSel('#s6');
    }, 480);
  });

  function fireConfetti(){
    var layer = $('#confetti-layer');
    var colors = ['#FF8FAB','#FF5C8A','#B388EB','#FFD6E0','#FFB3C6','#FFFFFF'];
    var n = reduceMotion ? 18 : 70;
    for(var i=0;i<n;i++){
      var h = document.createElement('span'); h.className='confetti-heart';
      var size = 9 + Math.random()*15;
      h.style.width = size+'px'; h.style.height = size+'px';
      h.style.left = (5 + Math.random()*90)+'%';
      h.style.top = (-10 - Math.random()*15)+'%';
      h.style.setProperty('--dx', ((Math.random()-0.5)*240)+'px');
      h.style.setProperty('--rot', (Math.random()*720-360)+'deg');
      h.style.animationDuration = (2.6 + Math.random()*2.6)+'s';
      h.style.animationDelay = (Math.random()*0.5)+'s';
      h.innerHTML = heartSVG(colors[i%colors.length]);
      layer.appendChild(h);
      (function(el, d){ setTimeout(function(){ el.remove(); }, (d+5000)); })(h, Math.random()*500);
    }
  }

  /* ---------- scroll progress bar ---------- */
  var progressBar = document.getElementById('scroll-progress');
  if(progressBar){
    var ticking = false;
    function updateProgress(){
      var h = document.documentElement;
      var max = (h.scrollHeight - h.clientHeight) || 1;
      var p = Math.min(1, Math.max(0, (h.scrollTop || document.body.scrollTop) / max));
      progressBar.style.transform = 'scaleX(' + p + ')';
      ticking = false;
    }
    function onScroll(){ if(!ticking){ window.requestAnimationFrame(updateProgress); ticking = true; } }
    window.addEventListener('scroll', onScroll, { passive: true });
    updateProgress();
  }

  window.addEventListener('load', function(){
    $all('#s1 .reveal').forEach(function(el){ el.classList.add('in'); });
  });
})();
</script>
```

- [ ] **Step 2: Reload and do a full interaction test**

```bash
open index.html
```
Test each interaction:
1. **S1**: greeting reveals, hearts float, CTA scrolls to S2.
2. **S2**: chat bubbles type in sequence ending with "Maaf ya…".
3. **S3**: tick marks check off as you scroll.
4. **S4**: stars twinkle, thoughts appear one-by-one, CTA scrolls to S5.
5. **S5**: loading bar fills to 100%, "done" tag appears.
6. **S6**: hearts float, ngambek button runs away, clicking forgive shows final state + confetti + GIF.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: port vanilla JS interactions (chat, runaway, confetti, all animations)"
```

---

## Task 11: Delete the React/Vite app and unused files

**Files:**
- Delete: `src/`, `public/`, `reference/`, `package.json`, `package-lock.json`, `vite.config.js`, `node_modules/`, `dist/`, `.github/`, `.oxlintrc.json`, `cat-meme-strawberry-cat.gif`, `midnightgif300.gif`

- [ ] **Step 1: Delete all React/Vite artifacts and unused GIFs**

```bash
rm -rf src/ public/ reference/ node_modules/ dist/ .github/
rm -f package.json package-lock.json vite.config.js .oxlintrc.json
rm -f cat-meme-strawberry-cat.gif midnightgif300.gif
```

- [ ] **Step 2: Verify the project root is clean**

```bash
ls -la
```
Expected: `index.html`, `opening.gif`, `mr42aipu-midnightgif300.gif`, `mochi-peachcat-cute-cat.gif`, `PRD.md`, `README.md`, `.gitignore`, `docs/`, `.git/`.

- [ ] **Step 3: Reload `index.html` to confirm it still works after deletion**

```bash
open index.html
```
Expected: the full app works identically — all sections, animations, and interactions. No broken paths, no console errors.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove React/Vite app and unused files

The single-file index.html (HTML + Tailwind Play CDN + vanilla JS) is now
the entire application. No build step, no node_modules, no src/ directory."
```

---

## Task 12: Update .gitignore, README, and final QA

**Files:**
- Modify: `.gitignore`
- Modify: `README.md`

- [ ] **Step 1: Simplify `.gitignore`**

Replace the contents of `.gitignore` with:

```
# OS
.DS_Store

# Editor
.vscode/*
!.vscode/extensions.json
.idea
*.sw?

# Playwright QA artifacts (if any)
.playwright-mcp/
```

- [ ] **Step 2: Rewrite `README.md`**

Replace the contents of `README.md` with:

```markdown
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
├─ index.html              ← the entire app (HTML + Tailwind + CSS + JS)
├─ opening.gif             ← Section 1 greeting GIF
├─ mr42aipu-midnightgif300.gif  ← Section 4 overthinking GIF
├─ mochi-peachcat-cute-cat.gif  ← Final state "Kondisi Adit saat ini" GIF
├─ PRD.md                  ← functional specification
└─ README.md
```

## Deployment

Push to GitHub and enable GitHub Pages (Settings → Pages → deploy from `main` branch root). Since there's no build step, Pages serves `index.html` directly. No base path configuration needed — relative GIF paths work at any URL.

## Replacing GIFs

Drop the new GIF file in the project root and update the `src="..."` attribute in `index.html`. The three GIFs are referenced by bare filename (e.g. `src="opening.gif"`).
```

- [ ] **Step 3: Final full-app QA in the browser**

```bash
open index.html
```
Walk through every interaction:
- [ ] S1 greeting reveals with floating hearts + GIF; CTA scrolls to S2
- [ ] S2 chat types bubbles in sequence, ends with "Maaf ya…"
- [ ] S3 ticks check off on scroll, plea text visible
- [ ] S4 night background, stars twinkle, thoughts stagger in, GIF loads, CTA scrolls to S5
- [ ] S5 loading bar animates 0→100%, "done" tag appears, final status shows
- [ ] S6 hearts float, ngambek button runs away on hover/click, 6+ attempts → balloon pop → funny message → resets
- [ ] S6 forgive button → question fades out, final state appears, confetti rains, "Kondisi Adit saat ini" + GIF shown
- [ ] Scroll progress bar tracks scroll position
- [ ] `prefers-reduced-motion` respected (test via DevTools → Rendering → emulate reduced motion)
- [ ] Responsive: resize to 360px, 768px, 1440px — all sections readable

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "docs: update README and gitignore for single-file stack"
```

---

## PRD acceptance criteria mapping

| PRD FR | Covered by |
|--------|-----------|
| FR-01 (runs) | Task 2 — `open index.html` |
| FR-02 (Tailwind) | Task 2 — Tailwind Play CDN + config |
| FR-03 (animations) | Task 3 + Task 10 — Framer Motion replaced by CSS keyframes + JS (per stack change) |
| FR-04 (six sections) | Tasks 4–9 |
| FR-05–FR-10 (each section) | Tasks 4, 5, 6, 7, 8, 9 |
| FR-11 (forgive → final) | Task 10 (forgiveness climax JS) |
| FR-12 (confetti) | Task 10 (fireConfetti) |
| FR-13 (GIF label) | Task 9 (gif-label "Kondisi Adit saat ini") |
| FR-14 (local GIFs) | Task 1 (GIFs at root) |
| FR-15 (runaway button) | Task 10 (tryFlee + farPoint) |
| FR-16 (attempt counter) | Task 10 (attempts variable) |
| FR-17 (balloon pop >5) | Task 10 (popBalloon) |
| FR-18 (smooth scroll) | Task 10 (scrollToSel + data-scroll) |
| FR-19 (responsive) | Task 12 (QA at 360/768/1440) |
| FR-20 (no optional link) | Not present in any task — confirmed absent |
| FR-21 (static deploy) | Task 12 — no build, GitHub Pages serves directly |

**Note on FR-03:** The PRD specifies Framer Motion, but the approved design explicitly changed the stack to vanilla JS + CSS keyframes. The animation *behavior* (reveal, stagger, confetti, balloon pop) is identical; only the implementation library changed. This is a deliberate, user-approved deviation.
