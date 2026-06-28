CREATE TABLE locations (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('closet', 'station', 'work_area')),
  name TEXT NOT NULL,
  description TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE assets (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('ok', 'incompleto', 'mantenimiento', 'faltante')),
  location_id TEXT NOT NULL REFERENCES locations(id),
  last_review TEXT,
  responsible TEXT,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE asset_components (
  id TEXT PRIMARY KEY,
  asset_id TEXT NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  quantity_expected INTEGER NOT NULL DEFAULT 1,
  quantity_actual INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL CHECK (status IN ('ok', 'incompleto', 'mantenimiento', 'faltante')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'docente', 'encargado', 'alumno')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audits (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  user_id TEXT REFERENCES users(id),
  location_id TEXT NOT NULL REFERENCES locations(id),
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audit_items (
  id TEXT PRIMARY KEY,
  audit_id TEXT NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
  asset_id TEXT NOT NULL REFERENCES assets(id),
  previous_status TEXT NOT NULL,
  new_status TEXT NOT NULL,
  observation TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_assets_location_id ON assets(location_id);
CREATE INDEX idx_assets_status ON assets(status);
CREATE INDEX idx_asset_components_asset_id ON asset_components(asset_id);
CREATE INDEX idx_audits_location_id ON audits(location_id);
