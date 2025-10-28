import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger(console.log));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Helper function to generate monthly data with realistic trends
const generateMonthlyData = (baseValue: number, trend: number, volatility: number = 0.1) => {
  const months = ['Nov 2024', 'Dec 2024', 'Jan 2025', 'Feb 2025', 'Mar 2025', 'Apr 2025', 
                  'May 2025', 'Jun 2025', 'Jul 2025', 'Aug 2025', 'Sep 2025', 'Oct 2025'];
  
  return months.map((month, index) => {
    const growth = (trend / 12) * index; // Linear growth over year
    const randomness = (Math.random() - 0.5) * 2 * volatility * baseValue; // Random variation
    const value = Math.round(baseValue * (1 + growth) + randomness);
    return { month, value };
  });
};

// Initialize database with realistic business data
app.post('/make-server-5bcce886/init-database', async (c) => {
  try {
    console.log('Initializing database with comprehensive business data...');

    // ==================== BUSINESS 1: TechStart Solutions Inc. ====================
    // Low Risk - Excellent financials (Target: 750+ score)
    const biz1_annual_revenue = 2500000;
    const biz1_monthly_base = biz1_annual_revenue / 12; // ~208K per month
    
    // Generate monthly revenue with 25% annual growth (very strong)
    const biz1_revenue_monthly = generateMonthlyData(biz1_monthly_base, 0.25, 0.05);
    
    // COGS is 35% of revenue (excellent margins)
    const biz1_cogs_monthly = biz1_revenue_monthly.map(r => ({
      month: r.month,
      value: Math.round(r.value * 0.35)
    }));
    
    // Operating expenses (salaries, rent, marketing, etc.) - 30% of revenue
    const biz1_opex_monthly = biz1_revenue_monthly.map(r => ({
      month: r.month,
      value: Math.round(r.value * 0.30)
    }));
    
    // Total expenses = COGS + OpEx
    const biz1_total_expenses = biz1_revenue_monthly.map((r, i) => ({
      month: r.month,
      value: biz1_cogs_monthly[i].value + biz1_opex_monthly[i].value
    }));
    
    // Calculate totals
    const biz1_total_revenue = biz1_revenue_monthly.reduce((sum, m) => sum + m.value, 0);
    const biz1_total_cogs = biz1_cogs_monthly.reduce((sum, m) => sum + m.value, 0);
    const biz1_total_opex = biz1_opex_monthly.reduce((sum, m) => sum + m.value, 0);
    const biz1_gross_profit = biz1_total_revenue - biz1_total_cogs;
    const biz1_net_profit = biz1_total_revenue - biz1_total_cogs - biz1_total_opex;
    
    const business1 = {
      id: 'biz-001',
      name: 'TechStart Solutions Inc.',
      industry: 'Technology & Software',
      request_date: '2025-10-15',
      credit_amount: 500000,
      revenue: biz1_total_revenue,
      employees: 18,
      status: 'under-review',
      risk_level: 'low',
      founded: '2020',
      address: '123 Innovation Drive, Monterrey, NL',
      phone: '+52 81 1234 5678',
      email: 'contact@techstart.mx',
      description: 'Software development company specializing in enterprise solutions for manufacturing and logistics sectors.',
      debt_service_coverage: 3.2,
      current_ratio: 2.4,
      debt_to_equity: 0.5,
      credit_score: 750, // Green range - HARDCODED
      years_in_business: 5,
      profit_margin: (biz1_net_profit / biz1_total_revenue) * 100,
      owner_name: 'Carlos Hernández',
      owner_experience: 15
    };

    // Balance Sheet - Excellent ratios
    const biz1_assets = 1850000;
    const biz1_current_assets = 850000; // Increased for better liquidity
    const biz1_liabilities = 620000; // Decreased for lower leverage
    const biz1_current_liabilities = 350000; // Better current ratio
    const biz1_equity = biz1_assets - biz1_liabilities;
    
    const business1Financials = {
      business_id: 'biz-001',
      
      // Monthly Revenue & Expenses
      revenue_data: JSON.stringify(biz1_revenue_monthly),
      expense_data: JSON.stringify(biz1_total_expenses),
      cogs_data: JSON.stringify(biz1_cogs_monthly),
      opex_data: JSON.stringify(biz1_opex_monthly),
      
      // Calculated from monthly data
      total_revenue: biz1_total_revenue,
      total_expenses: biz1_total_cogs + biz1_total_opex,
      gross_profit: biz1_gross_profit,
      net_profit: biz1_net_profit,
      
      // Balance Sheet
      assets: biz1_assets,
      liabilities: biz1_liabilities,
      equity: biz1_equity,
      current_assets: biz1_current_assets,
      current_liabilities: biz1_current_liabilities,
      
      // Cash Flow - Very strong
      operating_cash_flow: 680000, // Much higher for better cash flow score
      investing_cash_flow: -125000,
      financing_cash_flow: -85000,
      cash_and_equivalents: 425000, // Higher cash reserves
      
      // Profitability Ratios (calculated)
      gross_profit_margin: (biz1_gross_profit / biz1_total_revenue) * 100,
      net_profit_margin: (biz1_net_profit / biz1_total_revenue) * 100,
      return_on_assets: (biz1_net_profit / biz1_assets) * 100,
      return_on_equity: (biz1_net_profit / biz1_equity) * 100,
      
      // Efficiency Ratios
      asset_turnover: biz1_total_revenue / biz1_assets,
      inventory_turnover: 8.5,
      receivables_turnover: 9.2,
      
      // Liquidity Ratios (calculated)
      current_ratio: biz1_current_assets / biz1_current_liabilities,
      quick_ratio: 1.2,
      cash_ratio: 0.8,
      working_capital: biz1_current_assets - biz1_current_liabilities,
      
      // Debt Metrics - Low leverage
      total_debt: 420000, // Lower debt
      interest_expense: 28000, // Lower interest
      ebitda: 750000, // Higher EBITDA
      debt_to_equity: 420000 / biz1_equity,
      debt_service_coverage: 750000 / (28000 + 40000), // EBITDA / (Interest + Principal) = ~11.0
      
      // Sales Performance - Excellent growth
      sales_growth: 25.0,
      customer_acquisition_cost: 1250,
      customer_lifetime_value: 45000,
      monthly_recurring_revenue: Math.round(biz1_monthly_base * 0.85), // 85% is recurring
      
      // Operational KPIs
      days_sales_outstanding: 40,
      days_inventory_outstanding: 43,
      days_payable_outstanding: 35,
      cash_conversion_cycle: 40 + 43 - 35,
      
      // AR/AP Aging
      ar_aging_data: JSON.stringify([
        { category: '0-30 days', amount: 145000 },
        { category: '31-60 days', amount: 62000 },
        { category: '61-90 days', amount: 28000 },
        { category: '90+ days', amount: 12000 }
      ]),
      ap_aging_data: JSON.stringify([
        { category: '0-30 days', amount: 98000 },
        { category: '31-60 days', amount: 45000 },
        { category: '61-90 days', amount: 18000 },
        { category: '90+ days', amount: 8000 }
      ])
    };

    // ==================== BUSINESS 2: Green Valley Farms ====================
    // Medium Risk - ADJUSTED FOR YELLOW SCORE (580-620)
    const biz2_annual_revenue = 3200000;
    const biz2_monthly_base = biz2_annual_revenue / 12; // ~267K per month
    
    const biz2_revenue_monthly = generateMonthlyData(biz2_monthly_base, 0.06, 0.15); // Modest growth, higher volatility
    const biz2_cogs_monthly = biz2_revenue_monthly.map(r => ({
      month: r.month,
      value: Math.round(r.value * 0.62) // Higher COGS for lower margins
    }));
    const biz2_opex_monthly = biz2_revenue_monthly.map(r => ({
      month: r.month,
      value: Math.round(r.value * 0.32) // Higher operating expenses
    }));
    const biz2_total_expenses = biz2_revenue_monthly.map((r, i) => ({
      month: r.month,
      value: biz2_cogs_monthly[i].value + biz2_opex_monthly[i].value
    }));
    
    const biz2_total_revenue = biz2_revenue_monthly.reduce((sum, m) => sum + m.value, 0);
    const biz2_total_cogs = biz2_cogs_monthly.reduce((sum, m) => sum + m.value, 0);
    const biz2_total_opex = biz2_opex_monthly.reduce((sum, m) => sum + m.value, 0);
    const biz2_gross_profit = biz2_total_revenue - biz2_total_cogs;
    const biz2_net_profit = biz2_total_revenue - biz2_total_cogs - biz2_total_opex;

    // Adjusted balance sheet for moderate credit score (yellow range)
    const biz2_assets = 2650000;
    const biz2_current_assets = 550000; // Lower liquidity
    const biz2_liabilities = 1750000; // Higher debt
    const biz2_current_liabilities = 520000; // Current ratio ~1.06
    const biz2_equity = biz2_assets - biz2_liabilities;

    const business2 = {
      id: 'biz-002',
      name: 'Green Valley Farms',
      industry: 'Agriculture & Food Production',
      request_date: '2025-10-18',
      credit_amount: 750000,
      revenue: biz2_total_revenue,
      employees: 45,
      status: 'pending',
      risk_level: 'medium',
      founded: '2015',
      address: '456 Rural Highway, Guadalajara, JAL',
      phone: '+52 33 9876 5432',
      email: 'info@greenvalleyfarms.mx',
      description: 'Organic produce farm supplying major supermarket chains across western Mexico.',
      debt_service_coverage: 1.35, // Lower DSCR
      current_ratio: 1.06, // Borderline liquidity
      debt_to_equity: 1.94, // Higher leverage
      credit_score: 625, // Yellow range - HARDCODED
      years_in_business: 10,
      profit_margin: (biz2_net_profit / biz2_total_revenue) * 100,
      owner_name: 'María González',
      owner_experience: 22
    };

    const business2Financials = {
      business_id: 'biz-002',
      revenue_data: JSON.stringify(biz2_revenue_monthly),
      expense_data: JSON.stringify(biz2_total_expenses),
      cogs_data: JSON.stringify(biz2_cogs_monthly),
      opex_data: JSON.stringify(biz2_opex_monthly),
      total_revenue: biz2_total_revenue,
      total_expenses: biz2_total_cogs + biz2_total_opex,
      gross_profit: biz2_gross_profit,
      net_profit: biz2_net_profit,
      assets: biz2_assets,
      liabilities: biz2_liabilities,
      equity: biz2_equity,
      current_assets: biz2_current_assets,
      current_liabilities: biz2_current_liabilities,
      operating_cash_flow: 165000, // Moderate cash flow
      investing_cash_flow: -180000,
      financing_cash_flow: -120000,
      cash_and_equivalents: 72000, // Lower cash reserves
      gross_profit_margin: (biz2_gross_profit / biz2_total_revenue) * 100,
      net_profit_margin: (biz2_net_profit / biz2_total_revenue) * 100,
      return_on_assets: (biz2_net_profit / biz2_assets) * 100,
      return_on_equity: (biz2_net_profit / biz2_equity) * 100,
      asset_turnover: biz2_total_revenue / biz2_assets,
      inventory_turnover: 8.5, // Lower efficiency
      receivables_turnover: 8.2,
      current_ratio: biz2_current_assets / biz2_current_liabilities,
      quick_ratio: 0.7, // Lower quick ratio
      cash_ratio: 0.3, // Lower cash ratio
      working_capital: biz2_current_assets - biz2_current_liabilities,
      total_debt: 1150000, // Higher debt
      interest_expense: 92000,
      ebitda: 260000, // Lower EBITDA
      debt_to_equity: 1150000 / biz2_equity,
      debt_service_coverage: 260000 / (92000 + 100000), // Lower DSCR ~1.35
      sales_growth: 6.0, // Lower growth
      customer_acquisition_cost: 2200,
      customer_lifetime_value: 78000,
      monthly_recurring_revenue: 0, // No recurring revenue
      days_sales_outstanding: 34,
      days_inventory_outstanding: 29,
      days_payable_outstanding: 42,
      cash_conversion_cycle: 34 + 29 - 42,
      ar_aging_data: JSON.stringify([
        { category: '0-30 days', amount: 185000 },
        { category: '31-60 days', amount: 78000 },
        { category: '61-90 days', amount: 35000 },
        { category: '90+ days', amount: 22000 }
      ]),
      ap_aging_data: JSON.stringify([
        { category: '0-30 days', amount: 145000 },
        { category: '31-60 days', amount: 68000 },
        { category: '61-90 days', amount: 28000 },
        { category: '90+ days', amount: 12000 }
      ])
    };

    // ==================== BUSINESS 3: Metro Construction Ltd ====================
    // High Risk - ADJUSTED FOR RED SCORE (350-420)
    const biz3_annual_revenue = 5800000;
    const biz3_monthly_base = biz3_annual_revenue / 12;
    
    const biz3_revenue_monthly = generateMonthlyData(biz3_monthly_base, -0.12, 0.25); // Significant negative growth, very high volatility
    const biz3_cogs_monthly = biz3_revenue_monthly.map(r => ({
      month: r.month,
      value: Math.round(r.value * 0.78) // Very high COGS (poor margins)
    }));
    const biz3_opex_monthly = biz3_revenue_monthly.map(r => ({
      month: r.month,
      value: Math.round(r.value * 0.26) // High operating expenses
    }));
    const biz3_total_expenses = biz3_revenue_monthly.map((r, i) => ({
      month: r.month,
      value: biz3_cogs_monthly[i].value + biz3_opex_monthly[i].value
    }));
    
    const biz3_total_revenue = biz3_revenue_monthly.reduce((sum, m) => sum + m.value, 0);
    const biz3_total_cogs = biz3_cogs_monthly.reduce((sum, m) => sum + m.value, 0);
    const biz3_total_opex = biz3_opex_monthly.reduce((sum, m) => sum + m.value, 0);
    const biz3_gross_profit = biz3_total_revenue - biz3_total_cogs;
    const biz3_net_profit = biz3_total_revenue - biz3_total_cogs - biz3_total_opex;

    // Poor balance sheet for low credit score (red range)
    const biz3_assets = 4200000;
    const biz3_current_assets = 720000; // Very low liquidity
    const biz3_liabilities = 3750000; // Very high debt
    const biz3_current_liabilities = 1150000; // Current ratio < 0.65
    const biz3_equity = biz3_assets - biz3_liabilities;

    const business3 = {
      id: 'biz-003',
      name: 'Metro Construction Ltd',
      industry: 'Construction & Real Estate',
      request_date: '2025-10-20',
      credit_amount: 1200000,
      revenue: biz3_total_revenue,
      employees: 85,
      status: 'under-review',
      risk_level: 'high',
      founded: '2018',
      address: '789 Construction Blvd, Mexico City, CDMX',
      phone: '+52 55 5555 1234',
      email: 'contracts@metroconstruction.mx',
      description: 'Commercial and residential construction company with projects across central Mexico.',
      debt_service_coverage: 0.85, // Very low DSCR (below 1.0!)
      current_ratio: 0.63, // Poor liquidity
      debt_to_equity: 8.3, // Very high leverage
      credit_score: 375, // Red range - HARDCODED
      years_in_business: 7,
      profit_margin: (biz3_net_profit / biz3_total_revenue) * 100,
      owner_name: 'Roberto Sánchez',
      owner_experience: 18
    };

    const business3Financials = {
      business_id: 'biz-003',
      revenue_data: JSON.stringify(biz3_revenue_monthly),
      expense_data: JSON.stringify(biz3_total_expenses),
      cogs_data: JSON.stringify(biz3_cogs_monthly),
      opex_data: JSON.stringify(biz3_opex_monthly),
      total_revenue: biz3_total_revenue,
      total_expenses: biz3_total_cogs + biz3_total_opex,
      gross_profit: biz3_gross_profit,
      net_profit: biz3_net_profit,
      assets: biz3_assets,
      liabilities: biz3_liabilities,
      equity: biz3_equity,
      current_assets: biz3_current_assets,
      current_liabilities: biz3_current_liabilities,
      operating_cash_flow: 45000, // Very low cash flow (barely positive)
      investing_cash_flow: -285000,
      financing_cash_flow: -195000,
      cash_and_equivalents: 38000, // Very low cash reserves
      gross_profit_margin: (biz3_gross_profit / biz3_total_revenue) * 100,
      net_profit_margin: (biz3_net_profit / biz3_total_revenue) * 100,
      return_on_assets: (biz3_net_profit / biz3_assets) * 100,
      return_on_equity: (biz3_net_profit / biz3_equity) * 100,
      asset_turnover: biz3_total_revenue / biz3_assets,
      inventory_turnover: 4.2, // Very low efficiency
      receivables_turnover: 5.5,
      current_ratio: biz3_current_assets / biz3_current_liabilities,
      quick_ratio: 0.5, // Very low quick ratio
      cash_ratio: 0.2, // Very low cash ratio
      working_capital: biz3_current_assets - biz3_current_liabilities,
      total_debt: 3200000, // Very high debt
      interest_expense: 256000,
      ebitda: 180000, // Low EBITDA
      debt_to_equity: 3200000 / biz3_equity,
      debt_service_coverage: 180000 / (256000 + 55000), // Very low DSCR ~0.58
      sales_growth: -12.0, // Significant negative growth
      customer_acquisition_cost: 8500,
      customer_lifetime_value: 185000,
      monthly_recurring_revenue: 0,
      days_sales_outstanding: 47,
      days_inventory_outstanding: 70,
      days_payable_outstanding: 38,
      cash_conversion_cycle: 47 + 70 - 38,
      ar_aging_data: JSON.stringify([
        { category: '0-30 days', amount: 285000 },
        { category: '31-60 days', amount: 145000 },
        { category: '61-90 days', amount: 98000 },
        { category: '90+ days', amount: 72000 }
      ]),
      ap_aging_data: JSON.stringify([
        { category: '0-30 days', amount: 245000 },
        { category: '31-60 days', amount: 125000 },
        { category: '61-90 days', amount: 58000 },
        { category: '90+ days', amount: 35000 }
      ])
    };

    // Store in KV database
    await kv.set('business:biz-001', business1);
    await kv.set('business:biz-002', business2);
    await kv.set('business:biz-003', business3);
    
    await kv.set('financials:biz-001', business1Financials);
    await kv.set('financials:biz-002', business2Financials);
    await kv.set('financials:biz-003', business3Financials);

    // Store business IDs list
    await kv.set('business:list', ['biz-001', 'biz-002', 'biz-003']);

    console.log('Database initialized successfully with 3 businesses and comprehensive financial data');

    return c.json({ 
      success: true, 
      message: 'Database initialized with 3 businesses and 12 months of financial data',
      businesses: [business1.name, business2.name, business3.name],
      summary: {
        total_revenue: biz1_total_revenue + biz2_total_revenue + biz3_total_revenue,
        businesses_count: 3,
        data_points_per_business: 12
      }
    });
  } catch (error) {
    console.error('Error initializing database:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get all businesses
app.get('/make-server-5bcce886/businesses', async (c) => {
  try {
    const businessIds = await kv.get('business:list');
    if (!businessIds) {
      return c.json({ success: true, businesses: [] });
    }

    const businesses = await kv.mget(
      businessIds.map((id: string) => `business:${id}`)
    );

    return c.json({ success: true, businesses });
  } catch (error) {
    console.error('Error fetching businesses:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get single business
app.get('/make-server-5bcce886/business/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const business = await kv.get(`business:${id}`);
    
    if (!business) {
      return c.json({ success: false, error: 'Business not found' }, 404);
    }

    return c.json({ success: true, business });
  } catch (error) {
    console.error('Error fetching business:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get business financials
app.get('/make-server-5bcce886/financials/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const financials = await kv.get(`financials:${id}`);
    
    if (!financials) {
      return c.json({ success: false, error: 'Financials not found' }, 404);
    }

    return c.json({ success: true, financials });
  } catch (error) {
    console.error('Error fetching financials:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Health check
app.get('/make-server-5bcce886/health', (c) => {
  return c.json({ status: 'ok', message: 'Y&M Consulting API is running' });
});

Deno.serve(app.fetch);
