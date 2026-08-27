# Email Form Fix

The website code is configured to email form submissions to:

`aplustechucation@gmail.com`

## Only one required Cloudflare secret

Go to:

`Cloudflare -> Workers & Pages -> atechspot -> Settings -> Variables and Secrets`

Add:

- Name: `RESEND_API_KEY`
- Type: Secret
- Value: your Resend API key

Redeploy after saving the secret.

## Optional variables

- `FORM_TO_EMAIL=aplustechucation@gmail.com`
- `FORM_FROM_EMAIL=A+ Techucation Website <forms@your-verified-domain.com>`

If `FORM_FROM_EMAIL` is not set, the code uses:

`A+ Techucation Website <onboarding@resend.dev>`

That default is useful for Resend testing. Resend may restrict the onboarding sender to the email
address associated with your Resend account. For full production sending, verify a domain in Resend
and set `FORM_FROM_EMAIL`.

## Diagnostic URL

After deployment, open:

`https://www.atechspot.com/api/form-health`

Expected working response:

```json
{
  "ok": true,
  "resendConfigured": true,
  "recipient": "aplustechucation@gmail.com"
}
```

If it returns `resendConfigured: false`, the Cloudflare secret is missing from the Production
environment.

## Test

1. Wait at least 2 seconds after opening the form.
2. Submit the Contact form.
3. Look in Inbox, Spam, Promotions, and All Mail.
4. Submit the Intake form.
5. Submit the Data Recovery form.
