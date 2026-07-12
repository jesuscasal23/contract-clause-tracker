"""Seed the clause_types taxonomy (requirements §5.5 / §6.2). Idempotent."""

from sqlmodel import Session, select

from app.models import ClauseType

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


def seed_clause_types(session: Session) -> None:
    existing = set(session.exec(select(ClauseType.name)).all())
    for entry in SEED_CLAUSE_TYPES:
        if entry["name"] not in existing:
            session.add(ClauseType(**entry))
    session.commit()
