from pathlib import Path
from urllib.request import Request, urlopen
from PIL import Image
from io import BytesIO

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/"public"/"assets"/"authors"
OUT.mkdir(parents=True,exist_ok=True)

ASSETS={
"april-sanders-final.webp":"https://d2jqrm6oza8nb6.cloudfront.net/datasets/854ac927-0216-41c5-885f-0c6e7e8438c7.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiM2M5ZmE3OGVmM2U5ZWIxZSIsImJ1Y2tldCI6InJ1bndheS1kYXRhc2V0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc5MDI4OTY3OH0.QdIwDP0hjldbJAj0soF7gK4PEOc_0hxCWyaFm0h9xnk",
"jason-hughes-final.webp":"https://d2jqrm6oza8nb6.cloudfront.net/datasets/9928a024-4a71-497e-be12-d86db71155f4.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiYzAyN2I4ODIzZGVmYzk0YSIsImJ1Y2tldCI6InJ1bndheS1kYXRhc2V0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc5MDI3OTgxMH0.VnQ6dNB5QP59IaIjBB058MWoWrjsQfwyPWtJXqr8i4A"
}
for name,url in ASSETS.items():
    dest=OUT/name
    req=Request(url,headers={"User-Agent":"Mozilla/5.0"})
    raw=urlopen(req,timeout=60).read()
    if len(raw)<50000:
        raise SystemExit(f"{name} download too small: {len(raw)}")
    im=Image.open(BytesIO(raw)).convert("RGB")
    if im.width<800 or im.height<800:
        raise SystemExit(f"{name} dimensions too small: {im.size}")
    im.save(dest,"WEBP",quality=94,method=6)
    print(name, im.size, dest.stat().st_size)
