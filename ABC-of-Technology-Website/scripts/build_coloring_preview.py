from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public' / 'assets' / 'coloring'
OUT.mkdir(parents=True, exist_ok=True)
TARGET = OUT / 'coloring-preview-sheet.webp'

W, H = 1600, 1000
img = Image.new('RGB', (W, H), '#fffdf7')
d = ImageDraw.Draw(img)

font_paths = [
    '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
    '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
]

def font(size, bold=False):
    path = font_paths[0 if bold else 1]
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        return ImageFont.load_default()

TITLE = font(62, True)
SUB = font(28, False)
LETTER = font(86, True)
WORD = font(27, True)
SMALL = font(21, False)

# Header
d.text((70, 45), "ABC's of Technology — A–F Printable Preview", fill='#171717', font=TITLE)
d.text((72, 125), 'Black-and-white coloring pages • big letters • kid-friendly tech scenes • grown-up prompts', fill='#4b4b4b', font=SUB)

items = [
    ('A', 'Analog Phone'), ('B', 'Battery'), ('C', 'Computer'),
    ('D', 'Drone'), ('E', 'Email'), ('F', 'Flash Drive')
]

margin_x, gap_x = 55, 28
margin_y, gap_y = 190, 30
cols, rows = 3, 2
card_w = (W - margin_x*2 - gap_x*(cols-1)) // cols
card_h = (H - margin_y - 60 - gap_y*(rows-1)) // rows


def phone(cx, cy):
    d.rounded_rectangle((cx-78,cy-25,cx+78,cy+42), radius=22, outline='#111', width=5)
    d.arc((cx-70,cy-98,cx+70,cy+18), 205, 335, fill='#111', width=8)
    d.ellipse((cx+40,cy-7,cx+62,cy+15), outline='#111', width=4)

def battery(cx, cy):
    d.rounded_rectangle((cx-50,cy-90,cx+50,cy+100), radius=18, outline='#111', width=5)
    d.rectangle((cx-22,cy-115,cx+22,cy-90), outline='#111', width=5)
    d.text((cx-14,cy-50), '+', fill='#111', font=font(38, True))
    d.text((cx-11,cy+34), '−', fill='#111', font=font(42, True))

def computer(cx, cy):
    d.rounded_rectangle((cx-110,cy-82,cx+110,cy+45), radius=16, outline='#111', width=5)
    d.line((cx,cy+45,cx,cy+82), fill='#111', width=5)
    d.line((cx-58,cy+82,cx+58,cy+82), fill='#111', width=5)
    d.rounded_rectangle((cx-118,cy+98,cx+118,cy+138), radius=9, outline='#111', width=4)

def drone(cx, cy):
    d.rounded_rectangle((cx-56,cy-28,cx+56,cy+28), radius=20, outline='#111', width=5)
    for dx,dy in [(-86,-55),(86,-55),(-86,55),(86,55)]:
        d.line((cx + (-42 if dx<0 else 42), cy + (-18 if dy<0 else 18), cx+dx, cy+dy), fill='#111', width=4)
        d.ellipse((cx+dx-28,cy+dy-12,cx+dx+28,cy+dy+12), outline='#111', width=4)

def email(cx, cy):
    d.rounded_rectangle((cx-115,cy-72,cx+115,cy+72), radius=16, outline='#111', width=5)
    d.line((cx-108,cy-55,cx,cy+18,cx+108,cy-55), fill='#111', width=5)

def flash(cx, cy):
    d.rounded_rectangle((cx-48,cy-88,cx+48,cy+88), radius=18, outline='#111', width=5)
    d.rectangle((cx-26,cy-120,cx+26,cy-88), outline='#111', width=5)
    d.line((cx-10,cy-120,cx-10,cy-90), fill='#111', width=3)
    d.line((cx+10,cy-120,cx+10,cy-90), fill='#111', width=3)

icons = [phone, battery, computer, drone, email, flash]

for i, ((letter, word), icon) in enumerate(zip(items, icons)):
    r, c = divmod(i, cols)
    x0 = margin_x + c*(card_w+gap_x)
    y0 = margin_y + r*(card_h+gap_y)
    x1, y1 = x0+card_w, y0+card_h
    d.rounded_rectangle((x0,y0,x1,y1), radius=28, fill='#ffffff', outline='#1d1d1d', width=4)
    d.text((x0+26,y0+20), letter, fill='#ffffff', stroke_width=3, stroke_fill='#111111', font=LETTER)
    d.text((x0+122,y0+46), word, fill='#111111', font=WORD)
    cx, cy = (x0+x1)//2, y0 + 205
    icon(cx, cy)
    d.line((x0+32,y1-84,x1-32,y1-84), fill='#9a9a9a', width=2)
    d.text((x0+32,y1-70), 'COLOR • TALK • LEARN', fill='#303030', font=SMALL)
    d.text((x0+32,y1-40), f'{letter} is for {word}', fill='#303030', font=SMALL)

img.save(TARGET, 'WEBP', quality=88, method=6)
print(f'created {TARGET.relative_to(ROOT)} ({TARGET.stat().st_size} bytes)')
