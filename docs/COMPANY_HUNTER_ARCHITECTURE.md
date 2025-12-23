# The Asymmetric Public Company Hunter - Architecture

## Overview

A dashboard for identifying publicly traded companies with 20×–100×+ potential by analyzing **future TAMs, not current TAMs**.

---

## Recommended Tech Stack

### Option A: Astro + React Islands (Recommended for this project)
- **Framework:** Astro 5.x with hybrid SSR mode
- **Interactive Components:** React 18 via Astro Islands
- **Styling:** Tailwind CSS 4.x (already configured)
- **State Management:** Zustand (lightweight)
- **Data Fetching:** TanStack Query (React Query)
- **Charts:** Recharts or Chart.js
- **Database:** SQLite (local) or Supabase (hosted)

### Option B: Separate Next.js App
- If dashboard grows complex, consider standalone Next.js 15 app
- Can share Tailwind config between projects

---

## Free Data Sources

### Tier 1: Core Financial Data (No API Key Required)

| Source | Data Type | Method | Rate Limit |
|--------|-----------|--------|------------|
| **SEC EDGAR** | Filings, insider ownership, fundamentals | REST API | None |
| **Yahoo Finance** | Prices, market cap, ratios | yfinance/scraping | Soft limits |
| **OpenFIGI** | Security identifiers | REST API | 100/min |

### Tier 2: Free Tier APIs (API Key Required)

| Source | Data Type | Free Tier | Key Link |
|--------|-----------|-----------|----------|
| **Alpha Vantage** | Prices, fundamentals | 25/day | alphavantage.co |
| **Financial Modeling Prep** | Financials, profiles | 250/day | financialmodelingprep.com |
| **Polygon.io** | Market data | 5/min | polygon.io |
| **IEX Cloud** | All market data | 50k messages/mo | iexcloud.io |
| **Finnhub** | News, sentiment | 60/min | finnhub.io |
| **NewsAPI** | News headlines | 100/day | newsapi.org |

### Tier 3: Specialized Data

| Source | Data Type | Notes |
|--------|-----------|-------|
| **SEC EDGAR Form 4** | Insider transactions | Free, parse XML |
| **OpenInsider** | Insider buying summary | Web scraping |
| **Crunchbase** | Funding, founders | Limited free |
| **USPTO** | Patent data | Free API |
| **Reddit API** | Sentiment, mentions | Free tier |
| **Google Patents** | Patent search | Free |

---

## Data Model

### Company Entity
```typescript
interface Company {
  // Identifiers
  ticker: string;
  name: string;
  cik: string;              // SEC Central Index Key
  figi: string;             // OpenFIGI identifier

  // Market Data
  marketCap: number;
  price: number;
  priceChange30d: number;
  volume: number;

  // Classification
  sector: string;
  industry: string;
  futureCategory: FutureCategory;  // Custom classification

  // Fundamentals
  revenue: number;
  revenueGrowth: number;
  grossMargin: number;
  cashPosition: number;
  debtToEquity: number;

  // Insider Data
  insiderOwnership: number;
  insiderBuying90d: number;
  founderShares: number;

  // Custom Metrics
  currentTAM: number;
  futureTAM: number;
  tamMultiple: number;      // futureTAM / currentTAM

  // Scoring
  asymmetryScore: AsymmetryScore;

  // Metadata
  lastUpdated: Date;
  dataQuality: number;      // 0-100
}

type FutureCategory =
  | 'intelligence-infrastructure'
  | 'robotics-autonomous'
  | 'synthetic-biology'
  | 'materials-simulation'
  | 'advanced-energy'
  | 'national-security-space'
  | 'other';

interface AsymmetryScore {
  founderConviction: number;      // 0-10
  aiAcceleratedDisruption: number; // 0-10
  marketWhiteSpace: number;        // 0-10
  asymmetryConvexity: number;      // 0-10
  total: number;                   // Average
  rationale: ScoreRationale;
}

interface ScoreRationale {
  founderConviction: string;
  aiAcceleratedDisruption: string;
  marketWhiteSpace: string;
  asymmetryConvexity: string;
}
```

