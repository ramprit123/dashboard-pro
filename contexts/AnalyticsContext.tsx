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
  data: Record<string, any>[];
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
  analyticsHistory: AnalyticsData[];
  setCurrentAnalytics: (data: AnalyticsData | null) => void;
  updateAnalytics: (query: string, response: any) => void;
  selectAnalytics: (analytics: AnalyticsData) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const [currentAnalytics, setCurrentAnalytics] = useState<AnalyticsData | null>(null);
  const [analyticsHistory, setAnalyticsHistory] = useState<AnalyticsData[]>([]);

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

    // Add to history if it has visual data
    if (analyticsData.chartData || analyticsData.tableData || analyticsData.kpis) {
      setAnalyticsHistory((prev) => {
        // Remove duplicate if exists and add to front
        const filtered = prev.filter((item) => item.query !== query);
        return [analyticsData, ...filtered].slice(0, 10); // Keep last 10
      });
    }
  };

  const selectAnalytics = (analytics: AnalyticsData) => {
    setCurrentAnalytics(analytics);
  };

  return (
    <AnalyticsContext.Provider
      value={{
        currentAnalytics,
        analyticsHistory,
        setCurrentAnalytics,
        updateAnalytics,
        selectAnalytics,
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
