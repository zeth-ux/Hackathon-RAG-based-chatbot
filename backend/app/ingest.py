"""Chunk, embed, and store Seerah source files. Run: python -m app.ingest"""

from pathlib import Path

from app.config import CHUNK_OVERLAP, CHUNK_WORDS, SOURCES_PATH
from app.vectorstore import reset_collection


def parse_source_file(path: Path) -> tuple[str, str]:
    raw = path.read_text(encoding="utf-8").strip()
    if not raw:
        raise ValueError(f"{path.name} is empty")

    lines = raw.splitlines()
    first = lines[0].strip()
    if not first.lower().startswith("source:"):
        raise ValueError(
            f"{path.name}: first line must be a citation label, e.g. "
            "'Source: Ar-Raheeq Al-Makhtum, Chapter 2'"
        )
    label = first.split(":", 1)[1].strip()
    body = "\n".join(lines[1:]).strip()
    if not body:
        raise ValueError(f"{path.name} has a source label but no body text")
    return label, body


def chunk_text(text: str, chunk_words: int = CHUNK_WORDS, overlap: int = CHUNK_OVERLAP) -> list[str]:
    words = text.split()
    if not words:
        return []
    chunks = []
    step = max(chunk_words - overlap, 1)
    start = 0
    while start < len(words):
        piece = words[start : start + chunk_words]
        chunks.append(" ".join(piece))
        if start + chunk_words >= len(words):
            break
        start += step
    return chunks


def ingest() -> int:
    files = sorted(list(SOURCES_PATH.glob("*.txt")) + list(SOURCES_PATH.glob("*.md")))
    if not files:
        raise FileNotFoundError(f"No .txt or .md files found in {SOURCES_PATH}")

    collection = reset_collection()
    ids, documents, metadatas = [], [], []
    index = 0

    for path in files:
        label, body = parse_source_file(path)
        chunks = chunk_text(body)
        for chunk in chunks:
            ids.append(f"{path.stem}-{index}")
            documents.append(chunk)
            metadatas.append({"source": label, "file": path.name})
            index += 1
        print(f"  {path.name}: {len(chunks)} chunk(s) — {label}")

    collection.add(ids=ids, documents=documents, metadatas=metadatas)
    print(f"Stored {len(ids)} chunks in collection '{collection.name}'.")
    return len(ids)


if __name__ == "__main__":
    print(f"Ingesting sources from {SOURCES_PATH}")
    ingest()
