from pathlib import Path
from urllib.request import Request, urlopen
from PIL import Image
from io import BytesIO
import hashlib

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "official-coloring-src"
SRC.mkdir(parents=True, exist_ok=True)
HERO_SRC = ROOT / "official-homepage-src.png"

ASSETS = {
"A_Android.png":"https://d2jqrm6oza8nb6.cloudfront.net/datasets/0e1707e1-57af-42d7-8d68-6c904711ab4a.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiNjk4NjI3NDgyMjc1YTU4ZSIsImJ1Y2tldCI6InJ1bndheS1kYXRhc2V0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc5MDI3MTU2MH0.LfRL0In2JxG0x6PkcDsFm2teQqYh7dfNCP6iphqMUUY",
"B_Bitcoin.png":"https://d2jqrm6oza8nb6.cloudfront.net/datasets/e3df3b6f-9e05-44b1-a201-b96e5a568f2d.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiZTlmMTcwZjI3MWQxM2EzMiIsImJ1Y2tldCI6InJ1bndheS1kYXRhc2V0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc5MDMxNjAxOH0.EoM7inU1L68589ISPshcK5ItSBibbYxvSJ7qYAYZDUY",
"C_Cache.png":"https://d2jqrm6oza8nb6.cloudfront.net/datasets/ff722c8c-1762-459d-9ef3-cc8b400f6686.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiYzFlMGNkMzhhMDk2YmQ1YSIsImJ1Y2tldCI6InJ1bndheS1kYXRhc2V0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc5MDMyODg4OH0.BFLeHmFh2cLumU9lQU10RyoPYkzO9zjk4ZHhgMyqO8E",
"D_Drone.png":"https://d2jqrm6oza8nb6.cloudfront.net/datasets/bc8eb05e-fc01-479d-9991-7d3c6750120f.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiYmExNjRhMDcyNTI5YWRjOSIsImJ1Y2tldCI6InJ1bndheS1kYXRhc2V0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc5MDMzOTcxOX0.Py4WKRRc92vPQLtFrciwaN2mbkapSCxQY2bmude0LYc",
"E_Email.png":"https://d2jqrm6oza8nb6.cloudfront.net/datasets/8e734b87-1410-41eb-86b9-b83a5f5793a8.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiN2QzMDY4NWNjYTVmMDQxMyIsImJ1Y2tldCI6InJ1bndheS1kYXRhc2V0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc5MDMyMTI0NH0.MGHfBaveZc13thc58I7QZmGLs5lUPrUjMA8phxtg40g",
"F_Floppy_Disk.png":"https://d2jqrm6oza8nb6.cloudfront.net/datasets/a23527f2-b304-42d7-b7ef-81e4e3a21818.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiN2I0YzVjYWFkZDU2YmZmMSIsImJ1Y2tldCI6InJ1bndheS1kYXRhc2V0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc5MDMwNzYyNn0.eJLsHzExpaXhjPn4MGgUMfQy1je7D8S5Im9uPmFoelk",
"G_Gaming.png":"https://d2jqrm6oza8nb6.cloudfront.net/datasets/25b193d3-0b75-489e-a530-eace48008889.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiZGYyMDUzY2EwNzRmZmJhYiIsImJ1Y2tldCI6InJ1bndheS1kYXRhc2V0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc5MDI3OTM3MH0.xodlFVyMdJZD10fwWAXRh3QmouQqf3bekWgIWxNL5mo",
"H_Hardware.png":"https://d2jqrm6oza8nb6.cloudfront.net/datasets/910613e8-3a59-4e3a-b9cc-d3587d0e7aa7.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiOTJiYWJiN2E2OGIzZTEzZCIsImJ1Y2tldCI6InJ1bndheS1kYXRhc2V0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc5MDI5NjgyNn0.fxYSbSlmoZgM7GDfqDQziKBpCrQhiSh4uft_tX8dzew",
"I_Internet.png":"https://d2jqrm6oza8nb6.cloudfront.net/datasets/78fcaced-814b-45b0-830a-df2e5395c9e1.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiNzMwZjViNmU1YWQ1YjRjNCIsImJ1Y2tldCI6InJ1bndheS1kYXRhc2V0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc5MDMzMTg4Nn0.Zo2LG9o2sxS3VDYkWvXE_CaTplSdIZsJ8sjmK4xJbGI",
"J_Joystick.png":"https://d2jqrm6oza8nb6.cloudfront.net/datasets/8e0d50a7-3f64-4f37-99fe-434240c85b01.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiM2E4MzUxMThmOWZmZjM3YSIsImJ1Y2tldCI6InJ1bndheS1kYXRhc2V0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc5MDMwMjEwNH0.-v1knqbC02MpGk4h3-OT37McVqfNDvRPok5ux9TVn68",
"K_Keyboard.png":"https://d2jqrm6oza8nb6.cloudfront.net/datasets/6d45ddeb-0e9b-40df-b5eb-bd988628ac6b.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiNDMxZTFkOWEwNjJmMGUwZiIsImJ1Y2tldCI6InJ1bndheS1kYXRhc2V0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc5MDI5MDMzMH0.XeWZw3-kwOFmUD6Lqky-TcYzIOCzytm2c_wWpH0_PIc",
"L_Laptop.png":"https://d2jqrm6oza8nb6.cloudfront.net/datasets/6faeadaf-1983-4bc9-9da2-996854147331.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiYTJkZGFlODI5Y2QxYmI0ZiIsImJ1Y2tldCI6InJ1bndheS1kYXRhc2V0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc5MDMzMTUyMn0.UDY3f4xdWZFU3-CCX2uTBxDPRkntRICbMAx88HJB2Eo",
"M_Mouse.png":"https://d2jqrm6oza8nb6.cloudfront.net/datasets/d8c09c63-529f-4684-b78a-2b87d9edeee4.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiMTQ5NTgyZjk5ZGViNzMxMyIsImJ1Y2tldCI6InJ1bndheS1kYXRhc2V0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc5MDI5NjMxM30.UYRQRjVfqD_mjR9sTrsqEi_6AIOMlD2NsHni19A-cxw",
"N_Network.png":"https://d2jqrm6oza8nb6.cloudfront.net/datasets/0ab3f0b8-ef9b-46cb-83f7-3dbddbc73590.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiMGQwZjVjYmIxZTFhYmI3NSIsImJ1Y2tldCI6InJ1bndheS1kYXRhc2V0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc5MDI5NDU4N30.dt2Dgwmknud86XwJwlC-LZ-baiGxN3Z5uiMK-hBUBMI",
"O_Operating_System.png":"https://d2jqrm6oza8nb6.cloudfront.net/datasets/1945bf54-2bea-43df-8538-86da830f096e.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiMTYyZDE5ZWIxMjg0YThmOCIsImJ1Y2tldCI6InJ1bndheS1kYXRhc2V0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc5MDMxMDUwN30.Re-E5xgGGIk3tK5TZzJjyuJB2FH4o-45lQgeNmysZGw",
"P_Programming.png":"https://d2jqrm6oza8nb6.cloudfront.net/datasets/66a0508c-2dc9-4e4b-b84d-0af16893aba2.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiMzhmNGVmMTMxNWMzMjlmOSIsImJ1Y2tldCI6InJ1bndheS1kYXRhc2V0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc5MDI4NjQ4M30.RvSZ764zG0oKKQlziZtGmO-_UUJjhR3Gmxt8LvVnc0s",
"Q_QR_Code.png":"https://d2jqrm6oza8nb6.cloudfront.net/datasets/567b03d6-462e-4151-9aad-fadee872c2b4.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiMjEwZGIyZjJhNDUzZWZhNyIsImJ1Y2tldCI6InJ1bndheS1kYXRhc2V0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc5MDMyNTEwNn0.AvXczlN9-9HWgmooYbbyVJVL4mkPX9QcU4If9z6Gr9o",
"R_Robot.png":"https://d2jqrm6oza8nb6.cloudfront.net/datasets/d7ab81a5-22db-4ae0-9a35-4de5dbeea736.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiNTBmOTQwOGMzZmQyNWU0YyIsImJ1Y2tldCI6InJ1bndheS1kYXRhc2V0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc5MDMzOTQ2OH0.ylFm4MIWUPzGidCYtAXogsOxYjdbyFNTckm0ACUc-gE",
"S_Smartphone.png":"https://d2jqrm6oza8nb6.cloudfront.net/datasets/2c8ac754-03c4-43ae-88d5-5f7e3ed794a4.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiNjlkZDI0MDUxOTZiNjY5NyIsImJ1Y2tldCI6InJ1bndheS1kYXRhc2V0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc5MDI2OTk1N30.F-jeJmiH79j9MX57dUORgGx9C9quueeGHZUu1Mahy0c",
"T_Technology.png":"https://d2jqrm6oza8nb6.cloudfront.net/datasets/8e747764-3d17-44ab-8a7a-7e527f005614.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiMGQ4ZTRiMWQyN2M3MjFmYyIsImJ1Y2tldCI6InJ1bndheS1kYXRhc2V0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc5MDMxODc0OX0.BI3_2yWRkJcivb6MVmYPX3yOlHJq727v36hauyTJoOk",
"U_USB.png":"https://d2jqrm6oza8nb6.cloudfront.net/datasets/e76fd836-551d-4e1f-80e0-1e187cea152b.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiZWU3NTBlYTViY2YxNThkYSIsImJ1Y2tldCI6InJ1bndheS1kYXRhc2V0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc5MDI3NzY2OX0.0BY-d-qEUY6xQtGcY3EBeW4J_Zm97S66_OM8Hh_PHlI",
"V_Virtual_Reality.png":"https://d2jqrm6oza8nb6.cloudfront.net/datasets/ab14f1eb-917f-4560-a970-d15d3a15c113.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiNjQxMmNjOTMwOGNlMjNhMCIsImJ1Y2tldCI6InJ1bndheS1kYXRhc2V0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc5MDMyMzIxOX0.ezwfZKXJDfyNXyyo3GNksnj75EddRlk6hslF7EZUyLE",
"W_WiFi.png":"https://d2jqrm6oza8nb6.cloudfront.net/datasets/42702868-1010-4a09-b7b8-2aca1f7eaf88.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiY2YwYjI3NzQyM2JjNDIzNiIsImJ1Y2tldCI6InJ1bndheS1kYXRhc2V0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc5MDI4MzUwOH0.VX16yiMAG8_T0wQDGx1UIWi_XXXgWEHun55r8GioQGg",
"X_XTC.png":"https://d2jqrm6oza8nb6.cloudfront.net/datasets/79450b23-d813-4cb4-b9c1-1f1d8182cdf4.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiNDM4YzVlNzdjOWVkZGQ5YyIsImJ1Y2tldCI6InJ1bndheS1kYXRhc2V0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc5MDM0NDY5NX0.MlHe7HW4X5uYE7RtafYltLi1GYiSFOaCdi0zq4tIQNg",
"Y_YouTube.png":"https://d2jqrm6oza8nb6.cloudfront.net/datasets/c9c06b67-38ff-417f-9326-8f0615346237.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiNTg4NzFhZmE0MjYwMWRiNSIsImJ1Y2tldCI6InJ1bndheS1kYXRhc2V0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc5MDMyNzY3NH0.VHHlFsFA2_sGYeEIMrt-YyMfgExz0KyuSdjAwhqPbSI",
"Z_Zoom.png":"https://d2jqrm6oza8nb6.cloudfront.net/datasets/1733812b-8555-49ab-99ee-0bda9c08db48.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiOTdjY2QyZDdjNmMwM2M4YiIsImJ1Y2tldCI6InJ1bndheS1kYXRhc2V0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc5MDM1MDkzNX0.47Bx7jidH-kxZopsvnKYVuINhClV11VwaS6Lib5MvlE"
}

HERO_URL = "https://d2jqrm6oza8nb6.cloudfront.net/datasets/8bf616f6-90ff-4944-9c53-f345d545d007.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiYmFmZjgxNTg3MTY2MWFjMSIsImJ1Y2tldCI6InJ1bndheS1kYXRhc2V0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc5MDMzMDk2OH0.TRDtpIXaUNmUJOQl5xk93jqqG4CdxRW-B9AJCe9Wz4o"

def fetch(url, dest):
    if dest.exists() and dest.stat().st_size > 10000:
        return
    req = Request(url, headers={"User-Agent":"Mozilla/5.0"})
    raw = urlopen(req, timeout=60).read()
    if len(raw) < 10000:
        raise RuntimeError(f"Downloaded asset too small: {dest.name} ({len(raw)} bytes)")
    Image.open(BytesIO(raw)).verify()
    dest.write_bytes(raw)
    print("downloaded", dest.name, len(raw))

for name, url in ASSETS.items():
    fetch(url, SRC / name)

fetch(HERO_URL, HERO_SRC)

if len(list(SRC.glob("*.png"))) != 26:
    raise SystemExit("Expected exactly 26 official coloring source PNGs")
print("Official visual source assets ready.")
