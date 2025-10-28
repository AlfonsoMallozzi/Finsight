import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Brain, TrendingUp, AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";
import { AIAnalysisDetail } from "./AIAnalysisDetail";
import { aiAnalysisService, FocusedAnalysisResult } from "../services/aiAnalysisService";
import { Business, Financials } from "../services/businessService";
import { toast } from "sonner@2.0.3";

interface Suggestion {
  id: string;
  type: 'positive' | 'warning' | 'recommendation';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  actionText: string;
  priority: number;
}

interface AISuggestionsProps {
  searchQuery: string;
  timePeriod: string;
  business?: Business | null;
  financials?: Financials | null;
}

export function AISuggestions({ searchQuery, timePeriod, business, financials }: AISuggestionsProps) {
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<FocusedAnalysisResult | null>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [currentInsightType, setCurrentInsightType] = useState<string>('');
  const getCreditAnalysisSuggestions = (query: string, period: string): Suggestion[] => {
    // Return empty if no business data
    if (!business || !financials) {
      return [];
    }

    const dscr = financials.debt_service_coverage || business.debt_service_coverage || 0;
    const currentRatio = financials.current_ratio || business.current_ratio || 0;
    const debtToEquity = financials.debt_to_equity || business.debt_to_equity || 0;
    const salesGrowth = financials.sales_growth || 0;
    const netProfitMargin = financials.net_profit_margin || 0;
    const operatingCashFlow = financials.operating_cash_flow || 0;

    const allSuggestions: Suggestion[] = [];

    // Revenue Growth Insight
    if (salesGrowth > 15) {
      allSuggestions.push({
        id: 'credit-1',
        type: 'positive' as const,
        title: 'Strong Revenue Growth',
        description: `Revenue has grown consistently at ${salesGrowth.toFixed(1)}% year-over-year. Business shows strong market traction and sustainable growth trajectory.`,
        impact: 'high' as const,
        actionText: 'View Revenue Analysis',
        priority: 1
      });
    } else if (salesGrowth > 5) {
      allSuggestions.push({
        id: 'credit-1',
        type: 'recommendation' as const,
        title: 'Moderate Revenue Growth',
        description: `Revenue growth of ${salesGrowth.toFixed(1)}% is moderate. Consider strategies to accelerate growth or maintain stability.`,
        impact: 'medium' as const,
        actionText: 'View Revenue Analysis',
        priority: 2
      });
    } else if (salesGrowth < 0) {
      allSuggestions.push({
        id: 'credit-1',
        type: 'warning' as const,
        title: 'Revenue Decline Concern',
        description: `Revenue has declined ${Math.abs(salesGrowth).toFixed(1)}% year-over-year. This raises significant credit concerns and requires immediate attention.`,
        impact: 'high' as const,
        actionText: 'View Revenue Analysis',
        priority: 1
      });
    }

    // Cash Flow & DSCR Insight
    if (dscr >= 2.0 && operatingCashFlow > 100000) {
      allSuggestions.push({
        id: 'credit-2',
        type: 'positive' as const,
        title: 'Excellent Cash Flow',
        description: `Operating cash flow is strong at $${(operatingCashFlow / 1000).toFixed(0)}K. Debt service coverage ratio of ${dscr.toFixed(1)}x indicates excellent ability to service debt obligations.`,
        impact: 'high' as const,
        actionText: 'Review Cash Flow Details',
        priority: 2
      });
    } else if (dscr >= 1.25 && operatingCashFlow > 50000) {
      allSuggestions.push({
        id: 'credit-2',
        type: 'recommendation' as const,
        title: 'Adequate Cash Flow',
        description: `Operating cash flow of $${(operatingCashFlow / 1000).toFixed(0)}K with DSCR of ${dscr.toFixed(1)}x is acceptable but should be monitored closely.`,
        impact: 'medium' as const,
        actionText: 'Review Cash Flow Details',
        priority: 3
      });
    } else {
      allSuggestions.push({
        id: 'credit-2',
        type: 'warning' as const,
        title: 'Cash Flow Concerns',
        description: `Low operating cash flow of $${(operatingCashFlow / 1000).toFixed(0)}K and DSCR of ${dscr.toFixed(1)}x indicate serious debt service challenges. High default risk.`,
        impact: 'high' as const,
        actionText: 'Review Cash Flow Details',
        priority: 1
      });
    }

    // Liquidity Insight
    if (currentRatio >= 2.0) {
      allSuggestions.push({
        id: 'credit-3',
        type: 'positive' as const,
        title: 'Strong Liquidity Position',
        description: `Current ratio of ${currentRatio.toFixed(1)}x indicates excellent short-term liquidity and ability to meet obligations.`,
        impact: 'high' as const,
        actionText: 'Analyze Liquidity Trends',
        priority: 3
      });
    } else if (currentRatio >= 1.2) {
      allSuggestions.push({
        id: 'credit-3',
        type: 'recommendation' as const,
        title: 'Liquidity Monitoring Required',
        description: `Current ratio at ${currentRatio.toFixed(1)}x is acceptable but should be monitored. Consider improving working capital management.`,
        impact: 'medium' as const,
        actionText: 'Analyze Liquidity Trends',
        priority: 3
      });
    } else {
      allSuggestions.push({
        id: 'credit-3',
        type: 'warning' as const,
        title: 'Liquidity Crisis Risk',
        description: `Current ratio of ${currentRatio.toFixed(1)}x is dangerously low. Business may struggle to meet short-term obligations. Immediate action required.`,
        impact: 'high' as const,
        actionText: 'Analyze Liquidity Trends',
        priority: 1
      });
    }

    // Debt-to-Equity Insight
    if (debtToEquity < 1.0) {
      allSuggestions.push({
        id: 'credit-5',
        type: 'positive' as const,
        title: 'Conservative Leverage',
        description: `Debt-to-equity ratio of ${debtToEquity.toFixed(1)}x indicates conservative leverage. Balance sheet has capacity for additional debt.`,
        impact: 'medium' as const,
        actionText: 'Review Capital Structure',
        priority: 4
      });
    } else if (debtToEquity < 2.5) {
      allSuggestions.push({
        id: 'credit-5',
        type: 'warning' as const,
        title: 'Elevated Leverage',
        description: `Debt-to-equity ratio of ${debtToEquity.toFixed(1)}x shows elevated leverage. Limited capacity for additional debt without equity injection.`,
        impact: 'medium' as const,
        actionText: 'Review Capital Structure',
        priority: 3
      });
    } else {
      allSuggestions.push({
        id: 'credit-5',
        type: 'warning' as const,
        title: 'Excessive Leverage Risk',
        description: `Debt-to-equity ratio of ${debtToEquity.toFixed(1)}x is extremely high. Business is overleveraged and faces significant financial distress risk.`,
        impact: 'high' as const,
        actionText: 'Review Capital Structure',
        priority: 1
      });
    }

    // Profitability Insight
    if (netProfitMargin > 15) {
      allSuggestions.push({
        id: 'credit-4',
        type: 'positive' as const,
        title: 'Excellent Profitability',
        description: `Net profit margin of ${netProfitMargin.toFixed(1)}% exceeds industry averages. Strong competitive position suggests lower credit risk.`,
        impact: 'high' as const,
        actionText: 'View Industry Comparison',
        priority: 2
      });
    } else if (netProfitMargin > 5) {
      allSuggestions.push({
        id: 'credit-4',
        type: 'recommendation' as const,
        title: 'Moderate Profitability',
        description: `Net profit margin of ${netProfitMargin.toFixed(1)}% is moderate. Focus on cost control and pricing optimization to improve margins.`,
        impact: 'medium' as const,
        actionText: 'View Industry Comparison',
        priority: 4
      });
    } else {
      allSuggestions.push({
        id: 'credit-4',
        type: 'warning' as const,
        title: 'Profitability Concerns',
        description: `Net profit margin of ${netProfitMargin.toFixed(1)}% is very low or negative. Business model sustainability is questionable.`,
        impact: 'high' as const,
        actionText: 'View Industry Comparison',
        priority: 1
      });
    }

    // Always include documentation recommendation
    allSuggestions.push({
      id: 'credit-6',
      type: 'recommendation' as const,
      title: 'Request Additional Documentation',
      description: 'Consider requesting tax returns for the past 3 years and a detailed business plan to complete due diligence.',
      impact: 'medium' as const,
      actionText: 'Generate Document Request',
      priority: 5
    });

    let filteredSuggestions = allSuggestions;

    // Filter by search query if provided
    if (query) {
      const queryLower = query.toLowerCase();
      filteredSuggestions = filteredSuggestions.filter(s => 
        s.title.toLowerCase().includes(queryLower) || 
        s.description.toLowerCase().includes(queryLower)
      );
    }

    return filteredSuggestions.sort((a, b) => a.priority - b.priority);
  };

  const suggestions = getCreditAnalysisSuggestions(searchQuery, timePeriod);

  const getTypeIcon = (type: Suggestion['type']) => {
    switch (type) {
      case 'positive':
        return <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />;
      case 'recommendation':
        return <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />;
    }
  };

  const getTypeColor = (type: Suggestion['type']) => {
    switch (type) {
      case 'positive':
        return 'bg-gradient-to-br from-green-50 to-emerald-100 border-green-200 dark:from-green-950 dark:to-emerald-900 dark:border-green-800';
      case 'warning':
        return 'bg-gradient-to-br from-yellow-50 to-amber-100 border-yellow-200 dark:from-yellow-950 dark:to-amber-900 dark:border-yellow-800';
      case 'recommendation':
        return 'bg-gradient-to-br from-purple-50 to-fuchsia-100 border-purple-200 dark:from-purple-950 dark:to-fuchsia-900 dark:border-purple-800';
    }
  };

  const getImpactVariant = (impact: Suggestion['impact']) => {
    switch (impact) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
    }
  };

  const handleViewDetailedInsight = async (insightTitle: string) => {
    if (!business || !financials) {
      toast.error('Business data not available');
      return;
    }

    setCurrentInsightType(insightTitle);
    setIsLoadingAnalysis(true);
    setIsAnalysisOpen(true);

    try {
      const analysis = await aiAnalysisService.generateFocusedAnalysis(insightTitle, business, financials);
      setAiAnalysis(analysis);
      toast.success('AI Analysis Complete', {
        description: `Detailed analysis for "${insightTitle}" generated successfully`,
      });
    } catch (error) {
      console.error('Error generating AI analysis:', error);
      toast.error('Failed to generate AI analysis', {
        description: 'Please try again or contact support',
      });
      setIsAnalysisOpen(false);
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  return (
    <>
      <AIAnalysisDetail
        isOpen={isAnalysisOpen}
        onClose={() => setIsAnalysisOpen(false)}
        analysis={aiAnalysis}
        isLoading={isLoadingAnalysis}
        businessName={business?.name || 'Business'}
        insightType={currentInsightType}
        business={business}
        financials={financials}
      />
      <Card className="bg-gradient-to-br from-card to-primary/5 dark:from-card dark:to-primary/10 border-primary/20 dark:border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Credit Analysis AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
        {searchQuery && (
          <Alert>
            <AlertDescription>
              Showing credit insights for: "{searchQuery}"
            </AlertDescription>
          </Alert>
        )}
        
        {suggestions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No specific insights found for your query.</p>
            <p className="text-sm mt-2">
              Try searching for terms related to credit analysis
            </p>
          </div>
        ) : (
          suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className={`p-4 rounded-lg border-2 ${getTypeColor(suggestion.type)} shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getTypeIcon(suggestion.type)}
                  <h4 className="font-medium">{suggestion.title}</h4>
                </div>
                <Badge variant={getImpactVariant(suggestion.impact)}>
                  {suggestion.impact} impact
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground mb-3">
                {suggestion.description}
              </p>
              
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full justify-between hover:bg-primary/10 hover:border-primary"
                onClick={() => handleViewDetailedInsight(suggestion.title)}
                disabled={!business || !financials}
              >
                {suggestion.actionText}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
        </CardContent>
      </Card>
    </>
  );
}