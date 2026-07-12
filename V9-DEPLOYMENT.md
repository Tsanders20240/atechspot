# AtechSpot V9 Contact, Data Recovery, and Zoom Booking

## Included

- Contact form at `/contact` and `/contact.html`
- Contact submissions automatically email `aplustechucation@gmail.com`
- Complete DriveSavers data-recovery intake at `/data-recovery`
- Data-recovery submissions automatically email `aplustechucation@gmail.com`
- Prefilled email fallback if automatic delivery is unavailable
- Every `Book Consultation` CTA opens:
  `https://scheduler.zoom.us/a-plus-techucation/30-mins-with-a-plus`
- Cloudflare Pages Functions are restricted to `/api/*` only
- Static pages are excluded from Function handling

## Required Cloudflare Pages settings

Go to:

`Workers & Pages -> atechspot -> Settings -> Variables and Secrets`

Add secret:

- `RESEND_API_KEY`

Add variables:

- `FORM_TO_EMAIL=aplustechucation@gmail.com`
- `FORM_FROM_EMAIL=A+ Techucation Website <forms@YOUR_RESEND_VERIFIED_DOMAIN>`
- `ALLOWED_HOSTS=www.atechspot.com,atechspot.com,atechspot.pages.dev`

Important:

- Verify the sending domain in Resend.
- Replace `YOUR_RESEND_VERIFIED_DOMAIN`.
- The recipient remains `aplustechucation@gmail.com`.

## Deploy

1. Extract this ZIP.
2. Replace all files in the GitHub repository connected to Cloudflare Pages.
3. Confirm these files/folders exist:
   - `functions/api/contact.js`
   - `functions/api/data-recovery.js`
   - `_routes.json`
   - `contact/index.html`
   - `data-recovery/index.html`
4. Commit:
   `Deploy V9 contact and data recovery email forms`
5. Wait for Cloudflare Pages.
6. Purge the cache.
7. Test:
   - https://www.atechspot.com/contact
   - https://www.atechspot.com/data-recovery
8. Submit one test from each form.
9. Confirm both emails arrive at `aplustechucation@gmail.com`.
10. Test Book Consultation buttons across the website.
