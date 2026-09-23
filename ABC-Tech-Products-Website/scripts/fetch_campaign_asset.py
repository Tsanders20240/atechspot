from pathlib import Path
from urllib.request import Request, urlopen
from PIL import Image
from io import BytesIO

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/"public"/"assets"/"storefront"
OUT.mkdir(parents=True,exist_ok=True)

ASSETS={
  "storefront-showcase.webp":"https://d2jqrm6oza8nb6.cloudfront.net/datasets/c53e206a-88ef-46bf-a477-8004606d0270.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiNDY3NmI2ZTdhOTEwNjczYSIsImJ1Y2tldCI6InJ1bndheS1kYXRhc2V0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc5MDM1NDc5MX0.SezBceGpVkzQwZHEvokgdJn8ChCH3jxBN_WG3g_ZEBw",
  "generation-campaign.webp":"https://d2jqrm6oza8nb6.cloudfront.net/datasets/5c3b30b5-1b09-4671-8eab-4f8106bd686e.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiYzEyMzhiOTc4YzBmMjVmZiIsImJ1Y2tldCI6InJ1bndheS1kYXRhc2V0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc5MDI4MDk4M30.CSYP4jqovVGpp1_HTjkkQoaFLRQ1hYR1FGYkJFyHxOA",
  "abc-book-cover.webp":"https://d2jqrm6oza8nb6.cloudfront.net/datasets/44f586ba-0a9f-4126-9bc9-d47700b17b5a.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiNTA3MDc4NmZhZmU5ZTRiNSIsImJ1Y2tldCI6InJ1bndheS1kYXRhc2V0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc5MDM2MDk0M30.cI95mryYV1ievJhQk661dM1aqz8_7pKDIZjiOVkYNOM"
}

for name,url in ASSETS.items():
    raw=urlopen(Request(url,headers={"User-Agent":"Mozilla/5.0"}),timeout=60).read()
    if len(raw)<50000:
        raise SystemExit(f"{name} download too small: {len(raw)}")
    im=Image.open(BytesIO(raw)).convert("RGB")
    if im.width<800 or im.height<800:
        raise SystemExit(f"{name} dimensions too small: {im.size}")
    dest=OUT/name
    im.save(dest,"WEBP",quality=92,method=6)
    print(name, im.size, dest.stat().st_size)
