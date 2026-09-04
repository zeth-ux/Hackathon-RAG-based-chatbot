import time

from google import genai
from google.genai import errors as genai_errors

from app.config import GEMINI_API_KEY, GEMINI_MODEL, MAX_DISTANCE, TOP_K
from app.vectorstore import get_collection

MAX_RETRIES = 3
RETRY_DELAY_SECONDS = 2

PROMPT_TEMPLATE = """You are a careful Seerah assistant. You answer questions about the life of the Prophet Muhammad (peace be upon him) using ONLY the retrieved excerpts below.

Rules:
- Use only these excerpts. Do not add outside knowledge, even if you know more.
- After each factual claim, cite the source label in square brackets, e.g. [Ar-Raheeq Al-Makhtum, Chapter 2].
- If the excerpts do not contain enough information to answer, reply exactly with: I don't have information on that in my current sources.
- Do not speculate, do not issue unsourced religious rulings, and do not invent quotations.
- Write in clear English. Be respectful.

Retrieved excerpts:
{context}

Question: {question}

Answer:"""

NO_COVERAGE_ANSWER = "I don't have information on that in my current sources."


def _client():
    if not GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY is not set")
    return genai.Client(api_key=GEMINI_API_KEY)


def retrieve(question: str) -> list[dict]:
    collection = get_collection()
    if collection.count() == 0:
        return []

    result = collection.query(
        query_texts=[question],
        n_results=min(TOP_K, collection.count()),
        include=["documents", "metadatas", "distances"],
    )
    documents = (result.get("documents") or [[]])[0]
    metadatas = (result.get("metadatas") or [[]])[0]
    distances = (result.get("distances") or [[]])[0]

    hits = []
    for text, meta, distance in zip(documents, metadatas, distances):
        if text is None:
            continue
        if distance is not None and distance > MAX_DISTANCE:
            continue
        hits.append(
            {
                "text": text,
                "source": (meta or {}).get("source", "Unknown source"),
                "distance": distance,
            }
        )
    return hits


def build_prompt(question: str, hits: list[dict]) -> str:
    blocks = []
    for i, hit in enumerate(hits, start=1):
        blocks.append(f"[Excerpt {i} | Source: {hit['source']}]\n{hit['text']}")
    context = "\n\n".join(blocks)
    return PROMPT_TEMPLATE.format(context=context, question=question)


def generate_answer(question: str) -> tuple[str, list[str]]:
    hits = retrieve(question)
    if not hits:
        return NO_COVERAGE_ANSWER, []

    prompt = build_prompt(question, hits)
    print(f"DEBUG: calling Gemini model={GEMINI_MODEL!r} with key set={bool(GEMINI_API_KEY)}")

    response = None
    last_exc = None
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            client = _client()
            response = client.models.generate_content(
                model=GEMINI_MODEL,
                contents=prompt,
            )
            break
        except genai_errors.ServerError as exc:
            last_exc = exc
            print(f"GEMINI ERROR (ServerError, attempt {attempt}/{MAX_RETRIES}): {exc!r}")
            if attempt < MAX_RETRIES:
                time.sleep(RETRY_DELAY_SECONDS * attempt)
        except genai_errors.APIError as exc:
            print(f"GEMINI ERROR (APIError): {exc!r}")
            raise RuntimeError("The language model is temporarily unavailable. Please try again shortly.") from exc
        except Exception as exc:
            print(f"GEMINI ERROR (Exception): {exc!r}")
            raise RuntimeError("The language model is temporarily unavailable. Please try again shortly.") from exc

    if response is None:
        raise RuntimeError(
            "The language model is experiencing high demand right now. Please try again shortly."
        ) from last_exc

    answer = (response.text or "").strip()
    if not answer:
        raise RuntimeError("The language model returned an empty response. Please try again.")

    sources = list(dict.fromkeys(hit["source"] for hit in hits))
    if NO_COVERAGE_ANSWER.lower() in answer.lower() and len(answer) < 120:
        return NO_COVERAGE_ANSWER, []
    return answer, sources