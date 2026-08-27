# AtechSpot Final 10/10 Deployment

This package consolidates all prior fixes and additions:

- Google Analytics 4 on every HTML page
- Microsoft Clarity on every HTML page
- Lead-generation booking page
- Intake-first client workflow
- Zoom join link for approved clients
- GA4 and Clarity events
- Fixed form submissions
- Removed broken Turnstile placeholder
- Server-side spam filtering retained
- Cloudflare CSP finalized
- Friendly routes for /book, /booking, /intake, and /contact
- Sitemap deduplicated and checked

## Cloudflare Pages variables

Secret:
- RESEND_API_KEY

Variables:
- FORM_TO_EMAIL=aplustechucation@gmail.com
- FORM_FROM_EMAIL=A+ Techucation Forms <forms@YOUR_VERIFIED_DOMAIN>
- ALLOWED_HOSTS=www.atechspot.com

## Deploy

1. Extract this ZIP.
2. Upload all files to the root of your GitHub repository.
3. Replace all existing files.
4. Commit: `Deploy final AtechSpot lead generation system`
5. Wait for Cloudflare Pages deployment.
6. Purge cache:
   Cloudflare Dashboard → atechspot.com → Caching → Configuration → Purge Everything
7. Hard refresh with Ctrl+Shift+R.
8. Test:
   - https://www.atechspot.com/
   - https://www.atechspot.com/book
   - https://www.atechspot.com/intake
   - https://www.atechspot.com/contact
9. Confirm GA4 Realtime and Microsoft Clarity activity.
10. Submit a real form test.
