# AtechSpot V11 Business, Booking, and Universal Intake

## Updated

- Complete business page at `/business`
- Booking page merged with the official Zoom Scheduler
- Embedded Zoom Scheduler with new-tab fallback
- Universal intake form at `/intake`
- All service pages use the same intake route
- Query-string service prefill supported
- Clean Cloudflare Pages routes
- Root-safe assets
- Deployment marker: `V11-BUSINESS-BOOKING-INTAKE`

## Google Form

A Google Form cannot be created without access to your Google account.
Follow `GOOGLE-FORM-SETUP.md` after deployment.

The website intake form is already functional through the existing contact API.

## Deploy

1. Extract this ZIP.
2. Delete old route folders in GitHub:
   - business
   - booking
   - intake
   - contact
   - data-recovery
3. Upload this entire package to the repository root.
4. Confirm:
   - business/index.html
   - booking/index.html
   - intake/index.html
   - _redirects
5. Commit:
   `Deploy V11 business booking and universal intake`
6. Wait for Cloudflare Pages Production deployment.
7. Purge cache.
8. Test:
   - https://www.atechspot.com/business
   - https://www.atechspot.com/booking
   - https://www.atechspot.com/intake
9. Test the Zoom Scheduler button.
10. Submit one intake test and confirm the email arrives at aplustechucation@gmail.com.
