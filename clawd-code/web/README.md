# `web/`

Next.js 14 web dashboard for Clawd Code (package name `claude-code-web`) — a browser-based console, distinct from the terminal (Ink/React) UI in [`src/`](../src).

## Stack

- **Next.js 14** (App Router) + **React 18**
- **Zustand** for client state, **SWR** for data fetching
- **Radix UI** primitives (`react-collapsible`, `react-dialog`, `react-dropdown-menu`, …) + **Tailwind CSS**

## Layout

```
web/
├── app/            Next.js App Router routes
├── components/     UI components
├── hooks/          React hooks
├── lib/            Client utilities
├── public/         Static assets
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

## Commands

```bash
cd web
npm run dev          # next dev --port 3000
npm run build        # next build
npm run start         # next start
npm run lint          # next lint
npm run type-check    # tsc --noEmit
```

Also buildable from the monorepo root via `bun run build:web` (see [`scripts/README.md`](../scripts/README.md)). This is the same web terminal referenced by [`docker/README.md`](../docker/README.md) for containerized deployment (`ANTHROPIC_API_KEY`-gated).
