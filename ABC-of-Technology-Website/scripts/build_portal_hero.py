from pathlib import Path
import base64, re
from io import BytesIO
from PIL import Image, ImageFilter, ImageEnhance

root = Path(__file__).resolve().parents[1]
# Temporary valid source while the full-resolution approved hero is replaced.
parts = [
    root / "hero-small" / "part0.txt",
    root / "hero-small" / "part1.txt",
]
data = "".join(p.read_text(encoding="utf-8").strip() for p in parts)
data = re.sub(r"\s+", "", data)
data += "=" * (-len(data) % 4)
raw = base64.b64decode(data, validate=False)
if raw[:4] != b"RIFF" or raw[8:12] != b"WEBP":
    raise SystemExit("Portal hero source is not a valid WebP RIFF file.")

image = Image.open(BytesIO(raw)).convert("RGB")
# Do not artificially call this 4K. Preserve the valid source cleanly.
image = ImageEnhance.Contrast(image).enhance(1.02)
image = ImageEnhance.Sharpness(image).enhance(1.12)
out = root / "public" / "assets" / "hero" / "abc-home-hero.webp"
out.parent.mkdir(parents=True, exist_ok=True)
image.save(out, "WEBP", quality=94, method=6)
print(f"Built valid portal hero {out} ({image.width}x{image.height}, {out.stat().st_size} bytes)")
