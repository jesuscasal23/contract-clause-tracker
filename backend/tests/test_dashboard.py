"""Critical path: dashboard list — summaries, search, filter by clause type and
status, group by clause type, and cascade delete."""

import pytest

from tests.conftest import upload_contract


def clause_type_id(client, name: str) -> int:
    types = client.get("/clause-types").json()
    return next(ct["id"] for ct in types if ct["name"] == name)


def annotate(client, document: dict, fragment: str, type_name: str) -> dict:
    sentence = next(s for s in document["sentences"] if fragment in s["text"])
    response = client.post(
        "/annotations",
        json={
            "sentence_id": sentence["id"],
            "clause_type_id": clause_type_id(client, type_name),
        },
    )
    assert response.status_code == 201, response.text
    return response.json()


@pytest.fixture()
def corpus(client) -> dict:
    msa = upload_contract(client, "01-master-services-agreement.txt")
    emp = upload_contract(client, "02-employment-agreement.md")
    annotate(client, msa, "In no event shall either party", "Limitation of Liability")
    annotate(client, msa, "terminate this Agreement for convenience",
             "Termination for Convenience")
    annotate(client, msa, "shall not disclose such Confidential Information",
             "Confidentiality")
    annotate(client, emp, "shall not, directly or indirectly, engage", "Non-Compete")
    return {"msa": msa, "emp": emp}


def test_list_returns_clause_summaries(client, corpus):
    documents = client.get("/documents").json()["documents"]
    assert len(documents) == 2
    by_name = {d["filename"]: d for d in documents}
    msa = by_name["01-master-services-agreement.txt"]
    assert msa["sentence_count"] == len(corpus["msa"]["sentences"])
    assert {(c["name"], c["count"]) for c in msa["clause_summary"]} == {
        ("Confidentiality", 1),
        ("Limitation of Liability", 1),
        ("Termination for Convenience", 1),
    }
    assert all(c["color"].startswith("#") for c in msa["clause_summary"])


def test_search_matches_filename_and_text(client, corpus):
    hits = client.get("/documents", params={"search": "employment"}).json()["documents"]
    assert [d["filename"] for d in hits] == ["02-employment-agreement.md"]
    # Body-text search: this phrase only occurs inside the MSA's raw text.
    hits = client.get("/documents", params={"search": "wilmington, delaware"}).json()[
        "documents"
    ]
    assert [d["filename"] for d in hits] == ["01-master-services-agreement.txt"]
    assert client.get("/documents", params={"search": "zzz-no-match"}).json()[
        "documents"
    ] == []


def test_filter_by_clause_type(client, corpus):
    ct = clause_type_id(client, "Non-Compete")
    hits = client.get("/documents", params={"clause_type": ct}).json()["documents"]
    assert [d["filename"] for d in hits] == ["02-employment-agreement.md"]


def test_filter_by_status_and_rejected_excluded_by_default(client, corpus):
    annotation = annotate(
        client, corpus["emp"], "shall not solicit any employee", "Non-Solicitation"
    )
    client.patch(f"/annotations/{annotation['id']}", json={"status": "rejected"})

    # Rejected labels do not count toward summaries by default...
    ct = clause_type_id(client, "Non-Solicitation")
    assert client.get("/documents", params={"clause_type": ct}).json()["documents"] == []
    # ...but an explicit status filter surfaces them.
    hits = client.get(
        "/documents", params={"clause_type": ct, "status": "rejected"}
    ).json()["documents"]
    assert [d["filename"] for d in hits] == ["02-employment-agreement.md"]
    # And a confirmed-only view still shows the other labels.
    confirmed = client.get("/documents", params={"status": "confirmed"}).json()[
        "documents"
    ]
    assert {d["filename"] for d in confirmed} == {
        "01-master-services-agreement.txt",
        "02-employment-agreement.md",
    }


def test_group_by_clause_type(client, corpus):
    groups = client.get("/documents", params={"group_by": "clause_type"}).json()[
        "groups"
    ]
    by_type = {g["clause_type"]["name"]: g["documents"] for g in groups}
    assert set(by_type) == {
        "Confidentiality",
        "Limitation of Liability",
        "Non-Compete",
        "Termination for Convenience",
    }
    assert [d["filename"] for d in by_type["Non-Compete"]] == [
        "02-employment-agreement.md"
    ]


def test_group_by_rejects_unknown_value(client):
    assert client.get("/documents", params={"group_by": "banana"}).status_code == 422


def test_delete_document_cascades(client, corpus):
    annotation = annotate(
        client, corpus["msa"], "shall be governed by and construed", "Governing Law"
    )
    document_id = corpus["msa"]["id"]
    assert client.delete(f"/documents/{document_id}").status_code == 204
    assert client.get(f"/documents/{document_id}").status_code == 404
    # Sentences and annotations are gone with it.
    assert client.delete(f"/annotations/{annotation['id']}").status_code == 404
    remaining = client.get("/documents").json()["documents"]
    assert [d["filename"] for d in remaining] == ["02-employment-agreement.md"]


def test_seeded_clause_types(client):
    types = client.get("/clause-types").json()
    assert {ct["name"] for ct in types} == {
        "Confidentiality",
        "Governing Law",
        "IP Assignment",
        "Limitation of Liability",
        "Non-Compete",
        "Non-Solicitation",
        "Termination for Convenience",
    }
    assert all(len(ct["color"]) == 7 for ct in types)


def test_create_clause_type_and_conflict(client):
    response = client.post(
        "/clause-types",
        json={"name": "Indemnification", "color": "#0e7490"},
    )
    assert response.status_code == 201
    assert response.json()["name"] == "Indemnification"
    assert (
        client.post(
            "/clause-types", json={"name": "Indemnification", "color": "#000000"}
        ).status_code
        == 409
    )
    assert (
        client.post(
            "/clause-types", json={"name": "Bad Color", "color": "tomato"}
        ).status_code
        == 422
    )


def test_auto_label_is_scaffolded_not_implemented(client, corpus):
    assert (
        client.post(f"/documents/{corpus['msa']['id']}/auto-label").status_code == 501
    )
    assert client.post("/documents/99999/auto-label").status_code == 404
