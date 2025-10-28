import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Alert, AlertDescription } from "../ui/alert";
import { ResponsiveContainer, ComposedChart, CartesianGrid, XAxis, YAxis, Bar, Line, BarChart, AreaChart, Area, PieChart, Pie, Cell, LineChart, Legend, Tooltip } from "recharts";
import { ColorPalette, Timeframe } from "../../types/widgets";
import { getPaletteColors } from "../../utils/colorPalettes";
import { Business, Financials, MonthlyData, aggregateDataByTimeframe, Timeframe as TF } from "../../services/businessService";
import { LoadingSpinner } from "../ui/loading-spinner";
import { Tachometer } from "../Tachometer";
import { creditScoringService } from "../../services/creditScoringService";
import { Activity, AlertTriangle, CheckCircle } from "lucide-react";

interface WidgetProps {
  colorPalette?: ColorPalette;
  business: Business | null;
  financials: Financials | null;
  timeframe?: Timeframe;
}

// Helper function to parse monthly JSON data
const parseMonthlyData = (jsonString: string): MonthlyData[] => {
  try {
    return JSON.parse(jsonString);
  } catch {
    return [];
  }
};

// Helper function to format currency
const formatCurrency = (value: number) => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(2)}M`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(2)}K`;
  }
  return `$${value.toFixed(2)}`;
};

