from pathlib import Path
from urllib.request import Request, urlopen
from PIL import Image
from io import BytesIO

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/"public"/"assets"/"authors"
OUT.mkdir(parents=True,exist_ok=True)

APRIL_URL="https://d2jqrm6oza8nb6.cloudfront.net/datasets/8ecef960-229e-4c44-86e7-6d4cb68adac0.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiNDRhOTIyMDkyMDAxZmRiNSIsImJ1Y2tldCI6InJ1bndheS1kYXRhc2V0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc5MDM0NDU4NX0.eBppsXR6lnCZ_UWojlu2si0G1GHhsJoKGuBgLxLOn7w"

# Preserve Jason's already-approved permanent portrait.
jason=OUT/"jason-hughes-final.webp"
if not jason.exists() or jason.stat().st_size < 100000:
    raise SystemExit("Jason final portrait is missing")

# Replace April with the exact user-approved polished_corporate_portrait_in_blue.png.
req=Request(APRIL_URL,headers={"User-Agent":"Mozilla/5.0"})
raw=urlopen(req,timeout=60).read()
if len(raw) < 100000:
    raise SystemExit(f"April portrait download too small: {len(raw)}")
im=Image.open(BytesIO(raw)).convert("RGB")
if im.width < 800 or im.height < 800:
    raise SystemExit(f"April portrait dimensions too small: {im.size}")
april=OUT/"april-sanders-final.webp"
im.save(april,"WEBP",quality=95,method=6)

# Validate both final portraits.
for path in [jason,april]:
    chk=Image.open(path)
    if chk.width < 800 or chk.height < 800:
        raise SystemExit(f"Final portrait dimensions too small: {path.name} {chk.size}")
    print(path.name, chk.size, path.stat().st_size)
