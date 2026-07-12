# AtechSpot V7 Deployment

## Fixed
- `/contact` now has direct booking, phone, email, and a working contact form
- `/booking` now contains a direct appointment-request form
- Booking choices: Zoom, Google Meet, phone, Microsoft Teams, or other accommodation
- Scheduled clients can open the existing Zoom room
- Removed all broken Cloudflare Turnstile placeholders and scripts

## Added
- Front-page promotion for `https://www.atechspot.com/business`
- DriveSavers data recovery page and homepage/business promotions
- Official DriveSavers YouTube channel playlist embedded next to the offer
- Partner code `DS23579` for 10% off eligible DriveSavers services
- Partner/compensation disclosure
- `/data-recovery` route
- Sitemap updates and internal links for Google discovery

## Cloudflare Pages form settings required
Secret:
- `RESEND_API_KEY`

Variables:
- `FORM_TO_EMAIL=aplustechucation@gmail.com`
- `FORM_FROM_EMAIL=A+ Techucation Forms <forms@YOUR_VERIFIED_DOMAIN>`
- `ALLOWED_HOSTS=www.atechspot.com`

## Deploy
1. Extract ZIP.
2. Upload all files to the GitHub repository root.
3. Replace existing files.
4. Commit: `Deploy V7 booking business and data recovery updates`
5. Wait for Cloudflare Pages deployment.
6. Purge cache.
7. Test:
   - https://www.atechspot.com/contact
   - https://www.atechspot.com/booking
   - https://www.atechspot.com/business
   - https://www.atechspot.com/data-recovery
8. Submit one booking form and one contact form.
9. Confirm GA4 Realtime and Clarity activity.
10. Resubmit sitemap in Google Search Console.

Google indexing cannot be guaranteed, but this package includes crawlable internal links, redirects, canonical pages, robots.txt, and an updated sitemap.
