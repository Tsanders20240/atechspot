from pathlib import Path
import base64, zlib
ROOT=Path(__file__).resolve().parents[1]
source=ROOT/'page-source.txt'
out=ROOT/'public'/'index.html'
out.parent.mkdir(parents=True,exist_ok=True)
out.write_bytes(zlib.decompress(base64.b64decode(source.read_text().strip())))
print(f'built {out.relative_to(ROOT)} ({out.stat().st_size} bytes)')
