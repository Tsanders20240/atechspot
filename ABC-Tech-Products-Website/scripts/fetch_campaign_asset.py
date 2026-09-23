from pathlib import Path
from PIL import Image

ROOT=Path(__file__).resolve().parents[1]
asset=ROOT/"public"/"assets"/"campaign"/"a-plus-tech-generation-campaign.webp"
if not asset.exists() or asset.stat().st_size < 100000:
    raise SystemExit(f"Approved campaign asset missing or too small: {asset}")
im=Image.open(asset)
if im.width < 1000 or im.height < 1000:
    raise SystemExit(f"Approved campaign dimensions too small: {im.size}")
print("Approved ABC Tech Products campaign asset verified:", im.size, asset.stat().st_size)
