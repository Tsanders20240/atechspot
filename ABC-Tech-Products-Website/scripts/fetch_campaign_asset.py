from pathlib import Path
from urllib.request import Request, urlopen
from PIL import Image
from io import BytesIO

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/"public"/"assets"/"campaign"
OUT.mkdir(parents=True,exist_ok=True)
URL="https://d2jqrm6oza8nb6.cloudfront.net/datasets/6d3c11b4-8a59-4a3c-acdb-05b37b63f969.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiM2QzZmNmOTVmMmJlMzU3OCIsImJ1Y2tldCI6InJ1bndheS1kYXRhc2V0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc5MDMzMTI4NX0.apfI3ig47zBasW9GsumzHqaAQ4x87onQYVV6pWwPknQ"
dest=OUT/"a-plus-tech-generation-campaign.webp"
raw=urlopen(Request(URL,headers={"User-Agent":"Mozilla/5.0"}),timeout=60).read()
if len(raw)<100000: raise SystemExit("campaign image download too small")
im=Image.open(BytesIO(raw)).convert("RGB")
if im.width<1000 or im.height<1000: raise SystemExit(f"campaign image too small: {im.size}")
im.save(dest,"WEBP",quality=92,method=6)
print(dest, im.size, dest.stat().st_size)