### Screening Criteria
```typescript
interface ScreeningCriteria {
  maxMarketCap: number;           // Default: 10B
  preferredMaxMarketCap: number;  // Default: 3B
  minInsiderOwnership: number;    // Default: 5%
  minTamMultiple: number;         // Default: 10x
  categories: FutureCategory[];
  excludePopularStocks: boolean;
  minAsymmetryScore: number;      // Default: 6
}
```

---

## Dashboard Architecture

### Pages Structure

```
/dashboard                    # Main dashboard
  /screener                   # Company screener
  /company/[ticker]           # Individual company deep-dive
  /watchlist                  # Saved companies
  /scoring                    # Asymmetry score calculator
  /research                   # TAM research workspace
  /settings                   # API keys, preferences
```

### Component Hierarchy

```
Dashboard/
├── Layout/
│   ├── Sidebar (navigation)
│   ├── TopBar (search, notifications)
│   └── MainContent
├── Screener/
│   ├── FilterPanel
│   ├── CompanyTable
│   ├── QuickStats
│   └── ExportButton
├── CompanyDetail/
│   ├── Header (ticker, price, score)
│   ├── PriceChart
│   ├── FundamentalsPanel
│   ├── InsiderActivity
│   ├── TAMAnalysis
│   ├── ScoreBreakdown
│   ├── CatalystTimeline
│   └── RiskAssessment
├── Scoring/
│   ├── ScoreCalculator
│   ├── CriteriaSliders
│   └── ComparisonView
└── Research/
    ├── TAMEstimator
    ├── IndustryMapper
    └── NotesEditor
```

---

## Data Pipeline

### 1. Data Collection Layer

```typescript
// services/data/
├── sec-edgar.ts         // SEC filings, insider data
├── yahoo-finance.ts     // Price, market cap
├── alpha-vantage.ts     // Fundamentals (backup)
├── fmp.ts               // Financial Modeling Prep
├── news.ts              // News aggregation
└── patents.ts           // USPTO data
```

### 2. Data Aggregation

```typescript
// services/aggregation/
├── company-profile.ts   // Merge all data sources
├── insider-analysis.ts  // Parse Form 4s
├── tam-calculator.ts    // TAM estimation logic
└── score-engine.ts      // Asymmetry scoring
```

### 3. Storage

```typescript
// For MVP: Local SQLite via better-sqlite3
// For Production: Supabase or PlanetScale

// db/schema.sql
CREATE TABLE companies (
  id INTEGER PRIMARY KEY,
  ticker TEXT UNIQUE,
  data JSON,
  scores JSON,
  last_updated DATETIME
);

CREATE TABLE watchlist (
  id INTEGER PRIMARY KEY,
  ticker TEXT,
  notes TEXT,
  added_at DATETIME
);

CREATE TABLE tam_research (
  id INTEGER PRIMARY KEY,
  ticker TEXT,
  current_tam REAL,
  future_tam REAL,
  rationale TEXT,
  sources JSON
);
```

---

## Scoring Engine Logic

### Founder Conviction (0-10)

```typescript
function scoreFounderConviction(company: Company): number {
  let score = 0;

  // Insider ownership (0-4 points)
  if (company.insiderOwnership > 30) score += 4;
  else if (company.insiderOwnership > 20) score += 3;
  else if (company.insiderOwnership > 10) score += 2;
  else if (company.insiderOwnership > 5) score += 1;

  // Recent insider buying (0-3 points)
  if (company.insiderBuying90d > 1_000_000) score += 3;
  else if (company.insiderBuying90d > 100_000) score += 2;
  else if (company.insiderBuying90d > 0) score += 1;

  // Founder still active (0-3 points) - requires manual tagging
  // Parse from 14A proxy statements

  return Math.min(score, 10);
}
```

### AI-Accelerated Disruption (0-10)

