'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/UI/tabs';
import { GoogleChartWrapper } from '../Chart/GoogleChartWrapper';
import { BarChart3, Table, MessageSquare, TrendingUp, TrendingDown, Minus } from 'lucide-react';

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

interface AnalyticsResponseProps {
  message: string;
  chartData?: ChartData;
  tableData?: TableData;
  kpis?: KPI[];
  timestamp: string;
  isUser?: boolean;
}

export function AnalyticsResponse({
  message,
  chartData,
  tableData,
  kpis,
  timestamp,
  isUser = false,
}: AnalyticsResponseProps) {
  const [activeTab, setActiveTab] = useState('text');

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

  if (isUser) {
    return (
      <div className="flex justify-end mb-4">
        <div className="max-w-[80%] bg-primary text-primary-foreground rounded-lg px-4 py-2">
          <p className="text-sm">{message}</p>
          <span className="text-xs opacity-70">{new Date(timestamp).toLocaleTimeString()}</span>
        </div>
      </div>
    );
  }

  const hasVisualData = chartData || tableData;
  const tabsAvailable = [];

  if (message) tabsAvailable.push({ id: 'text', label: 'Response', icon: MessageSquare });
  if (chartData) tabsAvailable.push({ id: 'chart', label: 'Chart', icon: BarChart3 });
  if (tableData) tabsAvailable.push({ id: 'table', label: 'Table', icon: Table });

  return (
    <div className="mb-6">
      {/* KPIs Row */}
      {kpis && kpis.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {kpis.map((kpi, index) => (
            <Card key={index} className={`border ${getTrendColor(kpi.trend)}`}>
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">{kpi.label}</p>
                    <p className="text-lg font-bold">{kpi.value}</p>
                    {kpi.change && <p className="text-xs text-muted-foreground">{kpi.change}</p>}
                  </div>
                  {getTrendIcon(kpi.trend)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Main Response Card */}
      <Card className="w-full">
        {hasVisualData ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Analytics Response</CardTitle>
                <TabsList className="grid w-fit grid-cols-auto">
                  {tabsAvailable.map((tab) => (
                    <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                      <tab.icon className="h-4 w-4" />
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </CardHeader>

            <CardContent>
              {/* Text Response Tab */}
              {message && (
                <TabsContent value="text" className="mt-0">
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <div className="whitespace-pre-wrap">{message}</div>
                  </div>
                </TabsContent>
              )}

              {/* Chart Tab */}
              {chartData && (
                <TabsContent value="chart" className="mt-0">
                  <div className="h-96 w-full">
                    <h3 className="text-lg font-semibold mb-4">{chartData.title}</h3>
                    <GoogleChartWrapper
                      chartType={chartData.chartType}
                      data={chartData.data}
                      options={chartData.options}
                      width="100%"
                      height="100%"
                    />
                  </div>
                </TabsContent>
              )}

              {/* Table Tab */}
              {tableData && (
                <TabsContent value="table" className="mt-0">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">{tableData.title}</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-border">
                        <thead>
                          <tr className="bg-muted">
                            {tableData.headers.map((header, index) => (
                              <th
                                key={index}
                                className="border border-border px-4 py-2 text-left font-medium"
                              >
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {tableData.rows.map((row, rowIndex) => (
                            <tr key={rowIndex} className="hover:bg-muted/50">
                              {row.map((cell, cellIndex) => (
                                <td key={cellIndex} className="border border-border px-4 py-2">
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
              <CardTitle className="text-lg">Response</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <div className="whitespace-pre-wrap">{message}</div>
              </div>
            </CardContent>
          </>
        )}

        <div className="px-6 pb-4">
          <span className="text-xs text-muted-foreground">
            {new Date(timestamp).toLocaleTimeString()}
          </span>
        </div>
      </Card>
    </div>
  );
}
