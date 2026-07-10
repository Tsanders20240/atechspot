# AtechSpot Professional v4 Launch Checklist

## Forms upgraded
- accessibility-checklist.html
- ai-readiness-quiz.html
- business-audit.html
- business-checklist.html
- contact.html
- intake.html
- technology-assessment.html

## Required before forms work live
1. Replace `YOUR_TURNSTILE_SITE_KEY` in every HTML page containing a form.
2. In Cloudflare Pages secrets, add:
   - TURNSTILE_SECRET_KEY
   - RESEND_API_KEY
3. Add variables:
   - FORM_TO_EMAIL=aplustechucation@gmail.com
   - FORM_FROM_EMAIL=A+ Techucation Forms <forms@YOUR_VERIFIED_EMAIL_DOMAIN>
   - ALLOWED_HOSTS=www.atechspot.com
4. Verify the sending domain in Resend.
5. Deploy through Git-connected Cloudflare Pages or Wrangler so `functions/api/submit.js` is published.
6. Test:
   - client intake
   - contact
   - business audit
   - AI readiness quiz
   - technology assessment
   - business checklist
   - accessibility checklist
7. Confirm successful form email delivery.
8. Confirm spam rejection, Turnstile failure, duplicate submission, and rate limit behavior.

## Visual upgrades
- stronger hero presentation
- professional trust indicators
- clearer client outcomes
- four-step client path
- improved cards and spacing
- better mobile form presentation
- consistent secure-form presentation
