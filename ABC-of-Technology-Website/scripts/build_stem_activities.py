from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.colors import HexColor, black, white

ROOT=Path(__file__).resolve().parents[1]
PREV=ROOT/'public'/'assets'/'activities'
PDF=ROOT/'public'/'downloads'/'activities'
PREV.mkdir(parents=True,exist_ok=True)
PDF.mkdir(parents=True,exist_ok=True)

BOLD='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
REG='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
def F(size,b=False):
    return ImageFont.truetype(BOLD if b else REG,size)

def header(draw,w,title,subtitle,color):
    draw.rounded_rectangle((24,24,w-24,245),36,fill=color)
    draw.text((58,50),"ABC's OF TECHNOLOGY",font=F(46,True),fill='white')
    draw.text((58,108),title,font=F(72,True),fill='white')
    draw.text((58,190),subtitle,font=F(27,True),fill='#eaffff')

def battery_preview():
    w,h=1200,1550
    im=Image.new('RGB',(w,h),'#effff2'); d=ImageDraw.Draw(im)
    header(d,w,'Battery Hunt','Explore safe battery-powered technology with a grown-up.','#08a64b')
    d.rounded_rectangle((45,285,w-45,1485),42,fill='white',outline='#20b95b',width=5)
    d.text((80,330),'1  LOOK & FIND',font=F(48,True),fill='#087a36')
    d.text((80,400),'Circle or check the battery-powered items.',font=F(30),fill='#12324c')
    items=[('TV Remote','▣'),('Toy Car','🚗'),('Flashlight','🔦'),('Game Controller','🎮'),('Clock','🕒'),('Computer Mouse','🖱️'),('Calculator','▦'),('Smoke Alarm','◉'),('Musical Card','♫')]
    x0,y0=90,490
    for i,(name,ico) in enumerate(items):
        r,c=divmod(i,3); x=x0+c*350; y=y0+r*235
        d.rounded_rectangle((x,y,x+290,y+185),24,fill='#f7fff8',outline='#7fd99c',width=3)
        d.text((x+112,y+24),ico,font=F(56),fill='#17304f')
        d.rectangle((x+18,y+130,x+48,y+160),outline='#08a64b',width=4)
        d.text((x+62,y+128),name,font=F(22,True),fill='#17304f')
    d.rounded_rectangle((80,1230,1120,1430),24,fill='#f7f0ff',outline='#8e57e8',width=4)
    d.text((110,1260),'2  THINK ABOUT IT',font=F(36,True),fill='#6a35bd')
    d.text((110,1320),'How do batteries help technology work?',font=F(28),fill='#17304f')
    d.text((110,1368),'Write or draw your idea on the printable page.',font=F(24),fill='#53657c')
    out=PREV/'battery-hunt.webp'; im.save(out,'WEBP',quality=94,method=6)
    return out

def stand_preview():
    w,h=1200,1550
    im=Image.new('RGB',(w,h),'#fff9ea'); d=ImageDraw.Draw(im)
    header(d,w,'Phone Stand','Build a simple stand with cardboard.','#ff8a18')
    d.rounded_rectangle((45,285,w-45,1485),42,fill='white',outline='#ffb13c',width=5)
    d.text((80,330),'WHAT YOU NEED',font=F(44,True),fill='#d76b00')
    needs=[('Cardboard','▰'),('Scissors','✂'),('Marker','🖊'),('Ruler','📏'),('Tape','▣')]
    for i,(name,ico) in enumerate(needs):
        x=80+i*210
        d.rounded_rectangle((x,405,x+175,560),22,fill='#fffaf0',outline='#ffc36a',width=3)
        d.text((x+55,430),ico,font=F(48),fill='#17304f')
        d.text((x+24,510),name,font=F(20,True),fill='#17304f')
    d.text((80,620),'STEP-BY-STEP',font=F(44,True),fill='#0b80ce')
    steps=[('1','Cut the Base','Cut a rectangle from cardboard.'),('2','Add the Slot','Cut a small slot near the middle.'),('3','Stand It Up','Slide the back piece into the slot.'),('4','Decorate','Add color, shapes or stickers.')]
    for i,(n,t,desc) in enumerate(steps):
        y=690+i*170
        d.ellipse((82,y,142,y+60),fill=['#1677ff','#18aa50','#ff7d19','#8a56e8'][i])
        d.text((101,y+8),n,font=F(32,True),fill='white')
        d.text((170,y),t,font=F(31,True),fill='#17304f')
        d.text((170,y+48),desc,font=F(24),fill='#53657c')
    d.rounded_rectangle((80,1370,1120,1450),22,fill='#eafff0',outline='#36b968',width=3)
    d.text((110,1393),'TRY IT!  Test your stand with a grown-up.',font=F(25,True),fill='#087a36')
    out=PREV/'phone-stand.webp'; im.save(out,'WEBP',quality=94,method=6)
    return out

