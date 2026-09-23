from pathlib import Path
from PIL import Image

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/"public"/"assets"/"authors"

expected=[
    OUT/"jason-hughes-final.webp",
    OUT/"april-sanders-final.webp",
]

for path in expected:
    if not path.exists() or path.stat().st_size < 100000:
        raise SystemExit(f"Final approved author portrait missing or too small: {path}")
    im=Image.open(path)
    if im.width < 800 or im.height < 800:
        raise SystemExit(f"Final approved author portrait dimensions too small: {path.name} {im.size}")
    print(path.name, im.size, path.stat().st_size)

print("Final approved ABC author portraits are permanently stored and verified.")
