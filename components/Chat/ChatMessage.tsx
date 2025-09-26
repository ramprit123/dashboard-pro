'use client';

import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/UI/avatar';
import { Bot, User, BarChart3, MousePointer } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/UI/badge';
import { useAnalytics } from '@/contexts/AnalyticsContext';

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

interface Message {
  id: string;
  message: string;
  timestamp: string;
  isUser?: boolean;
  conversationId?: string;
  chartData?: ChartData;
  tableData?: TableData;
  kpis?: KPI[];
  originalQuery?: string;
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const { updateAnalytics } = useAnalytics();
  const hasAnalytics = !message.isUser && (message.chartData || message.tableData || message.kpis);

  const handleAnalyticsClick = () => {
    if (hasAnalytics && message.originalQuery) {
      updateAnalytics(message.originalQuery, {
        message: message.message,
        chartData: message.chartData,
        tableData: message.tableData,
        kpis: message.kpis,
        timestamp: message.timestamp,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex gap-3 p-4 rounded-lg transition-colors',
        message.isUser ? 'bg-primary/10 ml-4' : 'bg-muted mr-4',
        hasAnalytics && 'hover:bg-muted/80 cursor-pointer'
      )}
      onClick={hasAnalytics ? handleAnalyticsClick : undefined}
    >
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarFallback>
          {message.isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-sm">{message.isUser ? 'You' : 'Assistant'}</span>
          <span className="text-xs text-muted-foreground">
            {new Date(message.timestamp).toLocaleTimeString()}
          </span>
          {hasAnalytics && (
            <Badge variant="secondary" className="text-xs">
              <BarChart3 className="h-3 w-3 mr-1" />
              Analytics
            </Badge>
          )}
          {hasAnalytics && <MousePointer className="h-3 w-3 text-muted-foreground" />}
        </div>
        <div className="text-sm leading-relaxed">
          {message.isUser ? (
            <p>{message.message}</p>
          ) : (
            <div>
              <p className="line-clamp-3">{message.message}</p>
              {hasAnalytics && (
                <p className="text-xs text-muted-foreground mt-2 italic">
                  📊 Click to view detailed charts and tables in the right panel
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
