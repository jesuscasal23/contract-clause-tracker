# Contract Clause Tracker — Project Context & Handoff

> **Read this first.** It gives an agent (or teammate) the full context of this project:
> the task, every decision made so far, where the files live, what is done, and what is
> next. Deep specs live in [`requirements.md`](./requirements.md); this is the orientation
> map. Last updated: 2026-07-12.

---

## 1. What this is

A take-home **job-interview case study** for **Legartis** (Swiss legal-tech, Zurich),
Full-Stack role. We are building a **Contract Clause Tracker**: legal teams upload
contracts and label which sentences are which *clause types* (e.g. "Limitation of
Liability", "Termination for Convenience", "Non-Compete"), then search/filter/group them.

The interviewers will **extend it live in a pair-programming session by adding an
automatic labeling step** — so every decision is made to make that step drop in cleanly.

### The brief (summary)
- **Upload** contracts (plain text / markdown).
- **View & label**: user labels *single sentences* with a clause type.
- **Dashboard**: document list with search, filter, grouping.
- **Stack**: Python backend (FastAPI preferred, "minimal"), **Angular** frontend, SQLite
  or Postgres, **Docker + docker-compose** (`docker-compose up` must work).
- **Judged on**: clean code structure, reasonable API, an **intuitive/self-explaining/
  appealing UX for labeling**, and a DB schema fitting the domain.
- **Bonus**: tests for critical paths; notes on how to extend (scaling, AI features).
- **Deliverables**: GitHub repo + README (setup + design decisions).
- **Time budget**: 3–4 hours; backend should be minimal.

---

## 2. Key locations — ⚠️ the project spans TWO folders

| What | Path |
|---|---|
| **Docs & specs** (this file, requirements, sketches, example contracts) | `~/Desktop/contract-clause-tracker/docs/` |
| **Angular design library** (Spartan-NG, being re-skinned to Legartis brand) | `~/legartis-ui/` |
| Backend app (FastAPI) | `~/Desktop/contract-clause-tracker/backend/` (**done** — see §6) |
| Frontend app that consumes the library | `contract-clause-tracker/frontend/projects/app/` (consolidated; `~/legartis-ui` kept intact as the original library) |

### Files that exist now
```
~/Desktop/contract-clause-tracker/docs/
├── PROJECT-CONTEXT.md                     ← you are here (handoff)
├── requirements.md                        ← full spec: interpretation, data model, API, UI, theming
├── 01-master-services-agreement.txt       ← example contract (LoL, Termination, Confidentiality, Governing Law)
├── 02-employment-agreement.md             ← example contract (Non-Compete, Non-Solicitation, IP, At-Will)
├── 03-saas-subscription-agreement.txt     ← example contract (LoL, Termination, SLA, Data/Privacy)
└── ui-sketches/
    ├── option-a-two-pane.html             ← interactive sketch: two-pane layout
    └── option-b-inline-popover.html       ← interactive sketch: focused reading + popover

~/legartis-ui/                             ← Spartan-NG library (Angular 21, Tailwind v4, ~58 components)
├── projects/playground/src/styles.css     ← ★ design tokens; RE-SKINNED to Legartis brand (see §5)
├── libs/ui/<component>/src/lib/*.stories.ts ← 58 components, each with a Storybook story
└── projects/playground/.storybook/        ← Storybook config
```
The example contracts intentionally embed the target clause types among filler sentences
and include segmentation traps (`Inc.`, `LLC`, `e.g.`, `99.9%`, `$185,000`, `Section 3.2`)
to stress the sentence splitter.

---

## 3. Decision log (locked)

1. **"A clause is a single sentence" — interpretation.** This constrains the *unit of
   annotation*, not the *definition of a clause*. Most sentences carry **no** label; only a
   few are tagged with a clause type from a fixed taxonomy. The job (human, then model) is
   to find the needle sentences. Not "every sentence is a clause."

2. **Data model — "offset-carrying hybrid of Proposal A".** Materialize sentences as rows
   (simple UI, human+model share identical units, trivial dashboard queries) **and** copy
   character offsets onto each annotation. Sentence-anchoring keeps the MVP simple; stored
   offsets mean a future "free spans" requirement is a constraint-relaxation + mechanical
   migration, not a rewrite. Full schema in `requirements.md` §6. Core tables:
   `documents`, `sentences`, `clause_types` (seeded taxonomy), `annotations` (with
   `source` user|model, `status` confirmed|suggested|rejected, `confidence`). The
   `source/status/confidence` columns are what let manual and automatic labels share one
   pipeline with human-in-the-loop review — the key enabler for the follow-up step.

3. **UI — "two-pane + in-place popover" (hybrid).** Persistent right sidebar (clause-type
   palette + live "clauses in this document" summary) from the two-pane sketch, combined
   with a click-a-sentence → in-place popover labeling gesture from the popover sketch.
   Model suggestions (future) render as dashed highlights with Accept/Reject. Details in
   `requirements.md` §5. Three screens: dashboard, upload (modal + honest loading state
   for transfer + segmentation), labeling view.

4. **Design system — reuse the `legartis-ui` Spartan-NG library**, re-skinned to the
   Legartis brand, instead of building components from scratch. It is a shadcn/ui port for
   Angular: token-driven, so re-skinning ~all components happens in one CSS file.

5. **Theming decisions** (this session): keep **Lucide** icons (not Phosphor); **skip dark
   mode** (Legartis site is light-only); use **exact hex** values (not oklch).

---

## 4. Data model / API / UI — quick pointers

- **Data model**: `requirements.md` §6 (schema DDL, entity notes, rationale).
- **API design**: `requirements.md` §7 (FastAPI endpoints incl. `POST /documents`,
  `GET /documents` with search/filter/group, `POST /annotations`, `PATCH /annotations/{id}`
  for accept/reject, future `POST /documents/{id}/auto-label`).
- **UI/UX**: `requirements.md` §5 + the two HTML sketches (open in a browser).
- **Automatic-labeling expansion**: `requirements.md` §8.

---

## 5. Legartis brand tokens (exact, extracted from live legartis.ai Webflow CSS)

Applied to `~/legartis-ui/projects/playground/src/styles.css` (the `:root` light block).

| Token | Value | Meaning |
|---|---|---|
| `--primary` / `--ring` | `#fa5b05` | brand orange (also focus ring) |
| `--primary-foreground` | `#ffffff` | text on orange |
| `--foreground` | `#22252b` | cool near-black text |
| `--muted-foreground` | `#6e7483` | secondary text |
| `--border` / `--input` | `#ececec` | hairline borders |
| `--secondary` / `--muted` | `#f6f6f6` | light surfaces |
| `--accent` | `#f3f3f3` | neutral hover surface |
| `--background` / `--card` / `--popover` | `#ffffff` | white |
| `--destructive` | `#ea384c` | brand red |
| `--radius` | `0.5rem` | → button 6px / card 8px |
| `--font-sans` | `Geist, …` | brand typeface |

Extra brand colors for component polish: orange hover `#d14424` / `#ff6d1d` / `#ff7a18`,
soft amber `#f8d47a`. Legartis uses Geist for **all** text (headings + body + UI). Radii:
button `.375rem`, card/input `.5rem`, pills fully rounded.

---

## 6. Current status

**Done**
- ✅ Interpretation, data model, and UI direction decided and documented.
- ✅ `requirements.md` written (overview → data model → API → UI → theming → extensions).
- ✅ Three example contracts created.
- ✅ Two interactive UI sketches created; hybrid direction chosen.
- ✅ Design library located (`~/legartis-ui`) and **re-skinned to Legartis brand** in
  `styles.css` (primary orange, neutrals, radius, Geist font, orange focus ring). Lucide
  kept, dark mode untouched, exact hex used.
- ✅ **Backend built** at `contract-clause-tracker/backend/` (FastAPI + SQLModel + SQLite,
  per §6/§7 of `requirements.md` — no spec deviations). Sentences segmented once at upload
  with `pysbd` (per-line blocks; markdown headings kept whole; emphasis markers removed
  via an offset map so `Inc.**` doesn't split); every stored offset verified to slice back
  out of the verbatim `raw_text`. All §7 endpoints incl. `?search/clause_type/status/
  group_by=clause_type`; `POST /documents/{id}/auto-label` scaffolded as a documented 501
  stub for the pair session. Seeded 7 clause types (ink hex in `clause_types.color`;
  frontend derives the tint). Dashboard summaries exclude `rejected` annotations unless
  `?status=rejected`. 22 pytest tests green (upload/segmentation traps, annotation
  lifecycle + unique constraint, dashboard queries, cascade delete); verified end-to-end
  with curl. `backend/Dockerfile` + root `docker-compose.yml` (backend on :8000, named
  volume for SQLite; frontend service slot noted). See `backend/README.md`.
- ✅ **Frontend built & verified** as a new `app` project inside the `~/legartis-ui`
  Angular workspace (`projects/app/`, added to `angular.json` alongside `playground`;
  reuses `libs/ui` Spartan components + the re-skinned tokens). Angular 21 standalone +
  **zoneless** (workspace has no zone.js) + signals. Three screens: dashboard
  (search/filter-by-clause/group-by, client-side over the list; upload modal with the
  two-phase "Uploading… / Analyzing sentences…" loader), and the hybrid labeling view
  (two-pane: document + persistent sidebar palette & live summary; in-place popover
  labeling gesture; clause highlights tinted from `clause_type.color`; **suggestion seam**
  = dashed highlight + Accept/Reject wired to `PATCH` for the auto-label step). Typed
  `ApiService` normalizes the backend's per-sentence-nested annotations into a flat list
  and unwraps `{documents:[…]}`. API base overridable via `window.__API_BASE__` (default
  `http://localhost:8000`). Builds clean (`ng build app`); **verified end-to-end in
  headless Chrome**: upload → segment → label two sentences → highlights + sidebar counts
  + dashboard chips + backend persistence all confirmed. Uses Lucide/inline SVG icons.
- ✅ **Consolidated into one deliverable repo**: `~/legartis-ui` copied to
  `contract-clause-tracker/frontend/` (deps/caches/git excluded; `pnpm install` re-run);
  production `ng build app` verified from the new location. Original `~/legartis-ui` intact.
- ✅ **Docker**: `frontend/Dockerfile` (multi-stage pnpm build → nginx; SPA fallback via
  `frontend/nginx.conf`) + `frontend` service in `docker-compose.yml` (`4200:80`,
  `depends_on: backend`). Frontend image **built and smoke-tested** (serves the app shell;
  `/documents/5` deep-link → index.html fallback → 200; hashed assets resolve).
- ✅ **Top-level `README.md`** (quick start, architecture, design decisions, API, dev,
  testing, extension notes).

- ✅ **`docker compose up --build` verified end-to-end**: both containers healthy
  (frontend nginx `:4200`, backend uvicorn `:8000`); backend seeds 7 clause types on a
  fresh named volume. Drove the **containerized production build** in headless Chrome with
  **real CORS** (no bypass) — upload → segment (25 sentences) → label 2 clauses → persisted
  via cross-origin fetch. `RESULT_OK`.
- ✅ **Pushed to GitHub (public)**: https://github.com/jesuscasal23/contract-clause-tracker
  (`main`). `.gitignore` keeps deps/venv/db/build output out (540 files, 3.6 MB committed).

- ✅ **Polish**: brand favicon (`projects/app/public/favicon.svg`, orange "C" — removes the
  `/favicon.ico` 404) and a primary-button hover → `#d14424` (`--primary-hover` token +
  an app-level rule, since the library's default variant only hovers anchors). Both
  verified in the running container.

**Pending / not started**
- ⬜ Further component polish (e.g. card shadow) + clause-palette reharmonization vs. orange
  (`requirements.md` §5.5).

---

## 7. How to run / verify

- **Storybook (design library)**: from `~/legartis-ui`, `pnpm install` then
  `pnpm storybook` (script: `ng run playground:storybook`). Uses **pnpm** (see
  `packageManager`). This is how to eyeball the Legartis re-skin across all components.
- **Sketches**: open the `.html` files in `docs/ui-sketches/` directly in a browser.
- **Backend**: `cd backend && .venv/bin/uvicorn app.main:app --reload` (or
  `docker-compose up` from the repo root); docs at `http://localhost:8000/docs`;
  tests via `.venv/bin/python -m pytest`.
- **Frontend**: from `~/legartis-ui`, `pnpm install` then `pnpm ng serve app` → serves the
  Contract Clause Tracker at `http://localhost:4200` (it calls the backend at `:8000`; the
  backend CORS already allows `:4200`). Run the backend first. NOTE: an unrelated
  `todo-app` may already be squatting `:8000`/`:4200` — stop it first, or the app won't
  reach its API. Build check: `pnpm ng build app`.

**Gotchas**
- Library is at `~/legartis-ui`, **not** on the Desktop. The old `~/Desktop/todo-app/
  todo-frontend` is an unrelated bare Angular scaffold — ignore it.
- Tailwind v4 + Spartan-NG: components read the CSS variables in `styles.css`; changing a
  token re-skins everything. `@source "../../../libs/ui"` registers the component classes.
- Keep brand values as exact hex per the decision.

---

## 8. The follow-up (pair-programming session)

The interviewers will add **automatic labeling** live. Our design already accommodates it
with no schema change: `POST /documents/{id}/auto-label` runs a model over the document's
sentences and inserts annotations with `source='model', status='suggested', confidence`.
The UI shows these as dashed highlights with Accept/Reject; accept→`confirmed`,
reject→`rejected`. Model approaches: few-shot LLM classification per sentence, embeddings +
nearest clause type, or a classifier trained on accumulated confirmed labels. See
`requirements.md` §8.

---

## 9. TL;DR for a new agent

Read `requirements.md`, open the two sketches, then continue from §6 "Pending". The
concept, data model, API, UI, and brand theming are all decided and documented; the
remaining work is **building** the backend, the frontend app (on top of the re-skinned
`~/legartis-ui` library), Docker, tests, and README — for a Legartis interview case study
whose graded centerpiece is an intuitive sentence-labeling UX.