export function RevenueExpenseChart({ colorPalette = 'banorte-red', business, financials, timeframe = 'month' }: WidgetProps) {
  const colors = getPaletteColors(colorPalette);
  
  // Parse real data from Supabase
  const revenueData = financials ? parseMonthlyData(financials.revenue_data) : [];
  const expenseData = financials ? parseMonthlyData(financials.expense_data) : [];
  
  // Aggregate based on timeframe
  const aggregatedRevenue = aggregateDataByTimeframe(revenueData, timeframe as TF);
  const aggregatedExpense = aggregateDataByTimeframe(expenseData, timeframe as TF);
  
  // Combine revenue and expenses into single dataset
  const chartData = aggregatedRevenue.map((rev, index) => ({
    month: rev.month.split(' ')[0], // Show only month/quarter/year name
    revenue: rev.value,
    expenses: aggregatedExpense[index]?.value || 0,
    profit: rev.value - (aggregatedExpense[index]?.value || 0)
  }));

  if (!financials) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle>Revenue vs Expenses</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Revenue vs Expenses ({timeframe === 'month' ? 'Monthly' : timeframe === 'quarter' ? 'Quarterly' : 'Yearly'})</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Legend />
            <Bar dataKey="revenue" fill={colors[0]} name="Revenue" />
            <Bar dataKey="expenses" fill={colors[1]} name="Expenses" />
            <Line type="monotone" dataKey="profit" stroke={colors[2]} strokeWidth={3} name="Profit" />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function BalanceSheetOverview({ colorPalette = 'banorte-red', business, financials, timeframe = 'month' }: WidgetProps) {
  const colors = getPaletteColors(colorPalette);
  
  if (!financials) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle>Balance Sheet Overview</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </CardContent>
      </Card>
    );
  }

  const balanceSheetData = [
    { category: 'Assets', value: financials.assets, color: colors[0] },
    { category: 'Liabilities', value: financials.liabilities, color: colors[3] },
    { category: 'Equity', value: financials.equity, color: colors[5] },
  ];
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Balance Sheet Overview</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={balanceSheetData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis dataKey="category" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Bar dataKey="value" fill={colors[0]}>
              {balanceSheetData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function WorkingCapitalWidget({ colorPalette = 'banorte-red', business, financials, timeframe = 'month' }: WidgetProps) {
  const colors = getPaletteColors(colorPalette);
  
  if (!financials) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle>Working Capital</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </CardContent>
      </Card>
    );
  }

  const data = [
    { name: 'Current Assets', value: financials.current_assets },
    { name: 'Current Liabilities', value: financials.current_liabilities },
    { name: 'Working Capital', value: financials.working_capital },
  ];
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Working Capital</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Bar dataKey="value" fill={colors[0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function RevenueForecastChart({ colorPalette = 'banorte-red', business, financials, timeframe = 'month' }: WidgetProps) {
  const colors = getPaletteColors(colorPalette);
  
  if (!financials) {
    return <Card className="h-full flex flex-col"><CardHeader><CardTitle>Revenue Forecast</CardTitle></CardHeader><CardContent className="flex-1 flex items-center justify-center"><LoadingSpinner /></CardContent></Card>;
  }

  const revenueData = parseMonthlyData(financials.revenue_data);
  const aggregatedData = aggregateDataByTimeframe(revenueData, timeframe as TF);
  
  const chartData = aggregatedData.map(item => ({
    month: item.month.split(' ')[0],
    actual: item.value,
    forecast: item.value * 1.05 // Simple forecast: 5% growth
  }));
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Revenue Trend & Forecast ({timeframe === 'month' ? 'Monthly' : timeframe === 'quarter' ? 'Quarterly' : 'Yearly'})</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Legend />
            <Line type="monotone" dataKey="actual" stroke={colors[0]} strokeWidth={2} name="Actual" />
            <Line type="monotone" dataKey="forecast" stroke={colors[2]} strokeWidth={2} strokeDasharray="5 5" name="Forecast" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function ExpenseBreakdownChart({ colorPalette = 'banorte-red', business, financials, timeframe = 'month' }: WidgetProps) {
  const colors = getPaletteColors(colorPalette);
  
  if (!financials) {
    return <Card className="h-full flex flex-col"><CardHeader><CardTitle>Expense Breakdown</CardTitle></CardHeader><CardContent className="flex-1 flex items-center justify-center"><LoadingSpinner /></CardContent></Card>;
  }

  const cogsData = parseMonthlyData(financials.cogs_data);
  const opexData = parseMonthlyData(financials.opex_data);
  
  // Aggregate based on timeframe
  const aggregatedCOGS = aggregateDataByTimeframe(cogsData, timeframe as TF);
  const aggregatedOpEx = aggregateDataByTimeframe(opexData, timeframe as TF);
  
  const totalCOGS = aggregatedCOGS.reduce((sum, item) => sum + item.value, 0);
  const totalOpEx = aggregatedOpEx.reduce((sum, item) => sum + item.value, 0);
  
  const expenseBreakdownData = [
    { name: 'Cost of Goods Sold', value: totalCOGS, color: colors[0] },
    { name: 'Operating Expenses', value: totalOpEx, color: colors[1] },
  ];
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Expense Breakdown ({timeframe === 'month' ? 'Monthly' : timeframe === 'quarter' ? 'Quarterly' : 'Yearly'})</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={expenseBreakdownData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry) => `${entry.name}: ${formatCurrency(entry.value)}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {expenseBreakdownData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function BudgetVsActualChart({ colorPalette = 'banorte-red', business, financials, timeframe = 'month' }: WidgetProps) {
  const colors = getPaletteColors(colorPalette);
  
  if (!financials) {
    return <Card className="h-full flex flex-col"><CardHeader><CardTitle>Budget vs Actual</CardTitle></CardHeader><CardContent className="flex-1 flex items-center justify-center"><LoadingSpinner /></CardContent></Card>;
  }

  // Aggregate revenue based on timeframe
  const revenueData = parseMonthlyData(financials.revenue_data);
  const cogsData = parseMonthlyData(financials.cogs_data);
  const opexData = parseMonthlyData(financials.opex_data);
  
  const aggregatedRevenue = aggregateDataByTimeframe(revenueData, timeframe as TF);
  const aggregatedCOGS = aggregateDataByTimeframe(cogsData, timeframe as TF);
  const aggregatedOpEx = aggregateDataByTimeframe(opexData, timeframe as TF);
  
  const totalRevenue = aggregatedRevenue.reduce((sum, item) => sum + item.value, 0);
  const totalCOGS = aggregatedCOGS.reduce((sum, item) => sum + item.value, 0);
  const totalOpEx = aggregatedOpEx.reduce((sum, item) => sum + item.value, 0);

  const budgetData = [
    { category: 'Revenue', budgeted: totalRevenue * 0.95, actual: totalRevenue },
    { category: 'COGS', budgeted: totalRevenue * 0.45, actual: totalCOGS },
    { category: 'OpEx', budgeted: totalRevenue * 0.32, actual: totalOpEx },
  ];
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Budget vs Actual</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={budgetData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis dataKey="category" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Legend />
            <Bar dataKey="budgeted" fill={colors[1]} name="Budgeted" />
            <Bar dataKey="actual" fill={colors[0]} name="Actual" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function KPIScorecardChart({ colorPalette = 'banorte-red', business, financials, timeframe = 'month' }: WidgetProps) {
  const colors = getPaletteColors(colorPalette);
  
  if (!financials) {
    return <Card className="h-full flex flex-col"><CardHeader><CardTitle>KPI Scorecard</CardTitle></CardHeader><CardContent className="flex-1 flex items-center justify-center"><LoadingSpinner /></CardContent></Card>;
  }

  const kpiData = [
    { metric: 'Gross Margin', value: parseFloat(financials.gross_profit_margin.toFixed(2)), target: 60 },
    { metric: 'Net Margin', value: parseFloat(financials.net_profit_margin.toFixed(2)), target: 15 },
    { metric: 'ROA', value: parseFloat(financials.return_on_assets.toFixed(2)), target: 12 },
    { metric: 'ROE', value: parseFloat(financials.return_on_equity.toFixed(2)), target: 20 },
  ];
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Key Performance Indicators</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={kpiData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis type="number" domain={[0, 100]} />
            <YAxis dataKey="metric" type="category" width={120} />
            <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
            <Legend />
            <Bar dataKey="value" fill={colors[0]} name="Actual %" />
            <Bar dataKey="target" fill={colors[4]} name="Target %" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function BurnRateChart({ colorPalette = 'banorte-red', business, financials, timeframe = 'month' }: WidgetProps) {
  const colors = getPaletteColors(colorPalette);
  
  if (!financials) {
    return <Card className="h-full flex flex-col"><CardHeader><CardTitle>Burn Rate</CardTitle></CardHeader><CardContent className="flex-1 flex items-center justify-center"><LoadingSpinner /></CardContent></Card>;
  }

  const expenseData = parseMonthlyData(financials.expense_data);
  const revenueData = parseMonthlyData(financials.revenue_data);
  
  // Aggregate based on timeframe
  const aggregatedExpenses = aggregateDataByTimeframe(expenseData, timeframe as TF);
  const aggregatedRevenue = aggregateDataByTimeframe(revenueData, timeframe as TF);
  
  const burnData = aggregatedExpenses.map((exp, index) => ({
    month: exp.month.split(' ')[0],
    burn: exp.value,
    revenue: aggregatedRevenue[index]?.value || 0,
    netBurn: exp.value - (aggregatedRevenue[index]?.value || 0)
  }));
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Cash Burn Rate ({timeframe === 'month' ? 'Monthly' : timeframe === 'quarter' ? 'Quarterly' : 'Yearly'})</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={burnData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Legend />
            <Line type="monotone" dataKey="burn" stroke={colors[0]} strokeWidth={2} name="Total Expenses" />
            <Line type="monotone" dataKey="revenue" stroke={colors[5]} strokeWidth={2} name="Revenue" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function LiquidityRatiosChart({ colorPalette = 'banorte-red', business, financials, timeframe = 'month' }: WidgetProps) {
  const colors = getPaletteColors(colorPalette);
  
  if (!financials) {
    return <Card className="h-full flex flex-col"><CardHeader><CardTitle>Liquidity Ratios</CardTitle></CardHeader><CardContent className="flex-1 flex items-center justify-center"><LoadingSpinner /></CardContent></Card>;
  }

  const liquidityData = [
    { metric: 'Current Ratio', value: parseFloat(financials.current_ratio.toFixed(2)), benchmark: 1.5 },
    { metric: 'Quick Ratio', value: parseFloat(financials.quick_ratio.toFixed(2)), benchmark: 1.0 },
    { metric: 'Cash Ratio', value: parseFloat(financials.cash_ratio.toFixed(2)), benchmark: 0.5 },
  ];
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Liquidity Ratios</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={liquidityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis dataKey="metric" />
            <YAxis domain={[0, 3]} />
            <Tooltip formatter={(value: number) => value.toFixed(2)} />
            <Legend />
            <Bar dataKey="value" fill={colors[0]} name="Actual" />
            <Bar dataKey="benchmark" fill={colors[4]} name="Benchmark" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function DebtEquityChart({ colorPalette = 'banorte-red', business, financials, timeframe = 'month' }: WidgetProps) {
  const colors = getPaletteColors(colorPalette);
  
  if (!financials) {
    return <Card className="h-full flex flex-col"><CardHeader><CardTitle>Debt Analysis</CardTitle></CardHeader><CardContent className="flex-1 flex items-center justify-center"><LoadingSpinner /></CardContent></Card>;
  }

  const data = [
    { name: 'Total Debt', value: financials.total_debt },
    { name: 'Equity', value: financials.equity },
  ];
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Debt vs Equity</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry) => `${entry.name}: ${formatCurrency(entry.value)}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index * 3]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
          </PieChart>
        </ResponsiveContainer>
        <div className="text-center mt-4">
          <p className="text-sm text-muted-foreground">
            Debt-to-Equity Ratio: <span className="font-bold">{financials.debt_to_equity.toFixed(2)}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function CreditScoreGauge({ colorPalette = 'banorte-red', business, financials, timeframe = 'month' }: WidgetProps) {
  const [creditScore, setCreditScore] = useState<number | null>(null);
  const [creditRating, setCreditRating] = useState<string>('');
  const [isCalculating, setIsCalculating] = useState(true);
  
  useEffect(() => {
    const calculateScore = async () => {
      if (!business || !financials) {
        setIsCalculating(false);
        return;
      }
      
      try {
        setIsCalculating(true);
        
        // Calculate credit score
        const scoreResult = creditScoringService.calculateCreditScore(business, financials);
        setCreditScore(scoreResult.score);
        setCreditRating(creditScoringService.getRating(scoreResult.score));
        
        console.log('Credit Score for', business.name, ':', scoreResult.score);
        console.log('Breakdown:', scoreResult.breakdown);
      } catch (error) {
        console.error('Error calculating credit score:', error);
        setCreditScore(0);
        setCreditRating('Unable to calculate');
      } finally {
        setIsCalculating(false);
      }
    };
    
    calculateScore();
  }, [business, financials]);
  
  if (!business || !financials) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <CardTitle>Credit Score</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <CardTitle>Credit Score</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">
          Creditworthiness assessment
        </p>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col items-center justify-center py-4">
        {isCalculating ? (
          <div className="flex flex-col items-center gap-4">
            <LoadingSpinner size="lg" />
            <p className="text-sm text-muted-foreground">Calculating...</p>
          </div>
        ) : (
          <>
            <Tachometer 
              value={creditScore || 0}
              max={1000}
              size={200}
              showValue={true}
              label="/ 1000"
            />
            
            <div className="mt-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Rating</p>
              <div className={`text-lg ${creditScoringService.getRatingColor(creditScore || 0)}`}>
                {creditRating}
              </div>
            </div>
            
            {creditScore && creditScore >= 550 ? (
              <Alert className="mt-4 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 dark:from-green-950 dark:to-emerald-950">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-xs text-green-900 dark:text-green-100">
                  Strong creditworthiness
                </AlertDescription>
              </Alert>
            ) : creditScore && creditScore >= 400 ? (
              <Alert className="mt-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 dark:from-yellow-950 dark:to-orange-950">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-xs text-yellow-900 dark:text-yellow-100">
                  Moderate credit risk
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="mt-4 bg-gradient-to-r from-red-50 to-pink-50 border-red-200 dark:from-red-950 dark:to-pink-950">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-xs text-red-900 dark:text-red-100">
                  High credit risk
                </AlertDescription>
              </Alert>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
