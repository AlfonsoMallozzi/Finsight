import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Search, Bell, User, Moon, Sun, Building2, ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface DashboardHeaderProps {
  onTimePeriodChange: (period: string) => void;
  onSearchQuery: (query: string) => void;
  timePeriod: string;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  businessName?: string;
  onBackToList?: () => void;
}

export function DashboardHeader({ 
  onTimePeriodChange, 
  onSearchQuery, 
  timePeriod,
  isDarkMode,
  onToggleDarkMode,
  businessName = "Y&M Consulting Inc.",
  onBackToList
}: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between p-6 bg-card border-b">
      <div className="flex items-center gap-4">
        {onBackToList && (
          <Button
            variant="outline"
            size="sm"
            onClick={onBackToList}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to List
          </Button>
        )}
        
        <div className="flex items-center gap-3">
          <Building2 className="h-8 w-8 text-red-600" />
          <div>
            <h1 className="text-2xl font-medium">Credit Analysis Dashboard</h1>
            <p className="text-sm text-muted-foreground">{businessName}</p>
          </div>
        </div>

        <Select value={timePeriod} onValueChange={onTimePeriodChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">Monthly</SelectItem>
            <SelectItem value="quarter">Quarterly</SelectItem>
            <SelectItem value="year">Yearly</SelectItem>
          </SelectContent>
        </Select>

        {/* Dark/Light Mode Toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleDarkMode}
          className="flex items-center gap-2"
        >
          {isDarkMode ? (
            <>
              <Sun className="h-4 w-4" />
              Light
            </>
          ) : (
            <>
              <Moon className="h-4 w-4" />
              Dark
            </>
          )}
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Ask AI about credit insights..."
            className="pl-10"
            onChange={(e) => onSearchQuery(e.target.value)}
          />
        </div>
        
        <Button variant="ghost" size="icon">
          <Bell className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src="/placeholder-avatar.jpg" />
            <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
          </Avatar>
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800">
            Credit Analyst
          </Badge>
        </div>
      </div>
    </div>
  );
}