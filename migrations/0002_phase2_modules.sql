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
