// Asymmetry Score Engine
// Calculates the 4-component score for each company

import type { Company, AsymmetryScore, FutureCategory } from '../lib/types';
import { SCORE_WEIGHTS } from '../lib/constants';

/**
 * Calculate Founder Conviction score (0-10)
 * Measures insider ownership, buying activity, and founder involvement
 */
export function scoreFounderConviction(company: Company): { score: number; rationale: string } {
  let score = 0;
  const factors: string[] = [];

  // Insider ownership (0-4 points)
  const ownership = company.insiderOwnership || 0;
  if (ownership > 30) {
    score += 4;
    factors.push(`High insider ownership (${ownership.toFixed(1)}%)`);
  } else if (ownership > 20) {
    score += 3;
    factors.push(`Strong insider ownership (${ownership.toFixed(1)}%)`);
  } else if (ownership > 10) {
    score += 2;
    factors.push(`Moderate insider ownership (${ownership.toFixed(1)}%)`);
  } else if (ownership > 5) {
    score += 1;
    factors.push(`Some insider ownership (${ownership.toFixed(1)}%)`);
  } else {
    factors.push(`Low insider ownership (${ownership.toFixed(1)}%)`);
  }

  // Recent insider buying (0-3 points)
  const buying = company.insiderBuying90d || 0;
  if (buying > 1_000_000) {
    score += 3;
    factors.push('Significant insider buying >$1M in 90d');
  } else if (buying > 100_000) {
    score += 2;
    factors.push('Notable insider buying in 90d');
  } else if (buying > 0) {
    score += 1;
    factors.push('Some insider buying in 90d');
  } else if (buying < -100_000) {
    factors.push('Warning: Insider selling detected');
  }

  // Founder still active (0-3 points)
  if (company.founderActive) {
    score += 3;
    factors.push('Founder-led company');
  }

  return {
    score: Math.min(score, 10),
    rationale: factors.length > 0 ? factors.join('. ') : 'Insufficient data',
  };
}

/**
 * Calculate AI-Accelerated Disruption score (0-10)
 * Measures how AI/tech unlocks the company's future TAM
 */
export function scoreAIDisruption(company: Company): { score: number; rationale: string } {
  let score = 0;
  const factors: string[] = [];

  // Category base scores
  const categoryScores: Record<FutureCategory, number> = {
    'intelligence-infrastructure': 3,
    'robotics-autonomous': 3,
    'synthetic-biology': 2,
    'materials-simulation': 3,
    'advanced-energy': 2,
    'national-security-space': 2,
    'other': 0,
  };

  const categoryScore = categoryScores[company.futureCategory] || 0;
  score += categoryScore;
  if (categoryScore > 0) {
    factors.push(`Core AI-adjacent sector (${company.futureCategory})`);
  }

  // TAM multiple boost (0-4 points)
  const tamMultiple = company.tamMultiple || 1;
  if (tamMultiple > 100) {
    score += 4;
    factors.push(`Extreme TAM expansion potential (${tamMultiple.toFixed(0)}x)`);
  } else if (tamMultiple > 50) {
    score += 3;
    factors.push(`Large TAM expansion potential (${tamMultiple.toFixed(0)}x)`);
  } else if (tamMultiple > 20) {
    score += 2;
    factors.push(`Strong TAM expansion potential (${tamMultiple.toFixed(0)}x)`);
  } else if (tamMultiple > 10) {
    score += 1;
    factors.push(`Moderate TAM expansion (${tamMultiple.toFixed(0)}x)`);
  }

  // Technology enablement (0-3 points based on sector alignment)
  if (['intelligence-infrastructure', 'robotics-autonomous', 'materials-simulation'].includes(company.futureCategory)) {
    score += 2;
    factors.push('Direct AI compute/automation beneficiary');
  } else if (['synthetic-biology', 'advanced-energy'].includes(company.futureCategory)) {
    score += 1;
    factors.push('AI-enabled R&D acceleration');
  }

  return {
    score: Math.min(score, 10),
    rationale: factors.length > 0 ? factors.join('. ') : 'Limited AI disruption potential',
  };
}

/**
 * Calculate Market White-Space score (0-10)
 * Measures how non-consensus/undiscovered the opportunity is
 */
export function scoreWhiteSpace(company: Company): { score: number; rationale: string } {
  let score = 0;
  const factors: string[] = [];

  // Small current TAM = higher score (0-4 points)
  const currentTAM = company.currentTAM || 0;
  if (currentTAM > 0) {
    if (currentTAM < 1_000_000_000) {
      score += 4;
      factors.push('Very small current TAM (<$1B)');
    } else if (currentTAM < 5_000_000_000) {
      score += 3;
      factors.push('Small current TAM (<$5B)');
    } else if (currentTAM < 10_000_000_000) {
      score += 2;
      factors.push('Moderate current TAM (<$10B)');
    } else {
      score += 1;
      factors.push('Established market');
    }
  } else {
    score += 3;
    factors.push('Undefined/emerging market');
  }

  // Market cap vs Future TAM (0-3 points)
  const futureTAM = company.futureTAM || 0;
  const marketCap = company.marketCap || 0;
  if (futureTAM > 0 && marketCap > 0) {
    const captureRatio = marketCap / futureTAM;
    if (captureRatio < 0.001) {
      score += 3;
      factors.push('Market cap is <0.1% of future TAM');
    } else if (captureRatio < 0.01) {
      score += 2;
      factors.push('Market cap is <1% of future TAM');
    } else if (captureRatio < 0.05) {
      score += 1;
      factors.push('Significant room for market capture');
    }
  }

  // Small cap premium (0-2 points)
  if (marketCap > 0) {
    if (marketCap < 1_000_000_000) {
      score += 2;
      factors.push('Small cap (<$1B) - less institutional attention');
    } else if (marketCap < 3_000_000_000) {
      score += 1;
      factors.push('Small-mid cap - emerging from obscurity');
    }
  }

  // No analyst coverage would add points (data not always available)

  return {
    score: Math.min(score, 10),
    rationale: factors.length > 0 ? factors.join('. ') : 'Market positioning unclear',
  };
}

