import { Business, Financials } from './businessService';

/**
 * Credit Scoring Service
 * Calculates a standardized credit score (0-1000) based on financial metrics
 */

interface CreditScoreResult {
  score: number; // 0-1000
  breakdown: {
    debtScore: number;
    liquidityScore: number;
    profitabilityScore: number;
    cashFlowScore: number;
    growthScore: number;
  };
  metrics: {
    debtToEquity: number;
    currentRatio: number;
    debtServiceCoverageRatio: number;
    netProfitMargin: number;
    returnOnAssets: number;
    revenueGrowth: number;
    operatingCashFlow: number;
  };
}

export class CreditScoringService {
  /**
   * Calculate credit score from 0-1000 based on financial data
   */
  static calculateCreditScore(business: Business, financials: Financials): CreditScoreResult {
    // Validate data
    if (!financials || !financials.monthly_data || financials.monthly_data.length === 0) {
      throw new Error('Invalid or missing financial data');
    }
    
    // Calculate financial metrics
    const metrics = this.calculateMetrics(business, financials);
    
    // Score each category (0-200 points each, total 1000)
    const debtScore = this.scoreDebtMetrics(metrics);
    const liquidityScore = this.scoreLiquidityMetrics(metrics);
    const profitabilityScore = this.scoreProfitabilityMetrics(metrics);
    const cashFlowScore = this.scoreCashFlowMetrics(metrics);
    const growthScore = this.scoreGrowthMetrics(metrics);
    
    // Total score (max 1000)
    const totalScore = Math.round(
      debtScore + liquidityScore + profitabilityScore + cashFlowScore + growthScore
    );
    
    return {
      score: Math.max(0, Math.min(1000, totalScore)),
      breakdown: {
        debtScore: Math.round(debtScore),
        liquidityScore: Math.round(liquidityScore),
        profitabilityScore: Math.round(profitabilityScore),
        cashFlowScore: Math.round(cashFlowScore),
        growthScore: Math.round(growthScore),
      },
      metrics,
    };
  }

  /**
   * Calculate all financial metrics
   */
  private static calculateMetrics(business: Business, financials: Financials) {
    const monthlyData = financials.monthly_data || [];
    
    if (monthlyData.length === 0) {
      throw new Error('No monthly data available');
    }
    
    const latestMonth = monthlyData[monthlyData.length - 1];
    const firstMonth = monthlyData[0];
    
    // Calculate totals across all months
    // Revenue = earnings - losses (as per business requirement)
    const totalEarnings = monthlyData.reduce((sum, m) => sum + (m.earnings || 0), 0);
    const totalLosses = monthlyData.reduce((sum, m) => sum + (m.losses || 0), 0);
    const totalRevenue = totalEarnings - totalLosses;
    const totalNetIncome = totalRevenue; // Simplified for credit scoring
    
    // Use financials data for current balance sheet items
    const currentAssets = financials.current_assets || financials.assets || 0;
    const currentLiabilities = financials.current_liabilities || financials.liabilities || 0;
    const totalEquity = financials.equity || (currentAssets - currentLiabilities);
    
    // Debt-to-Equity Ratio (lower is better)
    // Use the pre-calculated ratio if available, otherwise calculate
    const debtToEquity = financials.debt_to_equity || 
      (totalEquity > 0 ? currentLiabilities / totalEquity : 999);
    
    // Current Ratio (liquidity - higher is better, ideal ~2.0)
    // Use pre-calculated ratio if available
    const currentRatio = financials.current_ratio || 
      (currentLiabilities > 0 ? currentAssets / currentLiabilities : 10);
    
    // Debt Service Coverage Ratio (DSCR)
    // Use pre-calculated if available
    const debtServiceCoverageRatio = financials.debt_service_coverage ||
      (financials.total_debt > 0 && financials.ebitda > 0
        ? financials.ebitda / (financials.total_debt * 0.1) // Assume 10% debt service
        : 10);
    
    // Net Profit Margin
    // Use pre-calculated if available
    const netProfitMargin = financials.net_profit_margin || 
      (totalRevenue > 0 ? (totalNetIncome / totalRevenue) * 100 : 0);
    
    // Return on Assets (ROA)
    // Use pre-calculated if available
    const returnOnAssets = financials.return_on_assets || 
      (currentAssets > 0 ? (totalNetIncome / currentAssets) * 100 : 0);
    
    // Revenue Growth (comparing last 3 months to first 3 months)
    // Use pre-calculated if available
    let revenueGrowth = financials.sales_growth || 0;
    
    if (revenueGrowth === 0 && monthlyData.length >= 6) {
      const firstQuarterEarnings = monthlyData.slice(0, 3).reduce((sum, m) => sum + (m.earnings || 0), 0);
      const firstQuarterLosses = monthlyData.slice(0, 3).reduce((sum, m) => sum + (m.losses || 0), 0);
      const firstQuarterRevenue = firstQuarterEarnings - firstQuarterLosses;
      
      const lastQuarterEarnings = monthlyData.slice(-3).reduce((sum, m) => sum + (m.earnings || 0), 0);
      const lastQuarterLosses = monthlyData.slice(-3).reduce((sum, m) => sum + (m.losses || 0), 0);
      const lastQuarterRevenue = lastQuarterEarnings - lastQuarterLosses;
      
      revenueGrowth = firstQuarterRevenue > 0 
        ? ((lastQuarterRevenue - firstQuarterRevenue) / firstQuarterRevenue) * 100 
        : 0;
    }
    
    // Operating Cash Flow
    const operatingCashFlow = financials.operating_cash_flow || totalNetIncome;
    
    return {
      debtToEquity,
      currentRatio,
      debtServiceCoverageRatio,
      netProfitMargin,
      returnOnAssets,
      revenueGrowth,
      operatingCashFlow,
    };
  }

