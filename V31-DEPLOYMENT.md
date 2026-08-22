# ATechSpot V31 — True Two-Page Intro

- `/` is now a static, JavaScript-free intro page.
- `ENTER SITE` and `Skip intro` navigate directly to `/home`.
- `/home` serves the complete existing ATechSpot homepage from `home.html`.
- The homepage contains no intro overlay, no sessionStorage gate, no intro animation controller, and no V30 intro assets.
- Internal Home links point to `/home`, so normal site navigation does not reopen the splash.
- Critical intro background/layout CSS is inline to prevent a white pre-paint flash.
