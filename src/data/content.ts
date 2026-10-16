/**
 * ─────────────────────────────────────────────────────────────
 *  content.ts — every word on the site lives here.
 *  Edit this file to personalise the portfolio; components only
 *  read from it, so you never need to touch the markup.
 * ─────────────────────────────────────────────────────────────
 */

export type School = "offensive" | "defensive" | "utility";

export interface Spell {
  name: string;
  school: School;
  /** 1–5 */
  mastery: number;
  /** One-line flavour text shown on the card. */
  lore: string;
  /** Code snippet revealed on hover/focus. */
  incantation: string;
}

export interface Project {
  title: string;
  year: string;
  summary: string;
  stack: string[];
  repo?: string;
  live?: string;
  /** Optional screenshot in /public (e.g. "projects/atlas.png"). Gets a royal-blue duotone. */
  image?: string;
  /** Handwritten caption on the polaroid. */
  caption: string;
}

export interface Waypoint {
  period: string;
  role: string;
  place: string;
  summary: string;
  tags: string[];
}

export interface Link {
  label: string;
  value: string;
  href: string;
  /** Copy `value` to the clipboard instead of navigating. */
  copy?: boolean;
}

export const profile = {
  name: "Nathan",
  handle: "nathan.dev",
  role: "Full-stack developer",
  location: "Bulacan, Philippines",
  yearsCoding: 5,
  available: true,
  /** Hero headline. Wrap the accent word in *asterisks*. */
  headline: ["A collector of", "small spells &", "*lasting* code."],
  intro:
    "I build fast, thoughtful web apps — the kind of quiet magic people keep using long after launch. Currently collecting spells in TypeScript, React and the cloud.",
  meta: [
    "Experimental portfolio.",
    "Collecting spells since 2021.",
    "v1.0 — field edition.",
  ],
};

export const about = {
  title: ["Notes from a", "*slow* journey."],
  paragraphs: [
    "Hi, I’m Nathan. I write software the way a mage studies: slowly, curiously, and with a soft spot for the small, odd spells nobody else bothers to learn.",
    "Most days that means designing front-ends that feel calm, APIs that are boring in the best way, and tooling that lets teams ship without fear. I care about the details that make a product feel cared-for.",
    "Away from the keyboard I’m usually reading, sketching, or wandering somewhere with flowers.",
  ],
  quote: "Ten years is a blink. Build things worth remembering.",
  fieldNotes: {
    id: "FIELD NOTES · 0.01",
    rows: [
      { label: "Name", value: "Nathan" },
      { label: "Class", value: "Full-stack developer" },
      { label: "Region", value: "Bulacan, Philippines" },
      { label: "Party", value: "Open to new adventures" },
    ],
    checks: [
      { label: "Frontend", on: true },
      { label: "Backend", on: true },
      { label: "UI design", on: true },
      { label: "DevOps", on: true },
      { label: "Mobile", on: false },
      { label: "Data/AI", on: true },
    ],
    notes: [
      "Consistency is key",
      "Make it work, then make it clean",
      "coffee > tea",
    ],
  },
};

export const schools: Record<School, { label: string; blurb: string }> = {
  offensive: { label: "Offensive", blurb: "Languages & frameworks" },
  defensive: { label: "Defensive", blurb: "Testing, infra & reliability" },
  utility: { label: "Utility", blurb: "Tools & craft" },
};

export const spells: Spell[] = [
  {
    name: "TypeScript",
    school: "offensive",
    mastery: 5,
    lore: "Zoltraak-grade type safety.",
    incantation: "type Spell<T> = Readonly<T>;",
  },
  {
    name: "React",
    school: "offensive",
    mastery: 5,
    lore: "Summons interfaces from state.",
    incantation: "const [bloom, setBloom] = useState(0);",
  },
  {
    name: "Node.js",
    school: "offensive",
    mastery: 4,
    lore: "Servers that never sleep.",
    incantation: "app.listen(3000, () => cast());",
  },
  {
    name: "SQL",
    school: "offensive",
    mastery: 4,
    lore: "Asks the old archives questions.",
    incantation: "SELECT * FROM memories;",
  },
  {
    name: "Docker",
    school: "defensive",
    mastery: 4,
    lore: "Seals magic in tidy vessels.",
    incantation: "docker compose up -d",
  },
  {
    name: "CI / CD",
    school: "defensive",
    mastery: 4,
    lore: "Wards that run on every push.",
    incantation: "on: [push, pull_request]",
  },
  {
    name: "AWS",
    school: "defensive",
    mastery: 3,
    lore: "Borrowed power from distant lands.",
    incantation: "aws s3 sync ./dist s3://field",
  },
  {
    name: "Git",
    school: "utility",
    mastery: 5,
    lore: "Remembers every step of the journey.",
    incantation: 'git commit -m "plant flowers"',
  },
];

