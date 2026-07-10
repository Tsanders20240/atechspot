# Version 6 CSP Styling Fix

Problem:
The full stylesheet is embedded inside every HTML page, but Cloudflare's `_headers`
file allowed only external styles with:

style-src 'self';

That blocked all embedded CSS and caused the website to appear as raw text.

Fixed:
The policy now allows the intentionally embedded CSS:

style-src 'self' 'unsafe-inline';

Upload all files in this package to the repository root and replace existing files.

Commit message:
Fix Version 6 Cloudflare styling policy

After Cloudflare deploys:
1. Open Cloudflare Pages > Deployments and confirm the latest deployment is successful.
2. Purge Cloudflare cache for the domain.
3. Open https://www.atechspot.com/?v=6fix
4. Press Ctrl+Shift+R or Ctrl+F5.
