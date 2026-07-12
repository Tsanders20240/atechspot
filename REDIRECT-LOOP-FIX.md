# Redirect Loop Fix

The previous deployment contained rules such as:

- `/contact /contact.html 200`
- `/booking /booking.html 200`

Cloudflare's own clean-URL behavior could then redirect `.html` back to the extensionless URL,
creating a loop.

This package removes those rewrite rules and uses direct `.html` links throughout the site.

## Deploy
1. Replace all repository files with this package.
2. Commit: `Fix Cloudflare redirect loop`
3. Wait for Cloudflare Pages deployment.
4. Purge Cloudflare cache.
5. Test:
   - https://www.atechspot.com/contact.html
   - https://www.atechspot.com/booking.html
   - https://www.atechspot.com/business.html
   - https://www.atechspot.com/data-recovery.html

After those work, Cloudflare may also serve the clean versions without `.html`, but the `.html`
addresses are the guaranteed direct paths.
