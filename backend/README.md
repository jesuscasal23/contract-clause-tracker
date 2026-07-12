# Contract Clause Tracker — Backend

FastAPI + SQLModel + SQLite backend for the Contract Clause Tracker. Uploaded
contracts are stored verbatim, segmented into sentences once (pysbd), and sentences
are labeled with clause types from a seeded taxonomy.

## Run locally

```bash
cd backend
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/uvicorn app.main:app --reload
```

API at http://localhost:8000 (interactive docs at `/docs`). The SQLite file lives at
`backend/data/clause_tracker.db` (override with `DATABASE_URL`). Tables are created
and the clause-type taxonomy seeded on startup; both are idempotent.

Or from the repository root:

```bash
docker-compose up
```

## Tests

```bash
.venv/bin/python -m pytest
```

Covers the critical paths: upload → segmentation (offsets slice back to the sentence
text, legal-text traps like `Inc.`, `e.g.,`, `99.9%`, `$185,000`), annotation
create/update/delete (defaults, offset copy, unique constraint), and dashboard
search / filter / group-by / cascade delete. Tests run against an in-memory SQLite.

## API

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/documents` | Upload `.txt`/`.md` (multipart). Stores verbatim text, segments, returns document + sentences. |
| `GET` | `/documents` | Dashboard list with per-document clause summary. Query: `search`, `clause_type` (id), `status`, `group_by=clause_type`. |
| `GET` | `/documents/{id}` | Document + sentences + nested annotations (labeling view). |
| `DELETE` | `/documents/{id}` | Delete document; sentences and annotations cascade. |
| `POST` | `/documents/{id}/auto-label` | Scaffold (501) for the automatic-labeling step. |
| `GET` | `/clause-types` | The seeded taxonomy. |
| `POST` | `/clause-types` | Add a clause type (name + hex color). |
| `POST` | `/annotations` | Label a sentence: `{sentence_id, clause_type_id}` → `source='user'`, `status='confirmed'`, offsets copied from the sentence. |
| `PATCH` | `/annotations/{id}` | Change `status` (accept/reject) and/or `clause_type_id`. |
| `DELETE` | `/annotations/{id}` | Remove a label. |

## Design notes

- **Data model** ("offset-carrying hybrid", spec §6): `documents` keep `raw_text`
  verbatim; `sentences` are materialized once at upload with `(ordinal, char_start,
  char_end, text)` so human and model share stable, identical units; `annotations`
  link a sentence to a clause type and **copy the sentence's offsets at label time**
  — provenance that makes a future free-span requirement a constraint relaxation,
  not a rewrite. `UNIQUE(sentence_id, clause_type_id)` blocks duplicates while
  allowing multiple different clause types per sentence.
- **Auto-labeling ready**: `annotations.source` (`user`/`model`), `status`
  (`confirmed`/`suggested`/`rejected`) and `confidence` let manual and model labels
  share one table and one review flow. `POST /documents/{id}/auto-label` is a
  documented 501 stub: insert `source='model', status='suggested', confidence=p`,
  then the UI accepts/rejects via `PATCH /annotations/{id}`.
- **Segmentation** (`app/segmentation.py`): pysbd (legal-text aware: `Inc.`, `e.g.`,
  decimals, section numbers) run per line block; markdown headings become one span
  and emphasis markers are removed for segmentation through an index map so offsets
  always index into the verbatim raw text. Every span is verified to slice back out
  of `raw_text`. Deterministic; imperfect splits on exotic input are a documented
  limitation.
- **Status semantics**: dashboard summaries exclude `rejected` annotations unless
  `?status=rejected` is asked for explicitly.
- **Kept out on purpose** (minimal backend): no auth, no Alembic (schema is created
  on startup), no Postgres (schema is portable), no pagination (corpus-scale MVP).
