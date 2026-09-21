from pathlib import Path
import base64, re
from io import BytesIO
from PIL import Image

root = Path(__file__).resolve().parents[1]
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
print(f"Built approved ABC hero {out} ({image.width}x{image.height}, {len(raw)} bytes)")
