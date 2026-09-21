from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.colors import HexColor, black, white
from PIL import Image, ImageDraw, ImageFont

ROOT=Path(__file__).resolve().parents[1]
PREV=ROOT/'public'/'assets'/'activities'
PDF=ROOT/'public'/'downloads'/'activities'
PREV.mkdir(parents=True,exist_ok=True)
PDF.mkdir(parents=True,exist_ok=True)
W,H=letter
BOLD='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
REG='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'

def make_pdf(filename,letter_code,title,subtitle,steps,challenge,prompts,accent):
    p=PDF/filename
    c=canvas.Canvas(str(p),pagesize=letter)
    c.setFillColor(HexColor(accent)); c.roundRect(24,H-150,W-48,118,20,fill=1,stroke=0)
    c.setFillColor(white); c.setFont('Helvetica-Bold',13); c.drawString(45,H-65,"ABC's of Technology • A+ Techucation")
    c.setFont('Helvetica-Bold',31); c.drawString(45,H-105,f'{letter_code} — {title}')
    c.setFont('Helvetica',11); c.drawString(45,H-130,subtitle)
    c.setFillColor(black); c.setFont('Helvetica-Bold',18); c.drawString(45,H-195,'LEARN & DO')
    y=H-235
    colors=['#1677ff','#19a85b','#8a5df4']
    for i,(head,body) in enumerate(steps,1):
        c.setFillColor(HexColor(colors[i-1])); c.circle(58,y+5,14,fill=1,stroke=0)
        c.setFillColor(white); c.setFont('Helvetica-Bold',11); c.drawCentredString(58,y+1,str(i))
        c.setFillColor(HexColor('#102a56')); c.setFont('Helvetica-Bold',14); c.drawString(82,y,head)
        c.setFillColor(black); c.setFont('Helvetica',10.5); c.drawString(82,y-18,body); y-=74
    c.setFillColor(HexColor('#eef6ff')); c.roundRect(45,235,W-90,150,16,fill=1,stroke=0)
    c.setFillColor(HexColor('#102a56')); c.setFont('Helvetica-Bold',16); c.drawString(65,355,'DRAW / LABEL')
    c.setFont('Helvetica',10.5); c.drawString(65,336,challenge)
    c.setStrokeColor(HexColor('#7aa4d9')); c.setDash(3,3); c.rect(65,255,W-130,65,fill=0,stroke=1); c.setDash()
    c.setFillColor(HexColor('#fff6d8')); c.roundRect(45,80,W-90,120,16,fill=1,stroke=0)
    c.setFillColor(HexColor('#8a5b00')); c.setFont('Helvetica-Bold',15); c.drawString(65,175,'TALK ABOUT IT')
    c.setFillColor(black); c.setFont('Helvetica',10.5); c.drawString(65,145,'• '+prompts[0]); c.drawString(65,120,'• '+prompts[1])
    c.setFont('Helvetica-Oblique',8.5); c.setFillColor(HexColor('#5b6578')); c.drawRightString(W-45,45,'Use with a parent, guardian, teacher, or other grown-up.')
    c.save()
    return p

def make_preview(filename,letter_code,title,steps,accent):
    w,h=1200,1550
    im=Image.new('RGB',(w,h),'white'); d=ImageDraw.Draw(im)
    def F(size,b=False):
        return ImageFont.truetype(BOLD if b else REG,size)
    d.rounded_rectangle((28,28,w-28,245),36,fill=accent)
    d.text((58,54),"ABC's OF TECHNOLOGY",font=F(44,True),fill='white')
    d.text((58,118),f'{letter_code} — {title}',font=F(62,True),fill='white')
    d.rounded_rectangle((45,285,w-45,1495),42,fill='#fbfdff',outline=accent,width=5)
    d.text((80,330),'LEARN & DO',font=F(42,True),fill='#102a56')
    y=430
    for i,(head,body) in enumerate(steps,1):
        d.ellipse((82,y,142,y+60),fill=accent); d.text((101,y+8),str(i),font=F(30,True),fill='white')
        d.text((170,y),head,font=F(30,True),fill='#102a56'); d.text((170,y+48),body,font=F(23),fill='#4d6078'); y+=170
    d.rounded_rectangle((80,980,1120,1240),24,fill='#edf5ff',outline='#8db4e5',width=3)
    d.text((110,1015),'DRAW / LABEL',font=F(34,True),fill='#102a56'); d.rectangle((110,1080,1090,1200),outline='#8db4e5',width=3)
    d.rounded_rectangle((80,1280,1120,1435),24,fill='#fff4ce',outline='#efbd3b',width=3)
    d.text((110,1315),'TALK ABOUT IT',font=F(30,True),fill='#8a5b00')
    d.text((110,1370),'Think • explain • create with a grown-up',font=F(24),fill='#3e495c')
    out=PREV/filename; im.save(out,'WEBP',quality=94,method=6); return out

items=[
('f-floppy-flash-drive-activity.pdf','f-floppy-flash-drive-activity.webp','F','Floppy Disk & Flash Drive','Compare old and new ways to save digital files.',
 [('Compare old vs. new','How are floppy disks and flash drives different?'),('Sort storage jobs','What kinds of files can they hold?'),('Protect your files','Think about safe storage habits.')],
 'Draw a floppy disk on one side and a flash drive on the other.',
 ['How did people save files before flash drives?','What is one safe way to protect a USB or flash drive?'],'#1e8f5a'),
('g-game-controller-activity.pdf','g-game-controller-activity.webp','G','Game Controller','Explore how buttons and controls send instructions.',
 [('Find the controls','Buttons, sticks and direction pads.'),('Map an action','What does each control do?'),('Design a new button','Invent a helpful game control.')],
 'Design your own game controller and label three controls.',
 ['What buttons or controls help a player move?','How can games teach problem solving?'],'#1677ff'),
('h-headphones-activity.pdf','h-headphones-activity.webp','H','Headphones','Learn how headphones help us listen privately and safely.',
 [('Name the parts','Band, ear cups and connection.'),('Practice safe listening','Keep volume at a safe level.'),('Compare sound tools','Headphones or speakers?')],
 'Draw headphones and label the parts you know.',
 ['Why should volume stay at a safe level?','When are headphones useful for learning?'],'#8357e8')
]
for pdf,preview,l,title,subtitle,steps,challenge,prompts,accent in items:
    make_pdf(pdf,l,title,subtitle,steps,challenge,prompts,accent)
    make_preview(preview,l,title,steps,accent)
print('Built F/G/H activity PDFs and previews.')
