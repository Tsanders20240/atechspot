# AtechSpot V13 Resend-Ready Email Setup

Your Resend API key has been created. Do not paste the key into website code or GitHub.

## Cloudflare Production Secret

Go to:

`Cloudflare Dashboard -> Workers & Pages -> atechspot -> Settings -> Variables and Secrets`

Add:

- Variable name: `RESEND_API_KEY`
- Type: Secret
- Value: paste the Resend key that starts with `re_`

Save it for the **Production** environment.

## Recipient

The website defaults to:

`aplustechucation@gmail.com`

You may also add this Cloudflare variable explicitly:

- `FORM_TO_EMAIL=aplustechucation@gmail.com`

The address shown in your Resend test example was:

`aplustechucation@gmail.com`

That is only the sample test recipient from Resend. It does not automatically control your website forms.

## Sender

Until your own domain is verified in Resend, use:

`A+ Techucation Website <onboarding@resend.dev>`

Do not add `FORM_FROM_EMAIL` yet unless you have verified a sending domain in Resend.

After domain verification, set for example:

`FORM_FROM_EMAIL=A+ Techucation Website <forms@atechspot.com>`

## Redeploy

After saving the Cloudflare secret:

1. Open the latest Cloudflare Pages deployment.
2. Click **Retry deployment** or push a new GitHub commit.
3. Wait until the deployment is Production.
4. Open:

`https://www.atechspot.com/api/form-health`

Expected response:

```json
{
  "ok": true,
  "resendConfigured": true,
  "recipient": "aplustechucation@gmail.com",
  "sender": "A+ Techucation Website <onboarding@resend.dev>",
  "deployment": "V13-RESEND-READY"
}
```

## Test

Submit one test from:

- `/contact`
- `/intake`
- `/data-recovery`

Check Inbox, Spam, Promotions, and All Mail in `aplustechucation@gmail.com`.
