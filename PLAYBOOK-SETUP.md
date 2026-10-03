# ATechSpot PDF commerce activation

Implemented: fixed $29 USD one-time Checkout, explicit purchase consent, signed Stripe events, private R2 delivery, 15-minute links, transactional delivery email, payment rechecks, full-refund/dispute revocation and automated tests.

## 1. Stripe product

In the A+ Techucation LLC Stripe Dashboard, create an active digital product named **The A to Z Reseller Operations Playbook**. Description: **59-page digital PDF, 26 A–Z chapters and worksheets; personal business use license; no physical item or coaching**.

Set metadata `atechspot_product=reseller_playbook_v1`. Create a one-time **USD 29.00** price. Set tax behavior **exclusive** if that matches the confirmed commercial/tax setup. Select the actual ebook tax classification after confirming its applicability. Copy the `price_...` ID.

Create the equivalent product and price in an isolated Stripe sandbox for provider tests. Test and live IDs/keys/secrets are different. Never mix them.

## 2. Private Cloudflare storage

Cloudflare → R2 → create bucket **atechspot-private-downloads**. Public development URL and public custom domains must remain disabled. Upload the full PDF to:

`products/reseller-playbook-v1.pdf`

Content type must be `application/pdf`. Do not upload the private owner report, buyer data or full PDF to GitHub or the public website directory.

Workers & Pages → **atechspot** → Settings → Bindings: add R2 bucket binding **ATECHSPOT_DOWNLOADS** pointing to that bucket. This stores both the book and private order/event records. Use a separate sandbox bucket and preview environment for provider tests.

## 3. Restricted Stripe key

Create a restricted key for this website. Required privileges: Checkout Sessions write/read; Prices and Products read; PaymentIntents, Charges, Webhook Endpoints read; Tax Settings and Tax Registrations read when automatic tax is selected. Invoices may also need write permission because checkout creates a paid invoice; verify in sandbox and grant only the permission required by a confirmed 403. No payouts, banking, customers export or refund-write permission is needed for this application. Refunds are processed by an authorized owner through Stripe Dashboard.

Store the key directly as an encrypted Cloudflare Pages secret. Never enter it in GitHub source, this document or chat.

## 4. Stripe event destination

Create a webhook endpoint for **https://www.atechspot.com/api/playbook/webhook** with these events:

- `checkout.session.completed`
- `checkout.session.async_payment_succeeded`
- `checkout.session.async_payment_failed`
- `charge.refunded`
- `charge.dispute.created`

Copy its `we_...` ID and store its signing secret directly in Cloudflare. Configure Stripe public business/support details and the terms URL **https://www.atechspot.com/playbook/terms/** so required checkout consent works. Receipt/payment invoice behavior must be verified in sandbox.

## 5. Cloudflare configuration

Configure production separately from preview. Retain existing Resend and client portal settings.

| Name | Kind | Value |
| --- | --- | --- |
| `STRIPE_API_KEY` | Encrypted secret | Restricted key for matching Stripe mode |
| `STRIPE_WEBHOOK_SECRET` | Encrypted secret | Signing secret for matching event endpoint |
| `PLAYBOOK_DOWNLOAD_SECRET` | Encrypted secret | At least 32 random characters; generate securely |
| `PLAYBOOK_PRICE_ID` | Variable | Matching $29 price ID |
| `PLAYBOOK_WEBHOOK_ID` | Variable | Matching enabled webhook endpoint ID |
| `PLAYBOOK_ORIGIN` | Variable | `https://www.atechspot.com` in live mode; exact protected staging URL in sandbox mode |
| `PLAYBOOK_MODE` | Variable | `sandbox` for isolated testing; `live` for production |
| `PLAYBOOK_TAX_MODE` | Variable | `automatic` only with verified active Stripe Tax setup, or `reviewed_no_collection` only after confirming no collection is appropriate for this offer |
| `PLAYBOOK_LAUNCH_APPROVED` | Variable | Keep `false` until all provider tests pass; set `true` only at launch |
| `RESEND_API_KEY` | Existing encrypted secret | Existing verified transactional sender key |
| `ATECHSPOT_DOWNLOADS` | R2 binding | Private bucket |

The code never enables automatic tax just because a flag is present: it also checks active tax settings, at least one active registration and product tax classification. This does not establish the legal correctness of registration coverage. Do not add registrations unless the business is actually registered. Stripe currently returned no active registrations during inspection.

## 6. Provider test checklist

Run local suite with `node --test tests/playbook-commerce.test.js`. This is simulated integration coverage, not proof of provider configuration.

Using the sandbox key/price/webhook/bucket in a protected staging environment:

- Successful payment creates one order, invoice and delivery email.
- The email/private page downloads the actual full PDF.
- A declined payment creates no access or delivery email.
- A delayed payment grants access only after its success event; failure grants none.
- Repeated webhook delivery produces no duplicate fulfillment email.
- Forged signatures, another product and expired/modified links fail.
- A full sandbox refund prevents both fresh access and old download links.
- A dispute suspends access.
- Deliberate email failure causes a retriable event; fix and resend event.
- Verify applicable tax with a customer location in every relevant collection jurisdiction.
- Verify mobile layout, keyboard consent, cancellation and support links.

For preview tests, configure a separate webhook with the staging URL and set `PLAYBOOK_ORIGIN` to that exact origin. Protect the staging environment with Cloudflare Access. Never point a production endpoint at a sandbox or use a production key for test charges. The root production storefront does not show Buy while `PLAYBOOK_MODE=sandbox`. A protected staging origin shows a clearly labeled test checkout.

## 7. Launch

After provider tests pass, install matching live settings, confirm all jurisdictions and product/price details, redeploy, and set `PLAYBOOK_LAUNCH_APPROVED=true`. The page checks `/api/playbook/status`; it shows **Buy the PDF · $29** automatically only when the required services and checks are ready. A missing secret, wrong price, unavailable file, missing event subscription, incomplete tax setup or absent launch approval keeps checkout closed.

Set Cloudflare rate limits on checkout and access routes. Review delivery failures and refunds daily. Do not send marketing email merely because someone purchased; the transactional email does not enroll them in marketing.

## Current blockers

The connected Stripe app rejected product creation due to insufficient API permissions. No product was created, no charge made and no live refund performed. Hosting secret entry, private PDF upload and provider sandbox tests remain owner/account-access steps; these cannot be replaced by the simulated test suite.
