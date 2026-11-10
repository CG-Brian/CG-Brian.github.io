# Brian Jeong — Portfolio

Next.js (App Router) · TypeScript · Tailwind CSS v4 · MDX · Motion. Implements `brian_jeong_portfolio_spec_v1.md`.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (Vercel-compatible)
npm run typecheck
```

## Editing content

- **All text and entries:** `lib/portfolio-data.ts` (profile, links, skills, tokens, projects, research).
- **Case studies:** `content/projects/<slug>.mdx` and `content/research/<slug>.mdx`.
  Use `<Placeholder>` for unwritten parts and `<Note>` for qualifiers such as confidentiality.
- **Portrait:** put the image in `public/` and set `profile.portrait` (e.g. `"/portrait.jpg"`).
- **Social / resume links:** set `href` on `profile.links`. `null` renders as "link pending".

To add a project or research entry: add an object to `projects` / `research`, then add the matching MDX file.
The block, index row and `/projects/<slug>` route are generated automatically.

## Network lines

`lib/network.ts` defines boundary anchors (fractions of viewport height) where lines cross between
sections. Each section's `ConnectionLayer` draws Bézier paths between those edge anchors and elements
marked with `data-anchor`.
