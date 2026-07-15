"""Seed the clause_types taxonomy (requirements §5.5 / §6.2) and a sample
contract so a fresh install never starts empty. Idempotent."""

from pathlib import Path

from sqlmodel import Session, select

from app.models import ClauseType, Document, DocumentFormat, Sentence
from app.segmentation import segment_text

SEED_CLAUSE_TYPES: list[dict[str, str]] = [
    {
        "name": "Limitation of Liability",
        "description": "Caps or excludes a party's liability for damages.",
        "color": "#b45309",
    },
    {
        "name": "Termination for Convenience",
        "description": "Allows a party to end the agreement without cause on notice.",
        "color": "#1d4ed8",
    },
    {
        "name": "Confidentiality",
        "description": "Restricts disclosure or use of the other party's confidential information.",
        "color": "#0f766e",
    },
    {
        "name": "Non-Compete",
        "description": "Restricts a party from engaging in competing business activities.",
        "color": "#7c3aed",
    },
    {
        "name": "Governing Law",
        "description": "Designates the jurisdiction whose law governs the agreement.",
        "color": "#be123c",
    },
    {
        "name": "Non-Solicitation",
        "description": "Restricts soliciting the other party's employees or customers.",
        "color": "#0369a1",
    },
    {
        "name": "IP Assignment",
        "description": "Assigns intellectual property created under the agreement.",
        "color": "#9333ea",
    },
]


SEED_DATA_DIR = Path(__file__).parent / "seed_data"

# Shipped with the image and inserted only when the documents table has no rows
# at all, so a user's own uploads and deletions are never touched.
SEED_DOCUMENTS: list[str] = ["01-master-services-agreement.txt"]


def seed_clause_types(session: Session) -> None:
    existing = set(session.exec(select(ClauseType.name)).all())
    for entry in SEED_CLAUSE_TYPES:
        if entry["name"] not in existing:
            session.add(
                ClauseType(
                    name=entry["name"],
                    description=entry["description"],
                    color=entry["color"],
                )
            )
    session.commit()


def seed_example_documents(session: Session) -> None:
    if session.exec(select(Document.id).limit(1)).first() is not None:
        return
    for filename in SEED_DOCUMENTS:
        raw_text = (SEED_DATA_DIR / filename).read_text(encoding="utf-8")
        session.add(
            Document(
                filename=filename,
                format=DocumentFormat(Path(filename).suffix.lstrip(".")),
                raw_text=raw_text,
                sentences=[
                    Sentence(
                        ordinal=ordinal,
                        char_start=span.char_start,
                        char_end=span.char_end,
                        text=span.text,
                    )
                    for ordinal, span in enumerate(segment_text(raw_text))
                ],
            )
        )
    session.commit()
