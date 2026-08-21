# V24 Deployment

## Canonical domain
Deploy this bundle so the public site is **https://atechspot.com**.

## Cloudflare
1. Upload/deploy the full contents of this folder to the production project.
2. Ensure `atechspot.com` is the primary custom domain.
3. Keep `www.atechspot.com` proxied/attached only long enough to receive the 301 redirect to the non-WWW host.
4. Remove or disable any Cloudflare Redirect Rule that sends `atechspot.com` → `www.atechspot.com`.
5. Purge Cloudflare cache after deployment.
6. Test both hosts in Incognito.

Expected behavior:
- `https://atechspot.com/` → V24 website, stays non-WWW
- `https://www.atechspot.com/` → 301 → `https://atechspot.com/`
- paths are preserved, e.g. `/services` remains `/services`
