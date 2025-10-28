import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  FileText,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface CreditAnalyticsProps {
  totalApplications: number;
  pendingCount: number;
  underReviewCount: number;
  approvedCount: number;
  deniedCount: number;
  totalCreditRequested: number;
  averageCreditAmount: number;
  lowRiskCount: number;
  mediumRiskCount: number;
  highRiskCount: number;
}

export function CreditAnalytics({
  totalApplications,
  pendingCount,
  underReviewCount,
  approvedCount,
  deniedCount,
  totalCreditRequested,
  averageCreditAmount,
  lowRiskCount,
  mediumRiskCount,
  highRiskCount
}: CreditAnalyticsProps) {
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getPercentage = (count: number) => {
    return totalApplications > 0 ? ((count / totalApplications) * 100).toFixed(2) : '0.00';
  };

  return (
    <div className="space-y-4">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950 border-red-200 dark:border-red-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Applications</p>
                <p className="text-3xl font-semibold mt-1">{totalApplications}</p>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
                <FileText className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-fuchsia-50 dark:from-purple-950 dark:to-fuchsia-950 border-purple-200 dark:border-purple-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Requested</p>
                <p className="text-2xl font-semibold mt-1">{formatCurrency(totalCreditRequested)}</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Breakdown */}
      <Card className="bg-gradient-to-br from-card to-primary/5 dark:from-card dark:to-primary/10 border-primary/20 dark:border-primary/30">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            Application Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950 dark:to-amber-950 border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              <span className="text-sm font-medium">Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">{pendingCount}</span>
              <Badge variant="outline" className="bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300">
                {getPercentage(pendingCount)}%
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium">Under Review</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">{underReviewCount}</span>
              <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                {getPercentage(underReviewCount)}%
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium">Approved</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">{approvedCount}</span>
              <Badge variant="outline" className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                {getPercentage(approvedCount)}%
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950 dark:to-rose-950 border border-red-200 dark:border-red-800">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              <span className="text-sm font-medium">Denied</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">{deniedCount}</span>
              <Badge variant="outline" className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300">
                {getPercentage(deniedCount)}%
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Average Credit & Risk Distribution */}
      <div className="grid grid-cols-1 gap-4">
        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950 border-orange-200 dark:border-orange-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Credit Request</p>
                <p className="text-2xl font-semibold mt-1">{formatCurrency(averageCreditAmount)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-primary/5 dark:from-card dark:to-primary/10 border-primary/20 dark:border-primary/30">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-primary" />
              Risk Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Low Risk</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500" 
                    style={{ width: `${getPercentage(lowRiskCount)}%` }}
                  />
                </div>
                <span className="text-sm font-medium w-12 text-right">{lowRiskCount}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Medium Risk</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-500" 
                    style={{ width: `${getPercentage(mediumRiskCount)}%` }}
                  />
                </div>
                <span className="text-sm font-medium w-12 text-right">{mediumRiskCount}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">High Risk</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-500" 
                    style={{ width: `${getPercentage(highRiskCount)}%` }}
                  />
                </div>
                <span className="text-sm font-medium w-12 text-right">{highRiskCount}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
