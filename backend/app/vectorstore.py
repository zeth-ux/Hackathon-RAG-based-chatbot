import chromadb
from chromadb import Documents, EmbeddingFunction, Embeddings
from google import genai

from app.config import CHROMA_PATH, COLLECTION_NAME, GEMINI_API_KEY

EMBEDDING_MODEL = "gemini-embedding-001"


class GeminiEmbeddingFunction(EmbeddingFunction):
    def __init__(self):
        if not GEMINI_API_KEY:
            raise RuntimeError("GEMINI_API_KEY is not set")
        self.client = genai.Client(api_key=GEMINI_API_KEY)

    def __call__(self, input: Documents) -> Embeddings:
        result = self.client.models.embed_content(
            model=EMBEDDING_MODEL,
            contents=input,
        )
        return [embedding.values for embedding in result.embeddings]


def embedding_function():
    return GeminiEmbeddingFunction()


def client():
    CHROMA_PATH.mkdir(parents=True, exist_ok=True)
    return chromadb.PersistentClient(path=str(CHROMA_PATH))


def get_collection():
    return client().get_or_create_collection(
        name=COLLECTION_NAME,
        embedding_function=embedding_function(),
        metadata={"hnsw:space": "cosine"},
    )


def reset_collection():
    chroma = client()
    try:
        chroma.delete_collection(COLLECTION_NAME)
    except Exception:
        pass
    return get_collection()
