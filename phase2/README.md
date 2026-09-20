# ATechSpot Phase 2 — Shared Platform Foundation

This branch starts the real implementation of the Phase 2 internal operating systems while preserving the existing Cloudflare Pages production site.

## Architecture decision

The existing ATechSpot repository is already a Cloudflare Pages project deployed with Wrangler. Phase 2 therefore extends the current platform with Cloudflare Pages Functions instead of introducing a second hosting platform.

## Phase 2 host registry

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

All recognized hosts share one edge runtime and one application registry. Requests to www.atechspot.com and the apex domain continue to fall through to the existing static site.

## Added in foundation milestone

- Global Pages Functions middleware
- Unique request IDs
- Edge error handling
- Shared Phase 2 application registry
- Hostname-aware application routing
- /api/health endpoint
- /api/platform registry endpoint
- Secure no-store application shells
- noindex protection for private/internal systems

## Required Cloudflare configuration before the subdomains become live

1. Deploy this branch as a Preview and test it.
2. Merge after QA.
3. Add each Phase 2 hostname as a custom domain on the existing ATechSpot Pages project.
4. Confirm SSL is issued for each hostname.
5. Verify /api/health on every hostname.
6. Keep ops private; add a real authentication/authorization layer before exposing operational data.

## Next implementation milestone

### Identity + database

The next code milestone must provide:

- D1 database binding
- schema migrations
- users/customers/organizations
- roles and permissions
- sessions
- audit log
- customer IDs
- brand/property IDs

Do not store card data, passwords in plaintext, or secrets in source control.

### Core tables planned

users
customers
organizations
brands
properties
roles
permissions
user_roles
sessions
leads
bookings
intakes
projects
invoices
payments
tickets
articles
vendors
partners
audit_logs
events

## Definition of Done for this milestone

This foundation is complete only after:

- Cloudflare Preview deployment succeeds
- www.atechspot.com remains unchanged
- /api/health returns 200
- /api/platform returns the 15-system registry
- at least one test Phase 2 custom hostname routes through the application shell
- security headers are verified
- production deployment is completed only after preview QA

This is Milestone 1 of Phase 2, not the final Phase 2 completion gate.
