import { projectId, publicAnonKey } from '../utils/supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-5bcce886`;

const headers = {
  'Authorization': `Bearer ${publicAnonKey}`,
  'Content-Type': 'application/json',
};

export interface Business {
  id: string;
  name: string;
  industry: string;
  request_date: string;
  credit_amount: number;
  revenue: number;
  employees: number;
  status: 'pending' | 'under-review' | 'approved' | 'denied';
  risk_level: 'low' | 'medium' | 'high';
  founded: string;
  address: string;
  phone: string;
  email: string;
  description: string;
  debt_service_coverage: number;
  current_ratio: number;
  debt_to_equity: number;
  credit_score: number;
  years_in_business: number;
  profit_margin: number;
  owner_name: string;
  owner_experience: number;
}

export interface MonthlyData {
  month: string;
  value: number;
}

export type Timeframe = 'month' | 'quarter' | 'year';

// Helper function to aggregate monthly data based on timeframe
export function aggregateDataByTimeframe(
  monthlyData: MonthlyData[],
  timeframe: Timeframe
): MonthlyData[] {
  if (timeframe === 'month') {
    return monthlyData;
  }
  
  if (timeframe === 'quarter') {
    const quarters: MonthlyData[] = [];
    for (let i = 0; i < monthlyData.length; i += 3) {
      const chunk = monthlyData.slice(i, i + 3);
      if (chunk.length > 0) {
        const quarterNum = Math.floor(i / 3) + 1;
        quarters.push({
          month: `Q${quarterNum} ${chunk[0].month.split(' ')[1] || '2025'}`,
          value: chunk.reduce((sum, item) => sum + item.value, 0)
        });
      }
    }
    return quarters;
  }
  
  // Yearly - sum all months
  const totalValue = monthlyData.reduce((sum, item) => sum + item.value, 0);
  const year = monthlyData[0]?.month.split(' ')[1] || '2025';
  return [{ month: year, value: totalValue }];
}

// Helper to format percentages consistently to 2 decimal places
export function formatPercentage(value: number): string {
  return value.toFixed(2);
}

export interface AgingData {
  category: string;
  amount: number;
}

export interface MonthlyFinancialData {
  month: string;
  year: number;
  earnings: number;
  losses: number;
  assets: number;
  liabilities: number;
  equity: number;
}

export interface Financials {
  business_id: string;
  
  // Monthly Data (JSON strings)
  revenue_data: string;
  expense_data: string;
  cogs_data: string;
  opex_data: string;
  
  // Parsed monthly data (optional, computed on client)
  monthly_data?: MonthlyFinancialData[];
  
  // Totals
  total_revenue: number;
  total_expenses: number;
  gross_profit: number;
  net_profit: number;
  
  // Balance Sheet
  assets: number;
  liabilities: number;
  equity: number;
  current_assets: number;
  current_liabilities: number;
  
  // Cash Flow
  operating_cash_flow: number;
  investing_cash_flow: number;
  financing_cash_flow: number;
  cash_and_equivalents: number;
  
  // Profitability Ratios
  gross_profit_margin: number;
  net_profit_margin: number;
  return_on_assets: number;
  return_on_equity: number;
  
  // Efficiency Ratios
  asset_turnover: number;
  inventory_turnover: number;
  receivables_turnover: number;
  
  // Liquidity Ratios
  current_ratio: number;
  quick_ratio: number;
  cash_ratio: number;
  working_capital: number;
  
  // Debt Metrics
  total_debt: number;
  interest_expense: number;
  ebitda: number;
  debt_to_equity: number;
  debt_service_coverage: number;
  
  // Sales Performance
  sales_growth: number;
  customer_acquisition_cost: number;
  customer_lifetime_value: number;
  monthly_recurring_revenue: number;
  
  // Operational KPIs
  days_sales_outstanding: number;
  days_inventory_outstanding: number;
  days_payable_outstanding: number;
  cash_conversion_cycle: number;
  
  // AR/AP Aging (JSON strings)
  ar_aging_data: string;
  ap_aging_data: string;
}

export const businessService = {
  // Initialize database with sample data
  async initDatabase(): Promise<{ success: boolean; message: string; businesses?: string[] }> {
    try {
      const response = await fetch(`${API_BASE_URL}/init-database`, {
        method: 'POST',
        headers,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to initialize database');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    }
  },

  // Get all businesses
  async getAllBusinesses(): Promise<Business[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/businesses`, {
        method: 'GET',
        headers,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch businesses');
      }
      
      const data = await response.json();
      return data.businesses || [];
    } catch (error) {
      console.error('Error fetching businesses:', error);
      throw error;
    }
  },

  // Get single business
  async getBusiness(id: string): Promise<Business | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/business/${id}`, {
        method: 'GET',
        headers,
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch business');
      }
      
      const data = await response.json();
      return data.business;
    } catch (error) {
      console.error('Error fetching business:', error);
      throw error;
    }
  },

  // Get business financials
  async getFinancials(id: string): Promise<Financials | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/financials/${id}`, {
        method: 'GET',
        headers,
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch financials');
      }
      
      const data = await response.json();
      const financials = data.financials;
      
      // Parse and compute monthly_data for AI service
      try {
        const revenueData = JSON.parse(financials.revenue_data || '[]');
        const expenseData = JSON.parse(financials.expense_data || '[]');
        const cogsData = JSON.parse(financials.cogs_data || '[]');
        
        financials.monthly_data = revenueData.map((r: any, idx: number) => {
          const expense = expenseData[idx] || { value: 0 };
          const cogs = cogsData[idx] || { value: 0 };
          const monthParts = r.month.split(' ');
          const monthMap: { [key: string]: number } = {
            'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
            'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12
          };
          
          return {
            month: monthMap[monthParts[0]] || idx + 1,
            year: parseInt(monthParts[1]) || 2025,
            earnings: r.value || 0,
            losses: expense.value || 0,
            assets: financials.assets || 0,
            liabilities: financials.liabilities || 0,
            equity: financials.equity || 0
          };
        });
      } catch (error) {
        console.error('Error parsing monthly data:', error);
        financials.monthly_data = [];
      }
      
      return financials;
    } catch (error) {
      console.error('Error fetching financials:', error);
      throw error;
    }
  },

  // Health check
  async healthCheck(): Promise<{ status: string; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers,
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error checking API health:', error);
      throw error;
    }
  },
};
