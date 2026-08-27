# AtechSpot Version 6 Deployment

This release embeds the full professional stylesheet directly into every HTML page.
It cannot fall back to raw unstyled text if the assets folder fails to load.

## Included
- Premium responsive homepage
- Featured YouTube video on homepage and Learning Center
- Secure client intake, contact, business audit, and AI readiness forms
- ABCs of Technology book, Kindle, author, music, lyric video, and PDF
- eBay store and Builderall links
- Cloudflare Pages Function
- Turnstile support
- Resend email support
- SEO, sitemap, robots, redirects, headers, 404 page

## Upload
Upload the CONTENTS of this folder to the root of:
Tsanders20240/atechspot

Commit:
Launch AtechSpot Version 6

## Forms
Replace YOUR_TURNSTILE_SITE_KEY in each form page.
Add Cloudflare secrets:
- TURNSTILE_SECRET_KEY
- RESEND_API_KEY

Add variables:
- FORM_TO_EMAIL=aplustechucation@gmail.com
- FORM_FROM_EMAIL=A+ Techucation Forms <forms@YOUR_VERIFIED_DOMAIN>
- ALLOWED_HOSTS=www.atechspot.com
