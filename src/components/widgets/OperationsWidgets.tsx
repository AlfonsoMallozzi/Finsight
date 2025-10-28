import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, LineChart, Line, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
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

export function EfficiencyKPIsChart({ colorPalette = 'banorte-red', business, financials }: WidgetProps) {
  const colors = getPaletteColors(colorPalette);
  
  if (!financials) {
    return <Card className="h-full flex flex-col"><CardHeader><CardTitle>Efficiency KPIs</CardTitle></CardHeader><CardContent className="flex-1 flex items-center justify-center"><p className="text-muted-foreground">Loading data...</p></CardContent></Card>;
  }

  const efficiencyData = [
    { metric: 'Asset Turnover', value: financials.asset_turnover * 50, fullMark: 100 },
    { metric: 'Inventory Turnover', value: Math.min(financials.inventory_turnover * 10, 100), fullMark: 100 },
    { metric: 'Receivables Turnover', value: Math.min(financials.receivables_turnover * 10, 100), fullMark: 100 },
    { metric: 'Working Capital Efficiency', value: Math.min((financials.working_capital / financials.total_revenue) * 500, 100), fullMark: 100 },
  ];
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Operational Efficiency KPIs</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={efficiencyData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" />
            <PolarRadiusAxis angle={90} domain={[0, 100]} />
            <Radar name="Efficiency Score" dataKey="value" stroke={colors[0]} fill={colors[0]} fillOpacity={0.6} />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function InventoryTurnoverChart({ colorPalette = 'banorte-red', business, financials }: WidgetProps) {
  const colors = getPaletteColors(colorPalette);
  
  if (!financials) {
    return <Card className="h-full flex flex-col"><CardHeader><CardTitle>Inventory Turnover</CardTitle></CardHeader><CardContent className="flex-1 flex items-center justify-center"><p className="text-muted-foreground">Loading data...</p></CardContent></Card>;
  }

  // Simulate monthly inventory turnover
  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const inventoryData = months.map(month => ({
    month,
    turnover: financials.inventory_turnover + (Math.random() - 0.5) * 2,
    target: 8.0
  }));
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Inventory Turnover Ratio</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={inventoryData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value: number) => value.toFixed(2)} />
            <Legend />
            <Line type="monotone" dataKey="turnover" stroke={colors[0]} strokeWidth={2} name="Actual Turnover" />
            <Line type="monotone" dataKey="target" stroke={colors[1]} strokeWidth={2} strokeDasharray="5 5" name="Target" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function StockLevelsChart({ colorPalette = 'banorte-red', business, financials }: WidgetProps) {
  const colors = getPaletteColors(colorPalette);
  
  if (!financials) {
    return <Card className="h-full flex flex-col"><CardHeader><CardTitle>Stock Levels</CardTitle></CardHeader><CardContent className="flex-1 flex items-center justify-center"><p className="text-muted-foreground">Loading data...</p></CardContent></Card>;
  }

  // Estimate inventory value from Days Inventory Outstanding
  const inventoryValue = (financials.total_revenue / 365) * financials.days_inventory_outstanding;
  
  const stockData = [
    { category: 'Raw Materials', value: inventoryValue * 0.35, color: colors[0] },
    { category: 'Work in Progress', value: inventoryValue * 0.25, color: colors[1] },
    { category: 'Finished Goods', value: inventoryValue * 0.40, color: colors[2] },
  ];
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Inventory Stock Levels</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={stockData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry) => `${entry.category}: ${formatCurrency(entry.value)}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {stockData.map((entry, index) => (
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

export function DeliveryPerformanceChart({ colorPalette = 'banorte-red', business, financials }: WidgetProps) {
  const colors = getPaletteColors(colorPalette);
  
  if (!financials) {
    return <Card className="h-full flex flex-col"><CardHeader><CardTitle>Delivery Performance</CardTitle></CardHeader><CardContent className="flex-1 flex items-center justify-center"><p className="text-muted-foreground">Loading data...</p></CardContent></Card>;
  }

  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const deliveryData = months.map(month => ({
    month,
    onTime: 85 + Math.random() * 10,
    target: 95
  }));
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>On-Time Delivery Performance</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={deliveryData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis dataKey="month" />
            <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
            <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
            <Legend />
            <Area type="monotone" dataKey="onTime" stroke={colors[0]} fill={colors[0]} name="On-Time %" />
            <Area type="monotone" dataKey="target" stroke={colors[1]} fill={colors[1]} fillOpacity={0.3} name="Target %" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function ProductionEfficiencyChart({ colorPalette = 'banorte-red', business, financials }: WidgetProps) {
  const colors = getPaletteColors(colorPalette);
  
  if (!financials) {
    return <Card className="h-full flex flex-col"><CardHeader><CardTitle>Production Efficiency</CardTitle></CardHeader><CardContent className="flex-1 flex items-center justify-center"><p className="text-muted-foreground">Loading data...</p></CardContent></Card>;
  }

  // Use asset turnover as proxy for production efficiency
  const efficiencyScore = Math.min(financials.asset_turnover * 60, 95);
  
  const efficiencyData = [
    { metric: 'Overall Equipment Effectiveness', value: efficiencyScore },
    { metric: 'Capacity Utilization', value: 78 + Math.random() * 15 },
    { metric: 'Quality Rate', value: 92 + Math.random() * 6 },
  ];
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Production Efficiency Metrics</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={efficiencyData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
            <YAxis dataKey="metric" type="category" width={200} />
            <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
            <Bar dataKey="value" fill={colors[0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function QualityMetricsChart({ colorPalette = 'banorte-red', business, financials }: WidgetProps) {
  const colors = getPaletteColors(colorPalette);
  
  if (!financials) {
    return <Card className="h-full flex flex-col"><CardHeader><CardTitle>Quality Metrics</CardTitle></CardHeader><CardContent className="flex-1 flex items-center justify-center"><p className="text-muted-foreground">Loading data...</p></CardContent></Card>;
  }

  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const qualityData = months.map(month => ({
    month,
    defectRate: 2 + Math.random() * 2,
    returnRate: 1 + Math.random() * 1.5
  }));
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Quality Control Metrics</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={qualityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(value) => `${value}%`} />
            <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
            <Legend />
            <Line type="monotone" dataKey="defectRate" stroke={colors[0]} strokeWidth={2} name="Defect Rate %" />
            <Line type="monotone" dataKey="returnRate" stroke={colors[1]} strokeWidth={2} name="Return Rate %" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function DowntimeAnalysisChart({ colorPalette = 'banorte-red', business, financials }: WidgetProps) {
  const colors = getPaletteColors(colorPalette);
  
  if (!financials) {
    return <Card className="h-full flex flex-col"><CardHeader><CardTitle>Downtime Analysis</CardTitle></CardHeader><CardContent className="flex-1 flex items-center justify-center"><p className="text-muted-foreground">Loading data...</p></CardContent></Card>;
  }

  const downtimeData = [
    { reason: 'Planned Maintenance', hours: 24, color: colors[0] },
    { reason: 'Unplanned Repairs', hours: 12, color: colors[1] },
    { reason: 'Material Shortages', hours: 8, color: colors[2] },
    { reason: 'Other', hours: 6, color: colors[3] },
  ];
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Downtime Analysis (Monthly Hours)</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={downtimeData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry) => `${entry.reason}: ${entry.hours}h`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="hours"
            >
              {downtimeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `${value} hours`} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function ResourceAllocationChart({ colorPalette = 'banorte-red', business, financials }: WidgetProps) {
  const colors = getPaletteColors(colorPalette);
  
  if (!financials) {
    return <Card className="h-full flex flex-col"><CardHeader><CardTitle>Resource Allocation</CardTitle></CardHeader><CardContent className="flex-1 flex items-center justify-center"><p className="text-muted-foreground">Loading data...</p></CardContent></Card>;
  }

  const totalOpEx = parseMonthlyData(financials.opex_data).reduce((sum, item) => sum + item.value, 0);
  
  const resourceData = [
    { resource: 'Labor', allocated: totalOpEx * 0.50, color: colors[0] },
    { resource: 'Equipment', allocated: totalOpEx * 0.25, color: colors[1] },
    { resource: 'Facilities', allocated: totalOpEx * 0.15, color: colors[2] },
    { resource: 'Technology', allocated: totalOpEx * 0.10, color: colors[3] },
  ];
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Resource Allocation</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={resourceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis dataKey="resource" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Bar dataKey="allocated" fill={colors[0]}>
              {resourceData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function WarehouseUtilizationChart({ colorPalette = 'banorte-red', business, financials }: WidgetProps) {
  const colors = getPaletteColors(colorPalette);
  
  if (!financials) {
    return <Card className="h-full flex flex-col"><CardHeader><CardTitle>Warehouse Utilization</CardTitle></CardHeader><CardContent className="flex-1 flex items-center justify-center"><p className="text-muted-foreground">Loading data...</p></CardContent></Card>;
  }

  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const utilizationData = months.map(month => ({
    month,
    utilization: 65 + Math.random() * 20,
    capacity: 100
  }));
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Warehouse Space Utilization</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={utilizationData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis dataKey="month" />
            <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
            <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
            <Legend />
            <Area type="monotone" dataKey="utilization" stroke={colors[0]} fill={colors[0]} name="Utilization %" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function InventoryAgingChart({ colorPalette = 'banorte-red', business, financials }: WidgetProps) {
  const colors = getPaletteColors(colorPalette);
  
  if (!financials) {
    return <Card className="h-full flex flex-col"><CardHeader><CardTitle>Inventory Aging</CardTitle></CardHeader><CardContent className="flex-1 flex items-center justify-center"><p className="text-muted-foreground">Loading data...</p></CardContent></Card>;
  }

  const inventoryValue = (financials.total_revenue / 365) * financials.days_inventory_outstanding;
  
  const agingData = [
    { category: '0-30 days', amount: inventoryValue * 0.45 },
    { category: '31-60 days', amount: inventoryValue * 0.30 },
    { category: '61-90 days', amount: inventoryValue * 0.15 },
    { category: '90+ days', amount: inventoryValue * 0.10 },
  ];
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Inventory Aging</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={agingData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis dataKey="category" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Bar dataKey="amount" fill={colors[0]}>
              {agingData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function StockValuationChart({ colorPalette = 'banorte-red', business, financials }: WidgetProps) {
  const colors = getPaletteColors(colorPalette);
  
  if (!financials) {
    return <Card className="h-full flex flex-col"><CardHeader><CardTitle>Stock Valuation</CardTitle></CardHeader><CardContent className="flex-1 flex items-center justify-center"><p className="text-muted-foreground">Loading data...</p></CardContent></Card>;
  }

  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const inventoryValue = (financials.total_revenue / 365) * financials.days_inventory_outstanding;
  
  const valuationData = months.map(month => ({
    month,
    value: inventoryValue * (0.9 + Math.random() * 0.2)
  }));
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Inventory Valuation Trend</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={valuationData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Line type="monotone" dataKey="value" stroke={colors[0]} strokeWidth={2} name="Inventory Value" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function ReorderAlertsChart({ colorPalette = 'banorte-red', business, financials }: WidgetProps) {
  const colors = getPaletteColors(colorPalette);
  
  if (!financials) {
    return <Card className="h-full flex flex-col"><CardHeader><CardTitle>Reorder Alerts</CardTitle></CardHeader><CardContent className="flex-1 flex items-center justify-center"><p className="text-muted-foreground">Loading data...</p></CardContent></Card>;
  }

  const alertData = [
    { status: 'Critical (Reorder Now)', count: 3, color: colors[1] },
    { status: 'Warning (Low Stock)', count: 8, color: colors[2] },
    { status: 'Normal', count: 45, color: colors[0] },
  ];
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Stock Reorder Status</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={alertData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry) => `${entry.status}: ${entry.count}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
            >
              {alertData.map((entry, index) => (
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

export function SupplierPerformanceChart({ colorPalette = 'banorte-red', business, financials }: WidgetProps) {
  const colors = getPaletteColors(colorPalette);
  
  if (!financials) {
    return <Card className="h-full flex flex-col"><CardHeader><CardTitle>Supplier Performance</CardTitle></CardHeader><CardContent className="flex-1 flex items-center justify-center"><p className="text-muted-foreground">Loading data...</p></CardContent></Card>;
  }

  const supplierData = [
    { supplier: 'Supplier A', onTime: 95, quality: 92, cost: 88 },
    { supplier: 'Supplier B', onTime: 88, quality: 95, cost: 90 },
    { supplier: 'Supplier C', onTime: 92, quality: 89, cost: 93 },
  ];
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Top Supplier Performance</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={supplierData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis dataKey="supplier" />
            <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
            <Tooltip formatter={(value: number) => `${value}%`} />
            <Legend />
            <Bar dataKey="onTime" fill={colors[0]} name="On-Time %" />
            <Bar dataKey="quality" fill={colors[1]} name="Quality %" />
            <Bar dataKey="cost" fill={colors[2]} name="Cost Efficiency %" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function ShippingCostsChart({ colorPalette = 'banorte-red', business, financials }: WidgetProps) {
  const colors = getPaletteColors(colorPalette);
  
  if (!financials) {
    return <Card className="h-full flex flex-col"><CardHeader><CardTitle>Shipping Costs</CardTitle></CardHeader><CardContent className="flex-1 flex items-center justify-center"><p className="text-muted-foreground">Loading data...</p></CardContent></Card>;
  }

  const revenueData = parseMonthlyData(financials.revenue_data);
  const shippingData = revenueData.map(rev => ({
    month: rev.month.split(' ')[0],
    cost: rev.value * 0.05, // Assume 5% shipping cost
    asPercent: 5
  }));
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Shipping & Logistics Costs</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={shippingData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Area type="monotone" dataKey="cost" stroke={colors[0]} fill={colors[0]} name="Shipping Costs" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function DeliveryTimeChart({ colorPalette = 'banorte-red', business, financials }: WidgetProps) {
  const colors = getPaletteColors(colorPalette);
  
  if (!financials) {
    return <Card className="h-full flex flex-col"><CardHeader><CardTitle>Delivery Time</CardTitle></CardHeader><CardContent className="flex-1 flex items-center justify-center"><p className="text-muted-foreground">Loading data...</p></CardContent></Card>;
  }

  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const deliveryData = months.map(month => ({
    month,
    avgDays: 3 + Math.random() * 2,
    target: 3
  }));
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Average Delivery Time</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={deliveryData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis dataKey="month" />
            <YAxis label={{ value: 'Days', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value: number) => `${value.toFixed(2)} days`} />
            <Legend />
            <Line type="monotone" dataKey="avgDays" stroke={colors[0]} strokeWidth={2} name="Avg Delivery Time" />
            <Line type="monotone" dataKey="target" stroke={colors[1]} strokeWidth={2} strokeDasharray="5 5" name="Target" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function LogisticsEfficiencyChart({ colorPalette = 'banorte-red', business, financials }: WidgetProps) {
  const colors = getPaletteColors(colorPalette);
  
  if (!financials) {
    return <Card className="h-full flex flex-col"><CardHeader><CardTitle>Logistics Efficiency</CardTitle></CardHeader><CardContent className="flex-1 flex items-center justify-center"><p className="text-muted-foreground">Loading data...</p></CardContent></Card>;
  }

  const efficiencyMetrics = [
    { metric: 'Route Optimization', score: 85 + Math.random() * 10 },
    { metric: 'Load Utilization', score: 80 + Math.random() * 15 },
    { metric: 'Fuel Efficiency', score: 75 + Math.random() * 15 },
    { metric: 'Time Efficiency', score: 88 + Math.random() * 10 },
  ];
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Logistics Efficiency Metrics</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={efficiencyMetrics} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
            <YAxis dataKey="metric" type="category" width={140} />
            <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
            <Bar dataKey="score" fill={colors[0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
