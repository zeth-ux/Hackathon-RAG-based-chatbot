import os
from pathlib import Path

from dotenv import load_dotenv
from google import genai

load_dotenv(Path(__file__).with_name(".env"))
key = os.getenv("GEMINI_API_KEY", "")
model = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
print("model", model)
client = genai.Client(api_key=key)
try:
    response = client.models.generate_content(
        model=model,
        contents="Reply with the single word OK.",
    )
    print("ok", bool((response.text or "").strip()))
    print("text_len", len(response.text or ""))
except Exception as exc:
    print(type(exc).__name__)
    print(str(exc)[:500])
