from pathlib import Path
import base64

root = Path(__file__).resolve().parents[1]
parts = [
    root / "hero-small" / "part0.txt",
    root / "hero-small" / "part1.txt",
]
data = "".join(p.read_text(encoding="utf-8").strip() for p in parts)
raw = base64.b64decode(data, validate=True)
if raw[:4] != b"RIFF" or raw[8:12] != b"WEBP":
    raise SystemExit("Decoded portal hero is not a valid WebP RIFF file.")
out = root / "public" / "assets" / "hero" / "abc-home-hero.webp"
out.parent.mkdir(parents=True, exist_ok=True)
out.write_bytes(raw)
print(f"Built {out} ({len(raw)} bytes)")
