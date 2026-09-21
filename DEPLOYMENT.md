# ATechSpot Production Deployment

## Platform

ATechSpot deploys from the `main` branch to Cloudflare Pages through the production GitHub Actions workflow.

Cloudflare Pages project configuration is the source of truth for runtime environment variables. Do not add a Pages `wrangler.jsonc` unless its configuration is deliberately kept in sync with the dashboard, because Pages deployments can otherwise replace dashboard-managed runtime settings.

Primary production domains:

- https://www.atechspot.com — public flagship
- https://account.atechspot.com — secure client-portal entry point

## Required Cloudflare secrets and variables

### Website forms

- `RESEND_API_KEY` — required for secure form and confirmation email delivery.
- `FORM_TO_EMAIL` — optional internal delivery address override.
- `FORM_FROM_EMAIL` — optional verified sender override.

### Secure Client Portal

The client portal fails closed until all portal variables are configured.

- `PORTAL_SIGNING_SECRET` — long random secret used to HMAC-sign magic links and session tokens. Store as a Cloudflare secret, never in Git.
- `CLIENT_PORTAL_USERS` — authorized active-client email allowlist. Store as a Cloudflare secret or protected variable.

Accepted `CLIENT_PORTAL_USERS` formats:

```text
client1@example.com,client2@example.com
```

or:

```json
["client1@example.com","client2@example.com"]
```

Never place client email allowlists in repository source.

## Client Portal security model

1. Client enters an authorized email at `/clients/`.
2. The public response is deliberately neutral and does not reveal whether the email exists.
3. Authorized accounts receive a signed magic link by email.
4. Magic links expire after 20 minutes.
5. Successful login creates a signed HttpOnly, Secure, SameSite=Lax session cookie.
6. Portal sessions expire after 8 hours.
7. `/clients/dashboard/` is denied without a valid signed session.
8. Portal responses are `no-store` and `noindex`.
9. Sign-out clears the session cookie.
10. Project-specific records must not be embedded in public/static JavaScript.

## Current production customer path

```text
Traffic
→ Homepage / problem router
→ Assessment
→ Intake
→ Booking
→ Written scope / proposal
→ Payment
→ Client Portal
→ Delivery
→ Support
→ GrowthCare
→ Referral
```

## Release QA

The deployment workflow should verify at minimum:

- homepage
- services
- assessment
- intake
- booking
- payments
- data recovery
- remote support
- client portal sign-in page
- secure portal source files
- security headers
- sitemap / robots
- custom production domain

The authenticated dashboard itself should not be publicly fetched as part of production QA because it is intentionally protected.

## Manual portal activation test

After configuring `PORTAL_SIGNING_SECRET` and `CLIENT_PORTAL_USERS`:

1. Open `/clients/`.
2. Enter an authorized test-client email.
3. Confirm the same neutral browser response used for all email addresses.
4. Confirm the magic-link email arrives.
5. Open the link within 20 minutes.
6. Confirm redirect to `/clients/dashboard/`.
7. Confirm the authorized email appears in the dashboard.
8. Sign out.
9. Confirm direct access to `/clients/dashboard/` redirects to `/clients/`.
10. Confirm an unauthorized email receives no magic link and the browser does not reveal account status.

## Operating rule

Do not call the client portal complete merely because the login shell works. A fully mature client portal should eventually add authenticated project data, milestones, files, approvals, invoices and messaging behind server-side access controls.

## Account subdomain routing

- `https://account.atechspot.com/` routes to `/clients/`.
- `https://account.atechspot.com/dashboard/` routes to `/clients/dashboard/`.
- Authentication still occurs through the same signed-session security model.
- The public flagship at `www.atechspot.com` remains the canonical marketing site.
