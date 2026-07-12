from pathlib import Path
from typing import Iterator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import event
from sqlalchemy.pool import StaticPool
from sqlmodel import Session, SQLModel, create_engine

from app.database import get_session
from app.main import app
from app.seed import seed_clause_types

DOCS_DIR = Path(__file__).resolve().parents[2] / "docs"


@pytest.fixture()
def client() -> Iterator[TestClient]:
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    event.listen(
        engine, "connect", lambda conn, _rec: conn.execute("PRAGMA foreign_keys=ON")
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        seed_clause_types(session)

    def get_session_override() -> Iterator[Session]:
        with Session(engine) as session:
            yield session

    app.dependency_overrides[get_session] = get_session_override
    # No context manager: skip lifespan so tests never touch the real database file.
    yield TestClient(app)
    app.dependency_overrides.clear()


def upload_contract(client: TestClient, name: str) -> dict:
    path = DOCS_DIR / name
    response = client.post(
        "/documents",
        files={"file": (name, path.read_bytes(), "text/plain")},
    )
    assert response.status_code == 201, response.text
    return response.json()
