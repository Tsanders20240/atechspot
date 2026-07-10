# AtechSpot Version 5 Deployment

## Before forms work
Replace `YOUR_TURNSTILE_SITE_KEY` in:
- intake.html
- contact.html
- business-audit.html
- ai-readiness.html

Cloudflare Pages secrets:
- TURNSTILE_SECRET_KEY
- RESEND_API_KEY

Cloudflare Pages variables:
- FORM_TO_EMAIL=aplustechucation@gmail.com
- FORM_FROM_EMAIL=A+ Techucation Forms <forms@YOUR_VERIFIED_DOMAIN>
- ALLOWED_HOSTS=www.atechspot.com

## Deploy
Upload all files to the root of the GitHub repository connected to Cloudflare Pages.

Commit message:
Launch AtechSpot Version 5

Cloudflare will redeploy automatically.

## Test
- /
- /learning.html
- /downloads/abcs-of-technology-coloring-activity-book.pdf
- /intake.html
- /contact.html
- /business-audit.html
- /ai-readiness.html
- /robots.txt
- /sitemap.xml
