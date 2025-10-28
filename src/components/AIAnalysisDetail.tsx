import { useState, useRef, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { LoadingSpinner } from './ui/loading-spinner';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle, 
  CheckCircle, 
  Send,
  Sparkles,
  BarChart3,
  FileText,
  Shield,
  Target,
  Minus,
  MessageSquare,
  User,
  Bot
} from 'lucide-react';
import { 
  LineChart as RechartsLineChart, 
  BarChart as RechartsBarChart,
  AreaChart as RechartsAreaChart,
  ComposedChart,
  Line, 
  Bar, 
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer
} from 'recharts';
import { FocusedAnalysisResult } from '../services/aiAnalysisService';
import { aiAnalysisService } from '../services/aiAnalysisService';
import { Business, Financials } from '../services/businessService';
import { toast } from 'sonner@2.0.3';

interface AIAnalysisDetailProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: FocusedAnalysisResult | null;
  isLoading: boolean;
  businessName: string;
  insightType: string;
  business?: Business | null;
  financials?: Financials | null;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function AIAnalysisDetail({ 
  isOpen, 
  onClose, 
  analysis, 
  isLoading,
  businessName,
  insightType,
  business,
  financials
}: AIAnalysisDetailProps) {
  const [question, setQuestion] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isAnswering, setIsAnswering] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom of chat when new messages arrive
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    // Clear chat when opening new analysis
    if (isOpen) {
      setChatMessages([]);
      setQuestion('');
    }
  }, [isOpen, insightType]);

  const handleAskQuestion = async () => {
    if (!question.trim() || !analysis || !business || !financials) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: question.trim(),
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setQuestion('');
    setIsAnswering(true);

    try {
      const answer = await aiAnalysisService.answerQuestion(
        userMessage.content,
        insightType,
        analysis,
        business,
        financials
      );

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: answer,
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting AI answer:', error);
      toast.error('Failed to get answer', {
        description: 'Please try asking again'
      });
    } finally {
      setIsAnswering(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'high': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const renderChart = (chartData: any) => {
    if (!chartData || !chartData.data || chartData.data.length === 0) return null;

    const commonProps = {
      width: '100%',
      height: 350,
      data: chartData.data,
      margin: { top: 10, right: 30, left: 20, bottom: 30 }
    };

    const chartColors = chartData.config?.colors || ['#E30613', '#FF5C68', '#FF8A93'];
    const dataKeys = chartData.config?.dataKeys || [];

    switch (chartData.type) {
      case 'line':
        return (
          <ResponsiveContainer {...commonProps}>
            <RechartsLineChart data={chartData.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey={chartData.config?.xAxisKey || 'month'} 
                label={{ value: chartData.config?.xAxisLabel || '', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                label={{ value: chartData.config?.yAxisLabel || '', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              {dataKeys.map((key: string, index: number) => (
                <Line 
                  key={key}
                  type="monotone" 
                  dataKey={key} 
                  stroke={chartColors[index % chartColors.length]}
                  strokeWidth={2}
                  dot={{ fill: chartColors[index % chartColors.length], r: 4 }}
                />
              ))}
            </RechartsLineChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer {...commonProps}>
            <RechartsBarChart data={chartData.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey={chartData.config?.xAxisKey || 'month'}
                label={{ value: chartData.config?.xAxisLabel || '', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                label={{ value: chartData.config?.yAxisLabel || '', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              {dataKeys.map((key: string, index: number) => (
                <Bar 
                  key={key}
                  dataKey={key} 
                  fill={chartColors[index % chartColors.length]}
                />
              ))}
            </RechartsBarChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer {...commonProps}>
            <RechartsAreaChart data={chartData.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey={chartData.config?.xAxisKey || 'month'}
                label={{ value: chartData.config?.xAxisLabel || '', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                label={{ value: chartData.config?.yAxisLabel || '', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              {dataKeys.map((key: string, index: number) => (
                <Area 
                  key={key}
                  type="monotone" 
                  dataKey={key} 
                  stroke={chartColors[index % chartColors.length]}
                  fill={chartColors[index % chartColors.length]}
                  fillOpacity={0.6}
                />
              ))}
            </RechartsAreaChart>
          </ResponsiveContainer>
        );

      case 'composed':
        return (
          <ResponsiveContainer {...commonProps}>
            <ComposedChart data={chartData.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey={chartData.config?.xAxisKey || 'month'}
                label={{ value: chartData.config?.xAxisLabel || '', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                label={{ value: chartData.config?.yAxisLabel || '', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              {dataKeys.slice(0, Math.floor(dataKeys.length / 2)).map((key: string, index: number) => (
                <Bar 
                  key={key}
                  dataKey={key} 
                  fill={chartColors[index % chartColors.length]}
                />
              ))}
              {dataKeys.slice(Math.floor(dataKeys.length / 2)).map((key: string, index: number) => (
                <Line 
                  key={key}
                  type="monotone" 
                  dataKey={key} 
                  stroke={chartColors[(index + 1) % chartColors.length]}
                  strokeWidth={2}
                />
              ))}
            </ComposedChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-4xl lg:max-w-6xl overflow-y-auto p-0">
        {isLoading ? (
          <>
            <SheetHeader className="p-6 pb-4 border-b bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950">
              <SheetTitle className="flex items-center gap-3 text-2xl">
                <div className="p-3 rounded-lg bg-gradient-to-br from-red-600 to-orange-600">
                  <Brain className="h-7 w-7 text-white" />
                </div>
                AI Analysis Loading
              </SheetTitle>
              <SheetDescription className="text-base mt-2">
                Generating comprehensive analysis for {businessName}
              </SheetDescription>
            </SheetHeader>
            <div className="flex items-center justify-center h-[calc(100vh-200px)]">
              <LoadingSpinner message={`Generating AI analysis for "${insightType}"...`} />
            </div>
          </>
        ) : analysis ? (
          <div className="h-full flex flex-col">
            {/* Header */}
            <SheetHeader className="p-6 pb-4 border-b bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950">
              <SheetTitle className="flex items-center gap-3 text-2xl">
                <div className="p-3 rounded-lg bg-gradient-to-br from-red-600 to-orange-600">
                  <Brain className="h-7 w-7 text-white" />
                </div>
                {analysis.title || 'AI Credit Analysis'}
              </SheetTitle>
              <SheetDescription className="text-base mt-2">
                Focused AI analysis for <span className="font-semibold text-foreground">{businessName}</span> - {insightType}
              </SheetDescription>
            </SheetHeader>

            {/* Content */}
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-6">
                {/* Executive Summary */}
                <Card className="border-2 border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Executive Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-base leading-relaxed whitespace-pre-wrap">
                      {analysis.executiveSummary}
                    </p>
                  </CardContent>
                </Card>

                {/* Key Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      Key Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {analysis.keyMetrics.map((metric, index) => (
                        <div 
                          key={index}
                          className="p-4 rounded-lg bg-gradient-to-br from-muted/50 to-muted/30 border border-border"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold">{metric.label}</h4>
                            {getTrendIcon(metric.trend)}
                          </div>
                          <div className="text-2xl mb-2">{metric.value}</div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {metric.interpretation}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Chart Visualization */}
                {analysis.chartData && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-primary" />
                        {insightType} - Visual Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {renderChart(analysis.chartData)}
                    </CardContent>
                  </Card>
                )}

                {/* Detailed Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Detailed Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-base leading-relaxed whitespace-pre-wrap">
                      {analysis.detailedAnalysis}
                    </p>
                  </CardContent>
                </Card>

                {/* Strengths and Concerns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-2 border-green-200 dark:border-green-800">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Strengths
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {analysis.strengths.map((strength, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-orange-200 dark:border-orange-800">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                        Concerns
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {analysis.concerns.map((concern, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                            <span>{concern}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* Risk Assessment */}
                <Card className="border-2 border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      Risk Assessment
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Risk Level</p>
                      <Badge className={`text-lg px-4 py-2 ${getRiskColor(analysis.riskAssessment.level)}`}>
                        {analysis.riskAssessment.level.toUpperCase()} RISK
                      </Badge>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Risk Factors</h4>
                      <ul className="space-y-2">
                        {analysis.riskAssessment.factors.map((factor, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <span className="text-primary mt-1">•</span>
                            <span>{factor}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {analysis.recommendations.map((rec, index) => (
                        <li 
                          key={index}
                          className="p-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border border-blue-200 dark:border-blue-800"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">
                              {index + 1}
                            </div>
                            <p className="text-sm leading-relaxed">{rec}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Action Items */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      Action Items
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {analysis.actionItems.map((action, index) => {
                      const priorityColors = {
                        high: 'border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950',
                        medium: 'border-yellow-300 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950',
                        low: 'border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-950'
                      };

                      return (
                        <div 
                          key={index}
                          className={`p-4 rounded-lg border-2 ${priorityColors[action.priority]}`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant={action.priority === 'high' ? 'destructive' : 'default'}>
                              {action.priority.toUpperCase()} PRIORITY
                            </Badge>
                            <h4 className="font-semibold">{action.item}</h4>
                          </div>
                          <p className="text-sm leading-relaxed">
                            {action.rationale}
                          </p>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>

                {/* Q&A Section */}
                <Card className="border-2 border-primary/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-primary" />
                      Ask AI Follow-up Questions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Chat Messages */}
                    {chatMessages.length > 0 && (
                      <ScrollArea className="h-[300px] pr-4">
                        <div className="space-y-4">
                          {chatMessages.map((message, index) => (
                            <div 
                              key={index}
                              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                              {message.role === 'assistant' && (
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center">
                                  <Bot className="h-4 w-4 text-white" />
                                </div>
                              )}
                              <div 
                                className={`max-w-[80%] p-3 rounded-lg ${
                                  message.role === 'user' 
                                    ? 'bg-primary text-primary-foreground' 
                                    : 'bg-muted'
                                }`}
                              >
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                  {message.content}
                                </p>
                                <p className="text-xs mt-1 opacity-70">
                                  {message.timestamp.toLocaleTimeString()}
                                </p>
                              </div>
                              {message.role === 'user' && (
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
                                  <User className="h-4 w-4 text-white" />
                                </div>
                              )}
                            </div>
                          ))}
                          <div ref={chatEndRef} />
                        </div>
                      </ScrollArea>
                    )}

                    {/* Question Input */}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Ask a question about this analysis..."
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()}
                        disabled={isAnswering}
                      />
                      <Button 
                        onClick={handleAskQuestion}
                        disabled={!question.trim() || isAnswering}
                        className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-orange-600 hover:to-red-600"
                      >
                        {isAnswering ? (
                          <div className="loader h-4 w-4" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    {chatMessages.length === 0 && (
                      <div className="text-center py-6 text-muted-foreground">
                        <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">
                          Ask questions to get deeper insights about {insightType.toLowerCase()}
                        </p>
                        <p className="text-xs mt-1">
                          Examples: "What are the main risks?" or "How does this compare to industry standards?"
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>

            {/* Footer */}
            <div className="p-6 border-t bg-card">
              <Button 
                variant="outline" 
                onClick={onClose}
                className="w-full"
              >
                Close Analysis
              </Button>
            </div>
          </div>
        ) : (
          <>
            <SheetHeader className="p-6 pb-4 border-b">
              <SheetTitle>AI Analysis</SheetTitle>
              <SheetDescription>
                No analysis data available
              </SheetDescription>
            </SheetHeader>
            <div className="flex items-center justify-center h-[calc(100vh-200px)]">
              <p className="text-muted-foreground">No analysis available</p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
