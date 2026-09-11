from pathlib import Path
import base64
import re

ROOT = Path(__file__).resolve().parents[1]
BOOK = ROOT / 'public' / 'assets' / 'book'

ASSETS = {
    'book-cover.svg': 'book-cover.webp',
    'book-bus-crop.svg': 'book-bus-crop.webp',
    'book-page-title.svg': 'book-page-title.webp',
    'book-page-best-you.svg': 'book-page-best-you.webp',
    'book-page-a.svg': 'book-page-a.webp',
}

PATTERN = re.compile(r'href=["\']data:image/webp;base64,([^"\']+)["\']', re.S)

for source_name, target_name in ASSETS.items():
    source = BOOK / source_name
    target = BOOK / target_name
    if not source.is_file():
        raise FileNotFoundError(f'Missing official book source asset: {source}')

    text = source.read_text(encoding='utf-8')
    match = PATTERN.search(text)
    if not match:
        raise ValueError(f'No embedded WebP payload found in {source_name}')

    # GitHub may preserve long data URIs with harmless whitespace/newlines.
    # Decode tolerantly, then validate the resulting bytes as a real WebP.
    payload = re.sub(r'\s+', '', match.group(1))
    payload += '=' * (-len(payload) % 4)
    try:
        raw = base64.b64decode(payload, validate=False)
    except Exception as exc:
        raise ValueError(f'Could not decode embedded WebP payload in {source_name}: {exc}') from exc

    if not raw.startswith(b'RIFF') or raw[8:12] != b'WEBP':
        raise ValueError(f'Embedded payload in {source_name} is not a valid WebP image')

    target.write_bytes(raw)
    print(f'decoded {target.relative_to(ROOT)} ({len(raw)} bytes)')

print('Official ABC book assets decoded successfully.')
