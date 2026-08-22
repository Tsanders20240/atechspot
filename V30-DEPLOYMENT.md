# ATechSpot V30 — Enter Site Real Navigation Fix

V30 changes the intro handoff so ENTER SITE and Skip intro perform a real browser navigation to `/?entered=1` instead of merely removing the overlay in-place.

On arrival, a pre-paint script:
1. records the intro as seen in sessionStorage,
2. hides the intro before the homepage paints,
3. cleans `?entered=1` from the URL with history.replaceState,
4. leaves the full existing ATechSpot homepage and all site pages intact.

This avoids an overlay-only handoff and guarantees that clicking ENTER SITE actually loads the main website document.
