-- Reference only. The tables are created automatically by worker.js.
CREATE TABLE IF NOT EXISTS rsvps (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  name_key TEXT NOT NULL UNIQUE,
  message TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS guestbook (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  message TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
