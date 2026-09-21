from pathlib import Path
import base64, re
from io import BytesIO
from PIL import Image, ImageFilter, ImageEnhance

root = Path(__file__).resolve().parents[1]
# Use the larger approved source, never the old 650x263 hero-small asset.
parts = [
    root / "hero-src" / "part1.txt",
    root / "hero-src" / "part2.txt",
]
data = "".join(p.read_text(encoding="utf-8").strip() for p in parts)
data = re.sub(r"\s+", "", data)
data += "=" * (-len(data) % 4)
raw = base64.b64decode(data, validate=False)
if raw[:4] != b"RIFF" or raw[8:12] != b"WEBP":
    raise SystemExit("Approved portal hero source is not a valid WebP RIFF file.")

image = Image.open(BytesIO(raw)).convert("RGB")
# Preserve detail using a high-quality 4K-class render target rather than browser stretching.
target_w = 3840
target_h = round(target_w * image.height / image.width)
image = image.resize((target_w, target_h), Image.Resampling.LANCZOS)
image = ImageEnhance.Contrast(image).enhance(1.035)
image = ImageEnhance.Sharpness(image).enhance(1.18)
image = image.filter(ImageFilter.UnsharpMask(radius=1.2, percent=115, threshold=2))

out = root / "public" / "assets" / "hero" / "abc-home-hero.webp"
out.parent.mkdir(parents=True, exist_ok=True)
image.save(out, "WEBP", quality=93, method=6)
print(f"Built approved 4K-class hero {out} ({image.width}x{image.height}, {out.stat().st_size} bytes)")
