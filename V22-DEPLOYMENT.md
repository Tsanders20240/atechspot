# V22 Deployment — Cloudflare Pages

This package keeps the existing Cloudflare Pages structure.

1. Back up the currently deployed project.
2. Upload/deploy the entire V22 folder contents to the same Pages project.
3. Keep these environment variables/secrets configured:
   - `RESEND_API_KEY`
   - `FORM_TO_EMAIL` (optional; defaults to aplustechucation@gmail.com)
   - `FORM_FROM_EMAIL` (optional; use a verified sender when available)
4. Verify `/api/form-health` returns `ok: true`.
5. Test:
   - `/contact`
   - `/intake`
   - `/data-recovery`
   - `/business-audit.html`
   - `/ai-readiness.html`
   - consultation links
   - mobile menu
   - BotPenguin chat
6. Confirm GA4 and Clarity events after deployment.
7. Clear Cloudflare cache if the prior homepage remains visible.

No Apple, Microsoft, or Lucid assets are required by this build.
