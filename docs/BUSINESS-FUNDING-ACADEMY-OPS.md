# A+ Techucation Business & Funding Academy — Ops Integration

## Ecosystem placement
- Parent public property: A+ Techucation
- Route: `atechucation.atechspot.com/business-funding/`
- Legal operator: A+ Techucation L.L.C.
- Does not create a new public ecosystem property or new support-system destination.
- Shared services remain ATechSpot account, pay, support, help, analytics and Ops.

## Ops dashboard additions
Add an **Education / Course Management** area to `ops.atechspot.com`.

### Executive KPIs
- Total courses
- Published / draft / archived courses
- Enrollments
- Active students
- Completion rate
- Revenue by course
- Revenue by academy
- Membership-attributed course revenue
- Standalone course revenue
- Bundle revenue
- Refunds
- Certificates issued
- Student support volume
- Course conversion rate
- Upsell revenue into consulting/services

### Course registry fields
- Course ID
- Academy ID
- Title
- Slug
- Track
- Instructor/owner
- Status
- Standalone price
- Membership access level
- Enrollment count
- Completion rate
- Revenue
- Last content update
- Legal review status
- Content review status

### Required filters
- Academy
- Track
- Course status
- Membership tier
- Date range
- Legal review status
- Content review status

### Roles
- Executive: full reporting and approval
- System Admin: system configuration
- Education Admin: course/content operations
- Finance: revenue/refund reporting
- Support: enrollment/support visibility only

## Funnel events
Track:
1. academy_view
2. course_view
3. course_cta_click
4. membership_cta_click
5. checkout_started
6. enrollment_created
7. lesson_started
8. lesson_completed
9. course_completed
10. consulting_upsell_click

## Launch gate
A course cannot be marked Published until:
- course metadata complete
- pricing/access configured
- content review passed
- legal/compliance review passed where required
- checkout/access tested
- support route verified
- analytics verified
- sitemap/canonical verified

## Compliance
Grant and nonprofit courses must not promise funding, approval, tax-exempt status, financing, revenue or legal outcomes. Educational content should direct users to current authoritative sources and qualified professionals for situation-specific legal, tax, accounting or financial advice.
