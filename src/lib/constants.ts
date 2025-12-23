// The Asymmetric Public Company Hunter - Constants

// Screening defaults
export const DEFAULT_MAX_MARKET_CAP = 10_000_000_000; // $10B
export const PREFERRED_MAX_MARKET_CAP = 3_000_000_000; // $3B
export const DEFAULT_MIN_INSIDER_OWNERSHIP = 5; // 5%
export const DEFAULT_MIN_TAM_MULTIPLE = 10; // 10x
export const DEFAULT_MIN_ASYMMETRY_SCORE = 6;

// API endpoints
export const SEC_EDGAR_BASE = 'https://data.sec.gov';
export const SEC_COMPANY_TICKERS = 'https://www.sec.gov/files/company_tickers.json';
export const YAHOO_FINANCE_BASE = 'https://query1.finance.yahoo.com';

// Rate limits (requests per minute)
export const RATE_LIMITS = {
  'sec-edgar': 10,
  'yahoo-finance': 120,
  'alpha-vantage': 5,
  'fmp': 300,
};

// Cache TTL (in seconds)
export const CACHE_TTL = {
  quote: 300,          // 5 minutes for price data
  fundamentals: 86400, // 24 hours for fundamentals
  insider: 3600,       // 1 hour for insider data
  filings: 86400,      // 24 hours for SEC filings
};

// Popular stocks to exclude (too obvious, fully priced)
export const EXCLUDED_TICKERS = [
  'NVDA', 'AAPL', 'MSFT', 'GOOGL', 'GOOG', 'AMZN', 'META', 'TSLA',
  'AMD', 'INTC', 'AVGO', 'QCOM', 'TXN', 'MU',
];

// Insider transaction types
export const TRANSACTION_TYPES = {
  'P': 'buy',
  'S': 'sell',
  'M': 'option_exercise',
  'A': 'award',
  'D': 'disposition',
} as const;

// Score weights (if we want to weight differently)
export const SCORE_WEIGHTS = {
  founderConviction: 1.0,
  aiDisruption: 1.0,
  whiteSpace: 1.0,
  asymmetry: 1.0,
};

// Data quality thresholds
export const DATA_QUALITY = {
  excellent: 80,
  good: 60,
  fair: 40,
  poor: 20,
};

// Default user agent for API requests
export const USER_AGENT = 'CompanyHunter/1.0 (contact@example.com)';

// Dashboard navigation
export const DASHBOARD_NAV = [
  { path: '/dashboard', label: 'Overview', icon: 'home' },
  { path: '/dashboard/screener', label: 'Screener', icon: 'search' },
  { path: '/dashboard/watchlist', label: 'Watchlist', icon: 'star' },
  { path: '/dashboard/research', label: 'Research', icon: 'book' },
  { path: '/dashboard/scoring', label: 'Scoring', icon: 'chart' },
  { path: '/dashboard/settings', label: 'Settings', icon: 'cog' },
];
