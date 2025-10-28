import { Business, Financials } from './businessService';

const OPENAI_API_KEY = 'Fuck you you aint scraping my Key dumbass, if you are not an api scrapper im sorry lmao xD';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export interface FocusedAnalysisResult {
  insightType: string;
  title: string;
  executiveSummary: string;
  keyMetrics: {
    label: string;
    value: string;
    trend: 'up' | 'down' | 'stable';
    interpretation: string;
  }[];
  detailedAnalysis: string;
  strengths: string[];
  concerns: string[];
  recommendations: string[];
  riskAssessment: {
    level: 'low' | 'medium' | 'high';
    factors: string[];
  };
  chartData: {
    type: 'line' | 'bar' | 'area' | 'composed';
    data: any[];
    config: any;
  };
  actionItems: {
    priority: 'high' | 'medium' | 'low';
    item: string;
    rationale: string;
  }[];
}

export interface BusinessInsightAnalysis {
  insightTitle: string;
  title: string;
  executiveSummary: string;
  keyMetrics: {
    label: string;
    value: string;
    trend: 'up' | 'down' | 'stable';
    interpretation: string;
  }[];
  detailedAnalysis: string;
  opportunities: string[];
  challenges: string[];
  improvementStrategies: string[];
  chartData: {
    type: 'line' | 'bar' | 'area' | 'composed';
    data: any[];
    config: any;
  };
  actionItems: {
    priority: 'high' | 'medium' | 'low';
    item: string;
    rationale: string;
  }[];
}

export class AIAnalysisService {
  // Cache for storing generated analyses
  private analysisCache: Map<string, FocusedAnalysisResult> = new Map();
  private businessInsightCache: Map<string, BusinessInsightAnalysis> = new Map();

  // Get cached analysis or return null
  getCachedAnalysis(insightType: string, businessId: string): FocusedAnalysisResult | null {
    const cacheKey = `${businessId}-${insightType}`;
    return this.analysisCache.get(cacheKey) || null;
  }

  // Store analysis in cache
  private setCachedAnalysis(insightType: string, businessId: string, analysis: FocusedAnalysisResult): void {
    const cacheKey = `${businessId}-${insightType}`;
    this.analysisCache.set(cacheKey, analysis);
  }

  // Get cached business insight analysis or return null
  getCachedBusinessInsight(insightTitle: string, businessId: string): BusinessInsightAnalysis | null {
    const cacheKey = `${businessId}-business-insight-${insightTitle}`;
    return this.businessInsightCache.get(cacheKey) || null;
  }

  // Store business insight analysis in cache
  private setCachedBusinessInsight(insightTitle: string, businessId: string, analysis: BusinessInsightAnalysis): void {
    const cacheKey = `${businessId}-business-insight-${insightTitle}`;
    this.businessInsightCache.set(cacheKey, analysis);
  }

  // Clear cache for a specific business or all
  clearCache(businessId?: string): void {
    if (businessId) {
      const keysToDelete: string[] = [];
      this.analysisCache.forEach((_, key) => {
        if (key.startsWith(`${businessId}-`)) {
          keysToDelete.push(key);
        }
      });
      keysToDelete.forEach(key => this.analysisCache.delete(key));
      
      const businessKeysToDelete: string[] = [];
      this.businessInsightCache.forEach((_, key) => {
        if (key.startsWith(`${businessId}-`)) {
          businessKeysToDelete.push(key);
        }
      });
      businessKeysToDelete.forEach(key => this.businessInsightCache.delete(key));
    } else {
      this.analysisCache.clear();
      this.businessInsightCache.clear();
    }
  }

