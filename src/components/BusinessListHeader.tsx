import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Moon, Sun, Building2, Bell, User, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface BusinessListHeaderProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onLogout?: () => void;
}

export function BusinessListHeader({ 
  isDarkMode,
  onToggleDarkMode,
  onLogout
}: BusinessListHeaderProps) {
  return (
    <div className="flex items-center justify-between p-6 bg-card border-b">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <Building2 className="h-8 w-8 text-red-600" />
          <div>
            <h1 className="text-2xl font-medium">Credit Applications</h1>
            <p className="text-sm text-muted-foreground">Y&M Consulting Inc.</p>
          </div>
        </div>

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
        <Button variant="ghost" size="icon">
          <Bell className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src="/placeholder-avatar.jpg" />
            <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
          </Avatar>
          <div className="text-right">
            <p className="text-sm font-medium">Sarah Mitchell</p>
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800">
              Credit Analyst
            </Badge>
          </div>
        </div>

        {onLogout && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={onLogout}
            className="flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        )}
      </div>
    </div>
  );
}
