from pathlib import Path

p = Path(__file__).with_name(".env")
print("exists", p.exists())
if not p.exists():
    raise SystemExit(0)
for line in p.read_text(encoding="utf-8").splitlines():
    if line.strip().startswith("GEMINI_API_KEY"):
        val = line.split("=", 1)[1].strip().strip('"').strip("'")
        placeholder = val in ("", "your_google_ai_studio_key_here")
        print("placeholder", placeholder)
        print("key_len", len(val))
        print("starts_with_AIza", val.startswith("AIza"))
    elif line.strip().startswith("GEMINI_MODEL"):
        print("model_line", line)