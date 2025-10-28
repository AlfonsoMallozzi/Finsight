import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  Users
} from "lucide-react";

interface QuickActionsProps {
  onApproveCredit?: () => void;
  onDenyCredit?: () => void;
}

export function QuickActions({ onApproveCredit, onDenyCredit }: QuickActionsProps) {
  return (
    <div className="space-y-6">
      {/* Credit Decision Actions */}
      <Card className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 border-red-200 dark:border-red-900">
        <CardHeader>
          <CardTitle className="text-red-600 dark:text-red-400">Credit Decision</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            className="w-full justify-start bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
            size="lg"
            onClick={onApproveCredit}
          >
            <CheckCircle className="h-5 w-5 mr-2" />
            Approve Credit Application
          </Button>
          <Button 
            className="w-full justify-start bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white"
            size="lg"
            onClick={onDenyCredit}
          >
            <XCircle className="h-5 w-5 mr-2" />
            Deny Credit Application
          </Button>
        </CardContent>
      </Card>

      {/* Communication Center */}
      <Card className="bg-gradient-to-br from-card to-accent/30 dark:from-card dark:to-accent/20">
        <CardHeader>
          <CardTitle>Communication Center</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button className="w-full justify-start" variant="outline">
            <Mail className="h-4 w-4 mr-2" />
            Send Email to Business
          </Button>
          <Button className="w-full justify-start" variant="outline">
            <Phone className="h-4 w-4 mr-2" />
            Schedule Call with Bank Manager
          </Button>
          <Button className="w-full justify-start" variant="outline">
            <Users className="h-4 w-4 mr-2" />
            Schedule Decision Committee Meeting
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}