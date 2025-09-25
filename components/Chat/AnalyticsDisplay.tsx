'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/UI/tabs';
import { Badge } from '@/components/UI/badge';
import { ScrollArea } from '@/components/UI/scroll-area';
import { GoogleChartWrapper } from '../Chart/GoogleChartWrapper';
import {
  BarChart3,
  Table,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
} from 'lucide-react';

interface ChartData {
  chartType: 'ColumnChart' | 'LineChart' | 'PieChart' | 'BarChart' | 'AreaChart';
  data: any[][];
  options: any;
  title: string;
}

interface TableData {
  headers: string[];
  rows: any[][];
  title: string;
}

interface KPI {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
}

interface AnalyticsData {
  message: string;
  chartData?: ChartData;
  tableData?: TableData;
  kpis?: KPI[];
  timestamp: string;
  query?: string;
}

interface AnalyticsDisplayProps {
  analyticsData: AnalyticsData | null;
}

export function AnalyticsDisplay({ analyticsData }: AnalyticsDisplayProps) {
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (analyticsData) {
      // Auto-switch to chart tab if chart data is available
      if (analyticsData.chartData) {
        setActiveTab('chart');
      } else {
        setActiveTab('overview');
      }
    }
  }, [analyticsData]);

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend?: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'down':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (!analyticsData) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Analytics Dashboard</h3>
            <p className="text-muted-foreground">
              Ask a question to see charts, tables, and insights here
            </p>
          </div>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Try asking:</p>
            <p className="font-mono bg-muted px-2 py-1 rounded">"Show category breakdown"</p>
            <p className="font-mono bg-muted px-2 py-1 rounded">"Analyze revenue trends"</p>
          </div>
        </div>
      </div>
    );
  }

  const hasVisualData = analyticsData.chartData || analyticsData.tableData;
  const tabsAvailable = [];

  tabsAvailable.push({ id: 'overview', label: 'Overview', icon: MessageSquare });
  if (analyticsData.chartData) tabsAvailable.push({ id: 'chart', label: 'Chart', icon: BarChart3 });
  if (analyticsData.tableData) tabsAvailable.push({ id: 'table', label: 'Table', icon: Table });

  return (
    <div className="h-full flex flex-col">
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {/* Query Header */}
          {analyticsData.query && (
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-primary">Your Query</p>
                    <p className="text-sm text-muted-foreground mt-1">{analyticsData.query}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* KPIs Row */}
          {analyticsData.kpis && analyticsData.kpis.length > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {analyticsData.kpis.map((kpi, index) => (
                <Card key={index} className={`border ${getTrendColor(kpi.trend)}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-xs font-medium text-muted-foreground">{kpi.label}</p>
                        <p className="text-xl font-bold mt-1">{kpi.value}</p>
                        {kpi.change && (
                          <p className="text-xs text-muted-foreground mt-1">{kpi.change}</p>
                        )}
                      </div>
                      {getTrendIcon(kpi.trend)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Main Analytics Content */}
          <Card className="flex-1">
            {hasVisualData ? (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                <CardHeader className="pb-3 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">Analytics Results</CardTitle>
                    <TabsList className="grid w-fit grid-cols-auto">
                      {tabsAvailable.map((tab) => (
                        <TabsTrigger
                          key={tab.id}
                          value={tab.id}
                          className="flex items-center gap-2"
                        >
                          <tab.icon className="h-4 w-4" />
                          {tab.label}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 min-h-0">
                  {/* Overview Tab */}
                  <TabsContent value="overview" className="mt-0 h-full">
                    <div className="prose prose-sm max-w-none dark:prose-invert h-full overflow-y-auto">
                      <div className="whitespace-pre-wrap">{analyticsData.message}</div>
                    </div>
                  </TabsContent>

                  {/* Chart Tab */}
                  {analyticsData.chartData && (
                    <TabsContent value="chart" className="mt-0 h-full">
                      <div className="h-full flex flex-col">
                        <h3 className="text-lg font-semibold mb-4 flex-shrink-0">
                          {analyticsData.chartData.title}
                        </h3>
                        <div className="flex-1 min-h-[400px]">
                          <GoogleChartWrapper
                            chartType={analyticsData.chartData.chartType}
                            data={analyticsData.chartData.data}
                            options={analyticsData.chartData.options}
                            width="100%"
                            height="100%"
                          />
                        </div>
                      </div>
                    </TabsContent>
                  )}

                  {/* Table Tab */}
                  {analyticsData.tableData && (
                    <TabsContent value="table" className="mt-0 h-full">
                      <div className="h-full flex flex-col">
                        <h3 className="text-lg font-semibold mb-4 flex-shrink-0">
                          {analyticsData.tableData.title}
                        </h3>
                        <div className="flex-1 overflow-auto">
                          <table className="w-full border-collapse border border-border">
                            <thead className="sticky top-0 bg-background">
                              <tr className="bg-muted">
                                {analyticsData.tableData.headers.map((header, index) => (
                                  <th
                                    key={index}
                                    className="border border-border px-4 py-3 text-left font-medium"
                                  >
                                    {header}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {analyticsData.tableData.rows.map((row, rowIndex) => (
                                <tr key={rowIndex} className="hover:bg-muted/50">
                                  {row.map((cell, cellIndex) => (
                                    <td key={cellIndex} className="border border-border px-4 py-3">
                                      {cell}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </TabsContent>
                  )}
                </CardContent>
              </Tabs>
            ) : (
              // Simple text response without tabs
              <>
                <CardHeader>
                  <CardTitle className="text-xl">Response</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <div className="whitespace-pre-wrap">{analyticsData.message}</div>
                  </div>
                </CardContent>
              </>
            )}
          </Card>

          {/* Timestamp */}
          <div className="text-center">
            <span className="text-xs text-muted-foreground">
              Generated at {new Date(analyticsData.timestamp).toLocaleString()}
            </span>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
