from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
from reportlab.lib.colors import black, white
from pathlib import Path
import math, os, shutil

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'public'/'downloads'/'coloring-pages'
OUT.mkdir(parents=True,exist_ok=True)
IND=OUT

for path,name in [('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf','DejaVu'),('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf','DejaVuBold')]:
    if os.path.exists(path): pdfmetrics.registerFont(TTFont(name,path))

DATA=[
('A','Analog Phone','Talk about how phones changed from old to new.'),('B','Battery','Name something at home that uses a battery.'),('C','Computer','Point to the screen, keyboard and mouse.'),('D','Drone','What can a drone see from the sky?'),('E','Email','Who might a grown-up send an email to?'),('F','Flash Drive','What kinds of files can a flash drive hold?'),('G','Game Controller','Name one button you use while playing a game.'),('H','Headphones','Why do headphones help us listen quietly?'),('I','Internet','Name one safe thing you can learn online with a grown-up.'),('J','Joystick','Which direction can a joystick move?'),('K','Keyboard','Find the first letter of your name on a keyboard.'),('L','Laptop','What makes a laptop easy to carry?'),('M','Mouse','How does a computer mouse help us point and click?'),('N','Network','How can computers share information with each other?'),('O','Online','Name one thing a grown-up may do online.'),('P','Programming','What instructions would you give a robot?'),('Q','QR Code','Ask a grown-up where they have seen a QR code.'),('R','Robot','What job would you give a helpful robot?'),('S','Smartphone','Name one helpful thing a smartphone can do.'),('T','Tablet','How is a tablet different from a laptop?'),('U','USB','What can a USB connection plug into?'),('V','Virtual Reality','What imaginary place would you visit in VR?'),('W','Wi-Fi','Where do you see the Wi-Fi symbol?'),('X','X-Ray','How can an X-ray help a doctor see inside the body?'),('Y','YouTube','What kind of educational video would you watch with a grown-up?'),('Z','Zoom','Who could you talk to on a video call?')]

W,H=letter

def setup(c):
    c.setLineWidth(2.4); c.setStrokeColor(black); c.setFillColor(white); c.setLineCap(1); c.setLineJoin(1)

def cloud(c,x,y,s=1):
    c.setFillColor(white); c.setStrokeColor(black); c.setLineWidth(2)
    c.circle(x,y,18*s,fill=1,stroke=1); c.circle(x+24*s,y+8*s,24*s,fill=1,stroke=1); c.circle(x+50*s,y,20*s,fill=1,stroke=1); c.line(x-18*s,y-18*s,x+70*s,y-18*s)

def star(c,x,y,r=7):
    pts=[]
    for i in range(10):
        a=math.radians(90+i*36); rr=r if i%2==0 else r*.45; pts.append((x+rr*math.cos(a),y+rr*math.sin(a)))
    p=c.beginPath(); p.moveTo(*pts[0])
    for pt in pts[1:]: p.lineTo(*pt)
    p.close(); c.drawPath(p,fill=0,stroke=1)

def face(c,x,y,s=1):
    c.circle(x-10*s,y+7*s,2.5*s,fill=0,stroke=1); c.circle(x+10*s,y+7*s,2.5*s,fill=0,stroke=1)
    p=c.beginPath(); p.moveTo(x-9*s,y-3*s); p.curveTo(x-4*s,y-10*s,x+4*s,y-10*s,x+9*s,y-3*s); c.drawPath(p,fill=0,stroke=1)

def limbs(c,x,y,w,h,s=1):
    c.line(x-w*.42,y-h*.15,x-w*.62,y-h*.25); c.line(x+w*.42,y-h*.15,x+w*.62,y-h*.25); c.line(x-w*.62,y-h*.25,x-w*.7,y-h*.15); c.line(x+w*.62,y-h*.25,x+w*.7,y-h*.15); c.line(x-w*.18,y-h*.45,x-w*.25,y-h*.68); c.line(x+w*.18,y-h*.45,x+w*.25,y-h*.68); c.line(x-w*.25,y-h*.68,x-w*.36,y-h*.7); c.line(x+w*.25,y-h*.68,x+w*.36,y-h*.7)

def rounded(c,x,y,w,h,r=12,fill=0): c.roundRect(x-w/2,y-h/2,w,h,r,fill=fill,stroke=1)

