# How this portfolio was made

How the Frieren-themed developer portfolio went from a folder of reference images to a finished site: the design decisions, how the code is organised, the animation techniques, the bugs found along the way and how the result was checked.

For running and customising the site, see [README.md](README.md).

---

## 1. The brief

The starting request:

- A **Frieren-themed** portfolio that still clearly reads as a **developer's** site.
- **Animated and high quality**, while staying **abstract yet readable and easy to navigate**.
- Palette: **royal blue, sky blue and cream**.
- **Blue-Moon Weed** (蒼月草) flowers and leaves throughout.
- Five reference images for inspiration.

Four decisions were settled up front:

| Question | Decision | Why |
|---|---|---|
| Stack | Vite + React + TypeScript | Component-based, fast dev server, deploys anywhere as static files |
| Content | Placeholders in one data file | Real content can be added later without touching markup |
| Sections | Hero, About + skills, Projects, Experience + contact | Covers what a hiring manager looks for |
| Artwork | Hand-built SVG and canvas | Fully animatable, tiny file size, and no copyrighted art is shipped |

---

## 2. Reading the references

Each reference image was used for specific, borrowable elements rather than copied as a whole style:

| Reference | What was taken from it | Where it shows up |
|---|---|---|
| Chibi Frieren in a scarf | Wobbly ink outlines, softness, little "thought bubble" doodles | Flower outlines, the `ThoughtMarks` doodle beside the hero terminal |
| Frieren in the flower field | Five-petal blue flowers, diagonal light rays, a calm floating mood | `BlueMoonWeed`, hero light rays, drifting petals |
| Line sketch with a form | Specimen form with checkboxes and handwritten values, halftone dots, blue brush wash | The "Field notes" card in the About section |
| 実験体δ poster | Grid paper, royal-blue duotone, tilted polaroids, 4-point sparkles, orbit rings, barcode, big index numbers, small mono metadata | Page background, project polaroids, sparkles, hero corner metadata |
| Background Color Theory | A dark band mid-page, diamond checker borders, text on curved paths, birds | The Journey (experience) section |

The aim was a page that feels like a collage of these elements while keeping a plain reading order: a headline, body text and clear links in every section.

---

## 3. The design system

### Colour

The tokens are defined once in [src/styles/tokens.css](src/styles/tokens.css):

| Token | Value | Use |
|---|---|---|
| `--cream` / `--paper` | `#F5F0E3` / `#FBF8F0` | Page and card backgrounds |
| `--royal` / `--royal-deep` | `#1F3BD6` / `#12238A` | Accents, large type, outlines |
| `--sky` / `--sky-soft` | `#8EC3EE` / `#CFE6F8` | Decoration, highlights, text on the dark band |
| `--ink` / `--night` | `#0F1633` / `#0C1230` | Body text; the dark Journey band |

Readability rule: body text is always ink on cream (or cream on night). Royal blue is used for accents and large type, and sky blue only for decoration or for text on the dark band, so contrast stays high.

### Type

Five typefaces, each with one job. All are self-hosted through `@fontsource`, so nothing loads from third-party font servers.

- **Instrument Serif italic**: display headings (the poster feel).
- **Inter**: body text.
- **JetBrains Mono**: the "code layer", meaning nav, labels and metadata.
- **Caveat**: handwriting on the field notes and polaroid captions.
- **Shippori Mincho**: a few decorative Japanese accents. These are `aria-hidden`, so screen readers skip them.

### The code theme

The developer flavour comes from framing ordinary UI as code:

- Nav links look like file tabs: `~/hero.tsx`, `~/grimoire.ts`, `~/projects/`, `~/journey.log`, `~/contact.sh`.
- Section labels are comments: `// 02 — projects/`.
- Skills are "spells" in a grimoire, grouped into Offensive (languages), Defensive (testing and infra) and Utility (tools). Each card shows a one-line code "incantation".
- The hero terminal "casts" the flower field with `cast --spell flowerField --bloom`.
- The footer signs off with `return <Memories forever />;`.

---

## 4. Project setup

The project was scaffolded by hand rather than with `npm create vite`, because the interactive prompts can hang in a non-interactive shell:

1. Write a minimal `package.json`, then `npm install` the dependencies so the latest versions are pulled.
2. Add `tsconfig.json` (strict mode, bundler resolution, `vite/client` types for CSS modules), `vite.config.ts` and `index.html`.
3. Set `base: './'` in the Vite config so the build also works from a GitHub Pages sub-path.

**Dependencies**

