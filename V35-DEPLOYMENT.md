# ATechSpot V35 — Stable Main-Site Route + Premium Redesign

- Root `/` is the intro only.
- Enter buttons are plain static links to `/main-site/` (no JavaScript navigation, no sessionStorage).
- `/main-site/` is a real folder containing `index.html`; no `_redirects` rule is needed for it.
- All Home/brand links point to `/main-site/`, so users do not return to the intro accidentally.
- Existing content, forms, functions, services, policies, and integrations remain present.
- Added V35 premium site-wide visual refinement layer.