  /**
   * Score debt metrics (0-200 points)
   * Lower debt is better
   */
  private static scoreDebtMetrics(metrics: ReturnType<typeof this.calculateMetrics>): number {
    let score = 0;
    
    // Debt-to-Equity Ratio (0-100 points)
    // Excellent: < 0.5 (100 pts), Good: 0.5-1.0 (75 pts), Fair: 1.0-2.0 (50 pts), Poor: > 2.0 (0-25 pts)
    if (metrics.debtToEquity < 0.5) {
      score += 100;
    } else if (metrics.debtToEquity < 1.0) {
      score += 75 + ((1.0 - metrics.debtToEquity) / 0.5) * 25;
    } else if (metrics.debtToEquity < 2.0) {
      score += 50 + ((2.0 - metrics.debtToEquity) / 1.0) * 25;
    } else if (metrics.debtToEquity < 5.0) {
      score += 25 * (1 - ((metrics.debtToEquity - 2.0) / 3.0));
    } else {
      score += 0;
    }
    
    // Debt Service Coverage Ratio (0-100 points)
    // Excellent: > 2.0 (100 pts), Good: 1.5-2.0 (75 pts), Fair: 1.25-1.5 (50 pts), Poor: < 1.25
    if (metrics.debtServiceCoverageRatio >= 2.0) {
      score += 100;
    } else if (metrics.debtServiceCoverageRatio >= 1.5) {
      score += 75 + ((metrics.debtServiceCoverageRatio - 1.5) / 0.5) * 25;
    } else if (metrics.debtServiceCoverageRatio >= 1.25) {
      score += 50 + ((metrics.debtServiceCoverageRatio - 1.25) / 0.25) * 25;
    } else if (metrics.debtServiceCoverageRatio >= 1.0) {
      score += 25 + ((metrics.debtServiceCoverageRatio - 1.0) / 0.25) * 25;
    } else {
      score += Math.max(0, metrics.debtServiceCoverageRatio * 25);
    }
    
    return score;
  }

  /**
   * Score liquidity metrics (0-200 points)
   * Higher liquidity is better
   */
  private static scoreLiquidityMetrics(metrics: ReturnType<typeof this.calculateMetrics>): number {
    let score = 0;
    
    // Current Ratio (0-200 points)
    // Excellent: 2.0-3.0 (200 pts), Good: 1.5-2.0 or 3.0-4.0 (150 pts), Fair: 1.0-1.5 (100 pts), Poor: < 1.0
    if (metrics.currentRatio >= 2.0 && metrics.currentRatio <= 3.0) {
      score += 200;
    } else if (metrics.currentRatio >= 1.5 && metrics.currentRatio < 2.0) {
      score += 150 + ((metrics.currentRatio - 1.5) / 0.5) * 50;
    } else if (metrics.currentRatio > 3.0 && metrics.currentRatio <= 4.0) {
      score += 150 + ((4.0 - metrics.currentRatio) / 1.0) * 50;
    } else if (metrics.currentRatio >= 1.0 && metrics.currentRatio < 1.5) {
      score += 100 + ((metrics.currentRatio - 1.0) / 0.5) * 50;
    } else if (metrics.currentRatio < 1.0) {
      score += metrics.currentRatio * 100;
    } else {
      // Very high ratio (> 4.0) - may indicate inefficient use of assets
      score += Math.max(100, 150 - ((metrics.currentRatio - 4.0) * 10));
    }
    
    return score;
  }

