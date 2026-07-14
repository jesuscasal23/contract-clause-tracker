# Contract Clause Tracker — Requirements & Design

> Status: draft for implementation. Owner: (candidate). Last updated: 2026-07-12.

## 1. Overview

Legal teams need to track which contracts contain which **types of clauses** (e.g.
"Limitation of Liability", "Termination for Convenience", "Non-Compete"). This
application lets a user upload contracts, read them, label individual sentences with a
clause type, and browse/search/filter/group the resulting labels across all documents.

A later iteration adds an **automatic labeling** step (a model proposes clause labels the
user reviews). The data model below is designed so that manual and automatic labels flow
through the same pipeline with no schema change.

## 2. Problem interpretation — "a clause is a single sentence"

The brief simplifies a clause to a single sentence. This constrains the **unit of
annotation**, not the **definition of a clause**:

- A document is segmented into sentences.
- **Most sentences carry no label.** They are ordinary prose.
- A small number of sentences are tagged as an instance of a clause type drawn from a
  fixed, seeded taxonomy.

The system's job — for both the human and, later, the model — is to find the *needle*
sentences (the ones that genuinely are a Limitation of Liability, etc.) among the hay. The
label space therefore has an implicit "none" for the vast majority of sentences.

## 3. User goals

- **Upload** a plain-text or Markdown contract and have it ready to label in seconds.
- **Label** clause-bearing sentences quickly and unambiguously while reading.
- **Review** at a glance which clauses were marked in a given document.
- **Find** documents by which clause types they contain, across the whole corpus.

## 4. Functional requirements

### 4.1 Upload
- Accept `.txt` and `.md` files.
- On upload the server stores the raw text verbatim and segments it into sentences once.
- The UI shows a loading state during upload + segmentation, then routes to the document.

### 4.2 Document view & labeling
- Render the document with each sentence individually selectable.
- Selecting a sentence and choosing a clause type creates a label; labels are shown as
  colored highlights keyed to the clause type.
- A sentence's label can be changed or removed.
- The view surfaces **all clauses marked in this document** (grouped by clause type).

### 4.3 Dashboard
- List all documents with, per document, a summary of clause types present and counts.
- **Search**: by filename and by document text.
- **Filter**: by clause type (documents that contain clause type X), and by label status.
- **Group**: by clause type (see all documents/labels under each type).

## 5. UI / UX design

The brief is graded primarily on UX ("intuitive, self-explaining, appealing" and
"supports the user with labeling"). The design below optimizes for a fast, discoverable
labeling loop and an always-visible per-document overview.

### 5.1 Screen inventory

1. **Dashboard** — corpus overview and entry point; document list with search / filter /
   group, and the primary "＋ Upload" action.
2. **Upload** — a modal (drop-zone + file picker), not a separate page, with an explicit
   loading state; on success it routes straight into the labeling view.
3. **Labeling view** — the core screen where the user reads a document and labels
   sentences. Design detailed in 5.2.

### 5.2 Labeling interaction — two-pane + in-place popover (chosen)

A hybrid of the two explored sketches (see 5.6): the persistent overview of the two-pane
layout combined with the single-click, in-place labeling gesture of the popover.

**Layout**
- **Left — document panel.** The contract rendered for reading, with each sentence a
  discrete, hoverable, clickable target. Section headings are visually distinct and not
  labelable.
- **Right — persistent sidebar**, always visible, with two stacked cards:
  - **Clause types** — the seeded taxonomy shown as a color legend/palette.
  - **Clauses in this document** — a live summary grouped by clause type with counts;
    clicking an entry scrolls to and highlights the sentence. This directly satisfies the
    "clear way to see all clauses marked per document" requirement with zero extra clicks.

**Gesture**
- Click a sentence → a small **popover anchored at that sentence** opens listing the clause
  types; one click applies the label. If the sentence is already labeled, the popover also
  offers **change type** and **remove**.
- The sidebar summary and the sentence's highlight update immediately.

**Visual encoding**
- Every clause type has a **stable color token** (5.5). A labeled sentence shows a colored
  highlight/left-border plus a small inline text tag with the clause-type name.
- Color is **always reinforced by the text tag** — never color-only — for accessibility.
- **Model suggestions (future, Section 8)** render distinctly, e.g. a dashed/muted
  highlight with inline **Accept / Reject** controls, so proposed vs. confirmed labels are
  never confused.

**Optional niceties (time-permitting)**
- Number keys (1–9) apply the corresponding clause type to the focused sentence; `Esc`
  closes the popover.

### 5.3 Upload & loading

- "＋ Upload" (dashboard and top bar) opens a modal accepting `.txt` / `.md` via drag-drop
  or file picker; it validates type and size client-side.