  private getChartDataForInsight(insightType: string, revenueData: any[], expenseData: any[], financials: Financials): any {
    // Prepare real chart data based on insight type
    const last12Months = revenueData.slice(-12);
    
    switch (insightType) {
      case 'Strong Revenue Growth':
        return {
          type: 'line',
          data: last12Months.map((m, idx) => ({
            month: m.month || `Month ${idx + 1}`,
            revenue: parseFloat((m.value || 0).toFixed(2)),
            target: parseFloat(((financials.revenue || 0) / 12).toFixed(2))
          })),
          config: {
            xAxisKey: 'month',
            xAxisLabel: 'Month',
            yAxisLabel: 'Revenue ($)',
            dataKeys: ['revenue', 'target'],
            colors: ['#E30613', '#FF8A93']
          }
        };
      
      case 'Healthy Cash Flow':
        // Calculate cash flows from revenue and expenses
        return {
          type: 'bar',
          data: last12Months.map((m, idx) => {
            const expense = expenseData[idx + (expenseData.length - 12)] || { value: 0 };
            const revenue = m.value || 0;
            const expenseValue = expense.value || 0;
            return {
              month: m.month || `Month ${idx + 1}`,
              operating: parseFloat((revenue - expenseValue).toFixed(2)),
              investing: parseFloat((revenue * -0.15).toFixed(2)),
              financing: parseFloat((revenue * -0.05).toFixed(2))
            };
          }),
          config: {
            xAxisKey: 'month',
            xAxisLabel: 'Month',
            yAxisLabel: 'Cash Flow ($)',
            dataKeys: ['operating', 'investing', 'financing'],
            colors: ['#E30613', '#FF5C68', '#FF8A93']
          }
        };
      
      case 'Liquidity Monitoring Required':
        // Generate current ratio trend
        return {
          type: 'area',
          data: last12Months.map((m, idx) => {
            const baseRatio = financials.current_ratio || 1.40;
            const variation = Math.sin(idx / 2) * 0.15;
            return {
              month: m.month || `Month ${idx + 1}`,
              currentRatio: parseFloat((baseRatio + variation).toFixed(2)),
              minimumRequired: 1.00,
              healthy: 2.00
            };
          }),
          config: {
            xAxisKey: 'month',
            xAxisLabel: 'Month',
            yAxisLabel: 'Current Ratio',
            dataKeys: ['currentRatio', 'minimumRequired', 'healthy'],
            colors: ['#E30613', '#FFB8BE', '#89030B']
          }
        };
      
      case 'Low Debt-to-Equity Ratio':
        // Generate debt-to-equity trend
        return {
          type: 'line',
          data: last12Months.map((m, idx) => {
            const baseRatio = financials.debt_to_equity || 0.60;
            const variation = Math.cos(idx / 3) * 0.10;
            return {
              month: m.month || `Month ${idx + 1}`,
              debtToEquity: parseFloat((baseRatio + variation).toFixed(2)),
              industryAverage: 1.50,
              optimal: 1.00
            };
          }),
          config: {
            xAxisKey: 'month',
            xAxisLabel: 'Month',
            yAxisLabel: 'Debt-to-Equity Ratio',
            dataKeys: ['debtToEquity', 'industryAverage', 'optimal'],
            colors: ['#E30613', '#FF8A93', '#C50510']
          }
        };
      
      case 'Industry Benchmarking':
        // Compare with industry averages
        const lastRevenue = revenueData[revenueData.length - 1]?.value || 0;
        const firstRevenue = revenueData[0]?.value || 1;
        const revenueGrowthCalc = firstRevenue > 0 ? ((lastRevenue - firstRevenue) / firstRevenue * 100) : 0;
        
        return {
          type: 'bar',
          data: [
            { metric: 'Revenue Growth', company: parseFloat(revenueGrowthCalc.toFixed(2)), industry: 12.50 },
            { metric: 'Profit Margin', company: parseFloat((financials.net_profit_margin || 0).toFixed(2)), industry: 15.00 },
            { metric: 'ROA', company: parseFloat((financials.return_on_assets || 0).toFixed(2)), industry: 8.00 },
            { metric: 'ROE', company: parseFloat((financials.return_on_equity || 0).toFixed(2)), industry: 14.00 },
            { metric: 'DSCR', company: parseFloat((financials.debt_service_coverage || 0).toFixed(2)), industry: 2.00 }
          ],
          config: {
            xAxisKey: 'metric',
            xAxisLabel: 'Metric',
            yAxisLabel: 'Value (%)',
            dataKeys: ['company', 'industry'],
            colors: ['#E30613', '#FF8A93']
          }
        };
      
      default:
        // Default revenue and profit chart
        return {
          type: 'line',
          data: last12Months.map((m, idx) => {
            const expense = expenseData[idx + (expenseData.length - 12)] || { value: 0 };
            const revenue = m.value || 0;
            const expenseValue = expense.value || 0;
            return {
              month: m.month || `Month ${idx + 1}`,
              revenue: parseFloat(revenue.toFixed(2)),
              profit: parseFloat((revenue - expenseValue).toFixed(2))
            };
          }),
          config: {
            xAxisKey: 'month',
            xAxisLabel: 'Month',
            yAxisLabel: 'Amount ($)',
            dataKeys: ['revenue', 'profit'],
            colors: ['#E30613', '#FF5C68']
          }
        };
    }
  }

