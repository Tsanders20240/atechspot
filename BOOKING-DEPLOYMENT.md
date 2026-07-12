# A+ Techucation Booking Lead-Generation Update

## Added
- High-converting consultation landing page
- Friendly `/book` route
- Intake-first workflow
- Service overview
- Four-step client path
- Preparation checklist
- Approved-client Zoom join section
- Confirmation message
- GA4 events: `consultation_request`, `zoom_join`
- Microsoft Clarity custom events with the same names
- One GA4 tag and one Clarity tag per HTML page
- Updated CSP for Clarity

## Zoom
Meeting ID: 837 2154 5302

The Zoom URL is labeled as a join link for already-approved and scheduled clients.
It is not presented as a public appointment scheduler.

## Deploy
1. Extract this ZIP.
2. Upload all files to the root of the GitHub repository connected to Cloudflare Pages.
3. Replace existing files.
4. Commit: `Add consultation booking funnel and tracking`
5. Wait for Cloudflare Pages deployment.
6. Purge Cloudflare cache.
7. Test:
   - https://www.atechspot.com/book
   - https://www.atechspot.com/booking.html
   - GA4 Realtime events
   - Microsoft Clarity recordings and events
