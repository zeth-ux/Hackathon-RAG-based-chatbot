import chromadb
from chromadb.utils.embedding_functions import SentenceTransformerEmbeddingFunction

from app.config import CHROMA_PATH, COLLECTION_NAME, EMBEDDING_MODEL


def embedding_function():
    return SentenceTransformerEmbeddingFunction(model_name=EMBEDDING_MODEL)


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
