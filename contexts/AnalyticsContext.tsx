'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

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

interface AnalyticsContextType {
  currentAnalytics: AnalyticsData | null;
  setCurrentAnalytics: (data: AnalyticsData | null) => void;
  updateAnalytics: (query: string, response: any) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const [currentAnalytics, setCurrentAnalytics] = useState<AnalyticsData | null>(null);

  const updateAnalytics = (query: string, response: any) => {
    const analyticsData: AnalyticsData = {
      message: response.message,
      chartData: response.chartData,
      tableData: response.tableData,
      kpis: response.kpis,
      timestamp: response.timestamp,
      query: query,
    };
    setCurrentAnalytics(analyticsData);
  };

  return (
    <AnalyticsContext.Provider
      value={{
        currentAnalytics,
        setCurrentAnalytics,
        updateAnalytics,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
}