```typescript
function scoreAIDisruption(company: Company): number {
  // Based on category and TAM multiple
  const categoryScores: Record<FutureCategory, number> = {
    'intelligence-infrastructure': 3,
    'robotics-autonomous': 3,
    'synthetic-biology': 2,
    'materials-simulation': 2,
    'advanced-energy': 2,
    'national-security-space': 2,
    'other': 0,
  };

  let score = categoryScores[company.futureCategory];

  // TAM multiple boost
  if (company.tamMultiple > 100) score += 4;
  else if (company.tamMultiple > 50) score += 3;
  else if (company.tamMultiple > 20) score += 2;
  else if (company.tamMultiple > 10) score += 1;

  // AI mentions in filings (NLP analysis)
  // score += analyzeAIReferences(company.filings);

  return Math.min(score, 10);
}
```

### Market White-Space (0-10)

```typescript
function scoreWhiteSpace(company: Company): number {
  let score = 0;

  // Small current TAM = higher score
  if (company.currentTAM < 1_000_000_000) score += 4;    // <$1B
  else if (company.currentTAM < 10_000_000_000) score += 2; // <$10B

  // Low analyst coverage
  // score += (10 - company.analystCoverage) / 2;

  // Low institutional ownership indicates non-consensus
  // if (company.institutionalOwnership < 30) score += 2;

  // Market cap < TAM potential
  if (company.marketCap < company.futureTAM * 0.01) score += 3;

  return Math.min(score, 10);
}
```

### Asymmetry & Convexity (0-10)

```typescript
function scoreAsymmetry(company: Company): number {
  let score = 0;

  // Potential upside multiple
  const potentialMultiple = company.futureTAM * 0.1 / company.marketCap;
  if (potentialMultiple > 100) score += 4;
  else if (potentialMultiple > 50) score += 3;
  else if (potentialMultiple > 20) score += 2;
  else if (potentialMultiple > 10) score += 1;

  // Strong balance sheet (survivability)
  if (company.cashPosition > company.marketCap * 0.1) score += 2;
  if (company.debtToEquity < 0.5) score += 1;

  // Multiple expansion catalysts
  // score += countCatalysts(company);

  // Downside protection
  if (company.grossMargin > 50) score += 1;
  if (company.revenueGrowth > 20) score += 1;

  return Math.min(score, 10);
}
```

---

## Implementation Phases

### Phase 1: Foundation (Week 1-2)
- [ ] Set up Astro hybrid mode with React
- [ ] Create dashboard layout and navigation
- [ ] Implement SEC EDGAR data fetcher
- [ ] Build basic company screener table
- [ ] Add local SQLite storage

### Phase 2: Data Layer (Week 3-4)
- [ ] Integrate Yahoo Finance for prices
- [ ] Parse Form 4 insider transactions
- [ ] Build company profile aggregation
- [ ] Add Alpha Vantage for fundamentals
- [ ] Implement data caching

### Phase 3: Scoring Engine (Week 5-6)
- [ ] Build scoring algorithms
- [ ] Create manual override UI
- [ ] Add TAM estimation workspace
- [ ] Implement category classification

### Phase 4: Analysis Features (Week 7-8)
- [ ] Company deep-dive page
- [ ] Catalyst timeline
- [ ] Watchlist with notes
- [ ] Export to CSV/PDF
- [ ] News integration

### Phase 5: Polish (Week 9-10)
- [ ] Charts and visualizations
- [ ] Mobile responsive
- [ ] Performance optimization
- [ ] Documentation

---

## API Rate Limit Strategy

```typescript
// services/rate-limiter.ts
class RateLimiter {
  private queues: Map<string, RequestQueue>;

  constructor() {
    this.queues = new Map([
      ['sec-edgar', new RequestQueue(10, 1000)],     // 10 req/sec
      ['alpha-vantage', new RequestQueue(5, 60000)], // 5 req/min
      ['fmp', new RequestQueue(5, 1000)],            // 5 req/sec
      ['yahoo', new RequestQueue(2, 1000)],          // 2 req/sec
    ]);
  }

  async request(source: string, fn: () => Promise<any>) {
    const queue = this.queues.get(source);
    return queue?.enqueue(fn);
  }
}
```

