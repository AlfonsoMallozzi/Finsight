import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Brain, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, ArrowRight, DollarSign } from "lucide-react";

interface CreditTrendsInsightsProps {
  totalApplications: number;
  totalCreditRequested: number;
  averageCreditAmount: number;
  pendingCount: number;
  underReviewCount: number;
  highRiskCount: number;
  lowRiskCount: number;
}

export function CreditTrendsInsights({
  totalApplications,
  totalCreditRequested,
  averageCreditAmount,
  pendingCount,
  underReviewCount,
  highRiskCount,
  lowRiskCount
}: CreditTrendsInsightsProps) {
  
  const generateInsights = () => {
    const insights = [];

    // Volume insights
    if (totalApplications >= 10) {
      insights.push({
        type: 'warning' as const,
        title: 'High Application Volume',
        description: `Currently reviewing ${totalApplications} credit applications. Consider prioritizing high-value requests to manage workload efficiently.`,
        impact: 'medium' as const,
        icon: <TrendingUp className="h-4 w-4" />
      });
    } else if (totalApplications <= 3) {
      insights.push({
        type: 'recommendation' as const,
        title: 'Low Application Activity',
        description: `Only ${totalApplications} applications in the pipeline. This may indicate slower market conditions or need for increased outreach.`,
        impact: 'low' as const,
        icon: <TrendingDown className="h-4 w-4" />
      });
    }

    // Credit amount insights
    if (averageCreditAmount > 500000) {
      insights.push({
        type: 'positive' as const,
        title: 'Large Credit Requests',
        description: `Average credit request of $${(averageCreditAmount / 1000).toFixed(2)}K indicates businesses seeking substantial capital for growth. Ensure thorough due diligence.`,
        impact: 'high' as const,
        icon: <DollarSign className="h-4 w-4" />
      });
    } else if (averageCreditAmount < 250000) {
      insights.push({
        type: 'recommendation' as const,
        title: 'Small Business Focus',
        description: `Lower average credit requests suggest small business segment. Consider streamlined approval processes for qualified applicants.`,
        impact: 'medium' as const,
        icon: <DollarSign className="h-4 w-4" />
      });
    }

    // Pending workload
    if (pendingCount + underReviewCount >= 4) {
      insights.push({
        type: 'warning' as const,
        title: 'Processing Backlog Alert',
        description: `${pendingCount + underReviewCount} applications awaiting review. Prioritize time-sensitive cases to maintain service level agreements.`,
        impact: 'high' as const,
        icon: <AlertTriangle className="h-4 w-4" />
      });
    }

    // Risk profile insights
    const riskRatio = lowRiskCount / (highRiskCount || 1);
    if (riskRatio >= 3) {
      insights.push({
        type: 'positive' as const,
        title: 'Strong Applicant Quality',
        description: `${lowRiskCount} low-risk vs ${highRiskCount} high-risk applications. Portfolio shows healthy risk-adjusted opportunities.`,
        impact: 'high' as const,
        icon: <CheckCircle className="h-4 w-4" />
      });
    } else if (highRiskCount >= lowRiskCount) {
      insights.push({
        type: 'warning' as const,
        title: 'Elevated Risk Profile',
        description: `Higher proportion of risky applications. Apply stricter underwriting criteria and consider lower approval amounts.`,
        impact: 'high' as const,
        icon: <AlertTriangle className="h-4 w-4" />
      });
    }

    // Total exposure insight
    if (totalCreditRequested > 2000000) {
      insights.push({
        type: 'recommendation' as const,
        title: 'Significant Capital Exposure',
        description: `Total requested capital of $${(totalCreditRequested / 1000000).toFixed(2)}M. Review portfolio concentration and diversification strategy.`,
        impact: 'high' as const,
        icon: <TrendingUp className="h-4 w-4" />
      });
    }

    // Default insight if nothing else
    if (insights.length === 0) {
      insights.push({
        type: 'positive' as const,
        title: 'Balanced Portfolio',
        description: 'Current application pipeline shows balanced characteristics across volume, risk, and credit amounts.',
        impact: 'low' as const,
        icon: <CheckCircle className="h-4 w-4" />
      });
    }

    return insights.slice(0, 4); // Return max 4 insights
  };

  const insights = generateInsights();

  const getTypeColor = (type: 'positive' | 'warning' | 'recommendation') => {
    switch (type) {
      case 'positive':
        return 'bg-gradient-to-br from-green-50 to-emerald-100 border-green-200 dark:from-green-950 dark:to-emerald-900 dark:border-green-800';
      case 'warning':
        return 'bg-gradient-to-br from-yellow-50 to-amber-100 border-yellow-200 dark:from-yellow-950 dark:to-amber-900 dark:border-yellow-800';
      case 'recommendation':
        return 'bg-gradient-to-br from-purple-50 to-fuchsia-100 border-purple-200 dark:from-purple-950 dark:to-fuchsia-900 dark:border-purple-800';
    }
  };

  const getImpactVariant = (impact: 'high' | 'medium' | 'low') => {
    switch (impact) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
    }
  };

  return (
    <Card className="bg-gradient-to-br from-card to-primary/5 dark:from-card dark:to-primary/10 border-primary/20 dark:border-primary/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          AI Credit Trends & Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.map((insight, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border-2 ${getTypeColor(insight.type)} shadow-sm`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {insight.icon}
                <h4 className="font-medium text-sm">{insight.title}</h4>
              </div>
              <Badge variant={getImpactVariant(insight.impact)} className="text-xs">
                {insight.impact}
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground leading-relaxed">
              {insight.description}
            </p>
          </div>
        ))}

        <Alert className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
          <Brain className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-sm">
            AI analysis based on current application portfolio. Insights update in real-time as applications are processed.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
