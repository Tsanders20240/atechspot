CREATE TABLE IF NOT EXISTS acquisition_leads (
 id TEXT PRIMARY KEY, email TEXT NOT NULL, name TEXT NOT NULL, company TEXT NOT NULL DEFAULT '',
 source TEXT NOT NULL, campaign TEXT NOT NULL, medium TEXT NOT NULL DEFAULT '',
 landing_page TEXT NOT NULL DEFAULT '', service_interest TEXT NOT NULL, industry TEXT NOT NULL DEFAULT '',
 budget TEXT NOT NULL DEFAULT '', status TEXT NOT NULL DEFAULT 'new', qualification TEXT NOT NULL,
 next_action TEXT NOT NULL, next_action_at TEXT NOT NULL, estimated_deal_value REAL,
 owner TEXT NOT NULL DEFAULT 'Jason', payload TEXT NOT NULL, created_at TEXT NOT NULL,
 updated_at TEXT NOT NULL, internal_sent INTEGER NOT NULL DEFAULT 0, confirmation_sent INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS acquisition_leads_stage ON acquisition_leads(status,next_action_at);
CREATE INDEX IF NOT EXISTS acquisition_leads_email ON acquisition_leads(email);
CREATE TABLE IF NOT EXISTS acquisition_tasks (
 id TEXT PRIMARY KEY, lead_id TEXT REFERENCES acquisition_leads(id), project_id TEXT,
 kind TEXT NOT NULL, due_at TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending',
 attempts INTEGER NOT NULL DEFAULT 0, locked_until TEXT, completed_at TEXT
);
CREATE INDEX IF NOT EXISTS acquisition_tasks_due ON acquisition_tasks(status,due_at);
CREATE TABLE IF NOT EXISTS acquisition_access (
 email TEXT PRIMARY KEY, requested_at INTEGER NOT NULL, nonce TEXT NOT NULL, used INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS acquisition_proof (
 project_id TEXT PRIMARY KEY, lead_id TEXT NOT NULL REFERENCES acquisition_leads(id),
 baseline TEXT NOT NULL DEFAULT '', result TEXT NOT NULL DEFAULT '', evidence_url TEXT NOT NULL DEFAULT '',
 testimonial TEXT NOT NULL DEFAULT '', publication_permission INTEGER NOT NULL DEFAULT 0,
 verified INTEGER NOT NULL DEFAULT 0, status TEXT NOT NULL DEFAULT 'collecting', created_at TEXT NOT NULL
);
