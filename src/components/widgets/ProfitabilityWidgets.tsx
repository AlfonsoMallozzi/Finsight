import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, ComposedChart, Tooltip, Legend } from "recharts";
import { ColorPalette, Timeframe } from "../../types/widgets";
import { getPaletteColors } from "../../utils/colorPalettes";
import { Business, Financials, MonthlyData, aggregateDataByTimeframe, Timeframe as TF } from "../../services/businessService";

interface WidgetProps {
  colorPalette?: ColorPalette;
  business: Business | null;
  financials: Financials | null;
  timeframe?: Timeframe;
}

// Helper functions
const parseMonthlyData = (jsonString: string): MonthlyData[] => {
  try {
    return JSON.parse(jsonString);
  } catch {
    return [];
  }
};

const formatCurrency = (value: number) => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(2)}M`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(2)}K`;
  }
  return `$${value.toFixed(2)}`;
};

export function MarginAnalysisChart({ colorPalette = 'banorte-red', business, financials, timeframe = 'month' }: WidgetProps) {
  const colors = getPaletteColors(colorPalette);
  
  if (!financials) {
    return <Card className="h-full flex flex-col"><CardHeader><CardTitle>Margin Analysis</CardTitle></CardHeader><CardContent className="flex-1 flex items-center justify-center"><p className="text-muted-foreground">Loading data...</p></CardContent></Card>;
  }

  const revenueData = parseMonthlyData(financials.revenue_data);
  const cogsData = parseMonthlyData(financials.cogs_data);
  const opexData = parseMonthlyData(financials.opex_data);
  
  // Aggregate based on timeframe
  const aggregatedRevenue = aggregateDataByTimeframe(revenueData, timeframe as TF);
  const aggregatedCOGS = aggregateDataByTimeframe(cogsData, timeframe as TF);
  const aggregatedOpEx = aggregateDataByTimeframe(opexData, timeframe as TF);
  
  const marginData = aggregatedRevenue.map((rev, index) => {
    const cogs = aggregatedCOGS[index]?.value || 0;
    const opex = aggregatedOpEx[index]?.value || 0;
    const grossProfit = rev.value - cogs;
    const netProfit = rev.value - cogs - opex;
    
    return {
      month: rev.month.split(' ')[0],
      grossMargin: parseFloat(((grossProfit / rev.value) * 100).toFixed(2)),
      netMargin: parseFloat(((netProfit / rev.value) * 100).toFixed(2)),
      operatingMargin: parseFloat((((rev.value - cogs - opex) / rev.value) * 100).toFixed(2))
    };
  });
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Margin Analysis ({timeframe === 'month' ? 'Monthly' : timeframe === 'quarter' ? 'Quarterly' : 'Yearly'})</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={marginData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(value) => `${value.toFixed(2)}%`} />
            <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
            <Legend />
            <Line type="monotone" dataKey="grossMargin" stroke={colors[0]} strokeWidth={2} name="Gross Margin %" />
            <Line type="monotone" dataKey="netMargin" stroke={colors[1]} strokeWidth={2} name="Net Margin %" />
            <Line type="monotone" dataKey="operatingMargin" stroke={colors[5]} strokeWidth={2} name="Operating Margin %" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function ProfitabilityBreakdown({ colorPalette = 'banorte-red', business, financials, timeframe = 'month' }: WidgetProps) {
  const colors = getPaletteColors(colorPalette);
  
  if (!financials) {
    return <Card className="h-full flex flex-col"><CardHeader><CardTitle>Profitability Breakdown</CardTitle></CardHeader><CardContent className="flex-1 flex items-center justify-center"><p className="text-muted-foreground">Loading data...</p></CardContent></Card>;
  }

  const data = [
    { metric: 'Gross Margin', value: financials.gross_profit_margin },
    { metric: 'Net Margin', value: financials.net_profit_margin },
    { metric: 'ROA', value: financials.return_on_assets },
    { metric: 'ROE', value: financials.return_on_equity },
  ];
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Profitability Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis type="number" domain={[0, 100]} />
            <YAxis dataKey="metric" type="category" width={100} />
            <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
            <Bar dataKey="value" fill={colors[0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function GrossProfitTrendChart({ colorPalette = 'banorte-red', business, financials }: WidgetProps) {
  const colors = getPaletteColors(colorPalette);
  
  if (!financials) {
    return <Card className="h-full flex flex-col"><CardHeader><CardTitle>Gross Profit Trend</CardTitle></CardHeader><CardContent className="flex-1 flex items-center justify-center"><p className="text-muted-foreground">Loading data...</p></CardContent></Card>;
  }

  const revenueData = parseMonthlyData(financials.revenue_data);
  const cogsData = parseMonthlyData(financials.cogs_data);
  
  const chartData = revenueData.map((rev, index) => {
    const cogs = cogsData[index]?.value || 0;
    return {
      month: rev.month.split(' ')[0],
      revenue: rev.value,
      cogs: cogs,
      grossProfit: rev.value - cogs
    };
  });
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Gross Profit Trend</CardTitle>
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
            <Bar dataKey="cogs" fill={colors[1]} name="COGS" />
            <Line type="monotone" dataKey="grossProfit" stroke={colors[2]} strokeWidth={3} name="Gross Profit" />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function OperatingExpensesChart({ colorPalette = 'banorte-red', business, financials }: WidgetProps) {
  const colors = getPaletteColors(colorPalette);
  
  if (!financials) {
    return <Card className="h-full flex flex-col"><CardHeader><CardTitle>Operating Expenses</CardTitle></CardHeader><CardContent className="flex-1 flex items-center justify-center"><p className="text-muted-foreground">Loading data...</p></CardContent></Card>;
  }

  const opexData = parseMonthlyData(financials.opex_data);
  const revenueData = parseMonthlyData(financials.revenue_data);
  
  const chartData = opexData.map((opex, index) => ({
    month: opex.month.split(' ')[0],
    opex: opex.value,
    revenue: revenueData[index]?.value || 0,
    percentage: ((opex.value / (revenueData[index]?.value || 1)) * 100)
  }));
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Operating Expenses</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" tickFormatter={formatCurrency} />
            <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${value.toFixed(2)}%`} />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="opex" fill={colors[0]} name="Operating Expenses" />
            <Line yAxisId="right" type="monotone" dataKey="percentage" stroke={colors[2]} strokeWidth={2} name="% of Revenue" />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function EBITDATrendChart({ colorPalette = 'banorte-red', business, financials }: WidgetProps) {
  const colors = getPaletteColors(colorPalette);
  
  if (!financials) {
    return <Card className="h-full flex flex-col"><CardHeader><CardTitle>EBITDA Trend</CardTitle></CardHeader><CardContent className="flex-1 flex items-center justify-center"><p className="text-muted-foreground">Loading data...</p></CardContent></Card>;
  }

  const revenueData = parseMonthlyData(financials.revenue_data);
  const expenseData = parseMonthlyData(financials.expense_data);
  
  // Approximate monthly EBITDA (spread annual EBITDA across months proportionally)
  const annualEBITDA = financials.ebitda;
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.value, 0);
  
  const chartData = revenueData.map((rev, index) => {
    const monthlyEBITDA = (rev.value / totalRevenue) * annualEBITDA;
    return {
      month: rev.month.split(' ')[0],
      ebitda: monthlyEBITDA,
      revenue: rev.value,
      margin: (monthlyEBITDA / rev.value) * 100
    };
  });
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>EBITDA Trend</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" tickFormatter={formatCurrency} />
            <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${value.toFixed(2)}%`} />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="ebitda" fill={colors[0]} name="EBITDA" />
            <Line yAxisId="right" type="monotone" dataKey="margin" stroke={colors[2]} strokeWidth={2} name="EBITDA Margin %" />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function RevenueMixChart({ colorPalette = 'banorte-red', business, financials }: WidgetProps) {
  const colors = getPaletteColors(colorPalette);
  
  if (!financials) {
    return <Card className="h-full flex flex-col"><CardHeader><CardTitle>Revenue Mix</CardTitle></CardHeader><CardContent className="flex-1 flex items-center justify-center"><p className="text-muted-foreground">Loading data...</p></CardContent></Card>;
  }

  // For SaaS business, show recurring vs one-time
  const mixData = business?.industry.includes('Technology') || business?.industry.includes('Software')
    ? [
        { name: 'Recurring Revenue', value: financials.monthly_recurring_revenue * 12, color: colors[0] },
        { name: 'One-Time Revenue', value: financials.total_revenue - (financials.monthly_recurring_revenue * 12), color: colors[1] }
      ]
    : [
        { name: 'Product Revenue', value: financials.total_revenue * 0.70, color: colors[0] },
        { name: 'Service Revenue', value: financials.total_revenue * 0.30, color: colors[1] }
      ];
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Revenue Mix</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={mixData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry) => `${entry.name}: ${formatCurrency(entry.value)}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {mixData.map((entry, index) => (
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

export function CostAnalysisChart({ colorPalette = 'banorte-red', business, financials }: WidgetProps) {
  const colors = getPaletteColors(colorPalette);
  
  if (!financials) {
    return <Card className="h-full flex flex-col"><CardHeader><CardTitle>Cost Analysis</CardTitle></CardHeader><CardContent className="flex-1 flex items-center justify-center"><p className="text-muted-foreground">Loading data...</p></CardContent></Card>;
  }

  const cogsData = parseMonthlyData(financials.cogs_data);
  const opexData = parseMonthlyData(financials.opex_data);
  
  const totalCOGS = cogsData.reduce((sum, item) => sum + item.value, 0);
  const totalOpEx = opexData.reduce((sum, item) => sum + item.value, 0);
  
  const costData = [
    { name: 'Cost of Goods Sold', value: totalCOGS, color: colors[0] },
    { name: 'Operating Expenses', value: totalOpEx, color: colors[1] },
  ];
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Cost Structure</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={costData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry) => `${entry.name}: ${formatCurrency(entry.value)}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {costData.map((entry, index) => (
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

export function ProfitMarginsTrendChart({ colorPalette = 'banorte-red', business, financials }: WidgetProps) {
  const colors = getPaletteColors(colorPalette);
  
  if (!financials) {
    return <Card className="h-full flex flex-col"><CardHeader><CardTitle>Profit Margins Trend</CardTitle></CardHeader><CardContent className="flex-1 flex items-center justify-center"><p className="text-muted-foreground">Loading data...</p></CardContent></Card>;
  }

  const revenueData = parseMonthlyData(financials.revenue_data);
  const cogsData = parseMonthlyData(financials.cogs_data);
  const opexData = parseMonthlyData(financials.opex_data);
  
  const chartData = revenueData.map((rev, index) => {
    const cogs = cogsData[index]?.value || 0;
    const opex = opexData[index]?.value || 0;
    const grossProfit = rev.value - cogs;
    const netProfit = rev.value - cogs - opex;
    
    return {
      month: rev.month.split(' ')[0],
      gross: (grossProfit / rev.value) * 100,
      net: (netProfit / rev.value) * 100
    };
  });
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Profit Margins Trend</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(value) => `${value.toFixed(2)}%`} />
            <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
            <Legend />
            <Area type="monotone" dataKey="gross" stackId="1" stroke={colors[0]} fill={colors[0]} name="Gross Margin %" />
            <Area type="monotone" dataKey="net" stackId="2" stroke={colors[1]} fill={colors[1]} name="Net Margin %" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function ROIAnalysisChart({ colorPalette = 'banorte-red', business, financials }: WidgetProps) {
  const colors = getPaletteColors(colorPalette);
  
  if (!financials) {
    return <Card className="h-full flex flex-col"><CardHeader><CardTitle>ROI Analysis</CardTitle></CardHeader><CardContent className="flex-1 flex items-center justify-center"><p className="text-muted-foreground">Loading data...</p></CardContent></Card>;
  }

  const data = [
    { metric: 'ROA (Return on Assets)', value: financials.return_on_assets, benchmark: 12 },
    { metric: 'ROE (Return on Equity)', value: financials.return_on_equity, benchmark: 20 },
    { metric: 'Asset Turnover', value: financials.asset_turnover * 10, benchmark: 15 }, // Scale for visibility
  ];
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Return on Investment Analysis</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis type="number" />
            <YAxis dataKey="metric" type="category" width={180} />
            <Tooltip formatter={(value: number) => value.toFixed(2)} />
            <Legend />
            <Bar dataKey="value" fill={colors[0]} name="Actual" />
            <Bar dataKey="benchmark" fill={colors[1]} name="Industry Benchmark" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function ProfitTrendsChart({ colorPalette = 'banorte-red', business, financials }: WidgetProps) {
  const colors = getPaletteColors(colorPalette);
  
  if (!financials) {
    return <Card className="h-full flex flex-col"><CardHeader><CardTitle>Profit Trends</CardTitle></CardHeader><CardContent className="flex-1 flex items-center justify-center"><p className="text-muted-foreground">Loading data...</p></CardContent></Card>;
  }

  const revenueData = parseMonthlyData(financials.revenue_data);
  const expenseData = parseMonthlyData(financials.expense_data);
  
  const chartData = revenueData.map((rev, index) => ({
    month: rev.month.split(' ')[0],
    profit: rev.value - (expenseData[index]?.value || 0)
  }));
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Monthly Profit Trends</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Area type="monotone" dataKey="profit" stroke={colors[0]} fill={colors[0]} name="Net Profit" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
