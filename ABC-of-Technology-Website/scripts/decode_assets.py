from pathlib import Path
import base64, json
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'asset-source.json'
PUBLIC = ROOT / 'public'

data = json.loads(SOURCE.read_text(encoding='utf-8'))
for rel, encoded in data.items():
    target = PUBLIC / rel
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(base64.b64decode(encoded))
    print(f'decoded {target.relative_to(ROOT)} ({target.stat().st_size} bytes)')

# The interactive bus is an exact crop from the supplied official front cover.
cover_path = PUBLIC / 'assets/book/book-cover.webp'
bus_path = PUBLIC / 'assets/book/book-bus-crop.webp'
with Image.open(cover_path) as im:
    im = im.convert('RGB')
    w, h = im.size
    crop = im.crop((int(w * 0.04), int(h * 0.34), int(w * 0.96), int(h * 0.91)))
    crop.save(bus_path, 'WEBP', quality=78, method=6)
print(f'created {bus_path.relative_to(ROOT)} from official cover ({bus_path.stat().st_size} bytes)')
