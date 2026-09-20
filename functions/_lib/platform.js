export const PHASE2_APPS = Object.freeze({
  ops: { name: "ATechSpot Operations", purpose: "Executive operations, CRM, projects, finance, support and launch control", access: "private" },
  account: { name: "ATechSpot Account", purpose: "Central customer identity, profile and permissions", access: "customer" },
  book: { name: "ATechSpot Booking", purpose: "Brand-aware scheduling, reminders and calendar routing", access: "customer" },
  intake: { name: "ATechSpot Intake", purpose: "Conditional intake, consent, uploads and internal review", access: "customer" },
  pay: { name: "ATechSpot Pay", purpose: "Secure invoices, deposits, payment links and payment status", access: "customer" },
  clients: { name: "ATechSpot Client Portal", purpose: "Projects, milestones, files, approvals, contracts and billing", access: "customer" },
  support: { name: "ATechSpot Support", purpose: "Ticketing, routing, escalation and service history", access: "customer" },
  help: { name: "ATechSpot Help Center", purpose: "Searchable self-service documentation and ticket deflection", access: "public" },
  status: { name: "ATechSpot Status", purpose: "Service health, maintenance and incident history", access: "public" },
  start: { name: "ATechSpot Start", purpose: "Platform onboarding, tutorials, affiliate disclosure and setup assistance", access: "public" },
  shop: { name: "ATechSpot Shop", purpose: "Templates, checklists, digital tools, bundles and merchandise", access: "public" },
  partners: { name: "ATechSpot Partners", purpose: "Affiliate, referral, reseller and strategic partner management", access: "partner" },
  vendors: { name: "ATechSpot Vendors", purpose: "Vendor onboarding, compliance, projects, invoices and performance", access: "vendor" },
  press: { name: "ATechSpot Press", purpose: "Company facts, media assets, press releases and interview requests", access: "public" },
  developers: { name: "ATechSpot Developers", purpose: "API documentation, sandbox, webhooks, changelog and developer support", access: "public" }
});

export function appFromHostname(hostname = "") {
  const host = hostname.toLowerCase().split(":")[0];
  if (!host.endsWith(".atechspot.com")) return null;
  const label = host.slice(0, -".atechspot.com".length);
  if (!label || label === "www") return null;
  return PHASE2_APPS[label] ? { key: label, ...PHASE2_APPS[label] } : null;
}

const FUNCTIONAL = new Set(["ops","account","book","intake","pay","clients","support","help","status","shop","partners","vendors"]);
export function platformSnapshot() {
  return Object.entries(PHASE2_APPS).map(([key, app]) => ({
    key,
    hostname: `${key}.atechspot.com`,
    ...app,
    implementation: FUNCTIONAL.has(key) ? "functional-module" : "content-foundation"
  }));
}
