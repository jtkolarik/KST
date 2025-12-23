// Yahoo Finance Data Service
// Uses public endpoints - no API key required

import type { YahooQuote } from '../lib/types';

const BASE_URL = 'https://query1.finance.yahoo.com';

/**
 * Fetch quote data for a single ticker
 */
export async function getQuote(ticker: string): Promise<YahooQuote | null> {
  try {
    const url = `${BASE_URL}/v8/finance/chart/${ticker}?interval=1d&range=1mo`;

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) return null;

    const data = await response.json();
    const result = data.chart?.result?.[0];

    if (!result) return null;

    const meta = result.meta;
    const quotes = result.indicators?.quote?.[0] || {};
    const closes = quotes.close || [];

    // Calculate 30-day change
    const currentPrice = meta.regularMarketPrice || closes[closes.length - 1];
    const priceAgo = closes[0];
    const change30d = priceAgo ? ((currentPrice - priceAgo) / priceAgo) * 100 : 0;

    return {
      symbol: meta.symbol,
      regularMarketPrice: currentPrice,
      regularMarketChange: meta.regularMarketPrice - meta.previousClose,
      regularMarketChangePercent: ((meta.regularMarketPrice - meta.previousClose) / meta.previousClose) * 100,
      marketCap: meta.marketCap || 0,
      fiftyTwoWeekHigh: meta.fiftyTwoWeekHigh || 0,
      fiftyTwoWeekLow: meta.fiftyTwoWeekLow || 0,
      averageVolume: meta.averageVolume || 0,
    };
  } catch (error) {
    console.error(`Failed to fetch quote for ${ticker}:`, error);
    return null;
  }
}

/**
 * Fetch quotes for multiple tickers
 */
export async function getQuotes(tickers: string[]): Promise<Map<string, YahooQuote>> {
  const results = new Map<string, YahooQuote>();

  // Fetch in parallel with small batches to avoid rate limiting
  const batchSize = 5;
  for (let i = 0; i < tickers.length; i += batchSize) {
    const batch = tickers.slice(i, i + batchSize);
    const promises = batch.map(ticker => getQuote(ticker));
    const batchResults = await Promise.all(promises);

    batch.forEach((ticker, idx) => {
      const quote = batchResults[idx];
      if (quote) {
        results.set(ticker, quote);
      }
    });

    // Small delay between batches
    if (i + batchSize < tickers.length) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }

  return results;
}

/**
 * Fetch historical prices for charting
 */
export async function getHistoricalPrices(
  ticker: string,
  range: '1mo' | '3mo' | '6mo' | '1y' | '2y' | '5y' = '1y',
  interval: '1d' | '1wk' | '1mo' = '1d'
): Promise<{ date: Date; open: number; high: number; low: number; close: number; volume: number }[]> {
  try {
    const url = `${BASE_URL}/v8/finance/chart/${ticker}?interval=${interval}&range=${range}`;

    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) return [];

    const data = await response.json();
    const result = data.chart?.result?.[0];

    if (!result) return [];

    const timestamps = result.timestamp || [];
    const quotes = result.indicators?.quote?.[0] || {};

    return timestamps.map((ts: number, i: number) => ({
      date: new Date(ts * 1000),
      open: quotes.open?.[i] || 0,
      high: quotes.high?.[i] || 0,
      low: quotes.low?.[i] || 0,
      close: quotes.close?.[i] || 0,
      volume: quotes.volume?.[i] || 0,
    }));
  } catch (error) {
    console.error(`Failed to fetch historical prices for ${ticker}:`, error);
    return [];
  }
}

/**
 * Get key statistics (when available)
 */
export async function getKeyStats(ticker: string): Promise<Record<string, any> | null> {
  try {
    // This endpoint may have limitations
    const url = `${BASE_URL}/v10/finance/quoteSummary/${ticker}?modules=defaultKeyStatistics,financialData`;

    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) return null;

    const data = await response.json();
    const result = data.quoteSummary?.result?.[0];

    if (!result) return null;

    const keyStats = result.defaultKeyStatistics || {};
    const financialData = result.financialData || {};

    return {
      // Key Statistics
      beta: keyStats.beta?.raw,
      bookValue: keyStats.bookValue?.raw,
      priceToBook: keyStats.priceToBook?.raw,
      sharesOutstanding: keyStats.sharesOutstanding?.raw,
      sharesShort: keyStats.sharesShort?.raw,
      shortRatio: keyStats.shortRatio?.raw,
      heldPercentInsiders: keyStats.heldPercentInsiders?.raw,
      heldPercentInstitutions: keyStats.heldPercentInstitutions?.raw,

      // Financial Data
      totalRevenue: financialData.totalRevenue?.raw,
      revenueGrowth: financialData.revenueGrowth?.raw,
      grossMargins: financialData.grossMargins?.raw,
      operatingMargins: financialData.operatingMargins?.raw,
      profitMargins: financialData.profitMargins?.raw,
      totalCash: financialData.totalCash?.raw,
      totalDebt: financialData.totalDebt?.raw,
      debtToEquity: financialData.debtToEquity?.raw,
      currentRatio: financialData.currentRatio?.raw,
      returnOnEquity: financialData.returnOnEquity?.raw,
    };
  } catch (error) {
    console.error(`Failed to fetch key stats for ${ticker}:`, error);
    return null;
  }
}

/**
 * Search for tickers by company name
 */
export async function searchTickers(query: string): Promise<{ symbol: string; name: string; type: string }[]> {
  try {
    const url = `${BASE_URL}/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=10&newsCount=0`;

    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) return [];

    const data = await response.json();

    return (data.quotes || []).map((q: any) => ({
      symbol: q.symbol,
      name: q.shortname || q.longname || q.symbol,
      type: q.quoteType,
    }));
  } catch (error) {
    console.error(`Failed to search for "${query}":`, error);
    return [];
  }
}
