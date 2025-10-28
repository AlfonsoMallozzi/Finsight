import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { BusinessListHeader } from './BusinessListHeader';
import { CreditAnalytics } from './CreditAnalytics';
import { CreditTrendsInsights } from './CreditTrendsInsights';
import { LoadingSpinner } from './ui/loading-spinner';
import { businessService, Business as ApiBusinesstype } from '../services/businessService';
import { toast } from 'sonner@2.0.3';
import { 
  Building2, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Users,
  DollarSign,
  FileText,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Briefcase,
  BarChart3,
  Clock
} from 'lucide-react';

interface Business {
  id: string;
  name: string;
  industry: string;
  requestDate: string;
  creditAmount: number;
  revenue: number;
  employees: number;
  status: 'pending' | 'under-review' | 'approved' | 'denied';
  riskLevel: 'low' | 'medium' | 'high';
  founded: string;
  address: string;
  phone: string;
  email: string;
  description: string;
  debtServiceCoverage: number;
  currentRatio: number;
  debtToEquity: number;
}

interface BusinessListProps {
  onSelectBusiness: (businessId: string) => void;
  isDarkMode?: boolean;
  onLogout?: () => void;
}

export function BusinessList({ onSelectBusiness, isDarkMode = false, onLogout }: BusinessListProps) {
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [localIsDarkMode, setLocalIsDarkMode] = useState(isDarkMode);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitializing, setIsInitializing] = useState(false);

  // Apply dark mode class to html element
  useEffect(() => {
    if (localIsDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [localIsDarkMode]);

  const handleToggleDarkMode = () => {
    setLocalIsDarkMode(!localIsDarkMode);
  };

  // Convert API business to component business format
  const mapApiBusinessToComponent = (apiBusiness: ApiBusinesstype): Business => ({
    id: apiBusiness.id,
    name: apiBusiness.name,
    industry: apiBusiness.industry,
    requestDate: apiBusiness.request_date,
    creditAmount: apiBusiness.credit_amount,
    revenue: apiBusiness.revenue,
    employees: apiBusiness.employees,
    status: apiBusiness.status,
    riskLevel: apiBusiness.risk_level,
    founded: apiBusiness.founded,
    address: apiBusiness.address,
    phone: apiBusiness.phone,
    email: apiBusiness.email,
    description: apiBusiness.description,
    debtServiceCoverage: apiBusiness.debt_service_coverage,
    currentRatio: apiBusiness.current_ratio,
    debtToEquity: apiBusiness.debt_to_equity,
  });

  // Load businesses from database
  const loadBusinesses = async () => {
    try {
      setIsLoading(true);
      const apiBusinesses = await businessService.getAllBusinesses();
      
      // If no businesses found, initialize the database
      if (apiBusinesses.length === 0) {
        console.log('No businesses found. Initializing database...');
        setIsInitializing(true);
        await businessService.initDatabase();
        const newBusinesses = await businessService.getAllBusinesses();
        setBusinesses(newBusinesses.map(mapApiBusinessToComponent));
        setIsInitializing(false);
        toast.success('Database Initialized', {
          description: 'Sample business data has been loaded.',
        });
      } else {
        setBusinesses(apiBusinesses.map(mapApiBusinessToComponent));
      }
    } catch (error) {
      console.error('Error loading businesses:', error);
      toast.error('Failed to Load Businesses', {
        description: 'Could not fetch business data from the database.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    loadBusinesses();
  }, []);

  // Show loading state
  if (isLoading || isInitializing) {
    return (
      <div className="min-h-screen bg-background">
        <BusinessListHeader 
          isDarkMode={localIsDarkMode}
          onToggleDarkMode={handleToggleDarkMode}
          onLogout={onLogout}
        />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <LoadingSpinner 
            message={isInitializing ? 'Initializing database...' : 'Loading credit applications...'} 
          />
        </div>
      </div>
    );
  }



  const handleBusinessClick = (business: Business) => {
    setSelectedBusiness(business);
    setIsSheetOpen(true);
  };

  const handleAnalyzeBusiness = () => {
    if (selectedBusiness) {
      setIsSheetOpen(false);
      onSelectBusiness(selectedBusiness.id);
    }
  };

  const getStatusBadge = (status: Business['status']) => {
    const variants = {
      'pending': { variant: 'secondary' as const, label: 'Pending' },
      'under-review': { variant: 'default' as const, label: 'Under Review' },
      'approved': { variant: 'default' as const, label: 'Approved' },
      'denied': { variant: 'destructive' as const, label: 'Denied' }
    };
    return variants[status];
  };

  const getRiskBadge = (risk: Business['riskLevel']) => {
    const variants = {
      'low': { className: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300', label: 'Low Risk' },
      'medium': { className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300', label: 'Medium Risk' },
      'high': { className: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300', label: 'High Risk' }
    };
    return variants[risk];
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate analytics
  const analytics = {
    totalApplications: businesses.length,
    pendingCount: businesses.filter(b => b.status === 'pending').length,
    underReviewCount: businesses.filter(b => b.status === 'under-review').length,
    approvedCount: businesses.filter(b => b.status === 'approved').length,
    deniedCount: businesses.filter(b => b.status === 'denied').length,
    totalCreditRequested: businesses.reduce((sum, b) => sum + b.creditAmount, 0),
    averageCreditAmount: businesses.reduce((sum, b) => sum + b.creditAmount, 0) / businesses.length,
    lowRiskCount: businesses.filter(b => b.riskLevel === 'low').length,
    mediumRiskCount: businesses.filter(b => b.riskLevel === 'medium').length,
    highRiskCount: businesses.filter(b => b.riskLevel === 'high').length,
  };

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <BusinessListHeader 
          isDarkMode={localIsDarkMode}
          onToggleDarkMode={handleToggleDarkMode}
          onLogout={onLogout}
        />

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Business List */}
            <div className="lg:col-span-2">
              <Card className="bg-gradient-to-br from-card to-primary/5 dark:from-card dark:to-primary/10 border-primary/20 dark:border-primary/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    Active Applications ({businesses.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
              {businesses.map((business) => {
                const statusInfo = getStatusBadge(business.status);
                const riskInfo = getRiskBadge(business.riskLevel);
                
                return (
                  <div
                    key={business.id}
                    onClick={() => handleBusinessClick(business)}
                    className="p-4 rounded-lg border-2 bg-gradient-to-br from-white to-gray-50 border-gray-200 dark:from-gray-900 dark:to-gray-800 dark:border-gray-700 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-primary/50"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950">
                          <Building2 className="h-5 w-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{business.name}</h3>
                          <p className="text-sm text-muted-foreground">{business.industry}</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                        <Badge className={riskInfo.className}>{riskInfo.label}</Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Credit Request</p>
                          <p className="text-sm font-medium">{formatCurrency(business.creditAmount)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Annual Revenue</p>
                          <p className="text-sm font-medium">{formatCurrency(business.revenue)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Employees</p>
                          <p className="text-sm font-medium">{business.employees}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Applied</p>
                          <p className="text-sm font-medium">{formatDate(business.requestDate)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <span className="text-sm text-muted-foreground">Click to view details</span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                );
              })}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Analytics & AI Insights */}
            <div className="space-y-6">
              <CreditAnalytics
                totalApplications={analytics.totalApplications}
                pendingCount={analytics.pendingCount}
                underReviewCount={analytics.underReviewCount}
                approvedCount={analytics.approvedCount}
                deniedCount={analytics.deniedCount}
                totalCreditRequested={analytics.totalCreditRequested}
                averageCreditAmount={analytics.averageCreditAmount}
                lowRiskCount={analytics.lowRiskCount}
                mediumRiskCount={analytics.mediumRiskCount}
                highRiskCount={analytics.highRiskCount}
              />

              <CreditTrendsInsights
                totalApplications={analytics.totalApplications}
                totalCreditRequested={analytics.totalCreditRequested}
                averageCreditAmount={analytics.averageCreditAmount}
                pendingCount={analytics.pendingCount}
                underReviewCount={analytics.underReviewCount}
                highRiskCount={analytics.highRiskCount}
                lowRiskCount={analytics.lowRiskCount}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Slide-in Detail Panel */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-2xl lg:max-w-3xl overflow-y-auto p-0">
          {selectedBusiness && (
            <div className="h-full flex flex-col">
              <SheetHeader className="p-6 pb-4 border-b">
                <SheetTitle className="flex items-center gap-3 text-xl">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950">
                    <Building2 className="h-7 w-7 text-red-600 dark:text-red-400" />
                  </div>
                  {selectedBusiness.name}
                </SheetTitle>
                <SheetDescription className="text-base mt-2">
                  Review detailed business information and financial metrics for this credit application
                </SheetDescription>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Status & Risk */}
                <div className="flex gap-3">
                  <Badge variant={getStatusBadge(selectedBusiness.status).variant} className="text-base py-2 px-4">
                    {getStatusBadge(selectedBusiness.status).label}
                  </Badge>
                  <Badge className={`text-base py-2 px-4 ${getRiskBadge(selectedBusiness.riskLevel).className}`}>
                    {getRiskBadge(selectedBusiness.riskLevel).label}
                  </Badge>
                </div>

                {/* Business Description */}
                <div className="p-5 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border border-blue-200 dark:border-blue-800">
                  <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    Business Overview
                  </h3>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {selectedBusiness.description}
                  </p>
                </div>

                {/* Key Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    Company Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700">
                      <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Industry</p>
                        <p className="text-base font-medium">{selectedBusiness.industry}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700">
                      <Calendar className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Founded</p>
                        <p className="text-base font-medium">{formatDate(selectedBusiness.founded)}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700">
                      <Clock className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Application Date</p>
                        <p className="text-base font-medium">{formatDate(selectedBusiness.requestDate)}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700">
                      <Users className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Employees</p>
                        <p className="text-base font-medium">{selectedBusiness.employees}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 md:col-span-2">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Address</p>
                        <p className="text-base font-medium">{selectedBusiness.address}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700">
                      <Phone className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Phone</p>
                        <p className="text-base font-medium">{selectedBusiness.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700">
                      <Mail className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Email</p>
                        <p className="text-base font-medium">{selectedBusiness.email}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financial Overview */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Financial Snapshot
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-2 border-green-200 dark:border-green-800">
                      <p className="text-sm text-green-700 dark:text-green-400 mb-2">Annual Revenue</p>
                      <p className="text-xl font-semibold text-green-800 dark:text-green-300">
                        {formatCurrency(selectedBusiness.revenue)}
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-2 border-blue-200 dark:border-blue-800">
                      <p className="text-sm text-blue-700 dark:text-blue-400 mb-2">Credit Request</p>
                      <p className="text-xl font-semibold text-blue-800 dark:text-blue-300">
                        {formatCurrency(selectedBusiness.creditAmount)}
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-fuchsia-50 dark:from-purple-950 dark:to-fuchsia-950 border-2 border-purple-200 dark:border-purple-800">
                      <p className="text-sm text-purple-700 dark:text-purple-400 mb-2">DSCR</p>
                      <p className="text-xl font-semibold text-purple-800 dark:text-purple-300">
                        {selectedBusiness.debtServiceCoverage.toFixed(2)}x
                      </p>
                      <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">Debt Service Coverage</p>
                    </div>

                    <div className="p-4 rounded-lg bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950 border-2 border-orange-200 dark:border-orange-800">
                      <p className="text-sm text-orange-700 dark:text-orange-400 mb-2">Current Ratio</p>
                      <p className="text-xl font-semibold text-orange-800 dark:text-orange-300">
                        {selectedBusiness.currentRatio.toFixed(2)}x
                      </p>
                      <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">Liquidity Measure</p>
                    </div>

                    <div className="p-4 rounded-lg bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950 dark:to-rose-950 border-2 border-pink-200 dark:border-pink-800">
                      <p className="text-sm text-pink-700 dark:text-pink-400 mb-2">Debt-to-Equity</p>
                      <p className="text-xl font-semibold text-pink-800 dark:text-pink-300">
                        {selectedBusiness.debtToEquity.toFixed(2)}x
                      </p>
                      <p className="text-xs text-pink-600 dark:text-pink-400 mt-1">Leverage Ratio</p>
                    </div>

                    <div className="p-4 rounded-lg bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-950 dark:to-teal-950 border-2 border-cyan-200 dark:border-cyan-800">
                      <p className="text-sm text-cyan-700 dark:text-cyan-400 mb-2">Employees</p>
                      <p className="text-xl font-semibold text-cyan-800 dark:text-cyan-300">
                        {selectedBusiness.employees}
                      </p>
                      <p className="text-xs text-cyan-600 dark:text-cyan-400 mt-1">Team Size</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button - Fixed at bottom */}
              <div className="p-6 pt-4 border-t bg-card">
                <Button
                  size="lg"
                  onClick={handleAnalyzeBusiness}
                  className="w-full text-lg py-7 bg-gradient-to-r from-red-600 via-rose-600 to-orange-600 hover:from-orange-600 hover:via-rose-600 hover:to-red-600 transition-all duration-500 shadow-xl hover:shadow-red-500/50"
                >
                  <BarChart3 className="mr-2 h-6 w-6" />
                  Open Full Analytics Dashboard
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