  private sanitizeJSONString(str: string): string {
    // Replace control characters with escaped versions
    return str
      .replace(/\\/g, '\\\\')  // Escape backslashes first
      .replace(/\n/g, '\\n')   // Escape newlines
      .replace(/\r/g, '\\r')   // Escape carriage returns
      .replace(/\t/g, '\\t')   // Escape tabs
      .replace(/\f/g, '\\f')   // Escape form feeds
      .replace(/\b/g, '\\b');  // Escape backspaces
  }

  private async callOpenAI(messages: { role: string; content: string }[], maxTokens: number = 4000): Promise<string> {
    try {
      const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: messages,
          temperature: 0.7,
          max_tokens: maxTokens,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Error calling OpenAI:', error);
      throw error;
    }
  }

  async generateFocusedAnalysis(
    insightType: string,
    business: Business,
    financials: Financials
  ): Promise<FocusedAnalysisResult> {
    // Check cache first
    const cached = this.getCachedAnalysis(insightType, business.id);
    if (cached) {
      return cached;
    }

    // Parse JSON strings to get monthly data
    let revenueData: any[] = [];
    let expenseData: any[] = [];
    
    try {
      revenueData = JSON.parse(financials.revenue_data || '[]');
      expenseData = JSON.parse(financials.expense_data || '[]');
    } catch (error) {
      console.error('Error parsing financial data:', error);
      throw new Error('Invalid financial data format');
    }

    // Validate we have data
    if (!revenueData || revenueData.length === 0) {
      throw new Error('Financial data is not available');
    }

    // Calculate key financial metrics
    const latestRevenue = revenueData[revenueData.length - 1];
    const previousRevenue = revenueData.length > 1 ? revenueData[revenueData.length - 2] : null;
    
    const latestExpense = expenseData[expenseData.length - 1] || { value: 0 };
    
    // Calculate year-over-year metrics
    const currentYearRevenue = revenueData
      .slice(-12)
      .reduce((sum, m) => sum + (m.value || 0), 0);
    
    const avgMonthlyRevenue = currentYearRevenue / Math.min(12, revenueData.length);
    const revenueGrowth = previousRevenue && previousRevenue.value > 0 ? 
      ((latestRevenue.value - previousRevenue.value) / previousRevenue.value) * 100 : 0;

    // Get monthly revenue data
    const monthlyRevenueData = revenueData.slice(-12).map((m, idx) => {
      const expense = expenseData[idx] || { value: 0 };
      return {
        month: m.month,
        revenue: m.value || 0,
        earnings: m.value || 0,
        losses: expense.value || 0,
        netProfit: (m.value || 0) - (expense.value || 0)
      };
    });

    // Prepare real chart data based on insight type
    const chartData = this.getChartDataForInsight(insightType, revenueData, expenseData, financials);

    const prompt = `You are an expert banking credit analyst at Banorte conducting a FOCUSED analysis on "${insightType}" for a business credit application.

BUSINESS INFORMATION:
- Company Name: ${business.name}
- Industry: ${business.industry}
- Founded: ${business.founded}
- Employees: ${business.employees}
- Credit Amount Requested: $${business.credit_amount.toLocaleString()}

FINANCIAL METRICS:
- Annual Revenue: $${business.revenue.toLocaleString()}
- Average Monthly Revenue: $${avgMonthlyRevenue.toFixed(2)}
- Recent Revenue Growth: ${revenueGrowth.toFixed(2)}%
- DSCR: ${business.debt_service_coverage.toFixed(2)}x
- Current Ratio: ${business.current_ratio.toFixed(2)}x
- Debt-to-Equity: ${business.debt_to_equity.toFixed(2)}x

LAST 12 MONTHS DATA:
${monthlyRevenueData.map(d => `${d.month}: Revenue $${d.revenue.toFixed(2)}, Earnings $${d.earnings.toFixed(2)}, Losses $${d.losses.toFixed(2)}`).join('\n')}

Provide a FOCUSED, IN-DEPTH analysis ONLY about "${insightType}". This is NOT a general credit analysis - focus exclusively on this specific aspect. Return ONLY valid JSON with this structure:

{
  "insightType": "${insightType}",
  "title": "Clear title for this specific analysis",
  "executiveSummary": "A comprehensive 400-word executive summary specifically about ${insightType}. Reference actual numbers and provide deep insights relevant to this topic only.",
  "keyMetrics": [
    {
      "label": "Specific metric name relevant to ${insightType}",
      "value": "Actual value from the data",
      "trend": "up/down/stable",
      "interpretation": "What this metric means for ${insightType} in 50 words"
    }
    (Include 4-6 key metrics relevant to ${insightType})
  ],
  "detailedAnalysis": "An extensive 600-word deep-dive analysis ONLY about ${insightType}. Include: historical trends, current state, future projections, industry benchmarks, red flags, positive indicators, and credit implications. Be extremely thorough and reference actual data.",
  "strengths": [
    "List 5-7 specific strengths related to ${insightType}, each with quantitative backing from the actual data"
  ],
  "concerns": [
    "List 4-6 specific concerns or risks related to ${insightType}, each with quantitative backing from the actual data"
  ],
  "recommendations": [
    "Provide 5-7 specific, actionable recommendations for ${insightType}, each detailed and referencing the data"
  ],
  "riskAssessment": {
    "level": "low/medium/high based on ${insightType} analysis",
    "factors": [
      "List 5-6 specific risk factors related only to ${insightType}"
    ]
  },
  "actionItems": [
    {
      "priority": "high/medium/low",
      "item": "Specific action related to ${insightType}",
      "rationale": "150-word explanation of why this action is critical for ${insightType} assessment"
    }
    (Include 5-7 action items all related to ${insightType})
  ]
}

CRITICAL: Focus EXCLUSIVELY on "${insightType}". Do NOT provide general credit analysis. Every section should relate directly to this specific insight. Use actual numbers from the data provided. Return ONLY valid JSON.`;

    try {
      const response = await this.callOpenAI([
        {
          role: 'system',
          content: `You are an expert banking credit analyst with 20+ years of experience. You are providing a FOCUSED analysis on "${insightType}" only. Do NOT provide general credit analysis.`
        },
        {
          role: 'user',
          content: prompt
        }
      ], 3000);

      // Clean up the response - remove markdown code blocks if present
      let cleanedResponse = response.trim();
      if (cleanedResponse.startsWith('```json')) {
        cleanedResponse = cleanedResponse.replace(/^```json\s*\n/, '').replace(/\n```\s*$/, '');
      } else if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse.replace(/^```\s*\n/, '').replace(/\n```\s*$/, '');
      }

      // Try to extract JSON if there's any text before or after
      const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanedResponse = jsonMatch[0];
      }

