import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import { businessService } from "../services/businessService";

export function DatabaseReinitializer() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleReinitialize = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await businessService.initDatabase();
      setResult({
        success: true,
        message: response.message || 'Database reinitialized successfully!'
      });
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to reinitialize database'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          Reinitialize Database
        </CardTitle>
        <CardDescription>
          Click below to reinitialize the database with updated credit score data
        </CardDescription>
        <div className="mt-3 space-y-1 text-sm text-muted-foreground">
          <div>• <strong>Business 1 (TechStart Solutions)</strong>: Green Score (~700-800)</div>
          <div>• <strong>Business 2 (Green Valley Farms)</strong>: Yellow Score (~550-650)</div>
          <div>• <strong>Business 3 (Metro Construction)</strong>: Red Score (~300-450)</div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={handleReinitialize} 
          disabled={isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Reinitializing...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Reinitialize Database Now
            </>
          )}
        </Button>

        {result && (
          <Alert variant={result.success ? "default" : "destructive"}>
            {result.success ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertDescription>
              {result.message}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