def pdf_battery():
    p=PDF/'battery-hunt.pdf'; c=canvas.Canvas(str(p),pagesize=letter); W,H=letter
    c.setFillColor(HexColor('#08a64b')); c.roundRect(24,H-160,W-48,125,20,fill=1,stroke=0)
    c.setFillColor(white); c.setFont('Helvetica-Bold',26); c.drawString(45,H-82,"ABC's of Technology — Battery Hunt")
    c.setFont('Helvetica',12); c.drawString(45,H-108,'Find safe battery-powered items with a grown-up.')
    c.setFillColor(black); c.setFont('Helvetica-Bold',18); c.drawString(45,H-205,'1. Look and Find')
    c.setFont('Helvetica',12); c.drawString(45,H-228,'Check each battery-powered item you find at home.')
    names=['TV Remote','Toy Car','Flashlight','Game Controller','Clock','Computer Mouse','Calculator','Smoke Alarm','Musical Card']
    y=H-275
    for i,n in enumerate(names):
        col=i%3; row=i//3; x=50+col*175; yy=y-row*75
        c.rect(x,yy,18,18,fill=0,stroke=1); c.drawString(x+28,yy+3,n)
    c.setFont('Helvetica-Bold',18); c.drawString(45,260,'2. Count & Write')
    c.setFont('Helvetica',12); c.drawString(45,238,'How many battery-powered items did you find?')
    c.rect(310,220,90,35,fill=0,stroke=1)
    c.setFont('Helvetica-Bold',18); c.drawString(45,180,'3. Think About It')
    c.setFont('Helvetica',12); c.drawString(45,158,'How do batteries help these devices work? Draw or write below.')
    c.rect(45,55,W-90,85,fill=0,stroke=1)
    c.save()

def pdf_stand():
    p=PDF/'phone-stand.pdf'; c=canvas.Canvas(str(p),pagesize=letter); W,H=letter
    c.setFillColor(HexColor('#ff8a18')); c.roundRect(24,H-160,W-48,125,20,fill=1,stroke=0)
    c.setFillColor(white); c.setFont('Helvetica-Bold',26); c.drawString(45,H-82,"ABC's of Technology — Phone Stand")
    c.setFont('Helvetica',12); c.drawString(45,H-108,'Build a simple stand with cardboard and a grown-up.')
    c.setFillColor(black); c.setFont('Helvetica-Bold',18); c.drawString(45,H-205,'What You Need')
    c.setFont('Helvetica',12); c.drawString(45,H-230,'Cardboard • Scissors (grown-up use) • Marker • Ruler • Tape')
    steps=[('1. Cut the Base','Cut a cardboard rectangle about 6 × 3 inches.'),('2. Add the Slot','Cut a small slot near the middle.'),('3. Stand It Up','Slide the back piece into the slot to form a stand.'),('4. Decorate','Add color, shapes or stickers.')]; y=H-285
    for title,desc in steps:
        c.setFont('Helvetica-Bold',16); c.drawString(55,y,title)
        c.setFont('Helvetica',11); c.drawString(75,y-20,desc); y-=85
    c.setFont('Helvetica-Bold',18); c.drawString(45,215,'Try It!')
    c.setFont('Helvetica',12); c.drawString(45,192,'Test the stand with a small device. What would you change?')
    c.rect(45,70,W-90,95,fill=0,stroke=1)
    c.save()

battery_preview(); stand_preview(); pdf_battery(); pdf_stand()
print('Built 2 clear STEM activity previews and 2 printable PDFs.')
