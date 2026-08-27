# AtechSpot V14 Final Email Recipient Fix

## Final recipient

Every website form is configured to send to:

`aplustechucation@gmail.com`

The following forms use that recipient:

- Contact
- Universal Intake
- Data Recovery
- Business inquiry forms that use the shared contact endpoint

## Cloudflare settings

Under:

`Workers & Pages -> atechspot -> Settings -> Variables and Secrets`

Set:

- `RESEND_API_KEY` = your Resend API key
- `FORM_TO_EMAIL` = `aplustechucation@gmail.com`

Optional after verifying your sending domain in Resend:

- `FORM_FROM_EMAIL=A+ Techucation Website <forms@atechspot.com>`

Until then, the website uses:

`A+ Techucation Website <onboarding@resend.dev>`

## Deploy

1. Extract this ZIP.
2. Replace all files in the GitHub repository connected to Cloudflare Pages.
3. Commit:
   `Deploy V14 final email recipient fix`
4. Wait for the Production deployment.
5. Purge Cloudflare cache.
6. Open:
   `https://www.atechspot.com/api/form-health`
7. Confirm the response shows:
   - `"recipient": "aplustechucation@gmail.com"`
   - `"deployment": "V14-EMAIL-RECIPIENT-FINAL"`
8. Submit test forms from:
   - `/contact`
   - `/intake`
   - `/data-recovery`
