PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS brands (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  legal_owner TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS properties (
  id TEXT PRIMARY KEY,
  brand_id TEXT NOT NULL,
  hostname TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  property_type TEXT NOT NULL,
  access_level TEXT NOT NULL DEFAULT 'public',
  status TEXT NOT NULL DEFAULT 'foundation',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (brand_id) REFERENCES brands(id)
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  email_verified_at TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  user_id TEXT UNIQUE,
  display_name TEXT,
  phone TEXT,
  organization_name TEXT,
  timezone TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS roles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS user_roles (
  user_id TEXT NOT NULL,
  role_id TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, role_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TEXT NOT NULL,
  last_seen_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  user_agent TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  revoked_at TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expiry ON sessions(expires_at);

CREATE TABLE IF NOT EXISTS auth_magic_links (
  token_hash TEXT PRIMARY KEY,
  email TEXT NOT NULL COLLATE NOCASE,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  used_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_magic_email_created ON auth_magic_links(email, created_at);

CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  actor_user_id TEXT,
  action TEXT NOT NULL,
  object_type TEXT,
  object_id TEXT,
  request_id TEXT,
  metadata_json TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (actor_user_id) REFERENCES users(id)
);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at);

CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  customer_id TEXT,
  brand_id TEXT NOT NULL,
  property_id TEXT,
  source TEXT,
  campaign TEXT,
  service_interest TEXT,
  stage TEXT NOT NULL DEFAULT 'new',
  assigned_user_id TEXT,
  estimated_value_cents INTEGER,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (brand_id) REFERENCES brands(id),
  FOREIGN KEY (property_id) REFERENCES properties(id),
  FOREIGN KEY (assigned_user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  customer_id TEXT,
  property_id TEXT NOT NULL,
  service_key TEXT NOT NULL,
  starts_at TEXT NOT NULL,
  ends_at TEXT NOT NULL,
  timezone TEXT,
  status TEXT NOT NULL DEFAULT 'confirmed',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (property_id) REFERENCES properties(id)
);

CREATE TABLE IF NOT EXISTS intakes (
  id TEXT PRIMARY KEY,
  customer_id TEXT,
  property_id TEXT NOT NULL,
  service_key TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'started',
  payload_json TEXT,
  submitted_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (property_id) REFERENCES properties(id)
);

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  property_id TEXT NOT NULL,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'onboarding',
  started_at TEXT,
  due_at TEXT,
  completed_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (property_id) REFERENCES properties(id)
);

CREATE TABLE IF NOT EXISTS invoices (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  property_id TEXT NOT NULL,
  provider_invoice_id TEXT,
  description TEXT,
  payment_url TEXT,
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'draft',
  due_at TEXT,
  paid_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (property_id) REFERENCES properties(id)
);

CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  invoice_id TEXT,
  property_id TEXT NOT NULL,
  provider TEXT NOT NULL,
  provider_transaction_id TEXT,
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (invoice_id) REFERENCES invoices(id),
  FOREIGN KEY (property_id) REFERENCES properties(id)
);

CREATE TABLE IF NOT EXISTS tickets (
  id TEXT PRIMARY KEY,
  customer_id TEXT,
  property_id TEXT NOT NULL,
  category TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'P3',
  status TEXT NOT NULL DEFAULT 'new',
  subject TEXT NOT NULL,
  assigned_user_id TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  resolved_at TEXT,
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (property_id) REFERENCES properties(id),
  FOREIGN KEY (assigned_user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS articles (
  id TEXT PRIMARY KEY,
  property_id TEXT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (property_id) REFERENCES properties(id)
);

CREATE TABLE IF NOT EXISTS partners (
  id TEXT PRIMARY KEY,
  customer_id TEXT,
  partner_type TEXT NOT NULL,
  organization_name TEXT,
  status TEXT NOT NULL DEFAULT 'applicant',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE IF NOT EXISTS vendors (
  id TEXT PRIMARY KEY,
  customer_id TEXT,
  organization_name TEXT,
  status TEXT NOT NULL DEFAULT 'applicant',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

INSERT OR IGNORE INTO brands (id, name, slug, legal_owner)
VALUES ('BRD-ATECHSPOT', 'ATechSpot', 'atechspot', 'A+ Techucation L.L.C.');

INSERT OR IGNORE INTO roles (id, name, description) VALUES
('customer', 'Customer', 'Standard authenticated customer'),
('client', 'Client', 'Customer with an active client engagement'),
('student', 'Student', 'Education customer'),
('member', 'Member', 'Active membership customer'),
('partner', 'Partner', 'Approved referral or strategic partner'),
('affiliate', 'Affiliate', 'Approved affiliate'),
('vendor', 'Vendor', 'Approved vendor'),
('contractor', 'Contractor', 'Approved contractor'),
('staff', 'Staff', 'Internal staff member'),
('manager', 'Manager', 'Internal manager'),
('brand_admin', 'Brand Admin', 'Administrator for a brand or property'),
('system_admin', 'System Admin', 'Technical administrator'),
('executive', 'Executive', 'Executive access');

INSERT OR IGNORE INTO properties (id, brand_id, hostname, name, property_type, access_level) VALUES
('PROP-OPS','BRD-ATECHSPOT','ops.atechspot.com','ATechSpot Operations','internal','private'),
('PROP-ACCOUNT','BRD-ATECHSPOT','account.atechspot.com','ATechSpot Account','internal','customer'),
('PROP-BOOK','BRD-ATECHSPOT','book.atechspot.com','ATechSpot Booking','internal','customer'),
('PROP-INTAKE','BRD-ATECHSPOT','intake.atechspot.com','ATechSpot Intake','internal','customer'),
('PROP-PAY','BRD-ATECHSPOT','pay.atechspot.com','ATechSpot Pay','internal','customer'),
('PROP-CLIENTS','BRD-ATECHSPOT','clients.atechspot.com','ATechSpot Client Portal','internal','customer'),
('PROP-SUPPORT','BRD-ATECHSPOT','support.atechspot.com','ATechSpot Support','internal','customer'),
('PROP-HELP','BRD-ATECHSPOT','help.atechspot.com','ATechSpot Help Center','internal','public'),
('PROP-STATUS','BRD-ATECHSPOT','status.atechspot.com','ATechSpot Status','internal','public'),
('PROP-START','BRD-ATECHSPOT','start.atechspot.com','ATechSpot Start','internal','public'),
('PROP-SHOP','BRD-ATECHSPOT','shop.atechspot.com','ATechSpot Shop','internal','public'),
('PROP-PARTNERS','BRD-ATECHSPOT','partners.atechspot.com','ATechSpot Partners','internal','partner'),
('PROP-VENDORS','BRD-ATECHSPOT','vendors.atechspot.com','ATechSpot Vendors','internal','vendor'),
('PROP-PRESS','BRD-ATECHSPOT','press.atechspot.com','ATechSpot Press','internal','public'),
('PROP-DEVELOPERS','BRD-ATECHSPOT','developers.atechspot.com','ATechSpot Developers','internal','public');
