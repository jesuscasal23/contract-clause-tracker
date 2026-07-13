# Contract Clause Tracker

A small full-stack app that helps legal teams track **which contracts contain which types
of clauses**. Users upload contracts (plain text / Markdown), label individual sentences
with a clause type (e.g. *Limitation of Liability*, *Termination for Convenience*,
*Non-Compete*), and browse everything from a single workspace with search, filtering and
grouping.

It's designed so an **automatic labeling** step (a model that proposes clause labels a human
reviews) drops in later with no schema change.

---

## Quick start

```bash
docker compose up --build
```

- **App** → http://localhost:4200
- **API docs** (Swagger) → http://localhost:8000/docs

> Ports **4200** and **8000** must be free. `docker compose up` starts the Angular frontend
> (nginx) and the FastAPI backend; the browser loads the app from `:4200` and calls the API
> at `:8000` (the backend's CORS allow-list already includes `http://localhost:4200`).

A fresh database is seeded with one sample contract so the app never starts empty. Try the
other sample contracts in [`docs/`](docs/) (`02-employment-agreement.md`,
`03-saas-subscription-agreement.txt`).

---

## What it does

1. **Upload** a `.txt` / `.md` contract. The backend stores the text verbatim and segments
   it into sentences once, on upload.
2. **Label** clause-bearing sentences: click a sentence → an in-place popover → pick a
   clause type. Labels show as colored highlights; a sidebar lists all clauses in the doc.
3. **Browse**: every document with its clause counts, plus search, filter-by-clause, and
   group-by-clause.

Everything happens on **one three-column workspace**: a left panel with the searchable
document list (search + filter + group + upload), the document/labeling view in the center,
and the clause palette + per-document summary on the right. Picking a document on the left
swaps the center — there is no separate landing page, and `/documents/:id` deep-links work.

---

## Architecture

```
┌────────────────────┐        HTTP/JSON        ┌──────────────────────────┐
│  Angular 21 (SPA)  │  ───────────────────▶   │  FastAPI + SQLModel      │
│  Spartan-NG UI     │  ◀───────────────────   │  PostgreSQL              │
│  re-skinned to     │                         │  pysbd segmentation      │
│  the Legartis brand│                         └──────────────────────────┘
└────────────────────┘
   nginx :4200                                       uvicorn :8000
```

- **Backend** — Python, **FastAPI** + **SQLModel** (SQLAlchemy + Pydantic) over **PostgreSQL**.
  Sentence segmentation with **pysbd** (legal text is full of `Inc.`, `e.g.`, `99.9%`,
  `Section 3.2`). Minimal by design.
- **Frontend** — **Angular 21** (standalone, **zoneless**, signals) built on a **Spartan-NG**
  component library (the Angular port of shadcn/ui), **re-skinned to the Legartis brand** via
  CSS design tokens. The workspace also ships a **Storybook** design-system playground.

---

## Repository layout

```
contract-clause-tracker/
├── backend/                # FastAPI service (app/, tests/, Dockerfile, README)
│   └── app/                #   models, schemas, routers, segmentation, seed
├── frontend/               # Angular workspace (Spartan-NG library + the app)
│   ├── projects/app/       #   ★ the Contract Clause Tracker UI (3-column workspace)
│   ├── libs/ui/            #   57 Spartan-NG components (owned source + Storybook stories)
│   ├── Dockerfile          #   multi-stage: pnpm build → nginx
│   └── nginx.conf
├── docs/                   # requirements, design context, sample contracts, UI sketches
│   ├── requirements.md     #   full spec (data model, API, UI, theming)
│   ├── PROJECT-CONTEXT.md  #   decision log + status handoff
│   └── ui-sketches/        #   the two explored labeling UIs
└── docker-compose.yml
```

---

## Design decisions

**"A clause is a single sentence" — the unit, not the definition.** Most sentences carry
*no* label; only a few are tagged with a clause type from a fixed, seeded taxonomy. The
system's job — for the human now, and a model later — is to find the *needle* sentences.

**Data model: an "offset-carrying hybrid".** Sentences are materialized as rows (so the UI
and a future model reference identical, stable units, and dashboard queries stay trivial),
**and** each annotation copies the sentence's character offsets. Sentence-anchoring keeps the
MVP simple; the stored offsets mean a future "free-span" requirement is a constraint
relaxation + mechanical migration rather than a rewrite. Tables: `documents`, `sentences`,
`clause_types` (seeded), `annotations`.

**Manual and automatic labels share one pipeline.** `annotations` carries `source`
(`user`|`model`), `status` (`confirmed`|`suggested`|`rejected`) and `confidence` from day
one. Automatic labeling becomes: insert `source='model', status='suggested'` rows; the UI
renders them as dashed **suggestions** with **Accept/Reject** (a `PATCH`). Human-in-the-loop
review is exactly what legal teams need — and it needs no schema change.

**UI: a single labeling workspace.** A persistent right sidebar (clause palette + live
"clauses in this document" summary) combined with an in-place popover on the clicked
sentence; the document list lives in a persistent left panel, so switching documents never
leaves the page. See `docs/ui-sketches/` for the two options that led here.

**Reused a design system, re-skinned to the brand.** Rather than build components from
scratch, the app consumes a Spartan-NG library whose entire look is driven by CSS tokens; the
brand palette (orange `#fa5b05`, cool-slate neutrals, Geist, tight radii) was taken from the
live Legartis site and applied in one token block.

More detail: [`docs/requirements.md`](docs/requirements.md) and
[`docs/PROJECT-CONTEXT.md`](docs/PROJECT-CONTEXT.md).

---

## API

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/documents` | Upload a `.txt`/`.md` file → stores, segments, returns the document. |
| `GET` | `/documents` | Document list (per-doc clause summary). Query: `search`, `clause_type`, `status`, `group_by=clause_type`. |
| `GET` | `/documents/{id}` | Document + sentences (with their annotations). |
| `DELETE` | `/documents/{id}` | Delete a document (cascades). |
| `GET` | `/clause-types` | The seeded clause taxonomy. |
| `POST` | `/annotations` | Create a label `{sentence_id, clause_type_id}`. |
| `PATCH` | `/annotations/{id}` | Change type / accept / reject (`status`). |
| `DELETE` | `/annotations/{id}` | Remove a label. |
| `POST` | `/documents/{id}/auto-label` | Scaffolded `501` stub for the automatic-labeling step. |

Interactive docs at `/docs` when the backend is running.

---

## Local development (without Docker)

**Backend**
```bash
cd backend
python -m venv .venv && .venv/bin/pip install -r requirements.txt
.venv/bin/uvicorn app.main:app --reload      # http://localhost:8000
.venv/bin/python -m pytest                    # tests
```

**Frontend**
```bash
cd frontend
pnpm install
pnpm ng serve app                             # http://localhost:4200 (needs the backend on :8000)
pnpm ng build app                             # production build
pnpm storybook                                # optional: the design-system playground
```

---

## Testing

- **Backend** — `pytest` covers the critical paths: upload + segmentation (incl. offset
  round-trips and abbreviation traps), the annotation lifecycle + unique constraint, and the
  dashboard search/filter/group queries.
- **Frontend** — the app builds clean and was driven end-to-end in headless Chrome
  (upload → segment → label → persistence → document-list chips → delete).

---

## Extending it

**Automatic labeling (the planned next step).** `POST /documents/{id}/auto-label` runs a
classifier over the document's sentences and inserts `source='model', status='suggested'`
annotations with a confidence. The UI already renders suggestions and Accept/Reject. Model
options, cheapest first: few-shot LLM classification per sentence; embeddings + nearest
clause-type prototype; or a classifier fine-tuned on the accumulated *confirmed* labels
(the accept/reject stream is a ready-made training signal).

**Scaling.** Add a full-text index for document search; run segmentation and auto-labeling
as background jobs for large docs; introduce multi-user auth + an audit trail (who labeled
what, when); paginate the dashboard.

**Product.** Free (multi-/sub-sentence) spans by relaxing the sentence-boundary constraint;
clause export (CSV/JSON); cross-corpus clause search and diffing.
