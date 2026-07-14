# frontend — Angular workspace

Two projects share this workspace and the `libs/ui` Spartan-NG component library:

- **`projects/app`** — the Contract Clause Tracker UI (what `docker compose up` serves
  on `:4200` via nginx).
- **`projects/storybook-host`** — a host app that exists only to mount Storybook for the
  component library; it is never shipped.

The workspace uses **pnpm** (see `packageManager` in `package.json`).

## Commands

```bash
pnpm install
pnpm ng serve app        # dev server → http://localhost:4200 (expects the API on :8000)
pnpm ng build app        # production build → dist/app
pnpm storybook           # component workbench → http://localhost:6006
pnpm build-storybook     # static Storybook build (the library's verify step)
pnpm ui <name>           # add a spartan/ui component into libs/ui/<name>
```

## Layout & conventions

- Component source is **owned** in `libs/ui/<name>/` (shadcn-style) — edit it directly;
  Storybook stories are co-located with each component.
- All theme tokens live in `libs/ui/theme.css` — the single source of truth, imported by
  both projects' `styles.css`. Never hardcode colors in components.
- `AGENTS.md` has the full conventions; `llms.txt` is the machine-readable catalog of all
  57 components (import alias, directive bundle, selectors).
