-- ATechSpot Phase 2 combined activation migration
-- Generated from 0001, 0002 and 0003. Safe for the current empty atechspot-phase2 D1 database.
-- Run this entire file once in Cloudflare D1 Console.

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


-- =========================
-- Phase 2 functional modules
-- =========================
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS service_catalog (
  id TEXT PRIMARY KEY,
  brand_id TEXT NOT NULL,
  property_id TEXT,
  service_key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  price_cents INTEGER,
  deposit_cents INTEGER,
  requires_intake INTEGER NOT NULL DEFAULT 1,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (brand_id) REFERENCES brands(id),
  FOREIGN KEY (property_id) REFERENCES properties(id)
);

CREATE TABLE IF NOT EXISTS project_milestones (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  due_at TEXT,
  completed_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS project_messages (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  author_user_id TEXT,
  body TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (author_user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS ticket_messages (
  id TEXT PRIMARY KEY,
  ticket_id TEXT NOT NULL,
  author_user_id TEXT,
  body TEXT NOT NULL,
  is_internal INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
  FOREIGN KEY (author_user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS incidents (
  id TEXT PRIMARY KEY,
  service_key TEXT NOT NULL,
  title TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'minor',
  status TEXT NOT NULL DEFAULT 'investigating',
  public_message TEXT,
  started_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  resolved_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  property_id TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  product_type TEXT NOT NULL DEFAULT 'digital',
  status TEXT NOT NULL DEFAULT 'draft',
  payment_url TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (property_id) REFERENCES properties(id)
);

CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  read_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_bookings_customer ON bookings(customer_id, starts_at);
CREATE INDEX IF NOT EXISTS idx_intakes_customer ON intakes(customer_id, created_at);
CREATE INDEX IF NOT EXISTS idx_projects_customer ON projects(customer_id, updated_at);
CREATE INDEX IF NOT EXISTS idx_invoices_customer ON invoices(customer_id, created_at);
CREATE INDEX IF NOT EXISTS idx_tickets_customer ON tickets(customer_id, updated_at);
CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents(status, started_at);

INSERT OR IGNORE INTO service_catalog
(id, brand_id, property_id, service_key, name, description, duration_minutes, price_cents, deposit_cents, requires_intake)
VALUES
('SRV-CONSULT-30','BRD-ATECHSPOT','PROP-BOOK','consultation-30','30-Minute Technology Consultation','Initial consultation for AI, automation, websites, ecommerce, apps, software or technology strategy.',30,NULL,NULL,1),
('SRV-TECH-REMOTE','BRD-ATECHSPOT','PROP-BOOK','remote-tech-support','Remote Technology Support','Remote troubleshooting and technology support session.',30,NULL,NULL,1),
('SRV-WEB-DISCOVERY','BRD-ATECHSPOT','PROP-BOOK','website-discovery','Website & Digital System Discovery','Discovery session for website, ecommerce and digital-system projects.',45,NULL,NULL,1);

INSERT OR IGNORE INTO articles
(id, property_id, slug, title, body, status)
VALUES
('ART-ACCOUNT-001','PROP-HELP','account-sign-in','How do I sign in to my ATechSpot account?','Enter your email address on account.atechspot.com. ATechSpot sends a time-limited sign-in link. Open the link in the same browser to create or access your account.','published'),
('ART-BOOK-001','PROP-HELP','booking-basics','How booking works','Choose an available ATechSpot service, date and time. Some services require intake before the appointment. Confirmation and reminder automation will be added as the scheduling module is activated.','published'),
('ART-SUPPORT-001','PROP-HELP','support-ticket','How do I open a support ticket?','Sign in to your ATechSpot account, open support.atechspot.com, choose a category and priority, and describe the issue.','published');


-- =========================
-- Account / billing / privacy
-- =========================
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS customer_preferences (
  customer_id TEXT PRIMARY KEY,
  transactional_email INTEGER NOT NULL DEFAULT 1,
  marketing_email INTEGER NOT NULL DEFAULT 0,
  product_updates INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS data_requests (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  request_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'submitted',
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at TEXT,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  property_id TEXT NOT NULL,
  total_cents INTEGER NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'created',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (property_id) REFERENCES properties(id)
);

CREATE TABLE IF NOT EXISTS order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  product_id TEXT,
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price_cents INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);


CREATE INDEX IF NOT EXISTS idx_data_requests_customer ON data_requests(customer_id, created_at);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id, created_at);

