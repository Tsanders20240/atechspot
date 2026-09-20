# ops.atechspot.com — Production Architecture

## Canonical architecture

`ops.atechspot.com` is NOT a separate Cloudflare Worker.

It is a custom hostname on the existing Cloudflare Pages project:

`atechspot`

The Phase 2 Pages Functions runtime inspects the hostname and routes
`ops.atechspot.com` to the private Ops application.

Correct path:

```text
ops.atechspot.com
  -> Cloudflare Pages custom domain
  -> atechspot Pages project
  -> functions/[[path]].js
  -> appFromHostname("ops.atechspot.com")
  -> opsControlCenterPage()
  -> D1 + application RBAC
```

## Do NOT create

- a separate `atechspot-ops` Worker
- an `ATS_KV` namespace for Ops
- a second authentication system
- a default `admin/admin123` account
- a CNAME to a workers.dev hostname

Those conflict with the Phase 2 architecture.

## Required production configuration

### Pages environment

- `AUTH_BASE_URL=https://account.atechspot.com`
- `AUTH_FROM_EMAIL=noreply@atechspot.com`
- `BOOTSTRAP_ADMIN_EMAIL=<authorized executive email>`
- `RESEND_API_KEY=<secret>`

### D1 binding

- binding name: `DB`
- database: `atechspot-phase2`

### Database

Apply migrations in order:

- `migrations/0001_phase2_core.sql`
- `migrations/0002_phase2_modules.sql`
- `migrations/0003_account_billing_privacy.sql`
- `migrations/0004_public_ecosystem_registry.sql`
- `migrations/0005_ops_control_center.sql`

## Domain

`ops.atechspot.com` should remain attached as a custom domain to the
existing `atechspot` Pages project. A Cloudflare-managed CNAME to the
Pages hostname is expected.

## Authentication

Ops uses passwordless email authentication backed by D1.

The bootstrap executive email receives the `executive` and
`system_admin` roles after successful magic-link authentication.

Authorized Ops roles:

- executive
- system_admin
- manager

All other authenticated roles receive HTTP 403.

## Expected production behavior

Logged out:
`ops.atechspot.com -> account.atechspot.com`

Authorized:
`ops.atechspot.com -> ATechSpot Executive Operating System`

Unauthorized authenticated user:
`403 Forbidden`

## Deployment blocker procedure

If Ops still shows the public ATechSpot homepage, verify:

1. the latest Phase 2 Pages deployment succeeded;
2. the deployment includes `functions/[[path]].js`;
3. Production has the `DB` D1 binding;
4. Production has all required auth variables;
5. migrations 0001-0005 are applied;
6. `ops.atechspot.com` remains a custom domain of the same Pages project.

If Cloudflare reports "Latest build failed", fix the deployment error before
changing DNS. The previous successful deployment will continue serving until
a new deployment succeeds.