| Package | Purpose |
|---|---|
| `react`, `react-dom` | UI |
| `gsap` | Animation. Version 3.13+ includes ScrollTrigger, **SplitText** and **DrawSVG** for free |
| `@gsap/react` | `useGSAP()`, which cleans up animations automatically when components unmount |
| `lenis` | Smooth scrolling |
| `@fontsource/*` | Self-hosted fonts |

---

## 5. Architecture

```
src/
  data/content.ts          every word on the site
  lib/                     gsap setup, smooth-scroll helpers, seeded random, *accent* parser
  hooks/                   useLenis, useReveal, usePrefersReducedMotion, useMediaQuery
  styles/                  tokens.css, global.css
  components/
    art/                   the illustrations (flowers, leaves, meadow, petals, sparkles…)
    layout/                Loader, Nav, Cursor, Footer
    ui/                    Terminal, SectionHeader, FieldNotes, SpellCard, Polaroid, ProjectCover
    sections/              Hero, About, Projects, Experience, Contact
```

Three principles shaped it.

**1. Content is data.** Components never hard-code copy; they read from [content.ts](src/data/content.ts). Titles use a tiny markup convention, where `'*lasting* code.'` renders "lasting" in royal blue. The `Accent` component in [src/lib/accent.tsx](src/lib/accent.tsx) handles this by splitting on asterisks.

**2. Art is built from small, reusable pieces.** Larger illustrations are assembled from a few primitives:

```
FlowerHead (one SVG <g>) ─┬─> BlueMoonWeed (a standalone flower)
                          ├─> Meadow (stems + leaves + heads that grow)
                          ├─> ProjectCover (generated polaroid art)
                          └─> Loader (the blooming intro)
LeafShape ────────────────┴─> the same consumers
```

**3. Styling.** Each component has its own CSS Module next to it, and the shared tokens are global. No UI framework was used, so every visual is custom.

---

## 6. Building the art

### The Blue-Moon Weed

[BlueMoonWeed.tsx](src/components/art/BlueMoonWeed.tsx) draws the flower in a −50…50 coordinate space:

- **One petal path**, rotated five times (0°, 72°, 144°…).
- **A radial gradient** that runs from pale at the centre to royal blue at the tips.
- **Fine veins** and **two freckles** per petal.
- **A cream centre** ringed by five stamen dots.

The gradients live in a single hidden `<svg>` ([ArtDefs.tsx](src/components/art/ArtDefs.tsx)) that is rendered once. Every flower references it by id (`url(#bmw-day)`), so dozens of flowers don't each carry their own `<defs>`. The gradient uses `gradientUnits="userSpaceOnUse"` centred on the flower's origin, so the shading radiates from the centre on every petal no matter how the petal is rotated.

The flower comes in four tones: `day`, `deep`, `night` (brighter, for the dark band) and `line` (sketch style).

### Leaves, sparkles and decor

- **Leaf:** a blade path plus a midrib and side veins, filled with a royal or sky gradient.
- **Sparkle:** the 4-point star from the posters, as a single cubic path.
- **Orbit, Barcode, BrushWash, Bird, CheckerBand, ThoughtMarks** ([Decor.tsx](src/components/art/Decor.tsx)):
  - The barcode is generated from a seeded random number generator, so it looks the same on every render.
  - The brush wash uses an SVG `feTurbulence` + `feDisplacementMap` filter to roughen the edges of simple blobs.
  - The checker band is an SVG diamond tile used as a CSS background. It moves by sliding a wider element with `transform`, which is cheaper than animating `background-position`.

### The meadow (stems that grow)

[Meadow.tsx](src/components/art/Meadow.tsx) generates a row of "sprigs", each made of a curved stem, one to three leaves, two grass blades and a flower head. The layout comes from a **seeded PRNG** ([random.ts](src/lib/random.ts)), so the arrangement is the same on every load:

- Sprigs are spread evenly with some jitter, so there are no big gaps.
- 40% are "back row": smaller, paler and with sky-coloured leaves, which gives depth.
- Leaves sit exactly on the stem. Their position comes from the quadratic Bézier formula evaluated at a point `t` along the stem:

```ts
const px = 2 * (1 - t) * t * ctrlX + t * t * endX;
const py = 2 * (1 - t) * t * ctrlY + t * t * endY;
```

When `bloom` turns true, a GSAP timeline plays these steps:

1. Grass and stems **draw themselves** (DrawSVG from 0% to 100%).
2. Leaves **scale up** from their base.
3. Flower heads **spin and pop open** with a `back.out` overshoot, staggered from the centre outwards.

