# CLAUDE.md

This project's agent guidance lives in **@AGENTS.md**. Read it before working here.

Machine-readable component catalog (all 57 components): **llms.txt** at the frontend root (`frontend/llms.txt`).

Quick facts:
- Angular 21 + spartan/ui (helm) component library; component source is owned in `libs/ui/<name>/`.
- Theme via CSS variables in `libs/ui/theme.css` (shared by `projects/app` and `projects/storybook-host`) — change `--primary` to rebrand.
- Storybook: `pnpm storybook` (dev) / `pnpm build-storybook` (verify). Stories co-located in `libs/ui`.
- Verify changes with `pnpm build-storybook` before declaring done.