export const projects: Project[] = [
  {
    title: "Grimoire",
    year: "2026",
    summary:
      "A markdown knowledge base with instant search and backlinks — a spellbook for engineering teams.",
    stack: ["React", "TypeScript", "SQLite", "Tauri"],
    repo: "https://github.com/your-handle/grimoire",
    live: "https://example.com",
    caption: "the spellbook",
  },
  {
    title: "Blue Moon",
    year: "2025",
    summary:
      "Real-time garden sensor dashboard. Streams soil and light data, and blooms an alert when plants need care.",
    stack: ["Next.js", "WebSockets", "Postgres"],
    repo: "https://github.com/your-handle/blue-moon",
    caption: "field data, live",
  },
  {
    title: "Zoltraak CLI",
    year: "2025",
    summary:
      "A tiny, fast CLI that scaffolds typed APIs from an OpenAPI file. Ordinary magic that saves hours.",
    stack: ["Node.js", "TypeScript", "OpenAPI"],
    repo: "https://github.com/your-handle/zoltraak",
    caption: "ordinary magic",
  },
  {
    title: "Party Finder",
    year: "2024",
    summary:
      "Matches people to study groups by schedule and interests. Accessible-first, PWA, offline-ready.",
    stack: ["React", "Express", "MongoDB"],
    live: "https://example.com",
    caption: "find your party",
  },
  {
    title: "Aureole",
    year: "2024",
    summary:
      "A generative-art playground: write a few lines of code, get a printable poster in royal blue.",
    stack: ["Canvas", "GLSL", "Vite"],
    repo: "https://github.com/your-handle/aureole",
    caption: "light experiments",
  },
  {
    title: "Journey Log",
    year: "2023",
    summary:
      "A minimal travel journal with maps, photos and a timeline. My first real full-stack app.",
    stack: ["Vue", "Firebase", "Mapbox"],
    repo: "https://github.com/your-handle/journey-log",
    caption: "where it began",
  },
];

export const journey = {
  title: ["The journey", "*so far.*"],
  ribbon: "ten years is a blink — but the memories stay ✦ keep walking ✦ ",
  waypoints: [
    {
      period: "2026 — present",
      role: "Full-Stack Developer",
      place: "Independent Projects",
      summary:
        "Building scalable, end-to-end web applications. Shipped a full-stack budget tracker and BulSU_Navigation, a campus routing app using PostGIS.",
      tags: ["React", "Node.js", "Supabase", "Docker"],
    },
    {
      period: "2024 — Present",
      role: "B.Sc. Information Technology",
      place: "Bulacan State University",
      summary:
        "Studying core software engineering principles while actively building real-world, Philippine-based solutions to build my portfolio.",
      tags: ["Web Development", "Systems Architecture", "UI/UX"],
    },
  ] satisfies Waypoint[],
};

export const contact = {
  title: ["Shall we go on", "an *adventure?*"],
  blurb:
    "Open to full-time roles, freelance work and interesting side quests. My inbox is always open — I reply faster than an elf would.",
  links: [
    {
      label: "email",
      value: "marqueznathanreigh@gmail.com",
      href: "mailto:marqueznathanreigh@gmail.com",
      copy: true,
    },
    {
      label: "github",
      value: "@ray-xxv",
      href: "https://github.com/ray-xxv",
    },
    {
      label: "linkedin",
      value: "/in/nathan-reigh-marquez/",
      href: "https://linkedin.com/in/nathan-reigh-marquez/",
    },
    { label: "resume", value: "resume.pdf", href: "./resume.pdf" },
  ] satisfies Link[],
  signoff: "return <Memories forever />;",
};

export const nav = [
  { id: "hero", file: "hero.tsx", label: "Home" },
  { id: "grimoire", file: "grimoire.ts", label: "About" },
  { id: "projects", file: "projects/", label: "Projects" },
  { id: "journey", file: "journey.log", label: "Journey" },
  { id: "contact", file: "contact.sh", label: "Contact" },
] as const;
