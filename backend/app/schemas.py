"""Request/response models for the API."""

import re
from datetime import datetime

from pydantic import field_validator
from sqlmodel import SQLModel

from app.models import AnnotationSource, AnnotationStatus, DocumentFormat

_HEX_COLOR = re.compile(r"^#[0-9a-fA-F]{6}$")

# --- clause types ---


class ClauseTypeRead(SQLModel):
    id: int
    name: str
    description: str | None
    color: str
    is_active: bool
    created_at: datetime


class ClauseTypeCreate(SQLModel):
    name: str
    description: str | None = None
    color: str

    @field_validator("name")
    @classmethod
    def name_not_blank(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("name must not be blank")
        return value

    @field_validator("color")
    @classmethod
    def color_is_hex(cls, value: str) -> str:
        if not _HEX_COLOR.match(value):
            raise ValueError("color must be a hex value like #b45309")
        return value


# --- annotations ---


class AnnotationRead(SQLModel):
    id: int
    sentence_id: int
    clause_type_id: int
    char_start: int
    char_end: int
    source: AnnotationSource
    confidence: float | None
    status: AnnotationStatus
    created_at: datetime


class AnnotationCreate(SQLModel):
    sentence_id: int
    clause_type_id: int


class AnnotationUpdate(SQLModel):
    status: AnnotationStatus | None = None
    clause_type_id: int | None = None


# --- documents ---


class SentenceRead(SQLModel):
    id: int
    ordinal: int
    char_start: int
    char_end: int
    text: str


class SentenceWithAnnotations(SentenceRead):
    annotations: list[AnnotationRead] = []


class DocumentRead(SQLModel):
    id: int
    filename: str
    format: DocumentFormat
    created_at: datetime


class DocumentDetail(DocumentRead):
    raw_text: str
    sentences: list[SentenceWithAnnotations]


class ClauseCount(SQLModel):
    clause_type_id: int
    name: str
    color: str
    count: int


class DocumentSummary(DocumentRead):
    sentence_count: int
    clause_summary: list[ClauseCount]


class DocumentListResponse(SQLModel):
    documents: list[DocumentSummary]


class ClauseTypeGroup(SQLModel):
    clause_type: ClauseTypeRead
    documents: list[DocumentSummary]


class GroupedDocumentListResponse(SQLModel):
    groups: list[ClauseTypeGroup]
