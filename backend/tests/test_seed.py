"""Seeding: a fresh database gets the sample contract; user data is never touched."""

from sqlalchemy.pool import StaticPool
from sqlmodel import Session, SQLModel, create_engine, select

from app.models import Document, DocumentFormat, Sentence
from app.seed import SEED_DOCUMENTS, seed_example_documents


def make_session() -> Session:
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    return Session(engine)


def test_seeds_sample_document_into_empty_db() -> None:
    with make_session() as session:
        seed_example_documents(session)

        documents = session.exec(select(Document)).all()
        assert [d.filename for d in documents] == SEED_DOCUMENTS
        sentences = session.exec(
            select(Sentence).where(Sentence.document_id == documents[0].id)
        ).all()
        assert sentences
        for sentence in sentences:  # offsets slice back out of the verbatim text
            raw = documents[0].raw_text
            assert raw[sentence.char_start : sentence.char_end] == sentence.text


def test_seed_is_idempotent() -> None:
    with make_session() as session:
        seed_example_documents(session)
        seed_example_documents(session)
        assert len(session.exec(select(Document)).all()) == len(SEED_DOCUMENTS)


def test_seed_skips_when_documents_exist() -> None:
    with make_session() as session:
        session.add(
            Document(filename="user.txt", format=DocumentFormat.txt, raw_text="Hello.")
        )
        session.commit()

        seed_example_documents(session)

        documents = session.exec(select(Document)).all()
        assert [d.filename for d in documents] == ["user.txt"]