Each sprig also sways gently on a pure-CSS rotation, with a random duration and delay so the stems never move in sync.

### Drifting petals (canvas)

Dozens of moving SVGs would be expensive, so falling petals use a `<canvas>` ([PetalField.tsx](src/components/art/PetalField.tsx)):

- **Sprites are drawn once.** A flower, a single petal and a leaf are each pre-rendered to an offscreen canvas using `Path2D` with the *same SVG path strings* as the vector art. Each frame then only calls `drawImage`.
- **Motion:** every particle has wind speed, gravity and sine-wave sway. A fake 3D tumble comes from squashing one axis with `cos(flip)`.
- **Pointer interaction:** particles within 120px of the cursor get pushed away.
- **Performance:**
  - Device pixel ratio is capped at 2.
  - The particle count scales with the canvas area, with a lower density on mobile.
  - The loop **pauses** when the canvas is off-screen (`IntersectionObserver`) or the tab is hidden (`visibilitychange`).

---

## 7. Motion system

### Smooth scrolling synced with GSAP

Lenis runs on GSAP's ticker, so smooth scrolling and ScrollTrigger always agree on the scroll position ([useLenis.ts](src/hooks/useLenis.ts)):

```ts
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```

The Lenis instance is stored in a module ([scroll.ts](src/lib/scroll.ts)) so the nav can call `scrollToId()`. That function falls back to native scrolling when Lenis is off, and moves keyboard focus to the target section.

### Reusable scroll reveals

[useReveal.ts](src/hooks/useReveal.ts) gives every section the same entrance behaviour with data attributes:

- `data-split`: headings rise line by line out of a mask (GSAP SplitText with `mask: 'lines'`).
- `data-reveal`: the element fades and lifts in.
- `data-reveal="stagger"`: its children do the same, one after another.

### Section by section

| Section | Animation |
|---|---|
| **Loader** | A sparkle outline draws itself and fills; petals bloom one by one; a counter runs 000→100; the panel slides up. Plays once per session (`sessionStorage`). |
| **Hero** | The headline lines rise, the copy fades in and the terminal tilts in. The terminal *types* its command; when it finishes, the meadow blooms and petals start drifting. Orbit rings and copy parallax on scroll. |
| **Grimoire** | The field-notes card drops in; handwritten values "write" (clip-path wipe); checkmarks draw; a pressed flower spins in. Spell cards are dealt in with random tilts and re-dealt when the filter changes. |
| **Projects** | Desktop: the section **pins** and the polaroids scroll **sideways**, with a progress bar and `01 / 06` counter. Polaroids straighten and lift on hover. Mobile: a simple vertical stack. |
| **Journey** | A winding road **draws itself as you scroll**, through every job. Each node's flower blooms as it enters. A caption slides along a curved text path, and birds cross the sky. |
| **Contact** | The terminal types `./contact.sh --party-invite`, then the links appear. Copying the email shows a toast. |
| **Footer** | A final meadow blooms when it scrolls into view. |

**Two techniques worth calling out:**

- **The road through the waypoints.** The Journey path isn't a fixed drawing. On every resize ([Experience.tsx](src/components/sections/Experience.tsx)), the code measures where each flower node sits in the list and builds a cubic Bézier path that passes through every node, swinging left and right between them. A `ResizeObserver` rebuilds it, so it always fits the layout, including the left-aligned mobile version.
- **The horizontal gallery.** It uses `gsap.matchMedia()`, so the pinned sideways scroll only exists on wide screens with motion allowed. Other conditions get their own setup, and GSAP tears each one down automatically when the media query stops matching.

### Rules followed throughout

- Animate only `transform` and `opacity` (plus SVG drawing), so motion stays on the GPU.
- Let **one system own each property.** CSS transitions and GSAP must never animate the same `transform` (see the bug list below).
- All GSAP code runs inside `useGSAP()`, which cleans up automatically, including under React StrictMode's double-run in development.

---

## 8. Accessibility and reduced motion

- **`prefers-reduced-motion`** is read through `useSyncExternalStore`, so it updates live. When it's on:
  - no loader, no smooth scroll, no particles and no pinning;
  - flowers render already in bloom, and terminals print their full text immediately;
  - a global CSS rule shortens any remaining CSS animation to near zero.