def draw_icon(c,word,cx,cy,s=1):
    c.setLineWidth(3)
    if word=='Analog Phone':
        rounded(c,cx,cy,190,100,22); rounded(c,cx,cy+5,95,35,10); face(c,cx,cy+4,1.2); p=c.beginPath(); p.moveTo(cx-75,cy+70); p.curveTo(cx-45,cy+110,cx+45,cy+110,cx+75,cy+70); p.lineTo(cx+55,cy+45); p.curveTo(cx+25,cy+70,cx-25,cy+70,cx-55,cy+45); p.close(); c.drawPath(p,fill=0,stroke=1); c.circle(cx+65,cy-20,13,fill=0,stroke=1); c.circle(cx+65,cy-20,5,fill=0,stroke=1); limbs(c,cx,cy,190,100)
    elif word=='Battery': rounded(c,cx,cy,125,190,20); rounded(c,cx,cy+105,50,18,4); c.setFont('DejaVuBold',30); c.drawCentredString(cx,cy+42,'+'); c.drawCentredString(cx,cy-48,'-'); face(c,cx,cy,1.2); limbs(c,cx,cy,125,190)
    elif word=='Computer':
        rounded(c,cx,cy+20,200,125,16); face(c,cx,cy+20,1.3); c.line(cx,cy-42,cx,cy-80); c.line(cx-45,cy-80,cx+45,cy-80); rounded(c,cx,cy-105,210,45,8)
        for yy in range(-117,-95,11):
            for xx in range(-80,90,24): rounded(c,cx+xx,cy+yy,16,6,2)
    elif word=='Drone':
        rounded(c,cx,cy,110,60,25); face(c,cx,cy,1)
        for dx,dy in [(-85,55),(85,55),(-85,-55),(85,-55)]: c.line(cx+(-45 if dx<0 else 45),cy+(20 if dy>0 else -20),cx+dx,cy+dy); c.circle(cx+dx,cy+dy,24,fill=0,stroke=1); c.line(cx+dx-26,cy+dy,cx+dx+26,cy+dy); c.line(cx+dx,cy+dy-26,cx+dx,cy+dy+26)
        c.circle(cx,cy-45,14,fill=0,stroke=1)
    elif word=='Email': rounded(c,cx,cy,220,145,18); c.line(cx-105,cy+55,cx,cy-20); c.line(cx+105,cy+55,cx,cy-20); face(c,cx,cy+15,1.2); limbs(c,cx,cy,220,145)
    elif word=='Flash Drive': rounded(c,cx,cy,105,190,22); c.rect(cx-28,cy+95,56,42,fill=0,stroke=1); c.line(cx-12,cy+95,cx-12,cy+132); c.line(cx+12,cy+95,cx+12,cy+132); face(c,cx,cy,1.1); limbs(c,cx,cy,105,190)
    elif word=='Game Controller':
        p=c.beginPath(); p.moveTo(cx-95,cy+25); p.curveTo(cx-120,cy-20,cx-110,cy-95,cx-65,cy-70); p.curveTo(cx-25,cy-48,cx+25,cy-48,cx+65,cy-70); p.curveTo(cx+110,cy-95,cx+120,cy-20,cx+95,cy+25); p.curveTo(cx+70,cy+70,cx+30,cy+72,cx,cy+55); p.curveTo(cx-30,cy+72,cx-70,cy+70,cx-95,cy+25); p.close(); c.drawPath(p,fill=0,stroke=1); c.line(cx-58,cy+10,cx-22,cy+10); c.line(cx-40,cy-8,cx-40,cy+28); c.circle(cx+50,cy+15,10,fill=0,stroke=1); c.circle(cx+75,cy-5,10,fill=0,stroke=1); face(c,cx,cy-10,.9)
    elif word=='Headphones': p=c.beginPath(); p.moveTo(cx-90,cy-15); p.curveTo(cx-90,cy+110,cx+90,cy+110,cx+90,cy-15); c.drawPath(p,fill=0,stroke=1); rounded(c,cx-88,cy-25,50,95,18); rounded(c,cx+88,cy-25,50,95,18); face(c,cx,cy,1.3)
    elif word=='Internet': c.circle(cx,cy,105,fill=0,stroke=1); c.ellipse(cx-55,cy-105,cx+55,cy+105,fill=0,stroke=1); c.line(cx-105,cy,cx+105,cy); c.ellipse(cx-100,cy-45,cx+100,cy+45,fill=0,stroke=1); face(c,cx,cy,1.2)
    elif word=='Joystick': rounded(c,cx,cy-55,170,80,14); c.line(cx,cy-15,cx,cy+75); c.circle(cx,cy+95,28,fill=0,stroke=1); c.circle(cx+55,cy-55,10,fill=0,stroke=1); face(c,cx-35,cy-55,.8)
    elif word=='Keyboard':
        rounded(c,cx,cy,240,130,15)
        for r in range(4):
            for col in range(8): rounded(c,cx-90+col*26,cy+38-r*26,19,16,2)
        c.roundRect(cx-55,cy-48,110,14,3,fill=0,stroke=1)
    elif word=='Laptop': rounded(c,cx,cy+35,210,130,15); face(c,cx,cy+35,1.1); p=c.beginPath(); p.moveTo(cx-120,cy-35); p.lineTo(cx+120,cy-35); p.lineTo(cx+95,cy-90); p.lineTo(cx-95,cy-90); p.close(); c.drawPath(p,fill=0,stroke=1); c.line(cx-40,cy-60,cx+40,cy-60)
    elif word=='Mouse': p=c.beginPath(); p.moveTo(cx,cy+105); p.curveTo(cx-85,cy+90,cx-110,cy+10,cx-80,cy-70); p.curveTo(cx-55,cy-125,cx+55,cy-125,cx+80,cy-70); p.curveTo(cx+110,cy+10,cx+85,cy+90,cx,cy+105); p.close(); c.drawPath(p,fill=0,stroke=1); c.line(cx,cy+102,cx,cy+20); rounded(c,cx,cy+52,24,38,8); face(c,cx,cy-25,1)
    elif word=='Network':
        pts=[(cx,cy+90),(cx-90,cy+20),(cx+90,cy+20),(cx-60,cy-90),(cx+60,cy-90)]
        for i,p1 in enumerate(pts):
            for j,p2 in enumerate(pts):
                if j>i and (i+j)%2==1: c.line(*p1,*p2)
        for x,y in pts: c.circle(x,y,25,fill=0,stroke=1); face(c,x,y,.45)
    elif word=='Online': rounded(c,cx,cy,240,165,16); c.line(cx-120,cy+55,cx+120,cy+55); c.circle(cx-90,cy+78,5,fill=0,stroke=1); c.circle(cx-72,cy+78,5,fill=0,stroke=1); c.circle(cx-54,cy+78,5,fill=0,stroke=1); c.circle(cx,cy-5,52,fill=0,stroke=1); c.line(cx-52,cy-5,cx+52,cy-5); c.ellipse(cx-25,cy-57,cx+25,cy+47,fill=0,stroke=1)
    elif word=='Programming': rounded(c,cx,cy,240,170,14); c.setFont('DejaVuBold',34); c.drawCentredString(cx,cy+20,'< / >'); c.setFont('DejaVu',18); c.drawString(cx-80,cy-25,'IF  →  THEN'); c.drawString(cx-80,cy-52,'RUN  →  GO!')
    elif word=='QR Code':
        rounded(c,cx,cy,210,210,12); cell=18; startx=cx-72; starty=cy+72; grid=[[1,1,1,0,1,0,1,1],[1,0,1,0,0,1,0,1],[1,1,1,0,1,1,1,0],[0,0,0,1,0,1,0,1],[1,0,1,0,1,1,0,0],[0,1,0,1,0,0,1,1],[1,1,1,0,1,0,1,0],[1,0,1,1,0,1,0,1]]
        for r,row in enumerate(grid):
            for col,v in enumerate(row):
                if v: c.rect(startx+col*cell,starty-r*cell-cell,cell-2,cell-2,fill=0,stroke=1)
    elif word=='Robot': rounded(c,cx,cy+45,150,100,22); c.circle(cx-30,cy+55,10,fill=0,stroke=1); c.circle(cx+30,cy+55,10,fill=0,stroke=1); c.line(cx,cy+95,cx,cy+125); c.circle(cx,cy+132,8,fill=0,stroke=1); rounded(c,cx,cy-60,135,120,18); c.line(cx-68,cy-45,cx-105,cy-10); c.line(cx+68,cy-45,cx+105,cy-10); c.line(cx-35,cy-120,cx-45,cy-155); c.line(cx+35,cy-120,cx+45,cy-155)
    elif word=='Smartphone': rounded(c,cx,cy,120,220,22); rounded(c,cx,cy,95,170,10); face(c,cx,cy+10,1.1); c.circle(cx,cy-95,6,fill=0,stroke=1); limbs(c,cx,cy,120,220)
    elif word=='Tablet': rounded(c,cx,cy,190,235,24); rounded(c,cx,cy+8,160,190,10); face(c,cx,cy+20,1.2); c.circle(cx,cy-100,7,fill=0,stroke=1)
    elif word=='USB': c.line(cx-105,cy-25,cx-20,cy-25); c.line(cx-20,cy-25,cx+20,cy+30); c.line(cx+20,cy+30,cx+70,cy+30); rounded(c,cx+95,cy+30,55,55,8); c.line(cx+82,cy+58,cx+82,cy+80); c.line(cx+108,cy+58,cx+108,cy+80); c.circle(cx-110,cy-25,24,fill=0,stroke=1); face(c,cx-110,cy-25,.5)
    elif word=='Virtual Reality': p=c.beginPath(); p.moveTo(cx-110,cy+40); p.curveTo(cx-95,cy+100,cx+95,cy+100,cx+110,cy+40); p.lineTo(cx+80,cy-35); p.curveTo(cx+30,cy-10,cx-30,cy-10,cx-80,cy-35); p.close(); c.drawPath(p,fill=0,stroke=1); rounded(c,cx-45,cy+35,55,40,10); rounded(c,cx+45,cy+35,55,40,10); c.line(cx-110,cy+45,cx-155,cy+70); c.line(cx+110,cy+45,cx+155,cy+70)
    elif word=='Wi-Fi':
        for r in [45,80,115]: p=c.beginPath(); p.arc(cx-r,cy-r,cx+r,cy+r,40,100); c.drawPath(p,fill=0,stroke=1)
        c.circle(cx,cy-35,10,fill=0,stroke=1); face(c,cx,cy-70,.9)
    elif word=='X-Ray': rounded(c,cx,cy+20,220,190,18); c.setFont('DejaVuBold',24); c.drawCentredString(cx,cy+90,'X-RAY'); c.circle(cx,cy-25,20,fill=0,stroke=1); [c.line(cx+dx,cy-10,cx+dx,cy+55) or c.circle(cx+dx,cy+65,7,fill=0,stroke=1) for dx in [-45,-22,0,22,45]]; c.line(cx-60,cy-60,cx+60,cy-60)
    elif word=='YouTube': rounded(c,cx,cy,230,155,28); p=c.beginPath(); p.moveTo(cx-25,cy+45); p.lineTo(cx+55,cy); p.lineTo(cx-25,cy-45); p.close(); c.drawPath(p,fill=0,stroke=1); face(c,cx,cy-70,.8)
    elif word=='Zoom': rounded(c,cx-25,cy,170,145,18); rounded(c,cx+95,cy,65,70,10); c.line(cx+65,cy+20,cx+125,cy+45); c.line(cx+65,cy-20,cx+125,cy-45); face(c,cx-25,cy,1.1)
    else: rounded(c,cx,cy,180,150,20); face(c,cx,cy,1.2)

