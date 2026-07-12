"""Critical path: create/update/delete annotations — source/status defaults,
offset copy from the sentence, and the (sentence, clause type) unique constraint."""

import pytest

from tests.conftest import upload_contract


@pytest.fixture()
def sentence(client) -> dict:
    document = upload_contract(client, "01-master-services-agreement.txt")
    return next(
        s for s in document["sentences"] if "In no event shall either party" in s["text"]
    )


def clause_type_id(client, name: str) -> int:
    types = client.get("/clause-types").json()
    return next(ct["id"] for ct in types if ct["name"] == name)


def test_create_annotation_defaults_and_offset_copy(client, sentence):
    ct_id = clause_type_id(client, "Limitation of Liability")
    response = client.post(
        "/annotations",
        json={"sentence_id": sentence["id"], "clause_type_id": ct_id},
    )
    assert response.status_code == 201, response.text
    annotation = response.json()
    assert annotation["source"] == "user"
    assert annotation["status"] == "confirmed"
    assert annotation["confidence"] is None
    assert annotation["char_start"] == sentence["char_start"]
    assert annotation["char_end"] == sentence["char_end"]


def test_duplicate_annotation_conflicts(client, sentence):
    ct_id = clause_type_id(client, "Limitation of Liability")
    payload = {"sentence_id": sentence["id"], "clause_type_id": ct_id}
    assert client.post("/annotations", json=payload).status_code == 201
    assert client.post("/annotations", json=payload).status_code == 409
    # A different clause type on the same sentence is allowed (many-to-many).
    other = clause_type_id(client, "Confidentiality")
    assert (
        client.post(
            "/annotations",
            json={"sentence_id": sentence["id"], "clause_type_id": other},
        ).status_code
        == 201
    )


def test_create_annotation_unknown_references(client, sentence):
    ct_id = clause_type_id(client, "Confidentiality")
    assert (
        client.post(
            "/annotations", json={"sentence_id": 99999, "clause_type_id": ct_id}
        ).status_code
        == 404
    )
    assert (
        client.post(
            "/annotations",
            json={"sentence_id": sentence["id"], "clause_type_id": 99999},
        ).status_code
        == 404
    )


def test_patch_status_and_clause_type(client, sentence):
    lol = clause_type_id(client, "Limitation of Liability")
    conf = clause_type_id(client, "Confidentiality")
    annotation = client.post(
        "/annotations", json={"sentence_id": sentence["id"], "clause_type_id": lol}
    ).json()

    updated = client.patch(
        f"/annotations/{annotation['id']}", json={"status": "rejected"}
    )
    assert updated.status_code == 200
    assert updated.json()["status"] == "rejected"

    updated = client.patch(
        f"/annotations/{annotation['id']}", json={"clause_type_id": conf}
    )
    assert updated.status_code == 200
    assert updated.json()["clause_type_id"] == conf

    # Changing back onto an existing (sentence, type) pair conflicts.
    client.post(
        "/annotations", json={"sentence_id": sentence["id"], "clause_type_id": lol}
    )
    conflict = client.patch(
        f"/annotations/{annotation['id']}", json={"clause_type_id": lol}
    )
    assert conflict.status_code == 409


def test_annotation_appears_in_document_detail(client, sentence):
    ct_id = clause_type_id(client, "Limitation of Liability")
    annotation = client.post(
        "/annotations", json={"sentence_id": sentence["id"], "clause_type_id": ct_id}
    ).json()

    documents = client.get("/documents").json()["documents"]
    detail = client.get(f"/documents/{documents[0]['id']}").json()
    labeled = next(s for s in detail["sentences"] if s["id"] == sentence["id"])
    assert [a["id"] for a in labeled["annotations"]] == [annotation["id"]]


def test_delete_annotation(client, sentence):
    ct_id = clause_type_id(client, "Governing Law")
    annotation = client.post(
        "/annotations", json={"sentence_id": sentence["id"], "clause_type_id": ct_id}
    ).json()
    assert client.delete(f"/annotations/{annotation['id']}").status_code == 204
    assert client.delete(f"/annotations/{annotation['id']}").status_code == 404
