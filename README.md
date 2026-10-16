# 蒼月草 — a Frieren-themed developer portfolio

An animated, single-page portfolio in royal blue, sky blue and cream. Blue-Moon Weed flowers, leaves and sparkles, plus a code-flavoured UI (file-tab nav, terminal "spells", a grimoire of skills).

Built with **Vite + React + TypeScript**, **GSAP** (ScrollTrigger, SplitText, DrawSVG) and **Lenis** smooth scrolling. All art is hand-built SVG/canvas, so no copyrighted artwork ships with the site.

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check + production build → dist/
npm run preview   # serve the build
```

## Make it yours

All copy lives in **`src/data/content.ts`**: name, headline, bio, field notes, skills ("spells"), projects, experience, contact links. Components only read from it.

- Wrap a word in `*asterisks*` in any title to give it the royal-blue accent.
- Project screenshots: put an image in `public/projects/` and set `image: 'projects/name.png'`. It fills a 16:10 frame, cropped from the top; set `imagePosition` (e.g. `'left top'`) to choose what stays visible. Without one, a generated cover is drawn.
- Resume: drop `resume.pdf` into `public/`.
- Colours, fonts and spacing are tokens in `src/styles/tokens.css`.
- Update `<title>` / meta tags in `index.html`. Add an `og:image` (1200×630 PNG in `public/`) for link previews.

## Structure

```
src/
  data/content.ts          all text content
  components/art/          BlueMoonWeed, Leaf, Meadow (growing stems), PetalField (canvas), Sparkle, Orbit, Decor
  components/layout/       Loader, Nav, Cursor, Footer
  components/ui/           Terminal, SectionHeader, FieldNotes, SpellCard, Polaroid, ProjectCover
  components/sections/     Hero, About (grimoire), Projects, Experience (journey), Contact
  hooks/                   useLenis, useReveal, usePrefersReducedMotion, useMediaQuery
  lib/                     gsap setup, smooth-scroll helpers, seeded random
```

## Motion & accessibility

- The intro loader plays once per browser session.
- `prefers-reduced-motion` turns off smooth scrolling, particles, pinning and the loader. Flowers render already in bloom, and terminals print instantly.
- Particles pause when off-screen or when the tab is hidden.
- Includes a skip link, real headings and landmarks, visible focus rings, and screen-reader text for the terminal transcripts. Decorative art is `aria-hidden`.

## Deploy

`vite.config.ts` uses `base: './'`, so `dist/` works on Vercel, Netlify or a GitHub Pages sub-path. Upload `dist/` or connect the repo.
