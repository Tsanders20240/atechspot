from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public' / 'assets' / 'coloring'
OUT.mkdir(parents=True, exist_ok=True)
TARGET = OUT / 'coloring-preview-sheet.webp'

W, H = 1800, 1180
img = Image.new('RGB', (W, H), '#fffdf7')
d = ImageDraw.Draw(img)

BOLD='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
REG='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
def F(size,b=False):
    try:return ImageFont.truetype(BOLD if b else REG,size)
    except:return ImageFont.load_default()

# headline area
d.text((72,42), "26 A–Z Technology Coloring Adventures", fill='#151515', font=F(62,True))
d.text((74,120), "Big letters • detailed kid-friendly tech scenes • color, talk, learn and create", fill='#4b4b4b', font=F(29))
d.rounded_rectangle((72,165,1728,1095), radius=34, fill='white', outline='#181818', width=5)

items=[('A','Analog Phone'),('B','Battery'),('C','Computer'),('D','Drone'),('E','Email'),('F','Flash Drive')]
cols,rows=3,2
left,top=105,205
gapx,gapy=35,35
cw=(1620-gapx*2)//3
ch=(840-gapy)//2

def cloud(x,y,s=1):
    d.ellipse((x,y,x+65*s,y+42*s),outline='#222',width=3)
    d.ellipse((x+38*s,y-24*s,x+106*s,y+43*s),outline='#222',width=3)
    d.ellipse((x+82*s,y,x+144*s,y+42*s),outline='#222',width=3)

def sun(x,y):
    d.ellipse((x-30,y-30,x+30,y+30),outline='#222',width=4)
    for a,b,c,e in [(0,-48,0,-76),(0,48,0,76),(-48,0,-76,0),(48,0,76,0),(-35,-35,-55,-55),(35,-35,55,-55),(-35,35,-55,55),(35,35,55,55)]: d.line((x+a,y+b,x+c,y+e),fill='#222',width=4)

def bus(x,y,scale=.55):
    w,h=230*scale,115*scale
    d.rounded_rectangle((x,y,x+w,y+h),radius=int(20*scale),outline='#111',width=4)
    d.polygon([(x+w*.12,y+h*.18),(x+w*.67,y+h*.18),(x+w*.8,y+h*.47),(x+w*.11,y+h*.47)],outline='#111')
    d.text((x+w*.28,y+h*.04),'ABC TECH BUS',fill='#111',font=F(max(10,int(15*scale)),True))
    for wx in (x+w*.23,x+w*.72): d.ellipse((wx-18*scale,y+h-18*scale,wx+18*scale,y+h+18*scale),outline='#111',width=4)

def icon(word,cx,cy):
    if word=='Analog Phone':
        d.arc((cx-95,cy-75,cx+95,cy+25),200,340,fill='#111',width=7)
        d.rounded_rectangle((cx-90,cy-5,cx+90,cy+75),radius=22,outline='#111',width=6)
        d.ellipse((cx+48,cy+20,cx+70,cy+42),outline='#111',width=4)
    elif word=='Battery':
        d.rounded_rectangle((cx-58,cy-82,cx+58,cy+92),radius=18,outline='#111',width=6)
        d.rectangle((cx-22,cy-108,cx+22,cy-82),outline='#111',width=5)
        d.text((cx-14,cy-58),'+',fill='#111',font=F(42,True)); d.text((cx-11,cy+35),'−',fill='#111',font=F(46,True))
    elif word=='Computer':
        d.rounded_rectangle((cx-110,cy-70,cx+110,cy+55),radius=16,outline='#111',width=6)
        d.line((cx,cy+55,cx,cy+90),fill='#111',width=5); d.line((cx-55,cy+90,cx+55,cy+90),fill='#111',width=5)
        d.rounded_rectangle((cx-120,cy+105,cx+120,cy+142),radius=8,outline='#111',width=4)
    elif word=='Drone':
        d.rounded_rectangle((cx-58,cy-25,cx+58,cy+30),radius=18,outline='#111',width=5)
        for dx,dy in [(-95,-62),(95,-62),(-95,62),(95,62)]:
            d.line((cx+(-45 if dx<0 else 45),cy+(-18 if dy<0 else 18),cx+dx,cy+dy),fill='#111',width=4)
            d.ellipse((cx+dx-32,cy+dy-12,cx+dx+32,cy+dy+12),outline='#111',width=4)
    elif word=='Email':
        d.rounded_rectangle((cx-120,cy-70,cx+120,cy+75),radius=14,outline='#111',width=6)
        d.line((cx-112,cy-53,cx,cy+20,cx+112,cy-53),fill='#111',width=5)
    else:
        d.rounded_rectangle((cx-50,cy-88,cx+50,cy+88),radius=18,outline='#111',width=6)
        d.rectangle((cx-26,cy-120,cx+26,cy-88),outline='#111',width=5)
        d.line((cx-10,cy-120,cx-10,cy-90),fill='#111',width=3); d.line((cx+10,cy-120,cx+10,cy-90),fill='#111',width=3)

for i,(letter,word) in enumerate(items):
    r,c=divmod(i,3); x=left+c*(cw+gapx); y=top+r*(ch+gapy)
    d.rounded_rectangle((x,y,x+cw,y+ch),radius=26,fill='#fff',outline='#222',width=4)
    # large outlined letter and title
    d.text((x+24,y+15),letter,fill='#fff',stroke_width=4,stroke_fill='#111',font=F(82,True))
    d.text((x+125,y+36),word,fill='#111',font=F(30,True))
    cloud(x+22,y+112,.65); sun(x+cw-58,y+125)
    # rolling landscape
    d.arc((x-50,y+210,x+cw*.72,y+390),190,340,fill='#222',width=3)
    d.arc((x+cw*.38,y+205,x+cw+70,y+400),195,345,fill='#222',width=3)
    # technology object center
    icon(word,x+cw//2,y+235)
    # ABC bus recurring character
    bus(x+28,y+ch-145,.55)
    # flowers/stars for more coloring detail
    for fx,fy in [(x+cw-80,y+ch-118),(x+cw-132,y+ch-78),(x+205,y+ch-58)]:
        d.ellipse((fx-8,fy-8,fx+8,fy+8),outline='#111',width=2)
        for dx,dy in [(-16,0),(16,0),(0,-16),(0,16)]: d.ellipse((fx+dx-7,fy+dy-7,fx+dx+7,fy+dy+7),outline='#111',width=2)
    # learning footer
    d.line((x+22,y+ch-48,x+cw-22,y+ch-48),fill='#888',width=2)
    d.text((x+24,y+ch-40),f'{letter} is for {word}  •  COLOR  •  TALK  •  LEARN',fill='#222',font=F(16,True))

# footer callout
d.rounded_rectangle((530,1110,1270,1160),radius=24,fill='#fff',outline='#111',width=3)
d.text((900,1120),'Preview of the complete 26-page A–Z printable collection',anchor='mm',fill='#111',font=F(20,True))
img.save(TARGET,'WEBP',quality=91,method=6)
print(f'created {TARGET.relative_to(ROOT)} ({TARGET.stat().st_size} bytes)')
