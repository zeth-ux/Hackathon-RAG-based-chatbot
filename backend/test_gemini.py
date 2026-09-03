"""
Standalone Gemini connectivity test.
Run from the backend folder with your venv active:
    python test_gemini.py
"""
import os
import sys

# Load .env the same way your app does
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

api_key = os.environ.get("GEMINI_API_KEY")
model = os.environ.get("GEMINI_MODEL", "gemini-2.5-flash")

print(f"1. GEMINI_API_KEY loaded: {bool(api_key)}")
if api_key:
    print(f"   Key starts with: {api_key[:6]}... (length {len(api_key)})")
print(f"2. GEMINI_MODEL: {model!r}")

if not api_key:
    print("\n>>> STOP: GEMINI_API_KEY is not set in your environment / .env file. This is your problem.")
    sys.exit(1)

print("\n3. Attempting to call Gemini directly...")
try:
    from google import genai
    client = genai.Client(api_key=api_key)
    response = client.models.generate_content(
        model=model,
        contents="Say hello in one short sentence.",
    )
    print("\n>>> SUCCESS. Gemini responded:")
    print(response.text)
except Exception as e:
    print(f"\n>>> FAILED. Real error below:")
    print(f"{type(e).__name__}: {e}")