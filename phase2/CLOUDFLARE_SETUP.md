# Cloudflare activation checklist — Phase 2

The application code is prepared in the `phase2/shared-platform-foundation` branch. These Cloudflare account operations are required to make it live.

## 1. D1

Create database:

`atechspot-phase2`

Bind it to the existing ATechSpot Pages project as:

`DB`

Apply:

`migrations/0001_phase2_core.sql`

## 2. Production variables

Set:

- AUTH_BASE_URL=https://account.atechspot.com
- AUTH_FROM_EMAIL=<verified ATechSpot sender>
- BOOTSTRAP_ADMIN_EMAIL=<authorized executive email>

Secret:

- RESEND_API_KEY

Never commit the API key.

## 3. Preview variables

Use a separate Preview environment. Do not use production customer data in Preview.

## 4. Custom domains

Attach the following custom domains to the same ATechSpot Pages project:

- ops.atechspot.com
- account.atechspot.com
- book.atechspot.com
- intake.atechspot.com
- pay.atechspot.com
- clients.atechspot.com
- support.atechspot.com
- help.atechspot.com
- status.atechspot.com
- start.atechspot.com
- shop.atechspot.com
- partners.atechspot.com
- vendors.atechspot.com
- press.atechspot.com
- developers.atechspot.com

Do not manually create conflicting DNS records if Cloudflare Pages is managing the custom-domain record.

## 5. Security controls before production data

- Turn on rate limiting for /api/auth/request-link
- Protect ops.atechspot.com with Cloudflare Access in addition to application RBAC
- Require MFA on Cloudflare and GitHub administrator accounts
- Review abandoned subdomains for takeover risk because Phase 2 currently uses a shared .atechspot.com session cookie
- Verify no Preview deployment is indexed
- Confirm audit logging before using internal operational data

## 6. Acceptance tests

For every custom hostname:

1. HTTPS certificate valid
2. GET /api/health returns 200
3. Correct service key appears
4. Private/customer systems include noindex
5. www.atechspot.com remains unchanged

For account:

1. Request magic link
2. Receive message
3. Use once successfully
4. Reuse fails
5. Expired link fails
6. /api/auth/me returns customer ID and roles
7. Logout revokes session

For ops:

1. Logged-out visitor is redirected to Account
2. Ordinary customer receives 403
3. Executive/system-admin/manager can enter
4. No internal data is exposed before authorization

## 7. Phase 2 is not complete after activation

Activation makes the shared foundation and Account/Ops access layer operational. Booking, Intake, Pay, Client Portal, Support, Help, Status and the expansion systems still require their functional modules before the overall Phase 2 10/10 gate can close.
