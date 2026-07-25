# AtechSpot V18 Executive Audit — DriveSavers Referral Flow

## Final customer journey
1. Visitor selects **Start Data Recovery Intake** on the homepage.
2. Visitor lands directly on the A+ Techucation data-recovery intake form.
3. The form clearly states that it is a referral intake and does not create a DriveSavers job.
4. Required ownership and partner-disclosure acknowledgments are collected.
5. A+ Techucation receives the complete intake by email with partner code DS25379 and a unique reference number.
6. The customer receives an email confirmation when Resend accepts delivery.
7. A+ Techucation reviews the lead and creates the official referral in the private DriveSavers partner dashboard.

## Corrections completed
- Removed the duplicate hero intake buttons.
- Removed customer-facing links to the private DriveSavers partner dashboard.
- Standardized the partner code as DS25379.
- Added a unique request reference number.
- Added customer confirmation email delivery.
- Added a visible success panel after form submission.
- Clarified that DriveSavers controls estimates, shipping, billing, eligibility, timing, and recovery outcomes.
- Preserved referral-compensation disclosure and sensitive-information warnings.
- Updated both `/data-recovery.html` and `/data-recovery/index.html`.
- Simplified the homepage DriveSavers calls to action.

## Required Cloudflare variables
- `RESEND_API_KEY` — Secret
- `FORM_TO_EMAIL` — `aplustechucation@gmail.com`
- `FORM_FROM_EMAIL` — verified sender, recommended: `A+ Techucation <intake@atechspot.com>`

Until `atechspot.com` is verified in Resend, use the Resend test sender allowed by the account. Customer confirmations may be restricted while using a test sender.
