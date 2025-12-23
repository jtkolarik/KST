// The Asymmetric Public Company Hunter - Type Definitions

export type FutureCategory =
  | 'intelligence-infrastructure'
  | 'robotics-autonomous'
  | 'synthetic-biology'
  | 'materials-simulation'
  | 'advanced-energy'
  | 'national-security-space'
  | 'other';

export interface Company {
  // Identifiers
  id?: number;
  ticker: string;
  name: string;
  cik?: string;

  // Market Data
  marketCap?: number;
  price?: number;
  priceChange30d?: number;
  volume?: number;

  // Classification
  sector?: string;
  industry?: string;
  futureCategory: FutureCategory;

  // Fundamentals
  revenue?: number;
  revenueGrowth?: number;
  grossMargin?: number;
  cashPosition?: number;
  debtToEquity?: number;

  // Insider Data
  insiderOwnership?: number;
  insiderBuying90d?: number;
  founderShares?: number;
  founderActive?: boolean;

  // TAM Data
  currentTAM?: number;
  futureTAM?: number;
  tamMultiple?: number;
  tamRationale?: string;

  // Scoring
  scores?: AsymmetryScore;

  // Metadata
  dataQuality?: number;
  lastUpdated?: Date;
}

export interface AsymmetryScore {
  founderConviction: number;      // 0-10
  aiDisruption: number;           // 0-10
  whiteSpace: number;             // 0-10
  asymmetry: number;              // 0-10
  total: number;                  // Average
  rationale?: ScoreRationale;
}

export interface ScoreRationale {
  founderConviction: string;
  aiDisruption: string;
  whiteSpace: string;
  asymmetry: string;
}

export interface InsiderTransaction {
  id?: number;
  ticker: string;
  insiderName: string;
  insiderTitle?: string;
  transactionType: 'buy' | 'sell' | 'option_exercise';
  shares: number;
  price: number;
  value: number;
  transactionDate: Date;
  filingDate: Date;
  formUrl?: string;
}

export interface WatchlistItem {
  id?: number;
  ticker: string;
  notes?: string;
  targetPrice?: number;
  thesis?: string;
  addedAt: Date;
  company?: Company;
}

export interface TAMResearch {
  id?: number;
  ticker: string;
  currentTAM: number;
  futureTAM: number;
  timeHorizonYears: number;
  rationale: string;
  sources: string[];
  confidence: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Catalyst {
  id?: number;
  ticker: string;
  catalystType: string;
  description: string;
  expectedDate?: Date;
  impactScore: number;
  status: 'pending' | 'occurred' | 'missed';
  notes?: string;
}

export interface ScreeningCriteria {
  maxMarketCap?: number;
  minMarketCap?: number;
  categories?: FutureCategory[];
  minInsiderOwnership?: number;
  minTamMultiple?: number;
  minAsymmetryScore?: number;
  excludeTickers?: string[];
}

export interface CompanyTableRow {
  ticker: string;
  name: string;
  marketCap: number;
  futureCategory: FutureCategory;
  insiderOwnership: number;
  tamMultiple: number;
  scoreTotal: number;
  priceChange30d: number;
}

// API Response types
export interface YahooQuote {
  symbol: string;
  regularMarketPrice: number;
  regularMarketChange: number;
  regularMarketChangePercent: number;
  marketCap: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  averageVolume: number;
}

export interface SECFiling {
  accessionNumber: string;
  filingDate: string;
  form: string;
  description: string;
  documentUrl: string;
}

export interface SECCompanyInfo {
  cik: string;
  name: string;
  ticker: string;
  sic: string;
  sicDescription: string;
  filings: SECFiling[];
}

// Category metadata
export const CATEGORY_INFO: Record<FutureCategory, { label: string; color: string; description: string }> = {
  'intelligence-infrastructure': {
    label: 'Intelligence Infrastructure',
    color: '#6366f1', // indigo
    description: 'Compute, chips, photonics, data centers, energy for AI'
  },
  'robotics-autonomous': {
    label: 'Robotics & Autonomous',
    color: '#8b5cf6', // violet
    description: 'Physical AI, autonomous systems, industrial automation'
  },
  'synthetic-biology': {
    label: 'Synthetic Biology',
    color: '#10b981', // emerald
    description: 'DNA synthesis, cell programming, precision biotech'
  },
  'materials-simulation': {
    label: 'Materials & Simulation',
    color: '#f59e0b', // amber
    description: 'Physics simulation, computational materials, digital twins'
  },
  'advanced-energy': {
    label: 'Advanced Energy',
    color: '#ef4444', // red
    description: 'Fusion, geothermal, micro-nuclear, next-gen batteries'
  },
  'national-security-space': {
    label: 'Defense & Space',
    color: '#3b82f6', // blue
    description: 'National security AI, space infrastructure, defense tech'
  },
  'other': {
    label: 'Other',
    color: '#6b7280', // gray
    description: 'Other emerging technology categories'
  }
};

// Formatting utilities
export function formatMarketCap(value: number | undefined): string {
  if (!value) return 'N/A';
  if (value >= 1_000_000_000_000) return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  return `$${value.toLocaleString()}`;
}

export function formatPercent(value: number | undefined): string {
  if (value === undefined) return 'N/A';
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}

export function formatTAM(value: number | undefined): string {
  if (!value) return 'TBD';
  if (value >= 1_000_000_000_000) return `$${(value / 1_000_000_000_000).toFixed(1)}T`;
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(0)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(0)}M`;
  return `$${value.toLocaleString()}`;
}
