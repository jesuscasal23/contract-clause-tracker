"""Engine, session dependency, and database initialization."""

import os
from pathlib import Path
from typing import Annotated, Iterator

from fastapi import Depends
from sqlalchemy import event
from sqlmodel import Session, SQLModel, create_engine

DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///./data/clause_tracker.db")

if DATABASE_URL.startswith("sqlite:///./"):
    Path(DATABASE_URL.removeprefix("sqlite:///./")).parent.mkdir(parents=True, exist_ok=True)

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})


@event.listens_for(engine, "connect")
def _enable_sqlite_foreign_keys(dbapi_connection, _record) -> None:
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()


def init_db() -> None:
    from app.seed import seed_clause_types

    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        seed_clause_types(session)


def get_session() -> Iterator[Session]:
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]