  /**
   * Score profitability metrics (0-200 points)
   * Higher profitability is better
   */
  private static scoreProfitabilityMetrics(metrics: ReturnType<typeof this.calculateMetrics>): number {
    let score = 0;
    
    // Net Profit Margin (0-100 points)
    // Excellent: > 20% (100 pts), Good: 10-20% (75 pts), Fair: 5-10% (50 pts), Poor: < 5%
    if (metrics.netProfitMargin >= 20) {
      score += 100;
    } else if (metrics.netProfitMargin >= 10) {
      score += 75 + ((metrics.netProfitMargin - 10) / 10) * 25;
    } else if (metrics.netProfitMargin >= 5) {
      score += 50 + ((metrics.netProfitMargin - 5) / 5) * 25;
    } else if (metrics.netProfitMargin >= 0) {
      score += (metrics.netProfitMargin / 5) * 50;
    } else {
      // Negative margin
      score += Math.max(0, 25 + metrics.netProfitMargin); // Penalize losses
    }
    
    // Return on Assets (0-100 points)
    // Excellent: > 15% (100 pts), Good: 8-15% (75 pts), Fair: 3-8% (50 pts), Poor: < 3%
    if (metrics.returnOnAssets >= 15) {
      score += 100;
    } else if (metrics.returnOnAssets >= 8) {
      score += 75 + ((metrics.returnOnAssets - 8) / 7) * 25;
    } else if (metrics.returnOnAssets >= 3) {
      score += 50 + ((metrics.returnOnAssets - 3) / 5) * 25;
    } else if (metrics.returnOnAssets >= 0) {
      score += (metrics.returnOnAssets / 3) * 50;
    } else {
      // Negative ROA
      score += Math.max(0, 25 + metrics.returnOnAssets);
    }
    
    return score;
  }

  /**
   * Score cash flow metrics (0-200 points)
   * Positive cash flow is critical
   */
  private static scoreCashFlowMetrics(metrics: ReturnType<typeof this.calculateMetrics>): number {
    let score = 0;
    
    // Operating Cash Flow (0-200 points)
    // Heavily weighted as cash flow is critical for creditworthiness
    if (metrics.operatingCashFlow > 100000) {
      score += 200;
    } else if (metrics.operatingCashFlow > 50000) {
      score += 175 + ((metrics.operatingCashFlow - 50000) / 50000) * 25;
    } else if (metrics.operatingCashFlow > 25000) {
      score += 150 + ((metrics.operatingCashFlow - 25000) / 25000) * 25;
    } else if (metrics.operatingCashFlow > 10000) {
      score += 125 + ((metrics.operatingCashFlow - 10000) / 15000) * 25;
    } else if (metrics.operatingCashFlow > 0) {
      score += 75 + (metrics.operatingCashFlow / 10000) * 50;
    } else {
      // Negative cash flow - significant penalty
      score += Math.max(0, 50 + (metrics.operatingCashFlow / 10000) * 50);
    }
    
    return score;
  }

  /**
   * Score growth metrics (0-200 points)
   * Positive growth indicates business momentum
   */
  private static scoreGrowthMetrics(metrics: ReturnType<typeof this.calculateMetrics>): number {
    let score = 0;
    
    // Revenue Growth (0-200 points)
    // Excellent: > 30% (200 pts), Good: 15-30% (150 pts), Fair: 5-15% (100 pts), Stable: 0-5% (75 pts)
    if (metrics.revenueGrowth >= 30) {
      score += 200;
    } else if (metrics.revenueGrowth >= 15) {
      score += 150 + ((metrics.revenueGrowth - 15) / 15) * 50;
    } else if (metrics.revenueGrowth >= 5) {
      score += 100 + ((metrics.revenueGrowth - 5) / 10) * 50;
    } else if (metrics.revenueGrowth >= 0) {
      score += 75 + (metrics.revenueGrowth / 5) * 25;
    } else if (metrics.revenueGrowth >= -10) {
      // Slight decline
      score += 50 + ((metrics.revenueGrowth + 10) / 10) * 25;
    } else {
      // Significant decline
      score += Math.max(0, 25 + ((metrics.revenueGrowth + 20) / 10) * 25);
    }
    
    return score;
  }

  /**
   * Get rating label based on score
   */
  static getRating(score: number): string {
    if (score >= 850) return 'Excellent';
    if (score >= 700) return 'Very Good';
    if (score >= 550) return 'Good';
    if (score >= 400) return 'Fair';
    if (score >= 250) return 'Poor';
    return 'Very Poor';
  }

  /**
   * Get rating color based on score
   */
  static getRatingColor(score: number): string {
    if (score >= 700) return 'text-green-600';
    if (score >= 550) return 'text-yellow-600';
    return 'text-red-600';
  }
}

export const creditScoringService = CreditScoringService;
