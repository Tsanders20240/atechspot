from pathlib import Path
import fitz
from PIL import Image
from io import BytesIO

ROOT=Path(__file__).resolve().parents[1]
SRC=ROOT/'public'/'downloads'/'coloring-pages'
OUT=ROOT/'public'/'assets'/'coloring-pages'
OUT.mkdir(parents=True,exist_ok=True)

count=0
for pdf in sorted(SRC.glob('[a-z]-*.pdf')):
    doc=fitz.open(pdf)
    page=doc[0]
    pix=page.get_pixmap(matrix=fitz.Matrix(2.2,2.2),alpha=False)
    im=Image.open(BytesIO(pix.tobytes('png'))).convert('RGB')
    # Trim only tiny white edge while preserving the printable page border.
    out=OUT/(pdf.stem+'.webp')
    im.save(out,'WEBP',quality=92,method=6)
    count+=1
print(f'Rendered {count} coloring-page previews into {OUT}')
