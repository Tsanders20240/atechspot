# AtechSpot V8 Legal, Accessibility, Intake, and Zoom Booking

## Major updates

- Accessibility page with ADA education, accommodation requests, DOJ resources, and issue reporting
- Expanded Terms of Service for A+ Techucation LLC
- Expanded Privacy Policy covering forms, analytics, Zoom scheduling, service providers, retention, and privacy requests
- Contact form connected to `aplustechucation@gmail.com` through a prefilled email workflow
- Detailed intake and price-request form
- Payment page directs visitors to intake before payment
- Booking page connected to official Zoom Scheduler:
  `https://scheduler.zoom.us/a-plus-techucation/30-mins-with-a-plus`
- Business-to-business page with Zoom consultation links
- Global Book Consultation buttons point to Zoom Scheduler
- Native clean routes for accessibility, terms, privacy, contact, booking, intake, business, and payment
- No Pages Functions, `_worker.js`, or `_routes.json`

## Important legal note

The Terms and Privacy pages are robust business-policy templates, not attorney certification.
Have a licensed Texas attorney review them before relying on them for a specific transaction,
regulated service, or legal dispute.

## Deploy

1. Extract this ZIP.
2. Replace all files in the `Tsanders20240/atechspot` repository.
3. Make sure GitHub includes the new route folders:
   - `accessibility/index.html`
   - `terms/index.html`
   - `privacy/index.html`
   - `contact/index.html`
   - `booking/index.html`
   - `intake/index.html`
   - `business/index.html`
   - `payment/index.html`
4. Delete old `functions/`, `_worker.js`, and `_routes.json` if still present.
5. Commit:
   `Deploy V8 legal accessibility intake and Zoom booking`
6. Wait for Cloudflare Pages deployment.
7. Purge cache.
8. Test:
   - https://www.atechspot.com/accessibility
   - https://www.atechspot.com/terms
   - https://www.atechspot.com/privacy
   - https://www.atechspot.com/contact
   - https://www.atechspot.com/booking
   - https://www.atechspot.com/intake
   - https://www.atechspot.com/business
   - https://www.atechspot.com/payment
9. Test the contact and intake forms. Each should open a prefilled email addressed to `aplustechucation@gmail.com`.
10. Test every Book Consultation button. Each should open the official Zoom Scheduler.