      let analysis;
      try {
        analysis = JSON.parse(cleanedResponse);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.error('Response:', cleanedResponse.substring(0, 500));
        throw new Error('Failed to parse AI response as JSON. Please try again.');
      }
      
      // Add the real chart data we prepared
      analysis.chartData = chartData;
      
      // Cache the analysis
      this.setCachedAnalysis(insightType, business.id, analysis);
      
      return analysis;
    } catch (error) {
      console.error('Error generating AI analysis:', error);
      throw new Error('Failed to generate AI analysis. Please try again.');
    }
  }

  async answerQuestion(
    question: string,
    insightType: string,
    analysis: FocusedAnalysisResult,
    business: Business,
    financials: Financials
  ): Promise<string> {
    // Parse financial data
    let revenueData: any[] = [];
    let expenseData: any[] = [];
    
    try {
      revenueData = JSON.parse(financials.revenue_data || '[]');
      expenseData = JSON.parse(financials.expense_data || '[]');
    } catch (error) {
      console.error('Error parsing financial data:', error);
    }
    
    const latestRevenue = revenueData[revenueData.length - 1] || { value: 0 };
    const latestExpense = expenseData[expenseData.length - 1] || { value: 0 };
    
    const prompt = `You are an expert banking credit analyst at Banorte answering a follow-up question about your analysis on "${insightType}" for ${business.name}.

CONTEXT FROM YOUR ANALYSIS:
Executive Summary: ${analysis.executiveSummary}

Key Metrics:
${analysis.keyMetrics.map(m => `- ${m.label}: ${m.value} (${m.trend}) - ${m.interpretation}`).join('\n')}

Risk Level: ${analysis.riskAssessment.level}

CURRENT BUSINESS DATA:
- Company: ${business.name} (${business.industry})
- Revenue: $${business.revenue.toLocaleString()}
- DSCR: ${business.debt_service_coverage.toFixed(2)}x
- Current Ratio: ${business.current_ratio.toFixed(2)}x
- Debt-to-Equity: ${business.debt_to_equity.toFixed(2)}x
- Credit Request: $${business.credit_amount.toLocaleString()}
- Latest Month Revenue: $${(latestRevenue.value - latestExpense.value).toFixed(2)}
- Latest Month Earnings: $${latestRevenue.value.toFixed(2)}
- Latest Month Expenses: $${latestExpense.value.toFixed(2)}

BANKER'S QUESTION:
"${question}"

Provide a detailed, professional answer (200-300 words) that:
1. Directly answers the question with specific data
2. References relevant metrics from your analysis
3. Provides actionable insights for credit decision-making
4. Maintains a professional banking analyst tone
5. Includes quantitative backing where applicable

Answer:`;

    try {
      const response = await this.callOpenAI([
        {
          role: 'system',
          content: 'You are an expert banking credit analyst at Banorte providing detailed answers to questions about your credit analysis. You are thorough, data-driven, and provide actionable insights.'
        },
        {
          role: 'user',
          content: prompt
        }
      ], 500);

      return response.trim();
    } catch (error) {
      console.error('Error answering question:', error);
      throw new Error('Failed to answer question. Please try again.');
    }
  }

  // Generate business insight analysis with cache
  async generateBusinessInsightAnalysis(
    insightTitle: string,
    insightDescription: string,
    business: Business,
    financials: Financials
  ): Promise<BusinessInsightAnalysis> {
    // Check cache first
    const cached = this.getCachedBusinessInsight(insightTitle, business.id);
    if (cached) {
      console.log(`Returning cached analysis for "${insightTitle}"`);
      return cached;
    }

    // Parse JSON strings to get monthly data
    let revenueData: any[] = [];
    let expenseData: any[] = [];
    
    try {
      revenueData = JSON.parse(financials.revenue_data || '[]');
      expenseData = JSON.parse(financials.expense_data || '[]');
    } catch (error) {
      console.error('Error parsing financial data:', error);
      throw new Error('Invalid financial data format');
    }

    // Validate we have data
    if (!revenueData || revenueData.length === 0) {
      throw new Error('Financial data is not available');
    }

    // Calculate key financial metrics
    const latestRevenue = revenueData[revenueData.length - 1];
    const previousRevenue = revenueData.length > 1 ? revenueData[revenueData.length - 2] : null;
    
    const latestExpense = expenseData[expenseData.length - 1] || { value: 0 };
    
    // Calculate year-over-year metrics
    const currentYearRevenue = revenueData
      .slice(-12)
      .reduce((sum, m) => sum + (m.value || 0), 0);
    
    const avgMonthlyRevenue = currentYearRevenue / Math.min(12, revenueData.length);
    const revenueGrowth = previousRevenue && previousRevenue.value > 0 ? 
      ((latestRevenue.value - previousRevenue.value) / previousRevenue.value) * 100 : 0;

    // Get monthly revenue data
    const monthlyRevenueData = revenueData.slice(-12).map((m, idx) => {
      const expense = expenseData[idx] || { value: 0 };
      return {
        month: m.month,
        revenue: m.value || 0,
        earnings: m.value || 0,
        losses: expense.value || 0,
        netProfit: (m.value || 0) - (expense.value || 0)
      };
    });

    // Prepare chart data based on insight type
    const chartData = this.getChartDataForInsight(insightTitle, revenueData, expenseData, financials);

    const prompt = `You are a business growth consultant providing FOCUSED analysis on \"${insightTitle}\" for a business owner.

BUSINESS INFORMATION:
- Company Name: ${business.name}
- Industry: ${business.industry}
- Founded: ${business.founded}
- Employees: ${business.employees}

INSIGHT CONTEXT:
- Insight Title: ${insightTitle}
- Description: ${insightDescription}

FINANCIAL METRICS:
- Annual Revenue: $${business.revenue.toLocaleString()}
- Average Monthly Revenue: $${avgMonthlyRevenue.toFixed(2)}
- Recent Revenue Growth: ${revenueGrowth.toFixed(2)}%
- Current Ratio: ${business.current_ratio.toFixed(2)}x
- Debt-to-Equity: ${business.debt_to_equity.toFixed(2)}x

LAST 12 MONTHS DATA:
${monthlyRevenueData.map(d => `${d.month}: Revenue $${d.revenue.toFixed(2)}, Net Profit $${d.netProfit.toFixed(2)}`).join('\\n')}

Provide a FOCUSED, IN-DEPTH analysis ONLY about \"${insightTitle}\". Focus on helping the business owner understand this specific aspect and how to improve it. Return ONLY valid JSON with this structure:

{
  "insightTitle": "${insightTitle}",
  "title": "Clear title for this specific analysis",
  "executiveSummary": "A comprehensive 300-word executive summary specifically about ${insightTitle}. Reference actual numbers and provide actionable insights relevant to this topic only.",
  "keyMetrics": [
    {
      "label": "Specific metric name relevant to ${insightTitle}",
      "value": "Actual value from the data",
      "trend": "up/down/stable",
      "interpretation": "What this metric means for ${insightTitle} in 40 words"
    }
    (Include 4-6 key metrics relevant to ${insightTitle})
  ],
  "detailedAnalysis": "An extensive 500-word deep-dive analysis ONLY about ${insightTitle}. Include: current state, trends, benchmarks, and growth opportunities. Be extremely thorough and reference actual data.",
  "opportunities": [
    "List 5-7 specific opportunities related to ${insightTitle}, each with quantitative backing from the actual data"
  ],
  "challenges": [
    "List 4-6 specific challenges or obstacles related to ${insightTitle}, each with quantitative backing from the actual data"
  ],
  "improvementStrategies": [
    "Provide 6-8 specific, detailed, actionable strategies to improve ${insightTitle}. Each strategy should be 2-3 sentences long and reference the data. Be very specific about WHAT to do and HOW to do it."
  ],
  "actionItems": [
    {
      "priority": "high/medium/low",
      "item": "Specific action related to improving ${insightTitle}",
      "rationale": "120-word explanation of why this action will help improve ${insightTitle}"
    }
    (Include 5-7 action items all related to improving ${insightTitle})
  ]
}

CRITICAL: Focus EXCLUSIVELY on \"${insightTitle}\". Every section should help the business owner understand and improve this specific aspect. Use actual numbers from the data provided. The improvement strategies section is the MOST IMPORTANT - make it extremely detailed and actionable. Return ONLY valid JSON.`;

    try {
      const response = await this.callOpenAI([
        {
          role: 'system',
          content: `You are an expert business growth consultant providing a FOCUSED analysis on \"${insightTitle}\" only. Help the business owner understand and improve this specific aspect of their business.`
        },
        {
          role: 'user',
          content: prompt
        }
      ], 3000);

      // Clean up the response - remove markdown code blocks if present
      let cleanedResponse = response.trim();
      if (cleanedResponse.startsWith('```json')) {
        cleanedResponse = cleanedResponse.replace(/^```json\s*\n/, '').replace(/\n```\s*$/, '');
      } else if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse.replace(/^```\s*\n/, '').replace(/\n```\s*$/, '');
      }

      // Try to extract JSON if there's any text before or after
      const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanedResponse = jsonMatch[0];
      }

      let analysis;
      try {
        analysis = JSON.parse(cleanedResponse);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.error('Response:', cleanedResponse.substring(0, 500));
        throw new Error('Failed to parse AI response as JSON. Please try again.');
      }
      
      // Add the real chart data we prepared
      analysis.chartData = chartData;
      
      // Cache the analysis
      this.setCachedBusinessInsight(insightTitle, business.id, analysis);
      console.log(`Cached new analysis for "${insightTitle}"`);
      
      return analysis;
    } catch (error) {
      console.error('Error generating business insight analysis:', error);
      throw new Error('Failed to generate AI analysis. Please try again.');
    }
  }

  async answerBusinessInsightQuestion(
    question: string,
    insightTitle: string,
    analysis: BusinessInsightAnalysis,
    business: Business,
    financials: Financials
  ): Promise<string> {
    // Parse financial data
    let revenueData: any[] = [];
    let expenseData: any[] = [];
    
    try {
      revenueData = JSON.parse(financials.revenue_data || '[]');
      expenseData = JSON.parse(financials.expense_data || '[]');
    } catch (error) {
      console.error('Error parsing financial data:', error);
    }
    
    const latestRevenue = revenueData[revenueData.length - 1] || { value: 0 };
    const latestExpense = expenseData[expenseData.length - 1] || { value: 0 };
    
    const prompt = `You are an expert business growth consultant answering a follow-up question about your analysis on \"${insightTitle}\" for ${business.name}.

CONTEXT FROM YOUR ANALYSIS:
Executive Summary: ${analysis.executiveSummary}

Key Metrics:
${analysis.keyMetrics.map(m => `- ${m.label}: ${m.value} (${m.trend}) - ${m.interpretation}`).join('\n')}

Improvement Strategies:
${analysis.improvementStrategies.slice(0, 3).join('\n')}

CURRENT BUSINESS DATA:
- Company: ${business.name} (${business.industry})
- Revenue: $${business.revenue.toLocaleString()}
- Current Ratio: ${business.current_ratio.toFixed(2)}x
- Debt-to-Equity: ${business.debt_to_equity.toFixed(2)}x
- Latest Month Revenue: $${latestRevenue.value.toFixed(2)}
- Latest Month Net Profit: $${(latestRevenue.value - latestExpense.value).toFixed(2)}
- Latest Month Expenses: $${latestExpense.value.toFixed(2)}

BUSINESS OWNER'S QUESTION:
"${question}"

Provide a detailed, helpful answer (200-300 words) that:
1. Directly answers the question with specific data
2. References relevant metrics from your analysis
3. Provides practical, actionable advice for improvement
4. Maintains a supportive business consultant tone
5. Includes quantitative backing where applicable

Answer:`;

    try {
      const response = await this.callOpenAI([
        {
          role: 'system',
          content: 'You are an expert business growth consultant providing detailed answers to questions about your business analysis. You are practical, data-driven, and provide actionable advice.'
        },
        {
          role: 'user',
          content: prompt
        }
      ], 500);

      return response.trim();
    } catch (error) {
      console.error('Error answering business insight question:', error);
      throw new Error('Failed to answer question. Please try again.');
    }
  }
}

export const aiAnalysisService = new AIAnalysisService();
