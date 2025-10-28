import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, LineChart, Line, AreaChart, Area, FunnelChart, Funnel, LabelList, PieChart, Pie, Cell, RadialBarChart, RadialBar, Tooltip, Legend } from "recharts";
import { ColorPalette } from "../../types/widgets";
import { getPaletteColors } from "../../utils/colorPalettes";
import { Business, Financials, MonthlyData } from "../../services/businessService";

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

const formatCurrency = (value: number) => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(2)}M`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(2)}K`;
  }
  return `$${value.toFixed(2)}`;
};

export function SalesPerformanceChart({ colorPalette = 'banorte-red', business, financials }: WidgetProps) {
  const colors = getPaletteColors(colorPalette);
  
  if (!financials) {
    return <Card className="h-full flex flex-col"><CardHeader><CardTitle>Sales Performance</CardTitle></CardHeader><CardContent className="flex-1 flex items-center justify-center"><p className="text-muted-foreground">Loading data...</p></CardContent></Card>;
  }

  const revenueData = parseMonthlyData(financials.revenue_data);
  const salesData = revenueData.map((rev, index) => {
    const target = rev.value * 0.95; // Target is 95% of actual
    return {
      month: rev.month.split(' ')[0],
      actual: rev.value,
      target: target,
      growth: index > 0 ? ((rev.value - revenueData[index - 1].value) / revenueData[index - 1].value) * 100 : 0
    };
  });
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Sales Performance</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Legend />
            <Bar dataKey="actual" fill={colors[0]} name="Actual Sales" />
            <Bar dataKey="target" fill={colors[1]} name="Target" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function LeadGenerationChart({ colorPalette = 'banorte-red', business, financials }: WidgetProps) {
  const colors = getPaletteColors(colorPalette);
  
  if (!financials) {
    return <Card className="h-full flex flex-col"><CardHeader><CardTitle>Lead Generation</CardTitle></CardHeader><CardContent className="flex-1 flex items-center justify-center"><p className="text-muted-foreground">Loading data...</p></CardContent></Card>;
  }

  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  // Estimate leads based on CAC and revenue
  const avgLeadsPerMonth = (financials.total_revenue / 12) / financials.customer_acquisition_cost;
  
  const leadData = months.map(month => ({
    month,
    leads: Math.round(avgLeadsPerMonth * (0.8 + Math.random() * 0.4)),
    qualified: Math.round(avgLeadsPerMonth * 0.6 * (0.8 + Math.random() * 0.4))
  }));
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Lead Generation Trends</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={leadData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="leads" stackId="1" stroke={colors[0]} fill={colors[0]} name="Total Leads" />
            <Area type="monotone" dataKey="qualified" stackId="2" stroke={colors[1]} fill={colors[1]} name="Qualified Leads" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function PipelineFunnelChart({ colorPalette = 'banorte-red', business, financials }: WidgetProps) {
  const colors = getPaletteColors(colorPalette);
  
  if (!financials) {
    return <Card className="h-full flex flex-col"><CardHeader><CardTitle>Sales Pipeline</CardTitle></CardHeader><CardContent className="flex-1 flex items-center justify-center"><p className="text-muted-foreground">Loading data...</p></CardContent></Card>;
  }

  const pipelineData = [
    { stage: 'Leads', value: 500, fill: colors[0] },
    { stage: 'Qualified', value: 300, fill: colors[1] },
    { stage: 'Proposal', value: 150, fill: colors[2] },
    { stage: 'Negotiation', value: 80, fill: colors[3] },
    { stage: 'Closed Won', value: 45, fill: colors[4] },
  ];
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Sales Pipeline Funnel</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={pipelineData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis type="number" />
            <YAxis dataKey="stage" type="category" width={100} />
            <Tooltip />
            <Bar dataKey="value" fill={colors[0]}>
              {pipelineData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function CustomerSegmentsChart({ colorPalette = 'banorte-red', business, financials }: WidgetProps) {
  const colors = getPaletteColors(colorPalette);
  
  if (!financials) {
    return <Card className="h-full flex flex-col"><CardHeader><CardTitle>Customer Segments</CardTitle></CardHeader><CardContent className="flex-1 flex items-center justify-center"><p className="text-muted-foreground">Loading data...</p></CardContent></Card>;
  }

  const segmentData = [
    { segment: 'Enterprise', customers: 12, revenue: financials.total_revenue * 0.45, color: colors[0] },
    { segment: 'Mid-Market', customers: 35, revenue: financials.total_revenue * 0.35, color: colors[1] },
    { segment: 'Small Business', customers: 88, revenue: financials.total_revenue * 0.20, color: colors[2] },
  ];
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Customer Segments</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={segmentData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry) => `${entry.segment}: ${entry.customers}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="customers"
            >
              {segmentData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function RevenueBySegmentChart({ colorPalette = 'banorte-red', business, financials }: WidgetProps) {
  const colors = getPaletteColors(colorPalette);
  
  if (!financials) {
    return <Card className="h-full flex flex-col"><CardHeader><CardTitle>Revenue by Segment</CardTitle></CardHeader><CardContent className="flex-1 flex items-center justify-center"><p className="text-muted-foreground">Loading data...</p></CardContent></Card>;
  }

  const segmentRevenue = [
    { segment: 'Enterprise', revenue: financials.total_revenue * 0.45 },
    { segment: 'Mid-Market', revenue: financials.total_revenue * 0.35 },
    { segment: 'Small Business', revenue: financials.total_revenue * 0.20 },
  ];
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Revenue by Customer Segment</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={segmentRevenue}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis dataKey="segment" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Bar dataKey="revenue" fill={colors[0]}>
              {segmentRevenue.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function SalesByRegionChart({ colorPalette = 'banorte-red', business, financials }: WidgetProps) {
  const colors = getPaletteColors(colorPalette);
  
  if (!financials) {
    return <Card className="h-full flex flex-col"><CardHeader><CardTitle>Sales by Region</CardTitle></CardHeader><CardContent className="flex-1 flex items-center justify-center"><p className="text-muted-foreground">Loading data...</p></CardContent></Card>;
  }

  const regionData = [
    { region: 'North', sales: financials.total_revenue * 0.35, color: colors[0] },
    { region: 'South', sales: financials.total_revenue * 0.25, color: colors[1] },
    { region: 'East', sales: financials.total_revenue * 0.22, color: colors[2] },
    { region: 'West', sales: financials.total_revenue * 0.18, color: colors[3] },
  ];
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Sales by Geographic Region</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={regionData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry) => `${entry.region}: ${formatCurrency(entry.sales)}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="sales"
            >
              {regionData.map((entry, index) => (
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

export function SalesByProductChart({ colorPalette = 'banorte-red', business, financials }: WidgetProps) {
  const colors = getPaletteColors(colorPalette);
  
  if (!financials) {
    return <Card className="h-full flex flex-col"><CardHeader><CardTitle>Sales by Product</CardTitle></CardHeader><CardContent className="flex-1 flex items-center justify-center"><p className="text-muted-foreground">Loading data...</p></CardContent></Card>;
  }

  const productData = [
    { product: 'Product A', sales: financials.total_revenue * 0.40 },
    { product: 'Product B', sales: financials.total_revenue * 0.30 },
    { product: 'Product C', sales: financials.total_revenue * 0.20 },
    { product: 'Product D', sales: financials.total_revenue * 0.10 },
  ];
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Sales by Product Line</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={productData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis type="number" tickFormatter={formatCurrency} />
            <YAxis dataKey="product" type="category" width={80} />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Bar dataKey="sales" fill={colors[0]}>
              {productData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function SalesRepPerformanceChart({ colorPalette = 'banorte-red', business, financials }: WidgetProps) {
  const colors = getPaletteColors(colorPalette);
  
  if (!financials) {
    return <Card className="h-full flex flex-col"><CardHeader><CardTitle>Sales Rep Performance</CardTitle></CardHeader><CardContent className="flex-1 flex items-center justify-center"><p className="text-muted-foreground">Loading data...</p></CardContent></Card>;
  }

  const avgPerRep = financials.total_revenue / Math.max(business?.employees || 1, 5);
  const repData = [
    { rep: 'Rep A', sales: avgPerRep * 1.2, quota: avgPerRep },
    { rep: 'Rep B', sales: avgPerRep * 1.05, quota: avgPerRep },
    { rep: 'Rep C', sales: avgPerRep * 0.95, quota: avgPerRep },
    { rep: 'Rep D', sales: avgPerRep * 0.88, quota: avgPerRep },
  ];
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Top Sales Rep Performance</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={repData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis dataKey="rep" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Legend />
            <Bar dataKey="sales" fill={colors[0]} name="Actual Sales" />
            <Bar dataKey="quota" fill={colors[1]} name="Quota" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function QuotaAttainmentChart({ colorPalette = 'banorte-red', business, financials }: WidgetProps) {
  const colors = getPaletteColors(colorPalette);
  
  if (!financials) {
    return <Card className="h-full flex flex-col"><CardHeader><CardTitle>Quota Attainment</CardTitle></CardHeader><CardContent className="flex-1 flex items-center justify-center"><p className="text-muted-foreground">Loading data...</p></CardContent></Card>;
  }

  const revenueData = parseMonthlyData(financials.revenue_data);
  const quotaData = revenueData.map(rev => {
    const quota = rev.value * 0.95;
    return {
      month: rev.month.split(' ')[0],
      attainment: (rev.value / quota) * 100,
      target: 100
    };
  });
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Monthly Quota Attainment</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={quotaData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(value) => `${value}%`} domain={[0, 120]} />
            <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
            <Legend />
            <Line type="monotone" dataKey="attainment" stroke={colors[0]} strokeWidth={2} name="Attainment %" />
            <Line type="monotone" dataKey="target" stroke={colors[1]} strokeWidth={2} strokeDasharray="5 5" name="Target 100%" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function WinLossRateChart({ colorPalette = 'banorte-red', business, financials }: WidgetProps) {
  const colors = getPaletteColors(colorPalette);
  
  if (!financials) {
    return <Card className="h-full flex flex-col"><CardHeader><CardTitle>Win/Loss Rate</CardTitle></CardHeader><CardContent className="flex-1 flex items-center justify-center"><p className="text-muted-foreground">Loading data...</p></CardContent></Card>;
  }

  const winLossData = [
    { outcome: 'Won', count: 45, color: colors[0] },
    { outcome: 'Lost', count: 28, color: colors[1] },
    { outcome: 'In Progress', count: 35, color: colors[2] },
  ];
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Deal Win/Loss Analysis</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={winLossData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry) => `${entry.outcome}: ${entry.count}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
            >
              {winLossData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function DealVelocityChart({ colorPalette = 'banorte-red', business, financials }: WidgetProps) {
  const colors = getPaletteColors(colorPalette);
  
  if (!financials) {
    return <Card className="h-full flex flex-col"><CardHeader><CardTitle>Deal Velocity</CardTitle></CardHeader><CardContent className="flex-1 flex items-center justify-center"><p className="text-muted-foreground">Loading data...</p></CardContent></Card>;
  }

  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const velocityData = months.map(month => ({
    month,
    avgDays: 45 + Math.random() * 20,
    target: 45
  }));
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Average Deal Cycle Time</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={velocityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis dataKey="month" />
            <YAxis label={{ value: 'Days', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value: number) => `${value.toFixed(2)} days`} />
            <Legend />
            <Line type="monotone" dataKey="avgDays" stroke={colors[0]} strokeWidth={2} name="Avg Cycle Time" />
            <Line type="monotone" dataKey="target" stroke={colors[1]} strokeWidth={2} strokeDasharray="5 5" name="Target" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function ConversionFunnelChart({ colorPalette = 'banorte-red', business, financials }: WidgetProps) {
  const colors = getPaletteColors(colorPalette);
  
  if (!financials) {
    return <Card className="h-full flex flex-col"><CardHeader><CardTitle>Conversion Funnel</CardTitle></CardHeader><CardContent className="flex-1 flex items-center justify-center"><p className="text-muted-foreground">Loading data...</p></CardContent></Card>;
  }

  const conversionData = [
    { stage: 'Visitors', count: 10000, rate: 100 },
    { stage: 'Leads', count: 500, rate: 5 },
    { stage: 'Qualified', count: 300, rate: 3 },
    { stage: 'Proposal', count: 150, rate: 1.5 },
    { stage: 'Customers', count: 45, rate: 0.45 },
  ];
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Marketing to Sales Conversion</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={conversionData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis type="number" />
            <YAxis dataKey="stage" type="category" width={100} />
            <Tooltip />
            <Bar dataKey="count" fill={colors[0]}>
              {conversionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function LeadSourcesChart({ colorPalette = 'banorte-red', business, financials }: WidgetProps) {
  const colors = getPaletteColors(colorPalette);
  
  if (!financials) {
    return <Card className="h-full flex flex-col"><CardHeader><CardTitle>Lead Sources</CardTitle></CardHeader><CardContent className="flex-1 flex items-center justify-center"><p className="text-muted-foreground">Loading data...</p></CardContent></Card>;
  }

  const sourceData = [
    { source: 'Organic Search', leads: 180, color: colors[0] },
    { source: 'Paid Ads', leads: 125, color: colors[1] },
    { source: 'Referrals', leads: 95, color: colors[2] },
    { source: 'Social Media', leads: 65, color: colors[3] },
    { source: 'Email', leads: 35, color: colors[4] },
  ];
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Lead Sources Distribution</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={sourceData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry) => `${entry.source}: ${entry.leads}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="leads"
            >
              {sourceData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function CustomerAcquisitionChart({ colorPalette = 'banorte-red', business, financials }: WidgetProps) {
  const colors = getPaletteColors(colorPalette);
  
  if (!financials) {
    return <Card className="h-full flex flex-col"><CardHeader><CardTitle>Customer Acquisition</CardTitle></CardHeader><CardContent className="flex-1 flex items-center justify-center"><p className="text-muted-foreground">Loading data...</p></CardContent></Card>;
  }

  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const acquisitionData = months.map(month => ({
    month,
    newCustomers: 5 + Math.round(Math.random() * 10),
    churn: 1 + Math.round(Math.random() * 3)
  }));
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Customer Acquisition vs Churn</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={acquisitionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="newCustomers" fill={colors[0]} name="New Customers" />
            <Bar dataKey="churn" fill={colors[1]} name="Churned" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function ChurnRateChart({ colorPalette = 'banorte-red', business, financials }: WidgetProps) {
  const colors = getPaletteColors(colorPalette);
  
  if (!financials) {
    return <Card className="h-full flex flex-col"><CardHeader><CardTitle>Churn Rate</CardTitle></CardHeader><CardContent className="flex-1 flex items-center justify-center"><p className="text-muted-foreground">Loading data...</p></CardContent></Card>;
  }

  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const churnData = months.map(month => ({
    month,
    churnRate: 2 + Math.random() * 3,
    target: 3
  }));
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Monthly Churn Rate</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={churnData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(value) => `${value}%`} />
            <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
            <Legend />
            <Line type="monotone" dataKey="churnRate" stroke={colors[0]} strokeWidth={2} name="Churn Rate %" />
            <Line type="monotone" dataKey="target" stroke={colors[1]} strokeWidth={2} strokeDasharray="5 5" name="Target %" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function LTVCACChart({ colorPalette = 'banorte-red', business, financials }: WidgetProps) {
  const colors = getPaletteColors(colorPalette);
  
  if (!financials) {
    return <Card className="h-full flex flex-col"><CardHeader><CardTitle>LTV:CAC Ratio</CardTitle></CardHeader><CardContent className="flex-1 flex items-center justify-center"><p className="text-muted-foreground">Loading data...</p></CardContent></Card>;
  }

  const ratio = financials.customer_lifetime_value / financials.customer_acquisition_cost;
  
  const ltvCacData = [
    { metric: 'Customer LTV', value: financials.customer_lifetime_value },
    { metric: 'Customer CAC', value: financials.customer_acquisition_cost },
  ];
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Customer LTV vs CAC</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={ltvCacData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis dataKey="metric" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Bar dataKey="value" fill={colors[0]}>
              {ltvCacData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="text-center mt-4">
          <p className="text-sm text-muted-foreground">
            LTV:CAC Ratio: <span className="font-bold text-lg">{ratio.toFixed(2)}:1</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function NPSScoreChart({ colorPalette = 'banorte-red', business, financials }: WidgetProps) {
  const colors = getPaletteColors(colorPalette);
  
  if (!financials) {
    return <Card className="h-full flex flex-col"><CardHeader><CardTitle>NPS Score</CardTitle></CardHeader><CardContent className="flex-1 flex items-center justify-center"><p className="text-muted-foreground">Loading data...</p></CardContent></Card>;
  }

  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const npsData = months.map(month => ({
    month,
    nps: 45 + Math.random() * 20,
    target: 50
  }));
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Net Promoter Score (NPS)</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={npsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis dataKey="month" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="nps" stroke={colors[0]} fill={colors[0]} name="NPS Score" />
            <Area type="monotone" dataKey="target" stroke={colors[1]} fill={colors[1]} fillOpacity={0.3} name="Target" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function CustomerRetentionChart({ colorPalette = 'banorte-red', business, financials }: WidgetProps) {
  const colors = getPaletteColors(colorPalette);
  
  if (!financials) {
    return <Card className="h-full flex flex-col"><CardHeader><CardTitle>Customer Retention</CardTitle></CardHeader><CardContent className="flex-1 flex items-center justify-center"><p className="text-muted-foreground">Loading data...</p></CardContent></Card>;
  }

  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const retentionData = months.map(month => ({
    month,
    retention: 92 + Math.random() * 6,
    target: 95
  }));
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Customer Retention Rate</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={retentionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis dataKey="month" />
            <YAxis domain={[85, 100]} tickFormatter={(value) => `${value}%`} />
            <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
            <Legend />
            <Line type="monotone" dataKey="retention" stroke={colors[0]} strokeWidth={2} name="Retention Rate %" />
            <Line type="monotone" dataKey="target" stroke={colors[1]} strokeWidth={2} strokeDasharray="5 5" name="Target %" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
