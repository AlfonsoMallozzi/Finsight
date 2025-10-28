import { useState, useEffect } from "react";
import { DashboardHeader } from "./components/DashboardHeader";
import { MetricsCards } from "./components/MetricsCards";
import { ModularChartsSection } from "./components/ModularChartsSection";
import { AISuggestions } from "./components/AISuggestions";
import { QuickActions } from "./components/QuickActions";
import { BusinessList } from "./components/BusinessList";
import { BusinessDashboard } from "./components/BusinessDashboard";
import { Hero } from "./components/Hero";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner@2.0.3";
import { WidgetLayout, AnalyticsSection, ColorPalette } from "./types/widgets";
import { businessService, Business, Financials } from "./services/businessService";

type AppView = 'hero' | 'businessList' | 'dashboard' | 'businessDashboard';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('hero');
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<'bank' | 'business' | null>(null);
  const [timePeriod, setTimePeriod] = useState("month");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentSection, setCurrentSection] = useState<AnalyticsSection>('financial');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentBusiness, setCurrentBusiness] = useState<Business | null>(null);
  const [currentFinancials, setCurrentFinancials] = useState<Financials | null>(null);

  // Apply dark mode class to html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Fetch business data when selected
  useEffect(() => {
    const fetchBusinessData = async () => {
      if (!selectedBusinessId) return;
      
      try {
        const [business, financials] = await Promise.all([
          businessService.getBusiness(selectedBusinessId),
          businessService.getFinancials(selectedBusinessId)
        ]);
        
        setCurrentBusiness(business);
        setCurrentFinancials(financials);
      } catch (error) {
        console.error('Error fetching business data:', error);
        toast.error('Failed to load business data');
      }
    };

    fetchBusinessData();
  }, [selectedBusinessId]);

  const handleToggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };
  
  // Initialize default widgets for bank credit analysis
  const [widgetLayout, setWidgetLayout] = useState<WidgetLayout>({
    financial: [
      { id: 'w1', widgetType: 'revenue-expense-chart', position: 0, size: { cols: 4, rows: 2 }, gridPosition: { x: 0, y: 0 } },
      { id: 'w2', widgetType: 'balance-sheet-overview', position: 1, size: { cols: 2, rows: 2 }, gridPosition: { x: 0, y: 2 } },
      { id: 'w3', widgetType: 'credit-score-gauge', position: 2, size: { cols: 2, rows: 2 }, gridPosition: { x: 2, y: 2 } }
    ],
    profitability: [
      { id: 'w4', widgetType: 'margin-analysis', position: 0, size: { cols: 4, rows: 2 }, gridPosition: { x: 0, y: 0 } },
      { id: 'w5', widgetType: 'profit-trends', position: 1, size: { cols: 4, rows: 2 }, gridPosition: { x: 0, y: 2 } }
    ],
    cashflow: [
      { id: 'w6', widgetType: 'cashflow-waterfall', position: 0, size: { cols: 4, rows: 2 }, gridPosition: { x: 0, y: 0 } },
      { id: 'w7', widgetType: 'working-capital', position: 1, size: { cols: 2, rows: 2 }, gridPosition: { x: 0, y: 2 } },
      { id: 'w8', widgetType: 'cash-conversion-cycle', position: 2, size: { cols: 2, rows: 2 }, gridPosition: { x: 2, y: 2 } }
    ],
    efficiency: [
      { id: 'w9', widgetType: 'efficiency-kpis', position: 0, size: { cols: 4, rows: 2 }, gridPosition: { x: 0, y: 0 } }
    ],
    inventory: [
      { id: 'w10', widgetType: 'inventory-turnover', position: 0, size: { cols: 2, rows: 2 }, gridPosition: { x: 0, y: 0 } },
      { id: 'w11', widgetType: 'stock-levels', position: 1, size: { cols: 2, rows: 2 }, gridPosition: { x: 2, y: 0 } }
    ],
    delivery: [
      { id: 'w12', widgetType: 'delivery-performance', position: 0, size: { cols: 4, rows: 2 }, gridPosition: { x: 0, y: 0 } }
    ],
    sales: [
      { id: 'w13', widgetType: 'sales-performance', position: 0, size: { cols: 3, rows: 2 }, gridPosition: { x: 0, y: 0 } },
      { id: 'w14', widgetType: 'lead-generation', position: 1, size: { cols: 2, rows: 2 }, gridPosition: { x: 3, y: 0 } }
    ],
    pipeline: [
      { id: 'w15', widgetType: 'pipeline-funnel', position: 0, size: { cols: 3, rows: 2 }, gridPosition: { x: 0, y: 0 } }
    ],
    customers: [
      { id: 'w16', widgetType: 'customer-segments', position: 0, size: { cols: 2, rows: 2 }, gridPosition: { x: 0, y: 0 } },
      { id: 'w17', widgetType: 'revenue-by-segment', position: 1, size: { cols: 2, rows: 2 }, gridPosition: { x: 2, y: 0 } }
    ]
  });

  const handleTimePeriodChange = (period: string) => {
    setTimePeriod(period);
  };

  const handleSearchQuery = (query: string) => {
    setSearchQuery(query);
  };

  const handleChangePalette = (section: string, widgetId: string, palette: ColorPalette) => {
    setWidgetLayout(prev => ({
      ...prev,
      [section]: prev[section]?.map(w => 
        w.id === widgetId ? { ...w, colorPalette: palette } : w
      ) || []
    }));
  };

  const handleLogin = (username: string, password: string) => {
    if (username === 'Banorte' && password === '67890') {
      setUserRole('bank');
      setCurrentView('businessList');
      setSelectedBusinessId('biz-001'); // Default to first business
      toast.success('Welcome Banorte', {
        description: 'Access granted to Credit Applications',
      });
    } else if (username === 'Business1' && password === '12345') {
      setUserRole('business');
      setSelectedBusinessId('biz-001'); // Default to first business
      setCurrentView('businessDashboard');
      toast.success('Welcome Business1', {
        description: 'Access granted to Business Dashboard',
      });
    } else if (username === 'Business3' && password === '45678') {
      setUserRole('business');
      setSelectedBusinessId('biz-003'); // Business with bad credit score
      setCurrentView('businessDashboard');
      toast.success('Welcome Business3', {
        description: 'Access granted to Business Dashboard',
      });
    }
  };

  const handleApproveCredit = () => {
    toast.success("Credit Application Approved", {
      description: "Credit approved by Y&M Consulting Inc. Documents will be prepared for final review and disbursement.",
      duration: 5000,
    });
  };

  const handleDenyCredit = () => {
    toast.error("Credit Application Denied", {
      description: "Credit denied by Y&M Consulting Inc. A formal letter with detailed reasoning will be sent to the applicant.",
      duration: 5000,
    });
  };

  // Show hero section first
  if (currentView === 'hero') {
    return (
      <>
        <Hero 
          onLogin={handleLogin}
        />
        <Toaster />
      </>
    );
  }

  // Show business dashboard
  if (currentView === 'businessDashboard') {
    return (
      <>
        <BusinessDashboard 
          businessId={selectedBusinessId || 'biz-001'}
          isDarkMode={isDarkMode}
          onToggleDarkMode={handleToggleDarkMode}
          onLogout={() => {
            setCurrentView('hero');
            setUserRole(null);
            toast.info('Logged out successfully');
          }}
        />
        <Toaster />
      </>
    );
  }

  // Show business list
  if (currentView === 'businessList') {
    return (
      <>
        <BusinessList 
          onSelectBusiness={(businessId) => {
            setSelectedBusinessId(businessId);
            setCurrentView('dashboard');
          }} 
          isDarkMode={isDarkMode}
          onLogout={() => {
            setCurrentView('hero');
            setUserRole(null);
            setSelectedBusinessId(null);
            toast.info('Logged out successfully');
          }}
        />
        <Toaster />
      </>
    );
  }

  // Show dashboard
  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-background relative">
        <DashboardHeader 
        onTimePeriodChange={handleTimePeriodChange}
        onSearchQuery={handleSearchQuery}
        timePeriod={timePeriod}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
        businessName={currentBusiness?.name || "Loading..."}
        onBackToList={() => setCurrentView('businessList')}
      />
    
      <div className="p-6 space-y-6">
        {/* Key Metrics Section */}
        <section>
          <h2 className="mb-4">Credit Health Metrics</h2>
          <MetricsCards 
            timePeriod={timePeriod} 
            currentRole="cfo" 
            business={currentBusiness}
            financials={currentFinancials}
          />
        </section>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Charts Section */}
          <div className="space-y-6 lg:col-span-2">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2>Financial Analytics</h2>
              </div>
              <ModularChartsSection 
                timePeriod={timePeriod} 
                currentRole="cfo"
                isDesignMode={false}
                widgetLayout={widgetLayout}
                onRemoveWidget={() => {}}
                onReorderWidgets={() => {}}
                onResizeWidget={() => {}}
                onSectionChange={setCurrentSection}
                onChangePalette={handleChangePalette}
                business={currentBusiness}
                financials={currentFinancials}
              />
            </section>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6 lg:col-span-1">
            <section>
              <h2 className="mb-4">AI Insights</h2>
              <AISuggestions 
                searchQuery={searchQuery} 
                timePeriod={timePeriod}
                business={currentBusiness}
                financials={currentFinancials}
              />
            </section>

            <section>
              <h2 className="mb-4">Actions</h2>
              <QuickActions 
                onApproveCredit={handleApproveCredit}
                onDenyCredit={handleDenyCredit}
              />
            </section>
          </div>
        </div>
      </div>
    </div>
    <Toaster />
    </>
  );
}
