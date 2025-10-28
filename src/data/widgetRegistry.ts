import { Widget, AnalyticsSection } from '../types/widgets';

export const widgetRegistry: Record<AnalyticsSection, Widget[]> = {
  financial: [
    {
      id: 'w-revenue-expense',
      type: 'revenue-expense-chart',
      title: 'Revenue vs Expenses',
      section: 'financial',
      defaultSize: { cols: 4, rows: 2 },
      minSize: { cols: 2, rows: 2 },
      maxSize: { cols: 4, rows: 3 },
      description: 'Combined view of revenue, expenses, and profit trends'
    },
    {
      id: 'w-balance-sheet',
      type: 'balance-sheet-overview',
      title: 'Balance Sheet Overview',
      section: 'financial',
      defaultSize: { cols: 2, rows: 2 },
      minSize: { cols: 2, rows: 2 },
      maxSize: { cols: 3, rows: 3 },
      description: 'Assets, liabilities, and equity snapshot'
    },
    {
      id: 'w-working-capital',
      type: 'working-capital',
      title: 'Working Capital Trend',
      section: 'financial',
      defaultSize: { cols: 2, rows: 2 },
      minSize: { cols: 2, rows: 2 },
      maxSize: { cols: 4, rows: 2 },
      description: 'Current assets vs current liabilities over time'
    },
    {
      id: 'w-revenue-forecast',
      type: 'revenue-forecast',
      title: 'Revenue Forecast',
      section: 'financial',
      defaultSize: { cols: 3, rows: 2 },
      minSize: { cols: 2, rows: 2 },
      maxSize: { cols: 4, rows: 3 },
      description: 'Projected revenue based on historical trends'
    },
    {
      id: 'w-expense-breakdown',
      type: 'expense-breakdown',
      title: 'Expense Breakdown',
      section: 'financial',
      defaultSize: { cols: 2, rows: 2 },
      minSize: { cols: 2, rows: 2 },
      maxSize: { cols: 3, rows: 2 },
      description: 'Categorized expense distribution'
    },
    {
      id: 'w-budget-vs-actual',
      type: 'budget-vs-actual',
      title: 'Budget vs Actual',
      section: 'financial',
      defaultSize: { cols: 4, rows: 2 },
      minSize: { cols: 2, rows: 2 },
      maxSize: { cols: 4, rows: 3 },
      description: 'Comparison of budgeted vs actual performance'
    },
    {
      id: 'w-kpi-scorecard',
      type: 'kpi-scorecard',
      title: 'Financial KPI Scorecard',
      section: 'financial',
      defaultSize: { cols: 2, rows: 2 },
      minSize: { cols: 2, rows: 2 },
      maxSize: { cols: 2, rows: 3 },
      description: 'Key financial metrics at a glance'
    },
    {
      id: 'w-burn-rate',
      type: 'burn-rate',
      title: 'Burn Rate Analysis',
      section: 'financial',
      defaultSize: { cols: 2, rows: 2 },
      minSize: { cols: 2, rows: 2 },
      maxSize: { cols: 3, rows: 2 },
      description: 'Monthly cash burn and runway calculation'
    },
    {
      id: 'w-liquidity-ratios',
      type: 'liquidity-ratios',
      title: 'Liquidity Ratios',
      section: 'financial',
      defaultSize: { cols: 2, rows: 2 },
      minSize: { cols: 2, rows: 2 },
      maxSize: { cols: 2, rows: 2 },
      description: 'Current ratio, quick ratio, and cash ratio'
    },
    {
      id: 'w-debt-equity',
      type: 'debt-equity',
      title: 'Debt-to-Equity Ratio',
      section: 'financial',
      defaultSize: { cols: 2, rows: 2 },
      minSize: { cols: 2, rows: 2 },
      maxSize: { cols: 3, rows: 2 },
      description: 'Leverage and capital structure analysis'
    },
    {
      id: 'w-credit-score-gauge',
      type: 'credit-score-gauge',
      title: 'Credit Score',
      section: 'financial',
      defaultSize: { cols: 2, rows: 2 },
      minSize: { cols: 2, rows: 2 },
      maxSize: { cols: 2, rows: 2 },
      description: 'Calculated credit score based on financial health'
    }
  ],
  profitability: [
    {
      id: 'w-margin-analysis',
      type: 'margin-analysis',
      title: 'Margin Analysis',
      section: 'profitability',
      defaultSize: { cols: 4, rows: 2 },
      minSize: { cols: 2, rows: 2 },
      maxSize: { cols: 4, rows: 3 },
      description: 'Gross, operating, and net margin trends'
    },
    {
      id: 'w-profit-breakdown',
      type: 'profitability-breakdown',
      title: 'Profitability Breakdown',
      section: 'profitability',
      defaultSize: { cols: 2, rows: 2 },
      allowedSizes: [{ cols: 2, rows: 2 }, { cols: 3, rows: 3 }],
      description: 'Revenue breakdown by product/service category (Pie Chart)'
    },
    {
      id: 'w-gross-profit-trend',
      type: 'gross-profit-trend',
      title: 'Gross Profit Trend',
      section: 'profitability',
      defaultSize: { cols: 3, rows: 2 },
      minSize: { cols: 2, rows: 2 },
      maxSize: { cols: 4, rows: 2 },
      description: 'Gross profit margins over time'
    },
    {
      id: 'w-operating-expenses',
      type: 'operating-expenses',
      title: 'Operating Expenses',
      section: 'profitability',
      defaultSize: { cols: 2, rows: 2 },
      minSize: { cols: 2, rows: 2 },
      maxSize: { cols: 3, rows: 2 },
      description: 'OPEX breakdown and trends'
    },
    {
      id: 'w-ebitda-trend',
      type: 'ebitda-trend',
      title: 'EBITDA Trend',
      section: 'profitability',
      defaultSize: { cols: 3, rows: 2 },
      minSize: { cols: 2, rows: 2 },
      maxSize: { cols: 4, rows: 2 },
      description: 'Earnings before interest, taxes, depreciation, and amortization'
    },
    {
      id: 'w-revenue-mix',
      type: 'revenue-mix',
      title: 'Revenue Mix',
      section: 'profitability',
      defaultSize: { cols: 2, rows: 2 },
      allowedSizes: [{ cols: 2, rows: 2 }, { cols: 3, rows: 3 }],
      description: 'Product/service revenue distribution (Pie Chart)'
    },
    {
      id: 'w-cost-analysis',
      type: 'cost-analysis',
      title: 'Cost Analysis',
      section: 'profitability',
      defaultSize: { cols: 2, rows: 2 },
      minSize: { cols: 2, rows: 2 },
      maxSize: { cols: 3, rows: 2 },
      description: 'Fixed vs variable cost breakdown'
    },
    {
      id: 'w-profit-margins-trend',
      type: 'profit-margins-trend',
      title: 'Profit Margins Trend',
      section: 'profitability',
      defaultSize: { cols: 4, rows: 2 },
      minSize: { cols: 2, rows: 2 },
      maxSize: { cols: 4, rows: 2 },
      description: 'All margin types in a single view'
    },
    {
      id: 'w-roi-analysis',
      type: 'roi-analysis',
      title: 'ROI Analysis',
      section: 'profitability',
      defaultSize: { cols: 2, rows: 2 },
      minSize: { cols: 2, rows: 2 },
      maxSize: { cols: 3, rows: 2 },
      description: 'Return on investment by initiative'
    },
    {
      id: 'w-product-profitability',
      type: 'product-profitability',
      title: 'Product Profitability',
      section: 'profitability',
      defaultSize: { cols: 3, rows: 2 },
      minSize: { cols: 2, rows: 2 },
      maxSize: { cols: 4, rows: 2 },
      description: 'Profitability analysis by product line'
    },
    {
      id: 'w-contribution-margin',
      type: 'contribution-margin',
      title: 'Contribution Margin',
      section: 'profitability',
      defaultSize: { cols: 2, rows: 2 },
      minSize: { cols: 2, rows: 2 },
      maxSize: { cols: 3, rows: 2 },
      description: 'Contribution margin by product/segment'
    },
    {
      id: 'w-break-even-analysis',
      type: 'break-even-analysis',
      title: 'Break-Even Analysis',
      section: 'profitability',
      defaultSize: { cols: 3, rows: 2 },
      minSize: { cols: 2, rows: 2 },
      maxSize: { cols: 4, rows: 2 },
      description: 'Break-even point and margin of safety'
    }
  ],
  cashflow: [
    {
      id: 'w-cashflow-waterfall',
      type: 'cashflow-waterfall',
      title: 'Cash Flow Waterfall',
      section: 'cashflow',
      defaultSize: { cols: 4, rows: 2 },
      minSize: { cols: 3, rows: 2 },
      maxSize: { cols: 4, rows: 3 },
      description: 'Operating, investing, and financing cash flows'
    },
    {
      id: 'w-ar-aging',
      type: 'ar-aging',
      title: 'Accounts Receivable Aging',
      section: 'cashflow',
      defaultSize: { cols: 2, rows: 2 },
      minSize: { cols: 2, rows: 2 },
      maxSize: { cols: 3, rows: 2 },
      description: 'Outstanding invoices by age'
    },
    {
      id: 'w-ap-aging',
      type: 'ap-aging',
      title: 'Accounts Payable Aging',
      section: 'cashflow',
      defaultSize: { cols: 2, rows: 2 },
      minSize: { cols: 2, rows: 2 },
      maxSize: { cols: 3, rows: 2 },
      description: 'Outstanding bills by due date'
    },
    {
      id: 'w-cash-conversion',
      type: 'cash-conversion',
      title: 'Cash Conversion Cycle',
      section: 'cashflow',
      defaultSize: { cols: 3, rows: 2 },
      minSize: { cols: 2, rows: 2 },
      maxSize: { cols: 4, rows: 2 },
      description: 'Days inventory + days receivable - days payable'
    },
    {
      id: 'w-ar-collection',
      type: 'ar-collection',
      title: 'AR Collection Performance',
      section: 'cashflow',
      defaultSize: { cols: 2, rows: 2 },
      minSize: { cols: 2, rows: 2 },
      maxSize: { cols: 3, rows: 2 },
      description: 'Collection efficiency and DSO trends'
    },
    {
      id: 'w-ap-payment',
      type: 'ap-payment',
      title: 'AP Payment Schedule',
      section: 'cashflow',
      defaultSize: { cols: 2, rows: 2 },
      minSize: { cols: 2, rows: 2 },
      maxSize: { cols: 3, rows: 2 },
      description: 'Upcoming payment obligations'
    },
    {
      id: 'w-free-cashflow',
      type: 'free-cashflow',
      title: 'Free Cash Flow',
      section: 'cashflow',
      defaultSize: { cols: 3, rows: 2 },
      minSize: { cols: 2, rows: 2 },
      maxSize: { cols: 4, rows: 2 },
      description: 'Operating cash flow minus capital expenditures'
    },
    {
      id: 'w-cash-runway',
      type: 'cash-runway',
      title: 'Cash Runway',
      section: 'cashflow',
      defaultSize: { cols: 2, rows: 2 },
      minSize: { cols: 2, rows: 2 },
      maxSize: { cols: 3, rows: 2 },
      description: 'Months of runway at current burn rate'
    },
    {
      id: 'w-working-capital-ratio',
      type: 'working-capital-ratio',
      title: 'Working Capital Ratio',
      section: 'cashflow',
      defaultSize: { cols: 2, rows: 2 },
      minSize: { cols: 2, rows: 2 },
      maxSize: { cols: 2, rows: 2 },
      description: 'Current assets to current liabilities ratio'
    },
    {
      id: 'w-cash-position',
      type: 'cash-position',
      title: 'Cash Position',
      section: 'cashflow',
      defaultSize: { cols: 2, rows: 2 },
      minSize: { cols: 2, rows: 2 },
      maxSize: { cols: 3, rows: 2 },
      description: 'Current cash and cash equivalents position'
    },
    {
      id: 'w-operating-cashflow',
      type: 'operating-cashflow',
      title: 'Operating Cash Flow',
      section: 'cashflow',
      defaultSize: { cols: 3, rows: 2 },
      minSize: { cols: 2, rows: 2 },
      maxSize: { cols: 4, rows: 2 },
      description: 'Cash generated from operations'
    },
    {
      id: 'w-days-sales-outstanding',
      type: 'days-sales-outstanding',
      title: 'Days Sales Outstanding',
      section: 'cashflow',
      defaultSize: { cols: 2, rows: 2 },
      minSize: { cols: 2, rows: 2 },
      maxSize: { cols: 3, rows: 2 },
      description: 'Average collection period for receivables'
    }
  ],
  efficiency: [
    {
      id: 'w-efficiency-kpis',
      type: 'efficiency-kpis',
      title: 'Operational KPIs',
      section: 'efficiency',
      defaultSize: { cols: 4, rows: 2 },
      minSize: { cols: 2, rows: 2 },
      maxSize: { cols: 4, rows: 3 },
      description: 'Productivity, utilization, and quality metrics'
    },
    {
      id: 'w-production-efficiency',
      type: 'production-efficiency',
      title: 'Production Efficiency',
      section: 'efficiency',
      defaultSize: { cols: 2, rows: 2 },
      minSize: { cols: 2, rows: 2 },
      maxSize: { cols: 3, rows: 2 },
      description: 'Output per unit of input over time'
    },
    {
      id: 'w-quality-metrics',
      type: 'quality-metrics',
      title: 'Quality Metrics',
      section: 'efficiency',
      defaultSize: { cols: 2, rows: 2 },
      minSize: { cols: 2, rows: 2 },
      maxSize: { cols: 3, rows: 2 },
      description: 'Defect rates, returns, and quality scores'
    },
    {
      id: 'w-downtime-analysis',
      type: 'downtime-analysis',
      title: 'Downtime Analysis',
      section: 'efficiency',
      defaultSize: { cols: 3, rows: 2 },
      minSize: { cols: 2, rows: 2 },
      maxSize: { cols: 4, rows: 2 },
      description: 'Equipment and process downtime tracking'
    },
    {
      id: 'w-resource-allocation',
      type: 'resource-allocation',
      title: 'Resource Allocation',
      section: 'efficiency',
      defaultSize: { cols: 2, rows: 2 },
      minSize: { cols: 2, rows: 2 },
      maxSize: { cols: 3, rows: 2 },
      description: 'Labor and equipment utilization rates'
    },
    {
      id: 'w-warehouse-utilization',
      type: 'warehouse-utilization',
      title: 'Warehouse Utilization',
      section: 'efficiency',
      defaultSize: { cols: 2, rows: 2 },
      minSize: { cols: 2, rows: 2 },
      maxSize: { cols: 3, rows: 2 },
      description: 'Storage space efficiency and optimization'
    }
  ],
  inventory: [
    {
      id: 'w-inventory-turnover',
      type: 'inventory-turnover',
      title: 'Inventory Turnover',
      section: 'inventory',
      defaultSize: { cols: 2, rows: 2 },
      minSize: { cols: 2, rows: 2 },
      maxSize: { cols: 3, rows: 2 },
      description: 'Turnover rates by category'
    },
    {
      id: 'w-stock-levels',
      type: 'stock-levels',
      title: 'Stock Levels',
      section: 'inventory',
      defaultSize: { cols: 2, rows: 2 },
      minSize: { cols: 2, rows: 2 },
      maxSize: { cols: 3, rows: 2 },
      description: 'Current stock levels by category'
    },
    {
      id: 'w-inventory-aging',
      type: 'inventory-aging',
      title: 'Inventory Aging',
      section: 'inventory',
      defaultSize: { cols: 3, rows: 2 },
      minSize: { cols: 2, rows: 2 },
      maxSize: { cols: 4, rows: 2 },
      description: 'Age distribution of inventory items'
    },
    {
      id: 'w-stock-valuation',
      type: 'stock-valuation',
      title: 'Stock Valuation',
      section: 'inventory',
      defaultSize: { cols: 2, rows: 2 },
      minSize: { cols: 2, rows: 2 },
      maxSize: { cols: 3, rows: 2 },
      description: 'Total inventory value and composition'
    },
    {
      id: 'w-reorder-alerts',
      type: 'reorder-alerts',
      title: 'Reorder Alerts',
      section: 'inventory',
      defaultSize: { cols: 2, rows: 2 },
      minSize: { cols: 2, rows: 2 },
      maxSize: { cols: 2, rows: 2 },
      description: 'Items below reorder point'
    },
    {
      id: 'w-supplier-performance',
      type: 'supplier-performance',
      title: 'Supplier Performance',
      section: 'inventory',
      defaultSize: { cols: 3, rows: 2 },
      minSize: { cols: 2, rows: 2 },
      maxSize: { cols: 4, rows: 2 },
      description: 'Lead time, quality, and pricing metrics'
    }
  ],
  delivery: [
    {
      id: 'w-delivery-performance',
      type: 'delivery-performance',
      title: 'Delivery Performance',
      section: 'delivery',
      defaultSize: { cols: 4, rows: 2 },
      minSize: { cols: 2, rows: 2 },
      maxSize: { cols: 4, rows: 3 },
      description: 'On-time, delayed, and early delivery metrics'
    },
    {
      id: 'w-shipping-costs',
      type: 'shipping-costs',
      title: 'Shipping Costs',
      section: 'delivery',
      defaultSize: { cols: 2, rows: 2 },
      minSize: { cols: 2, rows: 2 },
      maxSize: { cols: 3, rows: 2 },
      description: 'Cost per shipment and trends'
    },
    {
      id: 'w-delivery-time',
      type: 'delivery-time',
      title: 'Delivery Time Analysis',
      section: 'delivery',
      defaultSize: { cols: 2, rows: 2 },
      minSize: { cols: 2, rows: 2 },
      maxSize: { cols: 3, rows: 2 },
      description: 'Average delivery times by region'
    },
    {
      id: 'w-logistics-efficiency',
      type: 'logistics-efficiency',
      title: 'Logistics Efficiency',
      section: 'delivery',
      defaultSize: { cols: 3, rows: 2 },
      minSize: { cols: 2, rows: 2 },
      maxSize: { cols: 4, rows: 2 },
      description: 'Route optimization and carrier performance'
    }
  ],
  sales: [
    {
      id: 'w-sales-performance',
      type: 'sales-performance',
      title: 'Sales Performance',
      section: 'sales',
      defaultSize: { cols: 3, rows: 2 },
      minSize: { cols: 2, rows: 2 },
      maxSize: { cols: 4, rows: 2 },
      description: 'Revenue and conversion trends'
    },
    {
      id: 'w-lead-generation',
      type: 'lead-generation',
      title: 'Lead Generation',
      section: 'sales',
      defaultSize: { cols: 2, rows: 2 },
      minSize: { cols: 2, rows: 2 },
      maxSize: { cols: 3, rows: 2 },
      description: 'Lead volume over time'
    },
    {
      id: 'w-sales-by-region',
      type: 'sales-by-region',
      title: 'Sales by Region',
      section: 'sales',
      defaultSize: { cols: 2, rows: 2 },
      minSize: { cols: 2, rows: 2 },
      maxSize: { cols: 3, rows: 2 },
      description: 'Geographic revenue distribution'
    },
    {
      id: 'w-sales-by-product',
      type: 'sales-by-product',
      title: 'Sales by Product',
      section: 'sales',
      defaultSize: { cols: 2, rows: 2 },
      minSize: { cols: 2, rows: 2 },
      maxSize: { cols: 3, rows: 2 },
      description: 'Product performance comparison'
    },
    {
      id: 'w-sales-rep-performance',
      type: 'sales-rep-performance',
      title: 'Sales Rep Performance',
      section: 'sales',
      defaultSize: { cols: 3, rows: 2 },
      minSize: { cols: 2, rows: 2 },
      maxSize: { cols: 4, rows: 2 },
      description: 'Individual rep metrics and rankings'
    },
    {
      id: 'w-quota-attainment',
      type: 'quota-attainment',
      title: 'Quota Attainment',
      section: 'sales',
      defaultSize: { cols: 2, rows: 2 },
      minSize: { cols: 2, rows: 2 },
      maxSize: { cols: 3, rows: 2 },
      description: 'Team quota achievement percentage'
    },
    {
      id: 'w-win-loss-rate',
      type: 'win-loss-rate',
      title: 'Win/Loss Rate',
      section: 'sales',
      defaultSize: { cols: 2, rows: 2 },
      allowedSizes: [{ cols: 2, rows: 2 }, { cols: 3, rows: 3 }],
      description: 'Deal win rates and loss analysis (Pie Chart)'
    },
    {
      id: 'w-win-loss-analysis',
      type: 'win-loss-analysis',
      title: 'Win/Loss Analysis',
      section: 'sales',
      defaultSize: { cols: 3, rows: 2 },
      minSize: { cols: 2, rows: 2 },
      maxSize: { cols: 4, rows: 2 },
      description: 'Detailed win/loss breakdown with reasons'
    }
  ],
  pipeline: [
    {
      id: 'w-pipeline-funnel',
      type: 'pipeline-funnel',
      title: 'Sales Pipeline',
      section: 'pipeline',
      defaultSize: { cols: 3, rows: 2 },
      minSize: { cols: 2, rows: 2 },
      maxSize: { cols: 4, rows: 3 },
      description: 'Pipeline value by stage'
    },
    {
      id: 'w-deal-velocity',
      type: 'deal-velocity',
      title: 'Deal Velocity',
      section: 'pipeline',
      defaultSize: { cols: 2, rows: 2 },
      minSize: { cols: 2, rows: 2 },
      maxSize: { cols: 3, rows: 2 },
      description: 'Average time to close by stage'
    },
    {
      id: 'w-conversion-funnel',
      type: 'conversion-funnel',
      title: 'Conversion Funnel',
      section: 'pipeline',
      defaultSize: { cols: 3, rows: 2 },
      minSize: { cols: 2, rows: 2 },
      maxSize: { cols: 4, rows: 2 },
      description: 'Stage-to-stage conversion rates'
    },
    {
      id: 'w-lead-sources',
      type: 'lead-sources',
      title: 'Lead Sources',
      section: 'pipeline',
      defaultSize: { cols: 2, rows: 2 },
      minSize: { cols: 2, rows: 2 },
      maxSize: { cols: 3, rows: 2 },
      description: 'Lead generation by channel'
    }
  ],
  customers: [
    {
      id: 'w-customer-segments',
      type: 'customer-segments',
      title: 'Customer Segments',
      section: 'customers',
      defaultSize: { cols: 2, rows: 2 },
      allowedSizes: [{ cols: 2, rows: 2 }, { cols: 3, rows: 3 }],
      description: 'Customer distribution by segment (Pie Chart)'
    },
    {
      id: 'w-revenue-by-segment',
      type: 'revenue-by-segment',
      title: 'Revenue by Segment',
      section: 'customers',
      defaultSize: { cols: 2, rows: 2 },
      minSize: { cols: 2, rows: 2 },
      maxSize: { cols: 3, rows: 2 },
      description: 'Revenue breakdown by customer segment'
    },
    {
      id: 'w-customer-acquisition',
      type: 'customer-acquisition',
      title: 'Customer Acquisition',
      section: 'customers',
      defaultSize: { cols: 3, rows: 2 },
      minSize: { cols: 2, rows: 2 },
      maxSize: { cols: 4, rows: 2 },
      description: 'New customer growth trends'
    },
    {
      id: 'w-churn-rate',
      type: 'churn-rate',
      title: 'Churn Rate',
      section: 'customers',
      defaultSize: { cols: 2, rows: 2 },
      minSize: { cols: 2, rows: 2 },
      maxSize: { cols: 3, rows: 2 },
      description: 'Customer retention and churn analysis'
    },
    {
      id: 'w-ltv-cac',
      type: 'ltv-cac',
      title: 'LTV:CAC Ratio',
      section: 'customers',
      defaultSize: { cols: 2, rows: 2 },
      minSize: { cols: 2, rows: 2 },
      maxSize: { cols: 3, rows: 2 },
      description: 'Lifetime value to customer acquisition cost'
    },
    {
      id: 'w-nps-score',
      type: 'nps-score',
      title: 'NPS Score',
      section: 'customers',
      defaultSize: { cols: 2, rows: 2 },
      minSize: { cols: 2, rows: 2 },
      maxSize: { cols: 2, rows: 2 },
      description: 'Net Promoter Score tracking'
    },
    {
      id: 'w-customer-retention',
      type: 'customer-retention',
      title: 'Customer Retention',
      section: 'customers',
      defaultSize: { cols: 3, rows: 2 },
      minSize: { cols: 2, rows: 2 },
      maxSize: { cols: 4, rows: 2 },
      description: 'Cohort-based retention analysis'
    }
  ]
};

export const getWidgetsForSection = (section: AnalyticsSection): Widget[] => {
  return widgetRegistry[section] || [];
};
