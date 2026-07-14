"""Engine, session dependency, and database initialization."""

import os
from typing import Annotated, Iterator

from fastapi import Depends
from sqlmodel import Session, SQLModel, create_engine

# Matches the `db` service in docker-compose.yml (published on host port 5433);
# localhost works for local dev with `docker compose up db`.
DATABASE_URL = os.environ.get(
    "DATABASE_URL",
    "postgresql+psycopg://postgres:postgres@localhost:5433/clause_tracker",
)

engine = create_engine(DATABASE_URL, pool_pre_ping=True)


def init_db() -> None:
    from app.seed import seed_clause_types, seed_example_documents

    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        seed_clause_types(session)
        seed_example_documents(session)


def get_session() -> Iterator[Session]:
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]
