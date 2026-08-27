# ATechSpot V24 — Cloudflare-ready deployment

This package supports both current Cloudflare Pages upload methods.

## Recommended: Wrangler production deployment

1. Extract the ZIP.
2. Open the extracted folder.
3. Double-click `DEPLOY-V24-WINDOWS.bat`.
4. Sign in to the Cloudflare account that owns ATechSpot when prompted.
5. Wait for the deployment URL.

The command publishes to the existing `atechspot-v5` Pages project and production branch `main`.

## Dashboard ZIP deployment

Upload this ZIP through Workers & Pages > your project > Create deployment > Production. V24 includes `_worker.js`, so dashboard ZIP deployment retains form routes instead of ignoring the old `functions` directory.

## Required production variables

Keep these in Cloudflare Pages > Settings > Variables and Secrets:

- `RESEND_API_KEY` — encrypted secret
- `FORM_TO_EMAIL` — `aplustechucation@gmail.com`
- `FORM_FROM_EMAIL` — use `A+ Techucation Website <onboarding@resend.dev>` until a sending domain is verified

## Verify after deployment

- `/` shows the monochrome video introduction.
- `/digital-products` shows six small-business products.
- `/business-intake` loads the company intake.
- `/api/form-health` returns `ok: true`.
- Submit one production intake and confirm email receipt.
