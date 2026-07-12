# AGENTS.md — legartis-ui

Angular 21 component library built on **spartan/ui** (helm layer). This file tells AI agents how to
work in this repo. Keep it accurate when you change conventions.

## What this is
- A shadcn-style component library: the styled component source lives in **`libs/ui/<name>/`** and is
  **owned by this repo** (edit it directly — do not treat it as a black-box dependency).
- Accessible behavior comes from `@spartan-ng/brain` (Angular CDK under the hood). Do not reimplement it.
- Styling is **Tailwind CSS v4** utilities + **semantic CSS variables**.
- **`llms.txt`** at the repo root is the machine-readable catalog of all 57 components (alias, import
  bundle, selectors). Read it before using or adding components.

## Project layout
```
libs/ui/<name>/src/
  index.ts                 # public exports + `Hlm<Name>Imports` bundle
  lib/*.ts                 # component/directive source (you own this)
  lib/<name>.stories.ts    # Storybook story (co-located)
projects/playground/       # host app + Storybook (build target for Storybook)
  src/styles.css           # Tailwind entry + ALL theme variables
  .storybook/              # Storybook config
components.json            # spartan CLI config (componentsPath=libs/ui, importAlias=@spartan-ng/helm)
```

## Using components
- Import from the alias `@spartan-ng/helm/<name>` and spread the bundle into a standalone component's
  `imports`, e.g. `imports: [...HlmButtonImports]`.
- Apply the selector (see `llms.txt`): most are attribute directives (`<button hlmBtn>`, `<input hlmInput>`)
  or custom elements (`<hlm-checkbox>`).

## Adding a new spartan component
- Use the CLI (do not hand-copy): `pnpm ui <name>` (alias for `ng g @spartan-ng/cli:ui <name>`).
- It writes to `libs/ui/<name>/` and registers the tsconfig path alias automatically.

## Theming — the one rule that matters
- **All colors are CSS variables in `projects/playground/src/styles.css`** (`:root` and `:root.dark`).
- To rebrand, change `--primary` / `--primary-foreground` (OKLCH). Everything using `bg-primary` /
  `text-primary` follows.
- **Never hardcode hex/rgb colors in components.** Use the semantic tokens: `bg-background`,
  `text-foreground`, `bg-primary`, `bg-muted`, `text-muted-foreground`, `border`, `bg-destructive`, etc.
- Tailwind must see `libs/ui` — that's why `styles.css` has `@source "../../../libs/ui";`. Keep it.

## Storybook
- Stories are co-located at `libs/ui/<name>/src/lib/<name>.stories.ts` (also picked up from
  `projects/playground/src`). Titles: `Components/<Name>` or `Foundations/<Name>`.
- Pattern: `moduleMetadata({ imports: [...Hlm<Name>Imports] })` + a `render` returning `{ template }`.
- Run `pnpm storybook`; build `pnpm build-storybook`. The theme toolbar toggles light/dark.

## Conventions
- Angular: standalone components, signals, `input()/output()`, `strict` TypeScript. No NgModules.
- Prefer editing helm source over wrapping it. Wrap only to bake in brand defaults shared app-wide.
- After changing components or stories, verify with `pnpm build-storybook` before declaring done.

## Environment note
- Node here is 22.22.1, so the workspace is pinned to **Angular 21** (Angular 22 needs Node ≥22.22.3).
  Bump Node to move to Angular 22.
