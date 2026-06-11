# Beyond the Badge

Astro website for Beyond the Badge, a cultural brand partnerships studio. The site is built as a static Astro app with TinaCMS-backed content editing.

## Tech stack

- [Astro](https://astro.build/) for static pages and components
- [TinaCMS](https://tina.io/) for editable JSON and Markdown content
- GSAP and Lenis for page transitions, reveal animation, and smooth scrolling
- Node.js `>=22.12.0`

## Getting started

Install dependencies from the lockfile:

```sh
npm ci
```

Start the local development server with TinaCMS:

```sh
npm run dev
```

By default Astro serves the site at `http://localhost:4321`.

## Useful commands

| Command | Action |
| :-- | :-- |
| `npm ci` | Install dependencies from `package-lock.json` |
| `npm run dev` | Start TinaCMS and the Astro dev server |
| `npm run build` | Build the static site to `dist/` |
| `npm run build:cms` | Build TinaCMS when Tina credentials are present, then build Astro |
| `npm run preview` | Preview the production build locally |
| `npm run astro -- --help` | Show Astro CLI help |

## Project structure

```text
/
├── content/              # Tina-managed JSON content for page sections
├── public/               # Static assets served from the site root
├── src/
│   ├── components/       # Astro components for homepage and shared sections
│   ├── content/          # Markdown collections for services and testimonials
│   ├── layouts/          # Shared page layout and global browser scripts
│   ├── pages/            # Route entry points
│   └── styles/           # Global styles and design tokens
├── tina/                 # TinaCMS schema and editor configuration
└── astro.config.mjs
```

## Content editing

Most page copy is stored in `content/*.json` and is exposed through the TinaCMS schema in `tina/config.tsx`. Service and testimonial entries live in Markdown collections under:

- `src/content/services/`
- `src/content/testimonials/`

The content collection schemas are defined in `src/content.config.ts`.

## Build and deployment

The app is configured with the production site URL `https://beyondthebadge.co.uk` in `astro.config.mjs`.

Use `npm run build` for a standard static build. In environments with TinaCloud credentials, use `npm run build:cms`; it runs the TinaCMS build step only when `TINA_CLIENT_ID` is available, then builds Astro.

Local environment files such as `.env` and `.env.local` are intentionally ignored because they may contain TinaCloud secrets.
