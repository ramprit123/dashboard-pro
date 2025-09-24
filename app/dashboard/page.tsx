import { Suspense } from 'react';
import { DashboardHeader } from '@/components/Dashboard/DashboardHeader';
import { DashboardGrid } from '@/components/Dashboard/DashboardGrid';
import { DashboardMetrics } from '@/components/Dashboard/DashboardMetrics';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="container mx-auto px-4 py-6">
        <Suspense fallback={<div className="animate-pulse bg-muted h-32 rounded mb-6" />}>
          <DashboardMetrics />
        </Suspense>
        
        <Suspense fallback={<div className="animate-pulse bg-muted h-96 rounded" />}>
          <DashboardGrid />
        </Suspense>
      </div>
    </div>
  );
}