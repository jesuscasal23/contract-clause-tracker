"""SQLModel tables implementing the offset-carrying hybrid schema (requirements §6)."""

from datetime import datetime, timezone
from enum import Enum
from typing import ClassVar

from sqlmodel import Field, Relationship, SQLModel, UniqueConstraint


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class DocumentFormat(str, Enum):
    txt = "txt"
    md = "md"


class AnnotationSource(str, Enum):
    user = "user"
    model = "model"


class AnnotationStatus(str, Enum):
    confirmed = "confirmed"
    suggested = "suggested"
    rejected = "rejected"


class Document(SQLModel, table=True):
    __tablename__: ClassVar[str] = "documents"

    id: int | None = Field(default=None, primary_key=True)
    filename: str
    format: DocumentFormat
    raw_text: str  # stored verbatim; all offsets index into this
    created_at: datetime = Field(default_factory=utcnow)

    sentences: list["Sentence"] = Relationship(
        back_populates="document",
        cascade_delete=True,
        sa_relationship_kwargs={"order_by": "Sentence.ordinal"},
    )


class Sentence(SQLModel, table=True):
    __tablename__: ClassVar[str] = "sentences"
    __table_args__ = (UniqueConstraint("document_id", "ordinal"),)

    id: int | None = Field(default=None, primary_key=True)
    document_id: int = Field(foreign_key="documents.id", ondelete="CASCADE", index=True)
    ordinal: int  # 0-based position within the document
    char_start: int  # offset into documents.raw_text
    char_end: int
    text: str  # denormalized convenience copy

    document: Document = Relationship(back_populates="sentences")
    annotations: list["Annotation"] = Relationship(
        back_populates="sentence", cascade_delete=True
    )


class ClauseType(SQLModel, table=True):
    __tablename__: ClassVar[str] = "clause_types"

    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(unique=True, index=True)
    description: str | None = None
    color: str  # ink hex, e.g. "#b45309"; the UI derives the highlight tint
    is_active: bool = True
    created_at: datetime = Field(default_factory=utcnow)


class Annotation(SQLModel, table=True):
    __tablename__: ClassVar[str] = "annotations"
    __table_args__ = (UniqueConstraint("sentence_id", "clause_type_id"),)

    id: int | None = Field(default=None, primary_key=True)
    sentence_id: int = Field(foreign_key="sentences.id", ondelete="CASCADE", index=True)
    clause_type_id: int = Field(foreign_key="clause_types.id", index=True)
    char_start: int  # copied from the sentence at label time (offset provenance)
    char_end: int
    source: AnnotationSource = AnnotationSource.user
    confidence: float | None = None  # NULL for user labels; 0..1 for model labels
    status: AnnotationStatus = AnnotationStatus.confirmed
    created_at: datetime = Field(default_factory=utcnow)

    sentence: Sentence = Relationship(back_populates="annotations")
