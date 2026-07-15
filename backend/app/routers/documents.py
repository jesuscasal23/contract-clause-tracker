from pathlib import Path
from typing import Literal

from fastapi import APIRouter, HTTPException, Query, UploadFile, status
from sqlmodel import col, func, or_, select

from app.database import SessionDep
from app.models import (
    Annotation,
    AnnotationStatus,
    ClauseType,
    Document,
    DocumentFormat,
    Sentence,
)
from app.schemas import (
    ClauseCount,
    ClauseTypeGroup,
    ClauseTypeRead,
    DocumentDetail,
    DocumentListResponse,
    DocumentSummary,
    GroupedDocumentListResponse,
)
from app.segmentation import segment_text

router = APIRouter(prefix="/documents", tags=["documents"])

ALLOWED_EXTENSIONS: dict[str, DocumentFormat] = {
    ".txt": DocumentFormat.txt,
    ".md": DocumentFormat.md,
}


def _get_document_or_404(document_id: int, session: SessionDep) -> Document:
    document = session.get(Document, document_id)
    if not document:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Document not found")
    return document


@router.post("", response_model=DocumentDetail, status_code=status.HTTP_201_CREATED)
async def upload_document(file: UploadFile, session: SessionDep) -> Document:
    suffix = Path(file.filename or "").suffix.lower()
    if suffix not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            f"Unsupported file type '{suffix or '(none)'}'; only .txt and .md are accepted",
        )
    try:
        raw_text = (await file.read()).decode("utf-8")
    except UnicodeDecodeError:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "File is not valid UTF-8 text")
    if not raw_text.strip():
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "File is empty")

    document = Document(
        filename=file.filename or f"untitled{suffix}",
        format=ALLOWED_EXTENSIONS[suffix],
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
    session.add(document)
    session.commit()
    session.refresh(document)
    return document


@router.get("", response_model=DocumentListResponse | GroupedDocumentListResponse)
def list_documents(
    session: SessionDep,
    search: str | None = Query(default=None, description="Match filename or text"),
    clause_type: int | None = Query(default=None, description="Clause type id"),
    annotation_status: AnnotationStatus | None = Query(default=None, alias="status"),
    group_by: Literal["clause_type"] | None = None,
) -> DocumentListResponse | GroupedDocumentListResponse:
    statement = select(Document)
    if search:
        pattern = f"%{search}%"
        statement = statement.where(
            or_(
                col(Document.filename).ilike(pattern),
                col(Document.raw_text).ilike(pattern),
            )
        )
    documents = session.exec(
        statement.order_by(col(Document.created_at).desc(), col(Document.id).desc())
    ).all()

    sentence_counts = dict(
        session.exec(
            select(Sentence.document_id, func.count(col(Sentence.id))).group_by(
                col(Sentence.document_id)
            )
        ).all()
    )

    # One aggregate over all annotations: rejected ones are excluded from summaries
    # unless explicitly filtered for via ?status=rejected.
    annotation_counts = select(
        Sentence.document_id,
        Annotation.clause_type_id,
        func.count(col(Annotation.id)),
    ).join(Sentence, col(Annotation.sentence_id) == col(Sentence.id))
    if annotation_status:
        annotation_counts = annotation_counts.where(
            Annotation.status == annotation_status
        )
    else:
        annotation_counts = annotation_counts.where(
            Annotation.status != AnnotationStatus.rejected
        )
    annotation_counts = annotation_counts.group_by(
        col(Sentence.document_id), col(Annotation.clause_type_id)
    )
    counts_by_document: dict[int, dict[int, int]] = {}
    for document_id, clause_type_id, count in session.exec(annotation_counts).all():
        counts_by_document.setdefault(document_id or 0, {})[clause_type_id] = count

    clause_types = {
        ct.id: ct for ct in session.exec(select(ClauseType)).all() if ct.id is not None
    }

    summaries = []
    for document in documents:
        type_counts = counts_by_document.get(document.id or 0, {})
        if clause_type is not None and clause_type not in type_counts:
            continue
        summaries.append(
            DocumentSummary(
                id=document.id or 0,
                filename=document.filename,
                format=document.format,
                created_at=document.created_at,
                sentence_count=sentence_counts.get(document.id or 0, 0),
                clause_summary=[
                    ClauseCount(
                        clause_type_id=type_id,
                        name=clause_types[type_id].name,
                        color=clause_types[type_id].color,
                        count=count,
                    )
                    for type_id, count in sorted(
                        type_counts.items(), key=lambda item: clause_types[item[0]].name
                    )
                ],
            )
        )

    if group_by != "clause_type":
        return DocumentListResponse(documents=summaries)

    groups = []
    for type_id, ct in sorted(clause_types.items(), key=lambda item: item[1].name):
        matching = [
            summary
            for summary in summaries
            if any(entry.clause_type_id == type_id for entry in summary.clause_summary)
        ]
        if matching:
            groups.append(
                ClauseTypeGroup(
                    clause_type=ClauseTypeRead.model_validate(ct), documents=matching
                )
            )
    return GroupedDocumentListResponse(groups=groups)


@router.get("/{document_id}", response_model=DocumentDetail)
def get_document(document_id: int, session: SessionDep) -> Document:
    return _get_document_or_404(document_id, session)


@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_document(document_id: int, session: SessionDep) -> None:
    document = _get_document_or_404(document_id, session)
    session.delete(document)  # sentences + annotations cascade
    session.commit()


@router.post("/{document_id}/auto-label", status_code=status.HTTP_501_NOT_IMPLEMENTED)
def auto_label_document(document_id: int, session: SessionDep) -> None:
    """Scaffold for the automatic-labeling step (requirements §8).

    Planned contract: run a classifier over the document's sentences and insert
    one annotation per predicted clause with source='model', status='suggested'
    and a confidence in [0, 1]. The labeling UI then renders these as dashed
    suggestions with Accept (status -> confirmed) / Reject (status -> rejected)
    via PATCH /annotations/{id}. No schema change is required.
    """
    _get_document_or_404(document_id, session)
    raise HTTPException(
        status.HTTP_501_NOT_IMPLEMENTED,
        "Automatic labeling is not implemented yet; see the endpoint docstring "
        "for the planned contract",
    )
