# ArtMostSphere (frontend)

Frontend for ArtMostSphere, a Nigerian film-production marketplace: locations,
gear rental and sale, cast/talent hire, casting calls, an AI shoot planner and
bookings. Talks to a separate backend API.

## Stack

- Next.js (App Router), React, TypeScript (strict), `src/` dir, `@/*` alias
- Tailwind CSS v4; design tokens (colour, font, radius) as CSS variables in
  `src/app/globals.css`, with light / dark / system themes via `data-theme` on `<html>`
- zod (validation), react-hook-form + @hookform/resolvers (forms)
- @tanstack/react-query (server state; provider in `src/app/providers.tsx`)
- clsx + tailwind-merge via `cn()` in `src/lib/utils.ts`
- ESLint (eslint-config-next) + Prettier with prettier-plugin-tailwindcss
- API client: generated later with hey-api into `src/lib/api/` (see its README)

## Getting started

```bash
pnpm install
cp .env.example .env.local   # set NEXT_PUBLIC_API_URL
pnpm dev
```

## Scripts

| Script           | What it does                         |
| ---------------- | ------------------------------------ |
| `pnpm dev`       | Start the dev server                 |
| `pnpm build`     | Production build                     |
| `pnpm start`     | Serve the production build           |
| `pnpm lint`      | ESLint                               |
| `pnpm typecheck` | Generate route types, then `tsc`     |
| `pnpm format`    | Prettier (write)                     |
