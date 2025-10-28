import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Tachometer } from './Tachometer';
import { LoadingSpinner } from './ui/loading-spinner';
import { BusinessInsightDetail } from './BusinessInsightDetail';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Package,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Lightbulb,
  Target,
  BarChart3,
  LogOut,
  Activity
} from 'lucide-react';
import { businessService, Business, Financials } from '../services/businessService';
import { creditScoringService } from '../services/creditScoringService';
import { aiAnalysisService, BusinessInsightAnalysis } from '../services/aiAnalysisService';
import { toast } from 'sonner@2.0.3';

interface BusinessDashboardProps {
  businessId: string;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onLogout: () => void;
}

export function BusinessDashboard({ businessId, isDarkMode, onToggleDarkMode, onLogout }: BusinessDashboardProps) {
  const [creditScore, setCreditScore] = useState<number | null>(null);
  const [creditRating, setCreditRating] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [business, setBusiness] = useState<Business | null>(null);
  const [financials, setFinancials] = useState<Financials | null>(null);
  
  // Analysis slider state
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<BusinessInsightAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState<{ title: string; description: string } | null>(null);
  
  // Fetch business data and calculate credit score
  useEffect(() => {
    const fetchAndCalculate = async () => {
      try {
        setIsLoading(true);
        // Fetch business data using the provided businessId
        const [businessData, financialsData] = await Promise.all([
          businessService.getBusiness(businessId),
          businessService.getFinancials(businessId)
        ]);
        
        // Validate fetched data
        if (!businessData) {
          throw new Error('Business data not found');
        }
        
        if (!financialsData) {
          throw new Error('Financial data not found');
        }
        
        console.log('Fetched Business:', businessData);
        console.log('Fetched Financials:', financialsData);
        console.log('Monthly Data:', financialsData.monthly_data);
        
        setBusiness(businessData);
        setFinancials(financialsData);
        
        // Calculate credit score
        const scoreResult = creditScoringService.calculateCreditScore(businessData, financialsData);
        setCreditScore(scoreResult.score);
        setCreditRating(creditScoringService.getRating(scoreResult.score));
        
        console.log('Credit Score Breakdown:', scoreResult.breakdown);
        console.log('Financial Metrics:', scoreResult.metrics);
      } catch (error) {
        console.error('Error calculating credit score:', error);
        setCreditScore(0);
        setCreditRating('Unable to calculate');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAndCalculate();
  }, [businessId]);
  
  // Helper function to format currency
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toFixed(0)}`;
  };
  
  // Generate dynamic insights based on real financial data
  const generateInsights = () => {
    if (!business || !financials) return [];

    const insights = [];
    
    // Revenue Growth Insight
    if (financials.sales_growth > 10) {
      insights.push({
        title: 'Strong Revenue Growth',
        description: `Your revenue has grown ${financials.sales_growth.toFixed(1)}% annually. Excellent performance! Consider expanding operations to capitalize on this momentum.`,
        type: 'success' as const,
        priority: 'high' as const,
        impact: `+${formatCurrency(financials.total_revenue * 0.15)} potential with expansion`
      });
    } else if (financials.sales_growth > 0) {
      insights.push({
        title: 'Moderate Revenue Growth',
        description: `Revenue growth of ${financials.sales_growth.toFixed(1)}% is positive but below industry average. Focus on customer acquisition and retention strategies.`,
        type: 'warning' as const,
        priority: 'high' as const,
        impact: `+${formatCurrency(financials.total_revenue * 0.10)} potential improvement`
      });
    } else {
      insights.push({
        title: 'Revenue Decline Alert',
        description: `Revenue has declined by ${Math.abs(financials.sales_growth).toFixed(1)}%. Immediate action required to reverse this trend and stabilize operations.`,
        type: 'warning' as const,
        priority: 'high' as const,
        impact: `${formatCurrency(Math.abs(financials.total_revenue * financials.sales_growth / 100))} revenue at risk`
      });
    }

    // Cash Flow & Working Capital Insight
    if (financials.days_sales_outstanding > 45) {
      insights.push({
        title: 'Cash Flow Optimization Needed',
        description: `Accounts receivable average ${financials.days_sales_outstanding.toFixed(0)} days vs industry standard of 30 days. Improving collections could significantly boost working capital.`,
        type: 'warning' as const,
        priority: 'high' as const,
        impact: `${formatCurrency(financials.working_capital * 0.25)} working capital tied up`
      });
    } else if (financials.operating_cash_flow < 0) {
      insights.push({
        title: 'Negative Cash Flow Warning',
        description: `Operating cash flow is negative at ${formatCurrency(financials.operating_cash_flow)}. Urgent measures needed to improve cash generation and reduce burn rate.`,
        type: 'warning' as const,
        priority: 'high' as const,
        impact: 'Critical liquidity concern'
      });
    } else {
      insights.push({
        title: 'Healthy Cash Flow',
        description: `Strong operating cash flow of ${formatCurrency(financials.operating_cash_flow)}. Collections are efficient at ${financials.days_sales_outstanding.toFixed(0)} days. Maintain current practices.`,
        type: 'success' as const,
        priority: 'medium' as const,
        impact: 'Excellent liquidity position'
      });
    }

    // Profitability Insight
    if (financials.net_profit_margin > 15) {
      insights.push({
        title: 'Excellent Profit Margins',
        description: `Net profit margin of ${financials.net_profit_margin.toFixed(1)}% is exceptional. Cost controls are effective and pricing strategy is optimal.`,
        type: 'success' as const,
        priority: 'medium' as const,
        impact: 'Industry-leading profitability'
      });
    } else if (financials.net_profit_margin > 5) {
      insights.push({
        title: 'Moderate Profitability',
        description: `Net profit margin of ${financials.net_profit_margin.toFixed(1)}% is acceptable but could be improved. Review operating expenses and pricing strategy.`,
        type: 'info' as const,
        priority: 'medium' as const,
        impact: `+${formatCurrency(financials.total_revenue * 0.05)} with 5% margin improvement`
      });
    } else if (financials.net_profit_margin > 0) {
      insights.push({
        title: 'Low Profit Margins',
        description: `Net profit margin of ${financials.net_profit_margin.toFixed(1)}% is concerning. Urgent cost reduction and efficiency improvements needed.`,
        type: 'warning' as const,
        priority: 'high' as const,
        impact: 'Profitability at risk'
      });
    } else {
      insights.push({
        title: 'Operating at a Loss',
        description: `Negative net profit margin of ${financials.net_profit_margin.toFixed(1)}%. Critical restructuring required to achieve profitability.`,
        type: 'warning' as const,
        priority: 'high' as const,
        impact: `${formatCurrency(Math.abs(financials.net_profit))} annual loss`
      });
    }

    // Debt & Leverage Insight
    if (financials.debt_to_equity > 2.0) {
      insights.push({
        title: 'High Leverage Concern',
        description: `Debt-to-equity ratio of ${financials.debt_to_equity.toFixed(2)}x is elevated. Consider debt reduction strategies to lower financial risk.`,
        type: 'warning' as const,
        priority: 'high' as const,
        impact: 'Increased financial risk'
      });
    } else if (financials.debt_to_equity > 1.0) {
      insights.push({
        title: 'Moderate Debt Levels',
        description: `Debt-to-equity ratio of ${financials.debt_to_equity.toFixed(2)}x is manageable but monitor closely. Ensure debt service coverage remains strong.`,
        type: 'info' as const,
        priority: 'medium' as const,
        impact: 'Acceptable leverage ratio'
      });
    } else {
      insights.push({
        title: 'Conservative Debt Profile',
        description: `Debt-to-equity ratio of ${financials.debt_to_equity.toFixed(2)}x is excellent. Low leverage provides financial flexibility for growth opportunities.`,
        type: 'success' as const,
        priority: 'medium' as const,
        impact: 'Strong financial position'
      });
    }

    return insights.slice(0, 4); // Return top 4 insights
  };

  const insights = generateInsights();

  const handleViewDetailedAnalysis = async (insight: typeof insights[0]) => {
    if (!business || !financials) {
      toast.error('Unable to generate analysis', {
        description: 'Business data not loaded'
      });
      return;
    }

    setSelectedInsight({ title: insight.title, description: insight.description });
    
    // Check if we have cached analysis
    const cachedAnalysis = aiAnalysisService.getCachedBusinessInsight(insight.title, business.id);
    
    if (cachedAnalysis) {
      console.log('Using cached analysis for:', insight.title);
      setCurrentAnalysis(cachedAnalysis);
      setIsAnalysisOpen(true);
      return;
    }

    // Generate new analysis
    setIsAnalyzing(true);
    setIsAnalysisOpen(true);
    setCurrentAnalysis(null);

    try {
      const analysis = await aiAnalysisService.generateBusinessInsightAnalysis(
        insight.title,
        insight.description,
        business,
        financials
      );
      
      setCurrentAnalysis(analysis);
      toast.success('Analysis generated', {
        description: 'AI has completed the detailed analysis'
      });
    } catch (error) {
      console.error('Error generating analysis:', error);
      toast.error('Failed to generate analysis', {
        description: 'Please try again'
      });
      setIsAnalysisOpen(false);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Calculate KPIs from real data
  const kpis = business && financials ? [
    { 
      label: 'Annual Revenue', 
      value: formatCurrency(financials.total_revenue), 
      change: `${financials.sales_growth > 0 ? '+' : ''}${financials.sales_growth.toFixed(1)}%`, 
      trend: financials.sales_growth >= 0 ? 'up' as const : 'down' as const 
    },
    { 
      label: 'Net Profit', 
      value: formatCurrency(financials.net_profit), 
      change: `${financials.net_profit_margin.toFixed(1)}% margin`, 
      trend: financials.net_profit > 0 ? 'up' as const : 'down' as const 
    },
    { 
      label: 'Cash Flow', 
      value: formatCurrency(financials.operating_cash_flow), 
      change: `${financials.current_ratio.toFixed(2)}x current ratio`, 
      trend: financials.operating_cash_flow > 0 ? 'up' as const : 'down' as const 
    },
    { 
      label: 'Employees', 
      value: business.employees.toString(), 
      change: `${business.years_in_business} yrs in business`, 
      trend: 'up' as const 
    }
  ] : [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl text-foreground">{business?.name || 'Business Dashboard'}</h1>
              <p className="text-sm text-muted-foreground">Performance & Growth Insights</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={onToggleDarkMode}
            >
              {isDarkMode ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={onLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* KPIs */}
        {!isLoading && business && financials && (
          <section>
            <h2 className="mb-4">Key Performance Indicators</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {kpis.map((kpi, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {kpi.label}
                    </CardTitle>
                    {kpi.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{kpi.value}</div>
                    <p className="text-sm text-muted-foreground">
                      {kpi.change}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* AI-Powered Insights & Credit Score */}
        {!isLoading && business && financials && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2>AI-Powered Business Insights</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Personalized recommendations to improve your business performance
                </p>
              </div>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                <Lightbulb className="h-3 w-3 mr-1" />
                AI Insights
              </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* LEFT: Insights stacked vertically */}
              <div className="flex flex-col gap-4">
                {insights.map((insight, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {insight.type === 'success' ? (
                          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          </div>
                        ) : insight.type === 'warning' ? (
                          <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                            <AlertTriangle className="h-5 w-5 text-orange-600" />
                          </div>
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <Target className="h-5 w-5 text-blue-600" />
                          </div>
                        )}
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">{insight.title}</CardTitle>
                          <Badge variant="outline" className="text-xs">
                            {insight.priority === 'high' ? 'High Priority' : 'Medium Priority'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      {insight.description}
                    </p>
                    
                    <Alert className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                      <DollarSign className="h-4 w-4 text-purple-600" />
                      <AlertDescription className="text-sm font-medium text-purple-900">
                        Potential Impact: {insight.impact}
                      </AlertDescription>
                    </Alert>

                    <Button 
                      variant="outline" 
                      className="w-full mt-4 group"
                      onClick={() => handleViewDetailedAnalysis(insight)}
                    >
                      View Detailed Analysis
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* RIGHT: Credit Score Tachometer */}
            <div className="flex flex-col">
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Activity className="h-5 w-5 text-primary" />
                    <CardTitle className="text-center">Credit Eligibility Score</CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    Calculated from comprehensive financial analysis
                  </p>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  {isLoading ? (
                    <div className="flex flex-col items-center gap-4 py-20">
                      <LoadingSpinner size="lg" />
                      <p className="text-sm text-muted-foreground">Calculating credit score...</p>
                    </div>
                  ) : (
                    <>
                      <Tachometer 
                        value={creditScore || 0}
                        max={1000}
                        size={350}
                        showValue={true}
                        label="out of 1000"
                      />
                      
                      <div className="mt-6 text-center">
                        <p className="text-sm text-muted-foreground mb-1">Credit Rating</p>
                        <div className={`text-2xl ${creditScoringService.getRatingColor(creditScore || 0)}`}>
                          {creditRating}
                        </div>
                      </div>
                      
                      <div className="mt-8 w-full space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="h-3 w-3 rounded-full bg-red-600"></div>
                          <span className="text-sm text-muted-foreground">0-399: Poor</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="h-3 w-3 rounded-full bg-yellow-600"></div>
                          <span className="text-sm text-muted-foreground">400-699: Fair to Good</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="h-3 w-3 rounded-full bg-green-600"></div>
                          <span className="text-sm text-muted-foreground">700-1000: Excellent</span>
                        </div>
                      </div>

                      {creditScore && creditScore >= 550 ? (
                        <Alert className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 dark:from-green-950 dark:to-emerald-950">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <AlertDescription className="text-sm text-green-900 dark:text-green-100">
                            Your score qualifies for favorable loan terms
                          </AlertDescription>
                        </Alert>
                      ) : creditScore && creditScore >= 400 ? (
                        <Alert className="mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 dark:from-yellow-950 dark:to-orange-950">
                          <AlertTriangle className="h-4 w-4 text-yellow-600" />
                          <AlertDescription className="text-sm text-yellow-900 dark:text-yellow-100">
                            Moderate credit approval likelihood. Consider improving financial metrics.
                          </AlertDescription>
                        </Alert>
                      ) : (
                        <Alert className="mt-6 bg-gradient-to-r from-red-50 to-pink-50 border-red-200 dark:from-red-950 dark:to-pink-950">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                          <AlertDescription className="text-sm text-red-900 dark:text-red-100">
                            Credit approval may be challenging. Focus on improving key financial ratios.
                          </AlertDescription>
                        </Alert>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
          </section>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <LoadingSpinner size="lg" />
            <p className="text-sm text-muted-foreground mt-4">Loading business insights...</p>
          </div>
        )}
      </div>

      {/* Business Insight Detail Slider */}
      <BusinessInsightDetail
        isOpen={isAnalysisOpen}
        onClose={() => setIsAnalysisOpen(false)}
        analysis={currentAnalysis}
        isLoading={isAnalyzing}
        businessName={business?.name || 'Your Business'}
        insightTitle={selectedInsight?.title || ''}
        business={business}
        financials={financials}
      />
    </div>
  );
}
