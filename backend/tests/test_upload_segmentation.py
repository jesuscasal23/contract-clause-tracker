"""Critical path: upload -> segmentation produces sentences whose offsets slice
back to the sentence text from the verbatim raw text."""

from tests.conftest import upload_contract

CONTRACTS = [
    "01-master-services-agreement.txt",
    "02-employment-agreement.md",
    "03-saas-subscription-agreement.txt",
]


def find_sentence(document: dict, fragment: str) -> dict:
    matches = [s for s in document["sentences"] if fragment in s["text"]]
    assert matches, f"no sentence containing {fragment!r}"
    return matches[0]


def test_upload_returns_document_with_sentences(client):
    document = upload_contract(client, "01-master-services-agreement.txt")
    assert document["filename"] == "01-master-services-agreement.txt"
    assert document["format"] == "txt"
    assert len(document["sentences"]) > 20
    assert [s["ordinal"] for s in document["sentences"]] == list(
        range(len(document["sentences"]))
    )


def test_offsets_slice_back_to_sentence_text(client):
    for name in CONTRACTS:
        document = upload_contract(client, name)
        raw_text = document["raw_text"]
        for sentence in document["sentences"]:
            assert (
                raw_text[sentence["char_start"] : sentence["char_end"]]
                == sentence["text"]
            ), f"{name}: offset mismatch at ordinal {sentence['ordinal']}"


def test_segmentation_handles_legal_text_traps(client):
    msa = upload_contract(client, "01-master-services-agreement.txt")
    # "Inc." / "LLC" must not split the party-names sentence.
    intro = find_sentence(msa, "Nimbus Software Inc.")
    assert 'Harbor Analytics LLC ("Client").' in intro["text"]
    # "e.g.," mid-sentence must not split.
    egs = find_sentence(msa, "e.g., business plans")
    assert egs["text"].endswith("customer lists).")
    # "1.5%" decimal must not split.
    fees = find_sentence(msa, "1.5% per month")
    assert fees["text"].endswith("whichever is lower.")
    # Real boundary after "Section 3." must still split.
    term = find_sentence(msa, "accordance with this Section 3.")
    assert term["text"].endswith("Section 3.")

    emp = upload_contract(client, "02-employment-agreement.md")
    # "$185,000" must not split; markdown bold ("Inc.**") must not split.
    salary = find_sentence(emp, "$185,000")
    assert "standard payroll practices" in salary["text"]
    parties = find_sentence(emp, "Vertex Robotics Inc.")
    assert "effective January 15, 2025." in parties["text"]
    # Markdown headings stay whole.
    assert find_sentence(emp, "## 3. Non-Compete")["text"] == "## 3. Non-Compete"

    saas = upload_contract(client, "03-saas-subscription-agreement.txt")
    # "99.9%" must not split.
    sla = find_sentence(saas, "99.9% of the time")
    assert "excluding scheduled maintenance" in sla["text"]


def test_upload_rejects_unsupported_extension(client):
    response = client.post(
        "/documents", files={"file": ("contract.pdf", b"%PDF-1.4", "application/pdf")}
    )
    assert response.status_code == 400


def test_upload_rejects_empty_file(client):
    for payload in (b"", b"   \n\n  "):
        response = client.post(
            "/documents", files={"file": ("empty.txt", payload, "text/plain")}
        )
        assert response.status_code == 400


def test_upload_rejects_non_utf8(client):
    response = client.post(
        "/documents", files={"file": ("binary.txt", b"\xff\xfe\x00\x01", "text/plain")}
    )
    assert response.status_code == 400
