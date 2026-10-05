# ATechSpot acquisition system

## Working surfaces

- Industry hub: /industries/
- Five landing pages: home-services, restaurants-hospitality, beauty-wellness, professional-services and ecommerce under /industries/.
- Staff desk: /acquisition/. Request a sign-in link using jason@atechspot.com or aplustechucation@gmail.com. Access requires the new production database and secret to be configured by deployment.
- Existing assessment: /assessment/. Industry CTAs preselect service and industry and carry campaign identifiers.

## Lead workflow

1. A validated assessment creates a durable lead and three tasks in one database transaction: internal notice, customer acknowledgement, and staff review.
2. Notifications are attempted immediately. Failed sends remain in the outbox with bounded retries. The hourly GitHub workflow processes due tasks; its timing can drift.
3. Initial review is due at 9am America/Chicago on the next weekday. Public holidays are not excluded. Qualification flags indicate review priority, not automatic project acceptance.
4. Staff update stage, next action, due date and estimated value in the desk. Saving schedules an internal reminder. Deal value starts null and requires a real scoped estimate.
5. Lost and suppressed leads cancel pending tasks. Customer marketing sequences are not created.
6. Completed projects must be recorded by staff in the desk because this site does not yet have a project-management completion feed. Recording completion creates a proof record and internal collection task automatically.
7. Staff collect a baseline, measured result, evidence location, testimonial when available and publication permission. Approval is blocked without evidence, verified result and permission. Approved records are not automatically published.

No claims of external-client performance are fabricated. Industry pages label company-owned ecosystem work accurately.

## Attribution

Capture source, campaign, medium and landing pathname. Same-tab campaign information survives the journey to assessment using session storage when available. URL query strings are not retained as landing-page data. Missing attribution is explicitly marked unknown/unattributed.

## Security and maintenance

Staff sessions use single-use 15-minute email links and eight-hour Secure HttpOnly cookies. Staff writes require the expected Origin; an automation-only bearer token also exists. Do not expose that token in browser scripts or URLs.

The production setup script creates/reuses the acquisition D1 database, applies additive schema, preserves existing D1 bindings, updates only its own secret with Wrangler, and verifies prior environment variable names remain. It requires Cloudflare Pages Edit and D1 permissions. Existing email and payment secrets are not read into files.

The automation token is derived by HMAC from the existing deployment credential and a fixed context; it is masked in workflow logs. Rotate the deployment credential and redeploy to rotate automation access. Unauthorized requests cannot read lead or proof records.

Review failed tasks and retention needs regularly in the Cloudflare D1 dashboard. Completed task records and assessment payloads remain stored until an authorized retention process removes them. Do not collect passwords, payment credentials or unnecessary sensitive information in assessments.

Health: GET /api/acquisition/health reports configuration only. It does not prove inbox receipt, email-domain verification, scheduler execution or database permissions. Deployment must pass before calling the system live.

## Validation

Run: node --test tests/acquisition.test.js tests/playbook-commerce.test.js

Tests exercise real SQLite schema, idempotency, failure queues, staff authorization, single-use access, CSRF protection, suppression, proof approval and assessment integration with mocked email transport. No real emails are sent by these tests.

After deployment: confirm five landing routes, assessment fields, staff access, tracking health and unauthorized API denial. An actual staff-controlled assessment plus mailbox verification is needed for end-to-end email acceptance. Do not submit fictitious prospects.

## Daily prospecting

A separate ChatGPT automation researches five Houston-area candidates each morning through December 31, 2026. It produces evidence, service-fit hypotheses and outreach drafts. It does not send outreach or automatically import prospects into the inbound assessment database.

Start with the existing nine researched candidates. Keep candidate research separate from qualified inbound leads until a real sales conversation establishes fit.
