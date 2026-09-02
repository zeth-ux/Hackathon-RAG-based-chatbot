from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

from app.config import ALLOWED_ORIGIN, GEMINI_API_KEY
from app.rag import generate_answer
from app.vectorstore import get_collection


@asynccontextmanager
async def lifespan(_: FastAPI):
    try:
        if get_collection().count() == 0:
            from app.ingest import ingest

            print("Chroma collection is empty — running ingest on startup.")
            ingest()
    except Exception as exc:
        print(f"Startup ingest skipped or failed: {exc}")
    yield


app = FastAPI(
    title="Seerah RAG Assistant",
    description="Question answering grounded in curated Seerah source texts.",
    version="1.0.0",
    lifespan=lifespan,
)

@app.exception_handler(RequestValidationError)
async def validation_error_handler(_, __):
    return JSONResponse(
        status_code=400,
        content={"detail": "question is required and cannot be empty"},
    )

origins = [origin.strip() for origin in ALLOWED_ORIGIN.split(",") if origin.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins or ["*"],
    allow_credentials=False,
    allow_methods=["POST", "GET", "OPTIONS"],
    allow_headers=["*"],
)


class AskRequest(BaseModel):
    question: str = Field(..., min_length=1)


class AskResponse(BaseModel):
    answer: str
    sources: list[str]


@app.get("/")
@app.get("/health")
def health():
    count = 0
    try:
        count = get_collection().count()
    except Exception:
        pass
    return {"status": "ok", "chunks": count, "gemini_configured": bool(GEMINI_API_KEY)}


@app.post("/ask", response_model=AskResponse)
def ask(body: AskRequest):
    question = body.question.strip()
    if not question:
        raise HTTPException(status_code=400, detail="question cannot be empty")

    try:
        answer, sources = generate_answer(question)
    except RuntimeError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Something went wrong while answering. Please try again.",
        )

    return AskResponse(answer=answer, sources=sources)
