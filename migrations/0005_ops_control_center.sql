PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS property_health (
  property_id TEXT PRIMARY KEY,
  dns_status TEXT NOT NULL DEFAULT 'unknown',
  ssl_status TEXT NOT NULL DEFAULT 'unknown',
  http_status INTEGER,
  last_checked_at TEXT,
  incident_note TEXT,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS content_calendar (
  id TEXT PRIMARY KEY,
  brand_id TEXT NOT NULL,
  property_id TEXT,
  title TEXT NOT NULL,
  channel TEXT NOT NULL,
  content_type TEXT,
  status TEXT NOT NULL DEFAULT 'planned',
  scheduled_at TEXT,
  owner_user_id TEXT,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (brand_id) REFERENCES brands(id),
  FOREIGN KEY (property_id) REFERENCES properties(id),
  FOREIGN KEY (owner_user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS affiliate_performance (
  id TEXT PRIMARY KEY,
  partner_id TEXT,
  brand_id TEXT NOT NULL,
  period_start TEXT NOT NULL,
  period_end TEXT NOT NULL,
  clicks INTEGER NOT NULL DEFAULT 0,
  leads INTEGER NOT NULL DEFAULT 0,
  conversions INTEGER NOT NULL DEFAULT 0,
  revenue_cents INTEGER NOT NULL DEFAULT 0,
  commission_cents INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (partner_id) REFERENCES partners(id),
  FOREIGN KEY (brand_id) REFERENCES brands(id)
);

CREATE TABLE IF NOT EXISTS compliance_calendar (
  id TEXT PRIMARY KEY,
  brand_id TEXT,
  property_id TEXT,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  jurisdiction TEXT,
  due_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  owner_user_id TEXT,
  notes TEXT,
  completed_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (brand_id) REFERENCES brands(id),
  FOREIGN KEY (property_id) REFERENCES properties(id),
  FOREIGN KEY (owner_user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS vendor_records (
  id TEXT PRIMARY KEY,
  vendor_id TEXT,
  brand_id TEXT,
  service_category TEXT,
  contact_name TEXT,
  contact_email TEXT,
  contract_status TEXT NOT NULL DEFAULT 'prospect',
  renewal_at TEXT,
  annual_cost_cents INTEGER,
  risk_level TEXT NOT NULL DEFAULT 'standard',
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (vendor_id) REFERENCES vendors(id),
  FOREIGN KEY (brand_id) REFERENCES brands(id)
);

CREATE TABLE IF NOT EXISTS launch_checklists (
  id TEXT PRIMARY KEY,
  brand_id TEXT NOT NULL,
  property_id TEXT,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'planning',
  target_launch_at TEXT,
  owner_user_id TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (brand_id) REFERENCES brands(id),
  FOREIGN KEY (property_id) REFERENCES properties(id),
  FOREIGN KEY (owner_user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS launch_checklist_items (
  id TEXT PRIMARY KEY,
  checklist_id TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT,
  is_required INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'pending',
  sort_order INTEGER NOT NULL DEFAULT 0,
  completed_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (checklist_id) REFERENCES launch_checklists(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS standard_operating_procedures (
  id TEXT PRIMARY KEY,
  brand_id TEXT,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  version TEXT NOT NULL DEFAULT '1.0',
  owner_user_id TEXT,
  review_due_at TEXT,
  body TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (brand_id) REFERENCES brands(id),
  FOREIGN KEY (owner_user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_content_calendar_schedule ON content_calendar(status, scheduled_at);
CREATE INDEX IF NOT EXISTS idx_affiliate_period ON affiliate_performance(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_compliance_due ON compliance_calendar(status, due_at);
CREATE INDEX IF NOT EXISTS idx_vendor_renewal ON vendor_records(contract_status, renewal_at);
CREATE INDEX IF NOT EXISTS idx_launch_status ON launch_checklists(status, target_launch_at);
CREATE INDEX IF NOT EXISTS idx_sop_status ON standard_operating_procedures(status, review_due_at);

INSERT OR IGNORE INTO property_health (property_id)
SELECT id FROM properties;
