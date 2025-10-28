import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, ComposedChart, Tooltip, Legend } from "recharts";
import { ColorPalette } from "../../types/widgets";
import { getPaletteColors } from "../../utils/colorPalettes";
import { Business, Financials, MonthlyData, AgingData } from "../../services/businessService";
import { LoadingSpinner } from "../ui/loading-spinner";

interface WidgetProps {
  colorPalette?: ColorPalette;
  business: Business | null;
  financials: Financials | null;
}

// Helper functions
const parseMonthlyData = (jsonString: string): MonthlyData[] => {
  try {
    return JSON.parse(jsonString);
  } catch {
    return [];
  }
};

const parseAgingData = (jsonString: string): AgingData[] => {
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

export function CashflowWaterfallChart({ colorPalette = 'banorte-red', business, financials }: WidgetProps) {
  const colors = getPaletteColors(colorPalette);
  
  if (!financials) {
    return <Card className="h-full flex flex-col"><CardHeader><CardTitle>Cash Flow Waterfall</CardTitle></CardHeader><CardContent className="flex-1 flex items-center justify-center"><LoadingSpinner /></CardContent></Card>;
  }

  const cashflowData = [
    { category: 'Operating CF', value: financials.operating_cash_flow },
    { category: 'Investing CF', value: financials.investing_cash_flow },
    { category: 'Financing CF', value: financials.financing_cash_flow },
    { category: 'Net Change', value: financials.operating_cash_flow + financials.investing_cash_flow + financials.financing_cash_flow },
  ];
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Cash Flow Waterfall</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={cashflowData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis dataKey="category" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Bar dataKey="value" fill={colors[0]}>
              {cashflowData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.value >= 0 ? colors[0] : colors[1]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function ARAgingChart({ colorPalette = 'banorte-red', business, financials }: WidgetProps) {
  const colors = getPaletteColors(colorPalette);
  
  if (!financials) {
    return <Card className="h-full flex flex-col"><CardHeader><CardTitle>AR Aging</CardTitle></CardHeader><CardContent className="flex-1 flex items-center justify-center"><LoadingSpinner /></CardContent></Card>;
  }

  const arAgingData = parseAgingData(financials.ar_aging_data);
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Accounts Receivable Aging</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={arAgingData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis dataKey="category" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Bar dataKey="amount" fill={colors[0]}>
              {arAgingData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function APAgingChart({ colorPalette = 'banorte-red', business, financials }: WidgetProps) {
  const colors = getPaletteColors(colorPalette);
  
  if (!financials) {
    return <Card className="h-full flex flex-col"><CardHeader><CardTitle>AP Aging</CardTitle></CardHeader><CardContent className="flex-1 flex items-center justify-center"><LoadingSpinner /></CardContent></Card>;
  }

  const apAgingData = parseAgingData(financials.ap_aging_data);
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Accounts Payable Aging</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={apAgingData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis dataKey="category" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Bar dataKey="amount" fill={colors[1]}>
              {apAgingData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function CashConversionCycleChart({ colorPalette = 'banorte-red', business, financials }: WidgetProps) {
  const colors = getPaletteColors(colorPalette);
  
  if (!financials) {
    return <Card className="h-full flex flex-col"><CardHeader><CardTitle>Cash Conversion Cycle</CardTitle></CardHeader><CardContent className="flex-1 flex items-center justify-center"><LoadingSpinner /></CardContent></Card>;
  }

  const cashConversionData = [
    { component: 'DSO', days: financials.days_sales_outstanding, description: 'Days Sales Outstanding' },
    { component: 'DIO', days: financials.days_inventory_outstanding, description: 'Days Inventory Outstanding' },
    { component: 'DPO', days: -financials.days_payable_outstanding, description: 'Days Payable Outstanding' },
    { component: 'CCC', days: financials.cash_conversion_cycle, description: 'Cash Conversion Cycle' },
  ];
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Cash Conversion Cycle</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={cashConversionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis dataKey="component" />
            <YAxis label={{ value: 'Days', angle: -90, position: 'insideLeft' }} />
            <Tooltip 
              formatter={(value: number) => `${Math.abs(value)} days`}
              labelFormatter={(label) => cashConversionData.find(d => d.component === label)?.description || label}
            />
            <Bar dataKey="days" fill={colors[0]}>
              {cashConversionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.component === 'CCC' ? colors[2] : colors[index % 2]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function ARCollectionChart({ colorPalette = 'banorte-red', business, financials }: WidgetProps) {
  const colors = getPaletteColors(colorPalette);
  
  if (!financials) {
    return <Card className="h-full flex flex-col"><CardHeader><CardTitle>AR Collection</CardTitle></CardHeader><CardContent className="flex-1 flex items-center justify-center"><LoadingSpinner /></CardContent></Card>;
  }

  const arAgingData = parseAgingData(financials.ar_aging_data);
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Accounts Receivable Collection</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={arAgingData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry) => `${entry.category}: ${formatCurrency(entry.amount)}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="amount"
            >
              {arAgingData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function APPaymentChart({ colorPalette = 'banorte-red', business, financials }: WidgetProps) {
  const colors = getPaletteColors(colorPalette);
  
  if (!financials) {
    return <Card className="h-full flex flex-col"><CardHeader><CardTitle>AP Payment</CardTitle></CardHeader><CardContent className="flex-1 flex items-center justify-center"><LoadingSpinner /></CardContent></Card>;
  }

  const apAgingData = parseAgingData(financials.ap_aging_data);
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Accounts Payable Payment Status</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={apAgingData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry) => `${entry.category}: ${formatCurrency(entry.amount)}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="amount"
            >
              {apAgingData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function FreeCashflowChart({ colorPalette = 'banorte-red', business, financials }: WidgetProps) {
  const colors = getPaletteColors(colorPalette);
  
  if (!financials) {
    return <Card className="h-full flex flex-col"><CardHeader><CardTitle>Free Cash Flow</CardTitle></CardHeader><CardContent className="flex-1 flex items-center justify-center"><LoadingSpinner /></CardContent></Card>;
  }

  // Approximate monthly distribution
  const revenueData = parseMonthlyData(financials.revenue_data);
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.value, 0);
  
  const freeCashflowData = revenueData.map(rev => {
    const operatingCF = (rev.value / totalRevenue) * financials.operating_cash_flow;
    const investingCF = (rev.value / totalRevenue) * financials.investing_cash_flow;
    return {
      month: rev.month.split(' ')[0],
      operating: operatingCF,
      capex: Math.abs(investingCF),
      fcf: operatingCF + investingCF
    };
  });
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Free Cash Flow</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={freeCashflowData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Legend />
            <Bar dataKey="operating" fill={colors[0]} name="Operating CF" />
            <Bar dataKey="capex" fill={colors[1]} name="CapEx" />
            <Line type="monotone" dataKey="fcf" stroke={colors[2]} strokeWidth={3} name="Free Cash Flow" />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function CashRunwayChart({ colorPalette = 'banorte-red', business, financials }: WidgetProps) {
  const colors = getPaletteColors(colorPalette);
  
  if (!financials) {
    return <Card className="h-full flex flex-col"><CardHeader><CardTitle>Cash Runway</CardTitle></CardHeader><CardContent className="flex-1 flex items-center justify-center"><LoadingSpinner /></CardContent></Card>;
  }

  // Calculate runway: Cash / Monthly Burn
  const monthlyBurn = financials.total_expenses / 12;
  const currentRunway = financials.cash_and_equivalents / monthlyBurn;
  
  const cashRunwayData = [
    { scenario: 'Current Burn Rate', months: currentRunway },
    { scenario: 'Optimistic (20% less)', months: financials.cash_and_equivalents / (monthlyBurn * 0.8) },
    { scenario: 'Conservative (20% more)', months: financials.cash_and_equivalents / (monthlyBurn * 1.2) },
  ];
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Cash Runway Analysis</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={cashRunwayData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis type="number" label={{ value: 'Months', position: 'insideBottom', offset: -5 }} />
            <YAxis dataKey="scenario" type="category" width={150} />
            <Tooltip formatter={(value: number) => `${value.toFixed(2)} months`} />
            <Bar dataKey="months" fill={colors[0]}>
              {cashRunwayData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function WorkingCapitalRatioChart({ colorPalette = 'banorte-red', business, financials }: WidgetProps) {
  const colors = getPaletteColors(colorPalette);
  
  if (!financials) {
    return <Card className="h-full flex flex-col"><CardHeader><CardTitle>Working Capital Ratio</CardTitle></CardHeader><CardContent className="flex-1 flex items-center justify-center"><LoadingSpinner /></CardContent></Card>;
  }

  // Create trend data (simulate monthly changes)
  const workingCapitalRatioData = Array.from({ length: 6 }, (_, i) => ({
    month: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
    ratio: financials.current_ratio + (Math.random() - 0.5) * 0.2,
    target: 1.5
  }));
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Working Capital Ratio Trend</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={workingCapitalRatioData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis dataKey="month" />
            <YAxis domain={[0, 3]} />
            <Tooltip formatter={(value: number) => value.toFixed(2)} />
            <Legend />
            <Line type="monotone" dataKey="ratio" stroke={colors[0]} strokeWidth={2} name="Current Ratio" />
            <Line type="monotone" dataKey="target" stroke={colors[1]} strokeWidth={2} strokeDasharray="5 5" name="Target" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
