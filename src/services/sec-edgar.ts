// SEC EDGAR Data Service
// Free, no API key required - but must include User-Agent header

import { SEC_EDGAR_BASE, SEC_COMPANY_TICKERS, USER_AGENT, CACHE_TTL } from '../lib/constants';
import type { SECFiling, SECCompanyInfo, InsiderTransaction } from '../lib/types';

// SEC requires User-Agent header with contact info
const headers = {
  'User-Agent': USER_AGENT,
  'Accept': 'application/json',
};

// Cache for company tickers (CIK lookup)
let tickerCache: Map<string, string> | null = null;

/**
 * Fetch CIK for a given ticker symbol
 */
export async function getCIK(ticker: string): Promise<string | null> {
  if (!tickerCache) {
    await loadTickerCache();
  }
  return tickerCache?.get(ticker.toUpperCase()) || null;
}

/**
 * Load ticker to CIK mapping from SEC
 */
async function loadTickerCache(): Promise<void> {
  try {
    const response = await fetch(SEC_COMPANY_TICKERS, { headers });
    const data = await response.json();

    tickerCache = new Map();
    for (const key in data) {
      const company = data[key];
      const cik = String(company.cik_str).padStart(10, '0');
      tickerCache.set(company.ticker.toUpperCase(), cik);
    }
  } catch (error) {
    console.error('Failed to load SEC ticker cache:', error);
    tickerCache = new Map();
  }
}

/**
 * Fetch company facts from SEC EDGAR
 */
export async function getCompanyFacts(cik: string): Promise<Record<string, any> | null> {
  try {
    const paddedCik = cik.padStart(10, '0');
    const url = `${SEC_EDGAR_BASE}/api/xbrl/companyfacts/CIK${paddedCik}.json`;

    const response = await fetch(url, { headers });
    if (!response.ok) return null;

    return response.json();
  } catch (error) {
    console.error(`Failed to fetch company facts for CIK ${cik}:`, error);
    return null;
  }
}

/**
 * Fetch recent SEC filings for a company
 */
export async function getFilings(cik: string, count: number = 40): Promise<SECFiling[]> {
  try {
    const paddedCik = cik.padStart(10, '0');
    const url = `${SEC_EDGAR_BASE}/submissions/CIK${paddedCik}.json`;

    const response = await fetch(url, { headers });
    if (!response.ok) return [];

    const data = await response.json();
    const filings = data.filings?.recent || {};

    const result: SECFiling[] = [];
    const length = Math.min(count, filings.accessionNumber?.length || 0);

    for (let i = 0; i < length; i++) {
      result.push({
        accessionNumber: filings.accessionNumber[i],
        filingDate: filings.filingDate[i],
        form: filings.form[i],
        description: filings.primaryDocument[i] || '',
        documentUrl: `https://www.sec.gov/Archives/edgar/data/${cik}/${filings.accessionNumber[i].replace(/-/g, '')}/${filings.primaryDocument[i]}`,
      });
    }

    return result;
  } catch (error) {
    console.error(`Failed to fetch filings for CIK ${cik}:`, error);
    return [];
  }
}

/**
 * Get company basic info from SEC
 */
export async function getCompanyInfo(ticker: string): Promise<SECCompanyInfo | null> {
  const cik = await getCIK(ticker);
  if (!cik) return null;

  try {
    const paddedCik = cik.padStart(10, '0');
    const url = `${SEC_EDGAR_BASE}/submissions/CIK${paddedCik}.json`;

    const response = await fetch(url, { headers });
    if (!response.ok) return null;

    const data = await response.json();
    const filings = await getFilings(cik, 10);

    return {
      cik,
      name: data.name,
      ticker: data.tickers?.[0] || ticker,
      sic: data.sic || '',
      sicDescription: data.sicDescription || '',
      filings,
    };
  } catch (error) {
    console.error(`Failed to fetch company info for ${ticker}:`, error);
    return null;
  }
}

/**
 * Parse Form 4 filings to extract insider transactions
 * Note: This is a simplified version - full parsing requires XML processing
 */
export async function getInsiderTransactions(ticker: string, days: number = 90): Promise<InsiderTransaction[]> {
  const cik = await getCIK(ticker);
  if (!cik) return [];

  try {
    const filings = await getFilings(cik, 100);
    const form4Filings = filings.filter(f => f.form === '4');

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const recentFilings = form4Filings.filter(f => new Date(f.filingDate) >= cutoffDate);

    // For a full implementation, you'd parse the XML of each Form 4
    // Here we return filing metadata - actual transaction parsing requires more work
    return recentFilings.map(filing => ({
      ticker,
      insiderName: 'See Filing',
      transactionType: 'buy' as const, // Would be parsed from XML
      shares: 0,
      price: 0,
      value: 0,
      transactionDate: new Date(filing.filingDate),
      filingDate: new Date(filing.filingDate),
      formUrl: filing.documentUrl,
    }));
  } catch (error) {
    console.error(`Failed to fetch insider transactions for ${ticker}:`, error);
    return [];
  }
}

/**
 * Extract insider ownership from proxy statements (DEF 14A)
 * This is a placeholder - real implementation requires parsing proxy PDFs
 */
export async function getInsiderOwnership(ticker: string): Promise<number | null> {
  const cik = await getCIK(ticker);
  if (!cik) return null;

  try {
    const filings = await getFilings(cik, 50);
    const proxyFilings = filings.filter(f => f.form === 'DEF 14A' || f.form === 'DEF 14C');

    if (proxyFilings.length > 0) {
      // In a real implementation, you'd:
      // 1. Fetch the proxy statement
      // 2. Parse the beneficial ownership table
      // 3. Sum insider holdings
      // For now, return null to indicate manual research needed
      return null;
    }

    return null;
  } catch (error) {
    console.error(`Failed to get insider ownership for ${ticker}:`, error);
    return null;
  }
}

/**
 * Get financial data from XBRL filings
 */
export async function getFinancials(ticker: string): Promise<Record<string, number> | null> {
  const cik = await getCIK(ticker);
  if (!cik) return null;

  try {
    const facts = await getCompanyFacts(cik);
    if (!facts) return null;

    const usGaap = facts.facts?.['us-gaap'] || {};

    // Extract latest values for key metrics
    const extractLatest = (concept: string): number | null => {
      const data = usGaap[concept]?.units?.USD || usGaap[concept]?.units?.shares;
      if (!data || data.length === 0) return null;

      // Get the most recent 10-K or 10-Q value
      const sorted = [...data]
        .filter((d: any) => d.form === '10-K' || d.form === '10-Q')
        .sort((a: any, b: any) => new Date(b.end).getTime() - new Date(a.end).getTime());

      return sorted[0]?.val || null;
    };

    return {
      revenue: extractLatest('Revenues') || extractLatest('RevenueFromContractWithCustomerExcludingAssessedTax') || 0,
      netIncome: extractLatest('NetIncomeLoss') || 0,
      totalAssets: extractLatest('Assets') || 0,
      totalLiabilities: extractLatest('Liabilities') || 0,
      stockholdersEquity: extractLatest('StockholdersEquity') || 0,
      cash: extractLatest('CashAndCashEquivalentsAtCarryingValue') || 0,
      sharesOutstanding: extractLatest('CommonStockSharesOutstanding') || 0,
    };
  } catch (error) {
    console.error(`Failed to get financials for ${ticker}:`, error);
    return null;
  }
}
