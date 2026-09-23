from pathlib import Path
from PIL import Image

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/"public"/"assets"/"storefront"
ASSETS=[
  OUT/"storefront-showcase.webp",
  OUT/"generation-campaign.webp",
  OUT/"abc-book-cover.webp",
]
for path in ASSETS:
    if not path.exists() or path.stat().st_size < 50000:
        raise SystemExit(f"Final storefront asset missing or too small: {path}")
    im=Image.open(path)
    if im.width < 800 or im.height < 800:
        raise SystemExit(f"Final storefront dimensions too small: {path.name} {im.size}")
    print(path.name, im.size, path.stat().st_size)
print("Final ABC Tech Products storefront assets are permanently stored and verified.")
