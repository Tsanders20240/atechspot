# ATechSpot V32 — Canonical Redirect Loop Fix

## Fix
Removed the Pages-level redirect:
`https://www.atechspot.com/* -> https://atechspot.com/:splat`

The Cloudflare zone already has hostname canonicalization behavior. Keeping an opposite redirect inside `_redirects` can create an infinite www <-> apex loop, especially on `/home`.

V32 leaves `/home` as an internal 200 rewrite to `/home.html` and preserves the V31 two-page intro architecture.

## Expected flow
- `/` = intro
- ENTER SITE = `/home`
- `/home` = full intact website
- no Pages-level hostname redirect
