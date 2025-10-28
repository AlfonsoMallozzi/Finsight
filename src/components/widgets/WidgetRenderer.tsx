import { WidgetType, ColorPalette, Timeframe } from '../../types/widgets';
import { Business, Financials } from '../../services/businessService';
import { 
  RevenueExpenseChart, 
  BalanceSheetOverview, 
  WorkingCapitalWidget, 
  RevenueForecastChart, 
  ExpenseBreakdownChart, 
  BudgetVsActualChart, 
  KPIScorecardChart, 
  BurnRateChart, 
  LiquidityRatiosChart, 
  DebtEquityChart,
  CreditScoreGauge
} from './FinancialWidgets';
import { 
  MarginAnalysisChart, 
  ProfitabilityBreakdown, 
  GrossProfitTrendChart, 
  OperatingExpensesChart, 
  EBITDATrendChart, 
  RevenueMixChart, 
  CostAnalysisChart, 
  ProfitMarginsTrendChart, 
  ROIAnalysisChart 
} from './ProfitabilityWidgets';
import { 
  CashflowWaterfallChart, 
  ARAgingChart, 
  APAgingChart, 
  CashConversionCycleChart, 
  ARCollectionChart, 
  APPaymentChart, 
  FreeCashflowChart, 
  CashRunwayChart, 
  WorkingCapitalRatioChart 
} from './CashflowWidgets';
import { 
  EfficiencyKPIsChart, 
  InventoryTurnoverChart, 
  StockLevelsChart, 
  DeliveryPerformanceChart, 
  ProductionEfficiencyChart, 
  QualityMetricsChart, 
  DowntimeAnalysisChart, 
  ResourceAllocationChart, 
  WarehouseUtilizationChart, 
  InventoryAgingChart, 
  StockValuationChart, 
  ReorderAlertsChart, 
  SupplierPerformanceChart, 
  ShippingCostsChart, 
  DeliveryTimeChart, 
  LogisticsEfficiencyChart 
} from './OperationsWidgets';
import { 
  SalesPerformanceChart, 
  LeadGenerationChart, 
  PipelineFunnelChart, 
  CustomerSegmentsChart, 
  RevenueBySegmentChart, 
  SalesByRegionChart, 
  SalesByProductChart, 
  SalesRepPerformanceChart, 
  QuotaAttainmentChart, 
  WinLossRateChart, 
  DealVelocityChart, 
  ConversionFunnelChart, 
  LeadSourcesChart, 
  CustomerAcquisitionChart, 
  ChurnRateChart, 
  LTVCACChart, 
  NPSScoreChart, 
  CustomerRetentionChart 
} from './SalesWidgets';

interface WidgetRendererProps {
  type: WidgetType;
  colorPalette?: ColorPalette;
  business: Business | null;
  financials: Financials | null;
  timeframe?: Timeframe;
}

