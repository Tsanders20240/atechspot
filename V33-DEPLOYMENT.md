# ATechSpot V33 — Native /home Directory Fix

This release removes the `/home -> /home.html` Pages rewrite that could conflict with Cloudflare Pages clean-URL canonicalization and cause a redirect loop.

## Routing
- `/` serves the intro (`index.html`).
- ENTER SITE links to `/home/`.
- `/home/` serves `home/index.html` natively, with no redirect or rewrite.
- The previous top-level `home.html` file is removed.

This keeps the full ATechSpot homepage intact while eliminating the `/home` rewrite/canonicalization conflict.
