from pathlib import Path
from PIL import Image
import zipfile, re, shutil

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "official-coloring-src"
PUBLIC = ROOT / "public"
ASSET_OUT = PUBLIC / "assets" / "coloring-pages"
DL_OUT = PUBLIC / "downloads" / "coloring-pages"
ASSET_OUT.mkdir(parents=True, exist_ok=True)
DL_OUT.mkdir(parents=True, exist_ok=True)

PAGES = [
("A","Android","A_Android.png","a-android"),
("B","Bitcoin","B_Bitcoin.png","b-bitcoin"),
("C","Cache","C_Cache.png","c-cache"),
("D","Drone","D_Drone.png","d-drone"),
("E","Email","E_Email.png","e-email"),
("F","Floppy Disk","F_Floppy_Disk.png","f-floppy-disk"),
("G","Gaming","G_Gaming.png","g-gaming"),
("H","Hardware","H_Hardware.png","h-hardware"),
("I","Internet","I_Internet.png","i-internet"),
("J","Joystick","J_Joystick.png","j-joystick"),
("K","Keyboard","K_Keyboard.png","k-keyboard"),
("L","Laptop","L_Laptop.png","l-laptop"),
("M","Mouse","M_Mouse.png","m-mouse"),
("N","Network","N_Network.png","n-network"),
("O","Operating System","O_Operating_System.png","o-operating-system"),
("P","Programming","P_Programming.png","p-programming"),
("Q","QR Code","Q_QR_Code.png","q-qr-code"),
("R","Robot","R_Robot.png","r-robot"),
("S","Smartphone","S_Smartphone.png","s-smartphone"),
("T","Technology","T_Technology.png","t-technology"),
("U","USB","U_USB.png","u-usb"),
("V","Virtual Reality","V_Virtual_Reality.png","v-virtual-reality"),
("W","Wi-Fi","W_WiFi.png","w-wifi"),
("X","XTC","X_XTC.png","x-xtc"),
("Y","YouTube","Y_YouTube.png","y-youtube"),
("Z","Zoom","Z_Zoom.png","z-zoom"),
]

missing=[name for _,_,name,_ in PAGES if not (SRC/name).exists()]
if missing:
    raise SystemExit("Missing official coloring sources: "+", ".join(missing))

pdf_pages=[]
for letter,word,filename,slug in PAGES:
    src=SRC/filename
    im=Image.open(src).convert("RGB")
    if im.width < 1000 or im.height < 1300:
        raise SystemExit(f"Official page {filename} unexpectedly small: {im.size}")
    # Website preview: exact supplied artwork, optimized for fast loading.
    preview=im.copy()
    preview.thumbnail((900,1200), Image.Resampling.LANCZOS)
    preview.save(ASSET_OUT/f"{slug}.webp","WEBP",quality=88,method=6)

    # Printable PDF: preserve the supplied page on a clean US-Letter canvas.
    canvas=Image.new("RGB",(2550,3300),"white")
    printable=im.copy()
    printable.thumbnail((2310,3060), Image.Resampling.LANCZOS)
    canvas.paste(printable,((2550-printable.width)//2,(3300-printable.height)//2))
    out_pdf=DL_OUT/f"{slug}.pdf"
    canvas.save(out_pdf,"PDF",resolution=300.0,quality=92)
    pdf_pages.append(canvas)

combined=DL_OUT/"abc-technology-coloring-pages-a-z-26-pages.pdf"
pdf_pages[0].save(combined,"PDF",save_all=True,append_images=pdf_pages[1:],resolution=300.0,quality=90)

groups=[
("A-J_Tech_Coloring_Pages.zip",range(0,10)),
("K-T_Tech_Coloring_Pages.zip",range(10,20)),
("U-Z_Tech_Coloring_Pages.zip",range(20,26)),
]
for zip_name,indexes in groups:
    with zipfile.ZipFile(DL_OUT/zip_name,"w",zipfile.ZIP_DEFLATED) as z:
        for i in indexes:
            slug=PAGES[i][3]
            z.write(DL_OUT/f"{slug}.pdf",arcname=f"{PAGES[i][0]}_{PAGES[i][1].replace(' ','_')}.pdf")

with zipfile.ZipFile(DL_OUT/"ABC_Tech_Coloring_Pages_A-Z_26_Page_Combined.zip","w",zipfile.ZIP_DEFLATED) as z:
    for letter,word,_,slug in PAGES:
        z.write(DL_OUT/f"{slug}.pdf",arcname=f"{letter}_{word.replace(' ','_')}.pdf")

print("Built official 26-page coloring set from supplied artwork.")