---

## Initial Company Universe

### Seed List by Category

**Intelligence Infrastructure:**
- SMCI (Super Micro Computer) - AI server infrastructure
- ANET (Arista Networks) - Data center networking
- COHR (Coherent) - Optical components
- ONTO (Onto Innovation) - Semiconductor process control

**Robotics & Autonomous:**
- ISRG (Intuitive Surgical) - Surgical robotics
- LUNR (Intuitive Machines) - Lunar landers
- AMBA (Ambarella) - Edge AI vision
- PATH (UiPath) - RPA

**Synthetic Biology:**
- TWST (Twist Bioscience) - DNA synthesis
- DNA (Ginkgo Bioworks) - Biotech platform
- CDNA (CareDx) - Transplant diagnostics

**Advanced Energy:**
- OKLO (Oklo) - Micro nuclear
- SMR (NuScale Power) - Small modular reactors
- FREY (Freyr Battery) - Battery cells

**National Security & Space:**
- RKLB (Rocket Lab) - Small launch
- PL (Planet Labs) - Earth imaging
- ASTS (AST SpaceMobile) - Satellite cellular

---

## File Structure

```
src/
├── pages/
│   ├── dashboard/
│   │   ├── index.astro           # Dashboard home
│   │   ├── screener.astro        # Company screener
│   │   ├── company/[ticker].astro # Company detail
│   │   ├── watchlist.astro       # Saved companies
│   │   ├── scoring.astro         # Score calculator
│   │   ├── research.astro        # TAM research
│   │   └── settings.astro        # Configuration
│   └── api/
│       ├── companies/[ticker].ts
│       ├── screen.ts
│       ├── insider.ts
│       └── refresh.ts
├── components/
│   ├── dashboard/
│   │   ├── DashboardLayout.tsx
│   │   ├── Sidebar.tsx
│   │   ├── CompanyTable.tsx
│   │   ├── ScoreCard.tsx
│   │   ├── TAMChart.tsx
│   │   ├── InsiderActivity.tsx
│   │   └── FilterPanel.tsx
├── services/
│   ├── data/
│   │   ├── sec-edgar.ts
│   │   ├── yahoo-finance.ts
│   │   ├── alpha-vantage.ts
│   │   └── aggregator.ts
│   ├── scoring/
│   │   ├── engine.ts
│   │   ├── founder-conviction.ts
│   │   ├── ai-disruption.ts
│   │   ├── white-space.ts
│   │   └── asymmetry.ts
│   └── db/
│       ├── client.ts
│       ├── companies.ts
│       └── watchlist.ts
├── lib/
│   ├── types.ts
│   ├── constants.ts
│   └── utils.ts
└── db/
    └── schema.sql
```

---

## Environment Variables

```env
# .env.example

# Optional API Keys (free tiers)
ALPHA_VANTAGE_KEY=
FMP_API_KEY=
FINNHUB_KEY=
POLYGON_KEY=
NEWS_API_KEY=

# Database
DATABASE_URL=./data/hunter.db

# Cache
CACHE_TTL_SECONDS=3600
```

---

## Quick Start

```bash
# Install dependencies
npm install

# Add required packages
npm install @astrojs/react react react-dom
npm install @tanstack/react-query zustand recharts
npm install better-sqlite3

# Create database
mkdir -p data
sqlite3 data/hunter.db < db/schema.sql

# Start development
npm run dev
```

---

## Next Steps

1. **Confirm architecture choice** (Astro Islands vs Next.js)
2. **Prioritize data sources** (start with SEC EDGAR + Yahoo)
3. **Define MVP scope** (basic screener + top 10 list)
4. **Set up API key accounts** for enhanced data

---

*Document created for The Asymmetric Public Company Hunter project*
