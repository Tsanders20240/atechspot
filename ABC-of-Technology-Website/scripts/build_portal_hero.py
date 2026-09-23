from pathlib import Path
import base64, re
from io import BytesIO
from PIL import Image

root = Path(__file__).resolve().parents[1]
approved_png = root / "official-homepage-src.png"

if approved_png.exists() and approved_png.stat().st_size > 10000:
    image = Image.open(approved_png).convert("RGB")
    # The approved composition contains a duplicate toolbar across the top.
    # The website already has its own accessible navigation bar, so remove
    # only that embedded toolbar while preserving the hero artwork below it.
    crop_top = min(84, max(0, image.height // 10))
    image = image.crop((0, crop_top, image.width, image.height))
    out = root / "public" / "assets" / "hero" / "abc-home-hero.webp"
    out.parent.mkdir(parents=True, exist_ok=True)
    image.save(out, "WEBP", quality=92, method=6)
    print(f"Built approved toolbar-free ABC hero {out} ({image.width}x{image.height}, {out.stat().st_size} bytes)")
else:
    parts = [
        root / "hero-approved" / "part00.txt",
        root / "hero-approved" / "part01.txt",
        root / "hero-approved" / "part02.txt",
        root / "hero-approved" / "part03.txt",
    ]
    data = "".join(p.read_text(encoding="utf-8").strip() for p in parts)
    data = re.sub(r"\s+", "", data)
    data += "=" * (-len(data) % 4)
    raw = base64.b64decode(data, validate=False)
    if raw[:4] != b"RIFF" or raw[8:12] != b"WEBP":
        raise SystemExit("Approved ABC hero source is not a valid WebP RIFF file.")
    image = Image.open(BytesIO(raw))
    if image.width < 1400 or image.height < 900:
        raise SystemExit(f"Approved hero is unexpectedly small: {image.width}x{image.height}")
    out = root / "public" / "assets" / "hero" / "abc-home-hero.webp"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_bytes(raw)
    print(f"Built fallback approved ABC hero {out} ({image.width}x{image.height}, {len(raw)} bytes)")
