export type WidgetType = 
  | 'revenue-expense-chart'
  | 'margin-analysis'
  | 'cashflow-waterfall'
  | 'profitability-breakdown'
  | 'balance-sheet-overview'
  | 'working-capital'
  | 'efficiency-kpis'
  | 'inventory-turnover'
  | 'stock-levels'
  | 'delivery-performance'
  | 'sales-performance'
  | 'lead-generation'
  | 'pipeline-funnel'
  | 'customer-segments'
  | 'revenue-by-segment'
  | 'ar-aging'
  | 'ap-aging'
  | 'cash-conversion'
  | 'revenue-forecast'
  | 'expense-breakdown'
  | 'profit-margins-trend'
  | 'roi-analysis'
  | 'budget-vs-actual'
  | 'kpi-scorecard'
  | 'burn-rate'
  | 'liquidity-ratios'
  | 'debt-equity'
  | 'gross-profit-trend'
  | 'operating-expenses'
  | 'ebitda-trend'
  | 'revenue-mix'
  | 'cost-analysis'
  | 'ar-collection'
  | 'ap-payment'
  | 'free-cashflow'
  | 'cash-runway'
  | 'working-capital-ratio'
  | 'inventory-aging'
  | 'stock-valuation'
  | 'reorder-alerts'
  | 'supplier-performance'
  | 'warehouse-utilization'
  | 'production-efficiency'
  | 'quality-metrics'
  | 'downtime-analysis'
  | 'resource-allocation'
  | 'shipping-costs'
  | 'delivery-time'
  | 'logistics-efficiency'
  | 'sales-by-region'
  | 'sales-by-product'
  | 'sales-rep-performance'
  | 'quota-attainment'
  | 'win-loss-rate'
  | 'deal-velocity'
  | 'conversion-funnel'
  | 'lead-sources'
  | 'customer-acquisition'
  | 'churn-rate'
  | 'ltv-cac'
  | 'nps-score'
  | 'customer-retention'
  | 'product-profitability'
  | 'contribution-margin'
  | 'break-even-analysis'
  | 'cash-position'
  | 'operating-cashflow'
  | 'days-sales-outstanding'
  | 'win-loss-analysis'
  | 'credit-score-gauge';

export type AnalyticsSection = 
  | 'financial'
  | 'profitability'
  | 'cashflow'
  | 'efficiency'
  | 'inventory'
  | 'delivery'
  | 'sales'
  | 'pipeline'
  | 'customers';

export interface GridSize {
  cols: number; // width in grid columns
  rows: number; // height in grid rows
}

export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  section: AnalyticsSection;
  defaultSize: GridSize;
  description: string;
  minSize?: GridSize;
  maxSize?: GridSize;
  allowedSizes?: GridSize[]; // For widgets that should only allow specific sizes (e.g., pie charts must be square)
}

export type ColorPalette = 'banorte-red' | 'sunset-orange' | 'royal-purple' | 'amber-gold' | 'rose-pink' | 'slate-gray';

export type Timeframe = 'month' | 'quarter' | 'year';

export interface WidgetInstance {
  id: string;
  widgetType: WidgetType;
  position: number;
  size: GridSize;
  gridPosition?: { x: number; y: number }; // Grid coordinates for placement
  colorPalette?: ColorPalette; // Color scheme for the widget
}

export interface WidgetLayout {
  [section: string]: WidgetInstance[];
}
