from pathlib import Path
import base64
from io import BytesIO
from PIL import Image, ImageFilter

root = Path(__file__).resolve().parents[1]
parts = [
    root / "hero-small" / "part0.txt",
    root / "hero-small" / "part1.txt",
]
data = "".join(p.read_text(encoding="utf-8").strip() for p in parts)
raw = base64.b64decode(data, validate=True)
if raw[:4] != b"RIFF" or raw[8:12] != b"WEBP":
    raise SystemExit("Decoded portal hero is not a valid WebP RIFF file.")

image = Image.open(BytesIO(raw)).convert("RGB")
target_w = 1600
target_h = round(target_w * image.height / image.width)
if image.width < target_w:
    image = image.resize((target_w, target_h), Image.Resampling.LANCZOS)
image = image.filter(ImageFilter.UnsharpMask(radius=1.15, percent=120, threshold=2))

out = root / "public" / "assets" / "hero" / "abc-home-hero.webp"
out.parent.mkdir(parents=True, exist_ok=True)
image.save(out, "WEBP", quality=90, method=6)
print(f"Built {out} ({image.width}x{image.height}, {out.stat().st_size} bytes)")