- On submit, show a loading state that honestly covers the two real waits — **file
  transfer** and **server-side sentence segmentation** (e.g. "Uploading…" → "Analyzing
  sentences…"). On completion, route to the new document's labeling view.
- Handle and surface errors (unsupported type, empty file, server error) inline in the
  modal.

### 5.4 Dashboard

- One row/card per document showing filename, upload date, sentence count, and **clause-
  type chips with counts**.
- **Search** — matches filename and document text.
- **Filter** — by clause type (documents that contain type X; multi-select) and by label
  status.
- **Group** — toggle to group by clause type, nesting the matching documents/labels under
  each type heading.
- An **empty state** on first visit guiding the user to upload their first contract.

### 5.5 Visual system

- **Neutral, professional** palette suited to legal work; generous reading typography in the
  labeling view.
- **Clause-type color tokens** (seed set; ink = text/border, bg = highlight):

  | Clause type | Ink | Highlight |
  |---|---|---|
  | Limitation of Liability | `#b45309` | `#fef3c7` |
  | Termination for Convenience | `#1d4ed8` | `#dbeafe` |
  | Confidentiality | `#0f766e` | `#ccfbf1` |
  | Non-Compete | `#7c3aed` | `#ede9fe` |
  | Governing Law | `#be123c` | `#ffe4e6` |

  Colors live in the `clause_types.color` column so the taxonomy and its encoding stay in
  one place and new types get a color on creation.
- **Accessibility** — labels carry a text tag in addition to color; maintain sufficient
  contrast; all actions reachable by keyboard.

### 5.6 Sketch references

Two interactive HTML sketches informed this decision (in `docs/ui-sketches/`):
- `option-a-two-pane.html` — two-pane layout with a persistent summary sidebar.
- `option-b-inline-popover.html` — focused reading with an in-place popover + summary drawer.

The chosen design in 5.2 combines A's **persistent summary sidebar** with B's **in-place
popover gesture**.

## 6. Data model — offset-carrying hybrid (chosen)

Rationale recap: we materialize sentences as rows (simple, intuitive UI; human and model
share identical units; trivial dashboard queries) **and** copy character offsets onto each
annotation. Sentence-anchoring keeps the MVP simple; the stored offsets mean a future
requirement for free (multi-/sub-sentence) spans is a constraint relaxation + mechanical
migration, not a rewrite. In effect, our annotation is a *constrained special case* of a
general offset-span annotation: "must align to a sentence boundary."

### 6.1 Schema (PostgreSQL; dialect-portable — tests run on in-memory SQLite)

```sql
CREATE TABLE documents (
    id          INTEGER PRIMARY KEY,
    filename    TEXT    NOT NULL,
    format      TEXT    NOT NULL CHECK (format IN ('txt', 'md')),
    raw_text    TEXT    NOT NULL,          -- stored verbatim; offsets index into this
    created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE sentences (
    id          INTEGER PRIMARY KEY,
    document_id INTEGER NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    ordinal     INTEGER NOT NULL,          -- 0-based position within the document
    char_start  INTEGER NOT NULL,          -- offset into documents.raw_text
    char_end    INTEGER NOT NULL,
    text        TEXT    NOT NULL,          -- denormalized convenience copy
    UNIQUE (document_id, ordinal)
);

CREATE TABLE clause_types (
    id          INTEGER PRIMARY KEY,
    name        TEXT    NOT NULL UNIQUE,   -- e.g. "Limitation of Liability"
    description TEXT,
    color       TEXT    NOT NULL,          -- UI highlight color (hex)
    is_active   INTEGER NOT NULL DEFAULT 1,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE annotations (
    id             INTEGER PRIMARY KEY,
    sentence_id    INTEGER NOT NULL REFERENCES sentences(id) ON DELETE CASCADE,
    clause_type_id INTEGER NOT NULL REFERENCES clause_types(id),
    char_start     INTEGER NOT NULL,       -- copied from the sentence at label time
    char_end       INTEGER NOT NULL,       --   (offset provenance for future spans)
    source         TEXT    NOT NULL DEFAULT 'user'
                        CHECK (source IN ('user', 'model')),
    confidence     REAL,                   -- NULL for user labels; 0..1 for model
    status         TEXT    NOT NULL DEFAULT 'confirmed'
                        CHECK (status IN ('confirmed', 'suggested', 'rejected')),
    created_at     TEXT    NOT NULL DEFAULT (datetime('now')),
    UNIQUE (sentence_id, clause_type_id)
);

CREATE INDEX idx_sentences_document  ON sentences(document_id);
CREATE INDEX idx_annotations_sentence ON annotations(sentence_id);
CREATE INDEX idx_annotations_type     ON annotations(clause_type_id);
```

### 6.2 Entities

- **documents** — one uploaded contract. `raw_text` is frozen at upload; all offsets index
  into it, so the stored text must never be normalized after the fact.
- **sentences** — deterministic segmentation of a document, computed once at upload. Stable
  IDs are the unit both the UI and the model reference.
- **clause_types** — the seeded, controlled taxonomy. It is simultaneously the dashboard's
  filter/group vocabulary and the model's fixed output space. Seed with the three examples
  plus a handful more (Confidentiality, Governing Law, IP Assignment, Non-Solicitation).
- **annotations** — the link between a sentence and a clause type. First-class `source`,
  `status`, and `confidence` let manual and automatic labels share one table and one review
  flow. `UNIQUE(sentence_id, clause_type_id)` prevents duplicates while still allowing a
  sentence to hold multiple *different* clause types (many-to-many).

### 6.3 Key decisions

- Clause types are a **lookup table**, never free text.
- Segmentation is **deterministic and done once**; use a real sentence splitter (e.g.
  `pysbd` or spaCy) rather than a naive regex, because legal text is full of `Inc.`, `e.g.`,
  `No.`, decimals, and section numbers. Imperfect segmentation is a documented limitation.
- The schema supports **many labels per sentence**, but the MVP UI keeps it to one label
  per action for clarity.

## 7. API design (FastAPI)

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/documents` | Upload a file (multipart). Stores text, segments, returns document + sentences. |
| `GET` | `/documents` | Dashboard list. Query: `search`, `clause_type`, `status`, `group_by`. Returns per-doc clause summary. |
| `GET` | `/documents/{id}` | Document + sentences + annotations for the labeling view. |
| `DELETE` | `/documents/{id}` | Remove a document and its labels. |
| `GET` | `/clause-types` | List the taxonomy (for the palette / filters). |
| `POST` | `/clause-types` | (Optional) add a clause type. |
| `POST` | `/annotations` | Create a label `{sentence_id, clause_type_id}` → `source='user', status='confirmed'`. |
| `PATCH` | `/annotations/{id}` | Update status (accept/reject a suggestion) or clause type. |
| `DELETE` | `/annotations/{id}` | Remove a label. |

## 8. Planned expansion — automatic labeling

The pair-programming step adds a model that proposes labels. It slots in with **no schema
change**:

1. `POST /documents/{id}/auto-label` runs the model over the document's sentences.
2. For each predicted clause it inserts an annotation with
   `source='model', status='suggested', confidence=<p>`.
3. The labeling UI renders suggestions distinctly (e.g. dashed highlight) and lets the user
   **accept** (`status → confirmed`) or **reject** (`status → rejected`) — the human-in-the-
   loop review legal teams require.
4. Accept/reject decisions are retained as a feedback signal for future evaluation or
   fine-tuning.

Model options range from few-shot LLM classification per sentence, to an embedding +
nearest-clause-type approach, to a fine-tuned classifier trained on the accumulated
confirmed labels.

## 9. Tech stack & non-functional

- **Backend**: Python + FastAPI. Keep it minimal (the brief asks for minimal backend code).
- **Frontend**: Angular.
- **Database**: PostgreSQL (compose `db` service, published on host `:5433`); the schema is
  dialect-portable — tests run on in-memory SQLite so they need no server.
- **Containerization**: `Dockerfile` per service + `docker-compose.yml` → `docker compose up`.
- **Tests**: cover the critical paths — upload+segmentation, create/delete annotation,
  dashboard filter/group queries.

## 10. Assumptions & out of scope

- Single user, no authentication (not requested; noted as an extension).
- English-language contracts.
- One sentence = the atomic labelable unit (per the brief's simplification).
- No document versioning or editing of `raw_text` after upload.

## 11. Future extensions

- Free (multi-/sub-sentence) spans by relaxing the sentence-boundary constraint.
- Automatic labeling (Section 8) and active-learning from confirmed labels.
- Multi-user, roles, and audit trail (who labeled what, when).
- Export (CSV/JSON) of clauses for downstream review.
- Scale: full-text search index, background segmentation for large docs, dashboard pagination.

## 12. Theming — Legartis brand (applied)

The Angular UI is built on the **`legartis-ui`** Spartan-NG component library (vendored in
`frontend/`, Angular 21 + Tailwind v4, 57 components). Theming is centralized in
`libs/ui/theme.css` via shadcn-style CSS variables. The values below were
extracted from the live legartis.ai Webflow site and have been applied:

- **Primary / brand**: `#fa5b05` (orange); focus `--ring` also orange.
- **Text / neutrals**: `#22252b` (foreground), `#6e7483` (muted), borders `#ececec`,
  surfaces `#f6f6f6` / `#f3f3f3`, background `#ffffff`.
- **Radius**: `--radius: 0.5rem` → buttons 6px, cards/inputs 8px.
- **Font**: **Geist** via `--font-sans` (dev loads Google Fonts; production should
  self-host `@fontsource-variable/geist` to match Legartis).
- **Icons**: **Lucide** (kept; `@ng-icons/lucide`) — not switching to Phosphor.
- **Dark mode**: out of scope (site is light-only); library dark block left at defaults.
- Values are **exact hex** (not oklch) for brand fidelity.

Component-level polish still pending: button hover → `#d14424`, badge/clause chips, card
borders/shadow, tabs active state, popover shadow. The clause-type highlight palette
(§5.5) will be reharmonized so semantic label colors sit well beside the orange primary.

See `docs/PROJECT-CONTEXT.md` for the full cross-session handoff.
