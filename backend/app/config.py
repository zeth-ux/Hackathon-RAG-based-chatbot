import os
from pathlib import Path

from dotenv import load_dotenv

BACKEND_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BACKEND_DIR / ".env")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
ALLOWED_ORIGIN = os.getenv("ALLOWED_ORIGIN", "http://localhost:5500,http://127.0.0.1:5500,http://localhost:3000")

CHROMA_PATH = BACKEND_DIR / "chroma_db"
SOURCES_PATH = BACKEND_DIR / "data" / "seerah_sources"
COLLECTION_NAME = "seerah"
EMBEDDING_MODEL = "all-MiniLM-L6-v2"
TOP_K = 5
# Cosine distance; higher = less similar. Chunks above this are treated as irrelevant.
MAX_DISTANCE = 1.15
CHUNK_WORDS = 400
CHUNK_OVERLAP = 50