/**
 * Calculate Asymmetry & Convexity score (0-10)
 * Measures the upside potential vs downside risk
 */
export function scoreAsymmetry(company: Company): { score: number; rationale: string } {
  let score = 0;
  const factors: string[] = [];

  // Potential upside multiple (0-4 points)
  const futureTAM = company.futureTAM || 0;
  const marketCap = company.marketCap || 0;

  if (futureTAM > 0 && marketCap > 0) {
    // Assume 10% market capture at maturity
    const potentialValue = futureTAM * 0.1;
    const potentialMultiple = potentialValue / marketCap;

    if (potentialMultiple > 100) {
      score += 4;
      factors.push(`100x+ potential at 10% market capture`);
    } else if (potentialMultiple > 50) {
      score += 3;
      factors.push(`50x+ potential at 10% market capture`);
    } else if (potentialMultiple > 20) {
      score += 2;
      factors.push(`20x+ potential at 10% market capture`);
    } else if (potentialMultiple > 10) {
      score += 1;
      factors.push(`10x+ potential`);
    }
  }

  // Balance sheet strength / survivability (0-3 points)
  const cashPosition = company.cashPosition || 0;
  if (marketCap > 0 && cashPosition > marketCap * 0.2) {
    score += 2;
    factors.push('Strong cash position (>20% of market cap)');
  } else if (cashPosition > marketCap * 0.1) {
    score += 1;
    factors.push('Adequate cash runway');
  }

  const debtToEquity = company.debtToEquity || 0;
  if (debtToEquity < 0.3) {
    score += 1;
    factors.push('Low debt burden');
  } else if (debtToEquity > 1.5) {
    factors.push('Warning: High debt levels');
  }

  // Business quality indicators (0-2 points)
  const grossMargin = company.grossMargin || 0;
  if (grossMargin > 60) {
    score += 1;
    factors.push(`High gross margins (${(grossMargin * 100).toFixed(0)}%)`);
  }

  const revenueGrowth = company.revenueGrowth || 0;
  if (revenueGrowth > 30) {
    score += 1;
    factors.push(`Strong revenue growth (${(revenueGrowth * 100).toFixed(0)}%)`);
  } else if (revenueGrowth > 15) {
    score += 0.5;
    factors.push('Solid revenue growth');
  }

  return {
    score: Math.min(score, 10),
    rationale: factors.length > 0 ? factors.join('. ') : 'Risk/reward profile unclear',
  };
}

/**
 * Calculate complete Asymmetry Score for a company
 */
export function calculateAsymmetryScore(company: Company): AsymmetryScore {
  const founderResult = scoreFounderConviction(company);
  const aiResult = scoreAIDisruption(company);
  const whiteSpaceResult = scoreWhiteSpace(company);
  const asymmetryResult = scoreAsymmetry(company);

  // Weighted average (currently equal weights)
  const total = (
    founderResult.score * SCORE_WEIGHTS.founderConviction +
    aiResult.score * SCORE_WEIGHTS.aiDisruption +
    whiteSpaceResult.score * SCORE_WEIGHTS.whiteSpace +
    asymmetryResult.score * SCORE_WEIGHTS.asymmetry
  ) / (
    SCORE_WEIGHTS.founderConviction +
    SCORE_WEIGHTS.aiDisruption +
    SCORE_WEIGHTS.whiteSpace +
    SCORE_WEIGHTS.asymmetry
  );

  return {
    founderConviction: founderResult.score,
    aiDisruption: aiResult.score,
    whiteSpace: whiteSpaceResult.score,
    asymmetry: asymmetryResult.score,
    total: Math.round(total * 10) / 10,
    rationale: {
      founderConviction: founderResult.rationale,
      aiDisruption: aiResult.rationale,
      whiteSpace: whiteSpaceResult.rationale,
      asymmetry: asymmetryResult.rationale,
    },
  };
}

/**
 * Rank companies by Asymmetry Score
 */
export function rankCompanies(companies: Company[]): Company[] {
  return companies
    .map(company => ({
      ...company,
      scores: calculateAsymmetryScore(company),
    }))
    .sort((a, b) => (b.scores?.total || 0) - (a.scores?.total || 0));
}

/**
 * Get scoring summary for display
 */
export function getScoringSummary(score: AsymmetryScore): string {
  const ratings = [
    { name: 'Founder Conviction', value: score.founderConviction },
    { name: 'AI Disruption', value: score.aiDisruption },
    { name: 'White Space', value: score.whiteSpace },
    { name: 'Asymmetry', value: score.asymmetry },
  ];

  return ratings
    .map(r => `${r.name}: ${r.value.toFixed(1)}/10`)
    .join(' | ') + ` | Total: ${score.total.toFixed(1)}/10`;
}
