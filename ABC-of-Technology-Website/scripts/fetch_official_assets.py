from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "official-coloring-src"
HERO_SRC = ROOT / "official-homepage-src.png"

expected = [
"A_Android.png","B_Bitcoin.png","C_Cache.png","D_Drone.png","E_Email.png",
"F_Floppy_Disk.png","G_Gaming.png","H_Hardware.png","I_Internet.png","J_Joystick.png",
"K_Keyboard.png","L_Laptop.png","M_Mouse.png","N_Network.png","O_Operating_System.png",
"P_Programming.png","Q_QR_Code.png","R_Robot.png","S_Smartphone.png","T_Technology.png",
"U_USB.png","V_Virtual_Reality.png","W_WiFi.png","X_XTC.png","Y_YouTube.png","Z_Zoom.png",
]

missing=[name for name in expected if not (SRC/name).exists() or (SRC/name).stat().st_size < 10000]
if missing:
    raise SystemExit("Missing approved coloring sources: "+", ".join(missing))

for name in expected:
    im=Image.open(SRC/name)
    if im.width < 1000 or im.height < 1300:
        raise SystemExit(f"Approved source {name} unexpectedly small: {im.size}")

if not HERO_SRC.exists() or HERO_SRC.stat().st_size < 100000:
    raise SystemExit("Approved homepage source is missing")
hero=Image.open(HERO_SRC)
if hero.width < 1400 or hero.height < 800:
    raise SystemExit(f"Approved homepage source unexpectedly small: {hero.size}")

print("Approved ABC production artwork is present locally and verified.")
