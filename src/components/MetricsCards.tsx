import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { TrendingUp, TrendingDown, DollarSign, Activity, Percent, CreditCard } from "lucide-react";
import { Business, Financials } from "../services/businessService";

interface MetricData {
  title: string;
  value: string;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: React.ReactNode;
  description: string;
  status?: 'good' | 'warning' | 'bad';
}

interface MetricsCardsProps {
  timePeriod: string;
  currentRole?: string;
  business: Business | null;
  financials: Financials | null;
}

export function MetricsCards({ timePeriod, business, financials }: MetricsCardsProps) {
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(2)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(2)}K`;
    }
    return `$${amount.toFixed(2)}`;
  };

  const getStatus = (value: number, goodThreshold: number, warningThreshold: number, higherIsBetter: boolean = true): 'good' | 'warning' | 'bad' => {
    if (higherIsBetter) {
      if (value >= goodThreshold) return 'good';
      if (value >= warningThreshold) return 'warning';
      return 'bad';
    } else {
      if (value <= goodThreshold) return 'good';
      if (value <= warningThreshold) return 'warning';
      return 'bad';
    }
  };

  const getCreditMetrics = (): MetricData[] => {
    if (!business || !financials) {
      return [
        { title: "Revenue (Annual)", value: "Loading...", change: 0, icon: <DollarSign className="h-4 w-4" />, status: 'good' as const, changeType: 'increase' as const, description: 'Loading data...' },
        { title: "Debt Service Coverage", value: "Loading...", change: 0, icon: <CreditCard className="h-4 w-4" />, status: 'good' as const, changeType: 'increase' as const, description: 'Loading data...' },
        { title: "Current Ratio", value: "Loading...", change: 0, icon: <Activity className="h-4 w-4" />, status: 'good' as const, changeType: 'increase' as const, description: 'Loading data...' },
        { title: "Debt-to-Equity", value: "Loading...", change: 0, icon: <Percent className="h-4 w-4" />, status: 'good' as const, changeType: 'increase' as const, description: 'Loading data...' }
      ];
    }

    return [
      { 
        title: "Revenue (Annual)", 
        value: formatCurrency(business.revenue), 
        change: financials.sales_growth, 
        icon: <DollarSign className="h-4 w-4" />, 
        status: getStatus(financials.sales_growth, 15, 5),
        changeType: financials.sales_growth > 0 ? 'increase' as const : 'decrease' as const,
        description: `vs previous ${timePeriod}`
      },
      { 
        title: "Debt Service Coverage", 
        value: `${business.debt_service_coverage.toFixed(2)}x`, 
        change: parseFloat(((business.debt_service_coverage - 1.8) / 1.8 * 100).toFixed(2)), 
        icon: <CreditCard className="h-4 w-4" />, 
        status: getStatus(business.debt_service_coverage, 2.0, 1.25),
        changeType: 'increase' as const,
        description: `vs benchmark 1.8x`
      },
      { 
        title: "Current Ratio", 
        value: `${business.current_ratio.toFixed(2)}`, 
        change: parseFloat(((business.current_ratio - 1.2) / 1.2 * 100).toFixed(2)), 
        icon: <Activity className="h-4 w-4" />, 
        status: getStatus(business.current_ratio, 1.5, 1.0),
        changeType: business.current_ratio >= 1.2 ? 'increase' as const : 'decrease' as const,
        description: `vs benchmark 1.2x`
      },
      { 
        title: "Debt-to-Equity", 
        value: `${business.debt_to_equity.toFixed(2)}`, 
        change: parseFloat((-((business.debt_to_equity - 0.8) / 0.8 * 100)).toFixed(2)), 
        icon: <Percent className="h-4 w-4" />, 
        status: getStatus(business.debt_to_equity, 0.7, 1.5, false),
        changeType: business.debt_to_equity <= 0.8 ? 'decrease' as const : 'increase' as const,
        description: `vs benchmark 0.8x`
      }
    ];
  };

  const metrics = getCreditMetrics();

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'good':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800';
      case 'bad':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800';
      default:
        return '';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <Card key={index} className={`hover:shadow-md transition-shadow ${metric.status ? 'border-2' : ''} ${metric.status === 'good' ? 'border-green-200 dark:border-green-800' : metric.status === 'warning' ? 'border-yellow-200 dark:border-yellow-800' : ''}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {metric.title}
            </CardTitle>
            <div className="text-muted-foreground">
              {metric.icon}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge 
                variant={metric.changeType === 'increase' ? 'default' : 'destructive'}
                className="flex items-center gap-1"
              >
                {metric.changeType === 'increase' ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {Math.abs(metric.change)}%
              </Badge>
              <span className="text-xs text-muted-foreground">
                {metric.description}
              </span>
            </div>
            {metric.status && (
              <div className="mt-2">
                <Badge variant="outline" className={getStatusBadge(metric.status)}>
                  {metric.status === 'good' ? '✓ Healthy' : metric.status === 'warning' ? '⚠ Monitor' : '✗ Risk'}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}