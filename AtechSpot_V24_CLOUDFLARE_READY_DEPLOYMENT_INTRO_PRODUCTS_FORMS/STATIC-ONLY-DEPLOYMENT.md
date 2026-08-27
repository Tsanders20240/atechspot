# AtechSpot V7.3 Static-Only Deployment

## Removed

- `functions/`
- `_worker.js`
- `_routes.json`
- Cloudflare Pages Function form submission
- Resend environment-variable dependency
- API calls to `/api/submit`

## Form behavior

Forms now open the visitor's email app with the request prefilled and addressed to:

`aplustechucation@gmail.com`

The visitor reviews the message and presses Send.

## GitHub cleanup

When uploading this package, GitHub may retain old files that are not in the new upload.

Manually delete these from the repository if they still appear:

- `functions/`
- `_worker.js`
- `_routes.json`

## Deploy

1. Replace the repository files with this package.
2. Delete the old Function/Worker files listed above.
3. Commit: `Deploy static-only AtechSpot site`
4. Wait for Cloudflare Pages.
5. Purge cache.
6. Test:
   - https://atechspot.pages.dev/
   - https://atechspot.pages.dev/contact.html
   - https://atechspot.pages.dev/booking.html
   - https://www.atechspot.com/
   - https://www.atechspot.com/contact.html
   - https://www.atechspot.com/booking.html

## Variables that are no longer needed

You may remove:

- `RESEND_API_KEY`
- `FORM_TO_EMAIL`
- `FORM_FROM_EMAIL`
- `ALLOWED_HOSTS`
