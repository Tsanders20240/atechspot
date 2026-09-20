# Phase 2 environment and bindings

## Required Cloudflare Pages binding

Create a D1 database and bind it to the Pages project as:

`DB`

Apply migrations beginning with:

`migrations/0001_phase2_core.sql`

## Required secrets / environment variables

Production and Preview should be configured separately.

- `RESEND_API_KEY` — secret; never commit it
- `AUTH_FROM_EMAIL` — verified sender, for example a login/security mailbox on an approved ATechSpot domain
- `AUTH_BASE_URL` — `https://account.atechspot.com` in production

## Authentication design

Phase 2 begins with passwordless email magic-link authentication:

1. Customer submits email to `POST /api/auth/request-link`
2. A single-use token is generated
3. Only its SHA-256 hash is stored in D1
4. The raw token is sent by email and expires after 15 minutes
5. Verification creates or finds the user/customer record
6. A random session token is issued
7. Only the session-token hash is stored
8. Browser receives an HttpOnly + Secure + SameSite=Lax cookie
9. Logout revokes the session

No passwords are stored by ATechSpot in this design.

## Important security note

The current shared cookie uses `Domain=.atechspot.com` to enable Phase 2 cross-subdomain sign-in. This makes subdomain governance important: abandoned or externally delegated ATechSpot subdomains must not be allowed to become takeover risks.

Before final production approval, evaluate whether to retain shared-domain SSO or move to host-scoped sessions with authorization-code exchange for stronger isolation.

## Rate limiting

The application performs basic per-email throttling for magic-link requests. Add Cloudflare WAF/rate-limit rules before production launch.

## Still required before 10/10 production

- Cloudflare custom domains for all Phase 2 hosts
- D1 database creation and binding
- migration execution
- Resend production credentials
- Preview QA
- Cloudflare WAF/rate limiting
- Cloudflare Access or equivalent protection for ops.atechspot.com
- administrator role bootstrap process
- recovery/emergency-access procedure
- session-management UI
- security and authorization tests
