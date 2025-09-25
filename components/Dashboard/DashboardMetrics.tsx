'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/card';
import { MessageSquare, Users, TrendingUp, Clock } from 'lucide-react';

const metrics = [
  {
    title: 'Total Conversations',
    value: '1,234',
    change: '+12%',
    icon: MessageSquare,
  },
  {
    title: 'Active Users',
    value: '856',
    change: '+8%',
    icon: Users,
  },
  {
    title: 'Response Rate',
    value: '98.5%',
    change: '+2%',
    icon: TrendingUp,
  },
  {
    title: 'Avg Response Time',
    value: '150ms',
    change: '-5%',
    icon: Clock,
  },
];

export function DashboardMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            <metric.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">{metric.change}</span> from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