- A **skip link**, real landmarks (`header`, `nav`, `main`, `footer`) and one heading per section.
- **Visible focus rings** in royal blue.
- **Terminals** give screen readers the whole transcript at once (an `sr-only` paragraph) instead of a character-by-character stream.
- **Decorative art** is `aria-hidden`. Meaningful visuals (mastery stars, project covers) have labels.
- The **mobile menu** is `inert` while closed, so hidden links can't be tabbed into, and Esc closes it.
- The **custom cursor** only appears on fine pointers with motion allowed, and the normal cursor stays visible.

---

## 9. Testing and verification

### Build checks

`npx tsc --noEmit` and `npm run build` must both pass with no errors.

### Visual checks with headless Edge

No browser-automation library was installed. Instead, a small Node script drove **Microsoft Edge in headless mode through the Chrome DevTools Protocol**, using Node's built-in `WebSocket`. For each run it:

1. Launched Edge with a remote-debugging port.
2. Set the viewport size (and touch emulation for mobile).
3. Optionally emulated `prefers-reduced-motion: reduce`.
4. Loaded the page, waited for the intro, then scrolled to each section and saved a screenshot.
5. Recorded any console errors or exceptions.
6. Compared `scrollWidth` with the window width to detect sideways overflow.

It ran at **1440×900, 768×1024 and 390×844**, plus 1440×900 with reduced motion. The final runs had **no console errors and no sideways overflow** at any size.

### Bugs the screenshots caught

| Problem seen | Cause | Fix |
|---|---|---|
| The meadow bloomed *below the fold*, so the payoff was missed | The hero's content plus the meadow was taller than the screen | Anchored the meadow to the bottom of the hero with absolute positioning, and reserved padding for it |
| Petals drifted across the headline | The canvas sat above the text | Moved the canvas behind the content |
| A small blue pill sat at the bottom of every screen | The empty toast was only pushed down by 160% of its own (tiny) height | Moved it fully off-screen and set `visibility: hidden` when empty |
| Spell cards stayed slightly tilted after their entrance | A CSS `transition: transform` was fighting GSAP's tween on the same element | GSAP now animates an outer wrapper; the CSS hover effect lives on the inner card |
| The hand-drawn underline under *lasting* vanished in the animated version | SplitText's line masks clip anything below the text line | `split.revert()` when the entrance finishes, which restores the original markup |
| The contact flower covered the terminal's window dots | Positioning | Moved it to the opposite corner |

### Problems found while building

| Problem | Fix |
|---|---|
| The pinned Projects section was taller than a laptop screen | Moved the section heading *into* the horizontal track as its first panel |
| Scroll triggers could be measured in the wrong order once web fonts loaded and SplitText re-split | After `document.fonts.ready`: `ScrollTrigger.sort()` then `ScrollTrigger.refresh()` |
| StrictMode's double-run fired the spell-filter animation on first load | Compare against the last filter in a ref and skip when nothing changed |
| The mobile menu couldn't animate open (`hidden` toggles `display`, which skips transitions) | Use `visibility` with an expanding `clip-path` circle, plus `inert` while closed |
| The cursor's hover scale was ignored | A spinning CSS animation overrode `transform`; the scale moved to a wrapper element |
| Stems floated above the bottom edge | The SVG `viewBox` started below the stem base; it was recalculated so stems sit on the edge |

---

## 10. What's left to do

- Replace the placeholders in `content.ts`: projects, jobs, links, and the `@your-handle` / `hello@example.com` values.
- Add `public/resume.pdf`. The resume link is broken until then.
- Add real project screenshots in `public/projects/` (they get the duotone treatment automatically).
- Add an `og:image` (1200×630 PNG) for link previews.
- Run **Lighthouse** and a **keyboard-only pass**. Both were planned but not yet done.
- Make the first git commit and deploy (Vercel, Netlify or GitHub Pages).

---

## 11. Revision 2: smaller scale and the vine bridge

Feedback after the first version: everything felt **too large** in a real browser, the **hero → Grimoire transition** felt weak, and the hero's flowers were **too small**. This pass used the *UI/UX Pro Max* skill's guidance:
- Use one consistent type scale with a clear step between headings and body.
- Use small reveal offsets (8–16px).
- Tie scroll-drawn motion to the scrollbar with scrub 0.5–1.5.
- Pin at most 1–2 sections.

### Scaling down

- **Type scale** in `tokens.css`:
  - display headline 118px → about 78px at 1440px wide;
  - section titles about 88px → about 56px;
  - body text fixed at about 16px.
