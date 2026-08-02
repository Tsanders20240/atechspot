# V21 — DS25379 Required Autofill

## Completed change

The Data Recovery Intake now displays the A+ Techucation / DriveSavers partner code `DS25379` as a prefilled, read-only required field.

The server endpoint also validates the submitted value. A request is rejected if the code is missing, altered, or replaced.

## Updated files

- `data-recovery.html`
- `data-recovery/index.html`
- `functions/api/data-recovery.js`

## Required deployment configuration

The existing `RESEND_API_KEY`, `FORM_TO_EMAIL`, and `FORM_FROM_EMAIL` environment settings must remain configured for email delivery.

## Expected submission value

`Discount Code: DS25379`
