from fastapi import APIRouter, HTTPException, status
from sqlmodel import select

from app.database import SessionDep
from app.models import ClauseType
from app.schemas import ClauseTypeCreate, ClauseTypeRead

router = APIRouter(prefix="/clause-types", tags=["clause-types"])


@router.get("", response_model=list[ClauseTypeRead])
def list_clause_types(session: SessionDep) -> list[ClauseType]:
    return list(session.exec(select(ClauseType).order_by(ClauseType.name)).all())


@router.post("", response_model=ClauseTypeRead, status_code=status.HTTP_201_CREATED)
def create_clause_type(payload: ClauseTypeCreate, session: SessionDep) -> ClauseType:
    duplicate = session.exec(
        select(ClauseType).where(ClauseType.name == payload.name)
    ).first()
    if duplicate:
        raise HTTPException(
            status.HTTP_409_CONFLICT, f"Clause type '{payload.name}' already exists"
        )
    clause_type = ClauseType.model_validate(payload)
    session.add(clause_type)
    session.commit()
    session.refresh(clause_type)
    return clause_type
