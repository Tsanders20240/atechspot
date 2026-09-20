-- A+ Techucation Business & Funding Academy
-- D1-ready additive schema. Prefix edu_ avoids collisions with shared ATechSpot tables.
CREATE TABLE IF NOT EXISTS edu_academies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS edu_courses (
  id TEXT PRIMARY KEY,
  academy_id TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  track TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  standalone_price_cents INTEGER,
  description TEXT,
  legal_review_status TEXT NOT NULL DEFAULT 'pending',
  content_review_status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (academy_id) REFERENCES edu_academies(id)
);

CREATE TABLE IF NOT EXISTS edu_membership_course_access (
  membership_code TEXT NOT NULL,
  course_id TEXT NOT NULL,
  access_level TEXT NOT NULL DEFAULT 'full',
  PRIMARY KEY (membership_code, course_id),
  FOREIGN KEY (course_id) REFERENCES edu_courses(id)
);

CREATE TABLE IF NOT EXISTS edu_enrollments (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  course_id TEXT NOT NULL,
  source TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  enrolled_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at TEXT,
  FOREIGN KEY (course_id) REFERENCES edu_courses(id)
);

CREATE TABLE IF NOT EXISTS edu_course_progress (
  enrollment_id TEXT PRIMARY KEY,
  completed_units INTEGER NOT NULL DEFAULT 0,
  total_units INTEGER NOT NULL DEFAULT 0,
  percent_complete REAL NOT NULL DEFAULT 0,
  last_activity_at TEXT,
  FOREIGN KEY (enrollment_id) REFERENCES edu_enrollments(id)
);

INSERT OR IGNORE INTO edu_academies (id,name,slug,status)
VALUES ('ACA-BFA-001','A+ Techucation Business & Funding Academy','business-funding','planned_launch');