def draw_page(c,letter_,word,prompt,page_num=None):
    setup(c); c.roundRect(24,24,W-48,H-48,18,fill=0,stroke=1); c.setFillColor(black); c.setFont('DejaVuBold',68); c.drawString(52,H-112,letter_); c.setFont('DejaVu',48); c.drawString(98,H-112,letter_.lower()); c.setFont('DejaVuBold',26); c.drawRightString(W-48,H-82,"ABC'S OF TECHNOLOGY"); c.setFont('DejaVuBold',30); c.drawRightString(W-48,H-120,word.upper()); c.setLineWidth(1.5); c.line(52,H-140,W-52,H-140); cloud(c,62,H-202,.8); cloud(c,W-168,H-195,.65); star(c,95,H-250,10); star(c,W-86,H-260,9); draw_icon(c,word,W/2,H/2+10); c.setLineWidth(2); c.line(52,192,W-52,192)
    for x in range(65,int(W-60),60): c.line(x,192,x-7,204); c.line(x,192,x+4,208); c.line(x,192,x+10,200)
    c.setFillColor(black); c.setFont('DejaVuBold',15); c.drawString(52,154,'GROWN-UP TALK PROMPT'); c.setFont('DejaVu',13); words=prompt.split(); lines=[]; line=''
    for w in words:
        test=(line+' '+w).strip()
        if pdfmetrics.stringWidth(test,'DejaVu',13)>W-110: lines.append(line); line=w
        else: line=test
    if line: lines.append(line)
    y=133
    for ln in lines[:2]: c.drawString(52,y,ln); y-=18
    c.setFont('DejaVuBold',11); c.drawString(52,62,'PRINT • COLOR • LEARN • EXPLORE'); c.setFont('DejaVu',9); c.drawRightString(W-52,62,'Free family activity • abcoftech.atechspot.com')
    if page_num: c.drawCentredString(W/2,40,str(page_num))
    c.showPage()

for i,(l,w,p) in enumerate(DATA,1):
    slug=w.lower().replace(' ','-').replace('/','-').replace('wi-fi','wifi'); path=IND/f'{l.lower()}-{slug}.pdf'; cc=canvas.Canvas(str(path),pagesize=letter,pageCompression=1); draw_page(cc,l,w,p,1); cc.save()
combined=OUT/'abc-technology-coloring-pages-a-z-26-pages.pdf'; cc=canvas.Canvas(str(combined),pagesize=letter,pageCompression=1)
for i,(l,w,p) in enumerate(DATA,1): draw_page(cc,l,w,p,i)
cc.save(); print(combined); print('generated individual PDFs',len([p for p in IND.glob('[a-z]-*.pdf')]))
