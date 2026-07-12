from fastapi import APIRouter, HTTPException, status
from sqlmodel import Session, select

from app.database import SessionDep
from app.models import Annotation, ClauseType, Sentence
from app.schemas import AnnotationCreate, AnnotationRead, AnnotationUpdate

router = APIRouter(prefix="/annotations", tags=["annotations"])


def _ensure_no_duplicate(session: Session, sentence_id: int, clause_type_id: int) -> None:
    duplicate = session.exec(
        select(Annotation).where(
            Annotation.sentence_id == sentence_id,
            Annotation.clause_type_id == clause_type_id,
        )
    ).first()
    if duplicate:
        raise HTTPException(
            status.HTTP_409_CONFLICT,
            "This sentence already has an annotation of this clause type",
        )


@router.post("", response_model=AnnotationRead, status_code=status.HTTP_201_CREATED)
def create_annotation(payload: AnnotationCreate, session: SessionDep) -> Annotation:
    sentence = session.get(Sentence, payload.sentence_id)
    if not sentence:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Sentence not found")
    if not session.get(ClauseType, payload.clause_type_id):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Clause type not found")
    _ensure_no_duplicate(session, payload.sentence_id, payload.clause_type_id)

    annotation = Annotation(
        sentence_id=payload.sentence_id,
        clause_type_id=payload.clause_type_id,
        char_start=sentence.char_start,  # offset provenance, copied at label time
        char_end=sentence.char_end,
    )
    session.add(annotation)
    session.commit()
    session.refresh(annotation)
    return annotation


@router.patch("/{annotation_id}", response_model=AnnotationRead)
def update_annotation(
    annotation_id: int, payload: AnnotationUpdate, session: SessionDep
) -> Annotation:
    annotation = session.get(Annotation, annotation_id)
    if not annotation:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Annotation not found")

    if (
        payload.clause_type_id is not None
        and payload.clause_type_id != annotation.clause_type_id
    ):
        if not session.get(ClauseType, payload.clause_type_id):
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Clause type not found")
        _ensure_no_duplicate(session, annotation.sentence_id, payload.clause_type_id)
        annotation.clause_type_id = payload.clause_type_id
    if payload.status is not None:
        annotation.status = payload.status

    session.add(annotation)
    session.commit()
    session.refresh(annotation)
    return annotation


@router.delete("/{annotation_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_annotation(annotation_id: int, session: SessionDep) -> None:
    annotation = session.get(Annotation, annotation_id)
    if not annotation:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Annotation not found")
    session.delete(annotation)
    session.commit()