export function WidgetRenderer({ type, colorPalette = 'banorte-red', business, financials, timeframe = 'month' }: WidgetRendererProps) {
  switch (type) {
    // Financial Widgets
    case 'revenue-expense-chart':
      return <RevenueExpenseChart colorPalette={colorPalette} business={business} financials={financials} timeframe={timeframe} />;
    case 'balance-sheet-overview':
      return <BalanceSheetOverview colorPalette={colorPalette} business={business} financials={financials} timeframe={timeframe} />;
    case 'working-capital':
      return <WorkingCapitalWidget colorPalette={colorPalette} business={business} financials={financials} timeframe={timeframe} />;
    case 'revenue-forecast':
      return <RevenueForecastChart colorPalette={colorPalette} business={business} financials={financials} timeframe={timeframe} />;
    case 'expense-breakdown':
      return <ExpenseBreakdownChart colorPalette={colorPalette} business={business} financials={financials} timeframe={timeframe} />;
    case 'budget-vs-actual':
      return <BudgetVsActualChart colorPalette={colorPalette} business={business} financials={financials} timeframe={timeframe} />;
    case 'kpi-scorecard':
      return <KPIScorecardChart colorPalette={colorPalette} business={business} financials={financials} timeframe={timeframe} />;
    case 'burn-rate':
      return <BurnRateChart colorPalette={colorPalette} business={business} financials={financials} timeframe={timeframe} />;
    case 'liquidity-ratios':
      return <LiquidityRatiosChart colorPalette={colorPalette} business={business} financials={financials} timeframe={timeframe} />;
    case 'debt-equity':
      return <DebtEquityChart colorPalette={colorPalette} business={business} financials={financials} timeframe={timeframe} />;
    case 'credit-score-gauge':
      return <CreditScoreGauge colorPalette={colorPalette} business={business} financials={financials} timeframe={timeframe} />;

    // Profitability Widgets
    case 'margin-analysis':
      return <MarginAnalysisChart colorPalette={colorPalette} business={business} financials={financials} timeframe={timeframe} />;
    case 'profitability-breakdown':
      return <ProfitabilityBreakdown colorPalette={colorPalette} business={business} financials={financials} timeframe={timeframe} />;
    case 'gross-profit-trend':
      return <GrossProfitTrendChart colorPalette={colorPalette} business={business} financials={financials} timeframe={timeframe} />;
    case 'operating-expenses':
      return <OperatingExpensesChart colorPalette={colorPalette} business={business} financials={financials} timeframe={timeframe} />;
    case 'ebitda-trend':
      return <EBITDATrendChart colorPalette={colorPalette} business={business} financials={financials} timeframe={timeframe} />;
    case 'revenue-mix':
      return <RevenueMixChart colorPalette={colorPalette} business={business} financials={financials} timeframe={timeframe} />;
    case 'cost-analysis':
      return <CostAnalysisChart colorPalette={colorPalette} business={business} financials={financials} timeframe={timeframe} />;
    case 'profit-margins-trend':
      return <ProfitMarginsTrendChart colorPalette={colorPalette} business={business} financials={financials} timeframe={timeframe} />;
    case 'roi-analysis':
      return <ROIAnalysisChart colorPalette={colorPalette} business={business} financials={financials} timeframe={timeframe} />;

    // Cashflow Widgets
    case 'cashflow-waterfall':
      return <CashflowWaterfallChart colorPalette={colorPalette} business={business} financials={financials} timeframe={timeframe} />;
    case 'ar-aging':
      return <ARAgingChart colorPalette={colorPalette} business={business} financials={financials} timeframe={timeframe} />;
    case 'ap-aging':
      return <APAgingChart colorPalette={colorPalette} business={business} financials={financials} timeframe={timeframe} />;
    case 'cash-conversion':
      return <CashConversionCycleChart colorPalette={colorPalette} business={business} financials={financials} timeframe={timeframe} />;
    case 'ar-collection':
      return <ARCollectionChart colorPalette={colorPalette} business={business} financials={financials} timeframe={timeframe} />;
    case 'ap-payment':
      return <APPaymentChart colorPalette={colorPalette} business={business} financials={financials} timeframe={timeframe} />;
    case 'free-cashflow':
      return <FreeCashflowChart colorPalette={colorPalette} business={business} financials={financials} timeframe={timeframe} />;
    case 'cash-runway':
      return <CashRunwayChart colorPalette={colorPalette} business={business} financials={financials} timeframe={timeframe} />;
    case 'working-capital-ratio':
      return <WorkingCapitalRatioChart colorPalette={colorPalette} business={business} financials={financials} timeframe={timeframe} />;

    // Operations/Efficiency Widgets
    case 'efficiency-kpis':
      return <EfficiencyKPIsChart colorPalette={colorPalette} business={business} financials={financials} timeframe={timeframe} />;
    case 'production-efficiency':
      return <ProductionEfficiencyChart colorPalette={colorPalette} business={business} financials={financials} timeframe={timeframe} />;
    case 'quality-metrics':
      return <QualityMetricsChart colorPalette={colorPalette} business={business} financials={financials} timeframe={timeframe} />;
    case 'downtime-analysis':
      return <DowntimeAnalysisChart colorPalette={colorPalette} business={business} financials={financials} timeframe={timeframe} />;
    case 'resource-allocation':
      return <ResourceAllocationChart colorPalette={colorPalette} business={business} financials={financials} timeframe={timeframe} />;
    case 'warehouse-utilization':
      return <WarehouseUtilizationChart colorPalette={colorPalette} business={business} financials={financials} timeframe={timeframe} />;

    // Inventory Widgets
    case 'inventory-turnover':
      return <InventoryTurnoverChart colorPalette={colorPalette} business={business} financials={financials} timeframe={timeframe} />;
    case 'stock-levels':
      return <StockLevelsChart colorPalette={colorPalette} business={business} financials={financials} timeframe={timeframe} />;
    case 'inventory-aging':
      return <InventoryAgingChart colorPalette={colorPalette} business={business} financials={financials} timeframe={timeframe} />;
    case 'stock-valuation':
      return <StockValuationChart colorPalette={colorPalette} business={business} financials={financials} timeframe={timeframe} />;
    case 'reorder-alerts':
      return <ReorderAlertsChart colorPalette={colorPalette} business={business} financials={financials} timeframe={timeframe} />;
    case 'supplier-performance':
      return <SupplierPerformanceChart colorPalette={colorPalette} business={business} financials={financials} timeframe={timeframe} />;

    // Delivery Widgets
    case 'delivery-performance':
      return <DeliveryPerformanceChart colorPalette={colorPalette} business={business} financials={financials} timeframe={timeframe} />;
    case 'shipping-costs':
      return <ShippingCostsChart colorPalette={colorPalette} business={business} financials={financials} timeframe={timeframe} />;
    case 'delivery-time':
      return <DeliveryTimeChart colorPalette={colorPalette} business={business} financials={financials} timeframe={timeframe} />;
    case 'logistics-efficiency':
      return <LogisticsEfficiencyChart colorPalette={colorPalette} business={business} financials={financials} timeframe={timeframe} />;

    // Sales Widgets
    case 'sales-performance':
      return <SalesPerformanceChart colorPalette={colorPalette} business={business} financials={financials} timeframe={timeframe} />;
    case 'lead-generation':
      return <LeadGenerationChart colorPalette={colorPalette} business={business} financials={financials} timeframe={timeframe} />;
    case 'sales-by-region':
      return <SalesByRegionChart colorPalette={colorPalette} business={business} financials={financials} timeframe={timeframe} />;
    case 'sales-by-product':
      return <SalesByProductChart colorPalette={colorPalette} business={business} financials={financials} timeframe={timeframe} />;
    case 'sales-rep-performance':
      return <SalesRepPerformanceChart colorPalette={colorPalette} business={business} financials={financials} timeframe={timeframe} />;
    case 'quota-attainment':
      return <QuotaAttainmentChart colorPalette={colorPalette} business={business} financials={financials} timeframe={timeframe} />;
    case 'win-loss-rate':
      return <WinLossRateChart colorPalette={colorPalette} business={business} financials={financials} timeframe={timeframe} />;

    // Pipeline Widgets
    case 'pipeline-funnel':
      return <PipelineFunnelChart colorPalette={colorPalette} business={business} financials={financials} timeframe={timeframe} />;
    case 'deal-velocity':
      return <DealVelocityChart colorPalette={colorPalette} business={business} financials={financials} timeframe={timeframe} />;
    case 'conversion-funnel':
      return <ConversionFunnelChart colorPalette={colorPalette} business={business} financials={financials} timeframe={timeframe} />;
    case 'lead-sources':
      return <LeadSourcesChart colorPalette={colorPalette} business={business} financials={financials} timeframe={timeframe} />;

    // Customer Widgets
    case 'customer-segments':
      return <CustomerSegmentsChart colorPalette={colorPalette} business={business} financials={financials} timeframe={timeframe} />;
    case 'revenue-by-segment':
      return <RevenueBySegmentChart colorPalette={colorPalette} business={business} financials={financials} timeframe={timeframe} />;
    case 'customer-acquisition':
      return <CustomerAcquisitionChart colorPalette={colorPalette} business={business} financials={financials} timeframe={timeframe} />;
    case 'churn-rate':
      return <ChurnRateChart colorPalette={colorPalette} business={business} financials={financials} timeframe={timeframe} />;
    case 'ltv-cac':
      return <LTVCACChart colorPalette={colorPalette} business={business} financials={financials} timeframe={timeframe} />;
    case 'nps-score':
      return <NPSScoreChart colorPalette={colorPalette} business={business} financials={financials} timeframe={timeframe} />;
    case 'customer-retention':
      return <CustomerRetentionChart colorPalette={colorPalette} business={business} financials={financials} timeframe={timeframe} />;

    default:
      return null;
  }
}