- **Short laptop screens:** display and section sizes are also capped by viewport *height* (`min(5.4vw, 10.5vh)`), so 1366×768-style screens don't get oversized headlines.
- **Layout:**
  - max content width 1320 → 1180px;
  - nav height 64 → 54px;
  - section padding about 25% smaller.
- **Components:** tighter spell cards (now four per row), polaroids, journey cards and terminals.
- **Reveal animations** lift 18px instead of 44px.

### The vine bridge

`components/art/VineBridge.tsx` replaces the small hero meadow. It is one element sitting *between* the two sections. Negative margins give it zero height in the layout, so it overlaps the bottom of the hero and the top of the Grimoire.

- **Geometry:**
  - Two vines are written in relative coordinates (x as a share of the width, y as an offset from the section boundary) and rebuilt on resize.
  - Once the stems are in the DOM, `getPointAtLength()` places leaves, buds, curling tendrils and large Blue-Moon Weed blooms (about 90–120px) along them, angled to each stem's direction.
  - A thinner strand is generated to twist around each main stem.
- **Motion in two stages:**
  1. When the hero spell finishes casting, the part of each vine inside the hero grows on its own, about 2.6s.
  2. The rest is **scrubbed to scroll**: drawing continues down into the Grimoire, and each leaf or flower pops open as the drawing tip reaches it.
  - A "↓ follow the vine" cue sits where the vine leaves the hero and fades once scrolling starts.
- **Stacking:** the Grimoire section has a higher `z-index`, so its card and text sit on top of the vine, and the vine appears to wrap behind the field-notes card.
- **Mobile:** phones have no side margin, so they get separate vine paths that hug the screen edges, with blooms hanging half off-screen. Text stays readable.
- **Reduced motion:** the vines render fully grown.

### Checks

- Screenshots at 1440×900, 1536×730 (a short laptop screen) and 390×844, plus reduced motion.
- No console errors and no sideways overflow.
- One fix came from this round: on the short screen, the vine first reached up to the CTA buttons. Its hero stretch now hugs the bottom ~14% of the screen, with blooms hanging downward.

---

## 12. Revision 3: project numbers and the spell-cast transition

- **Project numbers:** each polaroid now has a header row above the frame instead of a faint outlined number hidden behind the photo. The row holds a solid royal italic `01` with an offset sky-blue "print" shadow (like the `06` on the 実験体δ poster), `/ 06`, and a fading rule. On hover the number lifts and tilts.
- **Breathing room:** the pinned gallery has about 15% of the screen height free below the cards, so they never sit on the bottom edge while you scroll sideways.
- **The spell-cast transition** (`components/art/SpellCast.tsx`) sits between Projects and Journey. It shows a magic circle made of tick marks, rings, an {8/3} octagram over a hexagram, a ring of code "runes" (`const journey = await cast(spell) ✦ …`), eight nodes, and a Blue-Moon Weed inside a sparkle at its centre.
  1. While the circle scrolls into view, its rings begin to draw.
  2. On desktop the section **pins**. That makes two pinned sections, which is the most the design guidelines recommend. While pinned:
     - the circle finishes drawing and the runes appear;
     - the centre flower blooms;
     - a shockwave pulses;
     - **night spreads from the centre** using an expanding `clip-path` circle.
  3. The circle exists twice: royal ink on cream, and sky light on night. The night copy sits inside the expanding clip, so the lines appear to *invert* as the spell washes over them.
  4. When it unpins, the screen is already fully night, so the Journey section simply continues. Its top checker band was removed, and a gradient fades its glows in from plain night, so there's no visible seam.
- **Reduced motion:** the circle is shown already cast, on night.

---

## 13. Revision 4: nav tracking and the Journey fade

- **Nav highlighting bug:**
  - *Cause:* the nav used an `IntersectionObserver` that only fired when a section crossed a thin band in the middle of the screen. While the pinned spell-cast scene played, no section was in that band, so the nav stayed on `projects/`. Near the bottom of the page, Contact could miss the band entirely.
  - *Fix:* on each scroll frame, the active tab is now the last section whose top has passed 40% of the viewport. Extra elements can join a section with `data-nav="<id>"`; the spell-cast scene uses `data-nav="journey"`. Reaching the bottom of the page always selects the last tab.
  - *Check:* verified in the browser at nine points down the page.
- **Journey → Contact fade:** the bottom checker band was removed. Instead, the bottom of the Journey section (background, stars, petals) is masked to transparent, revealing the page's own cream grid paper underneath, which is the same surface Contact is drawn on. A royal-to-sky tint over the fade keeps the in-between colours blue rather than grey.
