from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "assets" / "authors"
OUT.mkdir(parents=True, exist_ok=True)

# Production author portraits are permanent approved assets committed to the repository.
# Do not depend on temporary signed/CDN URLs during deployment.
portraits = {
    "Jason": OUT / "jason-hughes-final.webp",
    "April": OUT / "april-sanders-final.webp",
}

for name, path in portraits.items():
    if not path.exists():
        raise SystemExit(f"{name} final portrait is missing: {path}")
    if path.stat().st_size < 100000:
        raise SystemExit(f"{name} final portrait is unexpectedly small: {path.stat().st_size} bytes")

    with Image.open(path) as image:
        width, height = image.size
        if width < 800 or height < 800:
            raise SystemExit(
                f"{name} final portrait dimensions are too small: {path.name} {(width, height)}"
            )
        print(f"{path.name} {(width, height)} {path.stat().st_size}")

print("Approved permanent author portraits verified; no external download required.")
