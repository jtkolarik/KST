-- Company Hunter Database Schema

-- Core company data
CREATE TABLE IF NOT EXISTS companies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ticker TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  cik TEXT,                           -- SEC Central Index Key

  -- Market data
  market_cap REAL,
  price REAL,
  price_change_30d REAL,
  volume INTEGER,

  -- Classification
  sector TEXT,
  industry TEXT,
  future_category TEXT,               -- Our custom classification

  -- Fundamentals
  revenue REAL,
  revenue_growth REAL,
  gross_margin REAL,
  cash_position REAL,
  debt_to_equity REAL,

  -- Insider data
  insider_ownership REAL,
  insider_buying_90d REAL,
  founder_shares REAL,
  founder_active INTEGER DEFAULT 0,   -- Boolean

  -- TAM data
  current_tam REAL,
  future_tam REAL,
  tam_multiple REAL,
  tam_rationale TEXT,

  -- Asymmetry scores (0-10 each)
  score_founder_conviction REAL,
  score_ai_disruption REAL,
  score_white_space REAL,
  score_asymmetry REAL,
  score_total REAL,
  score_rationale TEXT,               -- JSON

  -- Metadata
  data_quality INTEGER DEFAULT 0,     -- 0-100
  last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- User's watchlist
CREATE TABLE IF NOT EXISTS watchlist (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ticker TEXT NOT NULL,
  notes TEXT,
  target_price REAL,
  thesis TEXT,
  added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ticker) REFERENCES companies(ticker)
);

-- TAM research entries
CREATE TABLE IF NOT EXISTS tam_research (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ticker TEXT NOT NULL,
  current_tam REAL,
  future_tam REAL,
  time_horizon_years INTEGER DEFAULT 10,
  rationale TEXT,
  sources TEXT,                       -- JSON array of URLs
  confidence INTEGER DEFAULT 50,      -- 0-100
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ticker) REFERENCES companies(ticker)
);

-- Insider transactions (from SEC Form 4)
CREATE TABLE IF NOT EXISTS insider_transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ticker TEXT NOT NULL,
  insider_name TEXT,
  insider_title TEXT,
  transaction_type TEXT,              -- 'buy', 'sell', 'option_exercise'
  shares INTEGER,
  price REAL,
  value REAL,
  transaction_date DATE,
  filing_date DATE,
  form_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Catalysts and events
CREATE TABLE IF NOT EXISTS catalysts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ticker TEXT NOT NULL,
  catalyst_type TEXT,                 -- 'product_launch', 'fda_approval', 'earnings', 'contract', etc.
  description TEXT,
  expected_date DATE,
  impact_score INTEGER,               -- 1-10
  status TEXT DEFAULT 'pending',      -- 'pending', 'occurred', 'missed'
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ticker) REFERENCES companies(ticker)
);

-- Data cache for API responses
CREATE TABLE IF NOT EXISTS data_cache (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cache_key TEXT UNIQUE NOT NULL,
  data TEXT NOT NULL,                 -- JSON
  source TEXT,
  expires_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_companies_ticker ON companies(ticker);
CREATE INDEX IF NOT EXISTS idx_companies_market_cap ON companies(market_cap);
CREATE INDEX IF NOT EXISTS idx_companies_score ON companies(score_total DESC);
CREATE INDEX IF NOT EXISTS idx_companies_category ON companies(future_category);
CREATE INDEX IF NOT EXISTS idx_insider_ticker ON insider_transactions(ticker);
CREATE INDEX IF NOT EXISTS idx_insider_date ON insider_transactions(transaction_date DESC);
CREATE INDEX IF NOT EXISTS idx_cache_key ON data_cache(cache_key);
CREATE INDEX IF NOT EXISTS idx_cache_expires ON data_cache(expires_at);

-- Seed data: Initial company universe
INSERT OR IGNORE INTO companies (ticker, name, future_category) VALUES
  -- Intelligence Infrastructure
  ('SMCI', 'Super Micro Computer', 'intelligence-infrastructure'),
  ('ANET', 'Arista Networks', 'intelligence-infrastructure'),
  ('COHR', 'Coherent Corp', 'intelligence-infrastructure'),
  ('ONTO', 'Onto Innovation', 'intelligence-infrastructure'),
  ('CIEN', 'Ciena Corporation', 'intelligence-infrastructure'),

  -- Robotics & Autonomous
  ('AMBA', 'Ambarella Inc', 'robotics-autonomous'),
  ('PATH', 'UiPath Inc', 'robotics-autonomous'),
  ('OUST', 'Ouster Inc', 'robotics-autonomous'),
  ('LUNR', 'Intuitive Machines', 'robotics-autonomous'),

  -- Synthetic Biology
  ('TWST', 'Twist Bioscience', 'synthetic-biology'),
  ('DNA', 'Ginkgo Bioworks', 'synthetic-biology'),
  ('CDNA', 'CareDx Inc', 'synthetic-biology'),
  ('BEAM', 'Beam Therapeutics', 'synthetic-biology'),

  -- Advanced Energy
  ('OKLO', 'Oklo Inc', 'advanced-energy'),
  ('SMR', 'NuScale Power', 'advanced-energy'),
  ('FREY', 'Freyr Battery', 'advanced-energy'),
  ('STEM', 'Stem Inc', 'advanced-energy'),

  -- National Security & Space
  ('RKLB', 'Rocket Lab USA', 'national-security-space'),
  ('PL', 'Planet Labs', 'national-security-space'),
  ('ASTS', 'AST SpaceMobile', 'national-security-space'),
  ('RDW', 'Redwire Corporation', 'national-security-space'),
  ('MNTS', 'Momentus Inc', 'national-security-space');
