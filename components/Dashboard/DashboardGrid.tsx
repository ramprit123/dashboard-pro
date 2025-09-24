'use client';

import dynamic from 'next/dynamic';
import { useDashboard } from '@/hooks/useDashboard';
import { Card, CardContent } from '@/components/UI/card';

// Dynamically import ResponsiveGridLayout with SSR disabled
const ResponsiveGridLayout = dynamic(() => import('react-grid-layout').then((m) => m.Responsive), {
  ssr: false,
});

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
    <ResponsiveGridLayout
      className="layout"
      layouts={{ lg: layout }}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
      rowHeight={60}
      isDraggable={false}
      isResizable={false}
    >
      {layout?.map((item) => (
        <div key={item.i}>
          <Card className="overflow-hidden">
            <CardContent className="p-4 h-full">
              <h3>Welcome chat</h3>
            </CardContent>
          </Card>
        </div>
      )) || []}
    </ResponsiveGridLayout>
  );
}
