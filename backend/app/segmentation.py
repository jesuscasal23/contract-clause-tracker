"""Deterministic sentence segmentation with exact character offsets.

The document is split into line blocks (contracts and markdown put headings and
paragraphs on their own lines), and each block is segmented with pysbd
(legal-text-aware: "Inc.", "e.g.", decimals, section numbers). Every produced span
is verified to slice back out of the raw text — with a search fallback in case
pysbd's own char spans ever drift.

Markdown wrinkles: heading lines become a single span, and emphasis markers
(*, _, `) are removed before segmentation because they break pysbd's abbreviation
rules (e.g. "Inc.**"); an index map translates the cleaned offsets back, so stored
offsets always index into the verbatim raw text.
"""

import re
from dataclasses import dataclass
from typing import Iterator

import pysbd

_segmenter = pysbd.Segmenter(language="en", clean=False, char_span=True)

_MD_HEADING = re.compile(r"^\s*#{1,6}\s+\S")
_EMPHASIS_CHARS = set("*_`")


@dataclass(frozen=True)
class SentenceSpan:
    text: str
    char_start: int
    char_end: int


def _iter_line_blocks(raw_text: str) -> Iterator[tuple[int, str]]:
    offset = 0
    for line in raw_text.split("\n"):
        yield offset, line
        offset += len(line) + 1


def _strip_emphasis(block: str) -> tuple[str, list[int] | None]:
    """Remove markdown emphasis chars; map each cleaned index to its raw index."""
    if not _EMPHASIS_CHARS.intersection(block):
        return block, None
    cleaned: list[str] = []
    mapping: list[int] = []
    for i, ch in enumerate(block):
        if ch in _EMPHASIS_CHARS:
            continue
        cleaned.append(ch)
        mapping.append(i)
    return "".join(cleaned), mapping


def _trimmed_span(raw_text: str, start: int, end: int) -> SentenceSpan | None:
    piece = raw_text[start:end]
    text = piece.strip()
    if not text:
        return None
    start += len(piece) - len(piece.lstrip())
    return SentenceSpan(text=text, char_start=start, char_end=start + len(text))


def segment_text(raw_text: str) -> list[SentenceSpan]:
    spans: list[SentenceSpan] = []
    for block_start, block in _iter_line_blocks(raw_text):
        if not block.strip():
            continue
        if _MD_HEADING.match(block):
            span = _trimmed_span(raw_text, block_start, block_start + len(block))
            if span:
                spans.append(span)
            continue
        cleaned, mapping = _strip_emphasis(block)
        if not cleaned.strip():
            continue
        cursor = 0
        for piece in _segmenter.segment(cleaned):
            start = piece.start
            # Verify the offset; recover via search if pysbd's span drifted.
            if cleaned[start : start + len(piece.sent)] != piece.sent:
                start = cleaned.find(piece.sent, cursor)
                if start == -1:
                    continue
            cursor = start + len(piece.sent)
            stripped = piece.sent.strip()
            if not stripped:
                continue
            c_start = start + (len(piece.sent) - len(piece.sent.lstrip()))
            c_end = c_start + len(stripped)
            if mapping is None:
                raw_start, raw_end = c_start, c_end
            else:
                raw_start, raw_end = mapping[c_start], mapping[c_end - 1] + 1
            span = _trimmed_span(raw_text, block_start + raw_start, block_start + raw_end)
            if span:
                spans.append(span)
    return spans
