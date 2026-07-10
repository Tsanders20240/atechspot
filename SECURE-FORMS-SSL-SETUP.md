# Secure Forms and Full SSL Deployment

## Spam protection included
- Cloudflare Turnstile with mandatory server-side Siteverify validation
- Honeypot field
- Four-second minimum completion-time check
- Server-side name, email, phone, origin and payload validation
- Spam phrase, script-injection and excessive-link filtering
- Optional Cloudflare rate-limiting binding
- Optional KV duplicate suppression for 24 hours
- Resend email delivery only after verification
- No exposed API or secret keys
- Security headers and HTTPS content upgrades

No public form can guarantee that every message is a paying customer, but these independent controls substantially reduce automated spam.

## Required Cloudflare setup
1. Create a Turnstile widget for the production hostname.
2. Replace `YOUR_TURNSTILE_SITE_KEY` in the HTML files.
3. Add the secret `TURNSTILE_SECRET_KEY` to the Pages project.
4. Add Resend secrets and variables:
   - `RESEND_API_KEY`
   - `FORM_TO_EMAIL=aplustechucation@gmail.com`
   - `FORM_FROM_EMAIL=A+ Techucation Forms <forms@YOUR_VERIFIED_EMAIL_DOMAIN>`
   - `ALLOWED_HOSTS=www.aplustechspot.com`
5. Verify the sending domain with Resend.
6. Optional: bind KV as `FORM_DEDUP`.
7. Optional: bind a Cloudflare rate limiter as `FORM_RATE_LIMITER`.

## Deployment
This package includes a `functions/` directory. Deploy through Git integration or Wrangler, not static-only Direct Upload.

Use Wrangler 4.36.0 or newer:

`npx wrangler pages deploy . --project-name main_secure_build`

## SSL/TLS
Cloudflare Pages provisions the public edge certificate after the custom domain validates.

In Cloudflare:
- Add the custom domain to the Pages project.
- Enable Always Use HTTPS.
- Enable TLS 1.3.
- Use minimum TLS 1.2 or newer when compatible.
- Use Full (strict) when a separate origin server is involved and presents a valid matching certificate.
- Confirm every page and asset loads over HTTPS before enabling HSTS.
- Enable HSTS only after all required hostnames work correctly over HTTPS.

Private certificate keys are never stored in this package.
