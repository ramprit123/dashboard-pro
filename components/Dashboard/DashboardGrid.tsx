'use client';

import { lazy, Suspense } from 'react';
import { useDashboard } from '@/hooks/useDashboard';
import { Card, CardContent } from '@/components/ui/card';

// Lazy load the grid layout to reduce initial bundle size
const Responsive = lazy(() => import('react-grid-layout').then(module => ({
  default: module.Responsive
})));

export function DashboardGrid() {
  const { currentDashboard, layout } = useDashboard();

  if (!currentDashboard) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No dashboard selected</p>
      </div>
    );
  }

  return (
    <Suspense fallback={<div className="animate-pulse bg-muted h-96 rounded" />}>
      <Responsive
        className="layout"
        layouts={{ lg: layout }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={60}
        isDraggable={false}
        isResizable={false}
      >
        {layout.map((item) => (
          <Card key={item.i} className="overflow-hidden">
            <CardContent className="p-4 h-full">
              <DashboardWidget widgetId={item.i} />
            </CardContent>
          </Card>
        ))}
      </Responsive>
    </Suspense>
  );
}

interface DashboardWidgetProps {
  widgetId: string;
}

function DashboardWidget({ widgetId }: DashboardWidgetProps) {
  // Widget factory pattern - easy to extend
  switch (widgetId) {
    case 'chat-metrics':
      return <div>Chat Metrics Widget</div>;
    case 'recent-chats':
      return <div>Recent Chats Widget</div>;
    case 'kpi-cards':
      return <div>KPI Cards Widget</div>;
    default:
      return <div>Unknown Widget: {widgetId}</div>;
  }
}