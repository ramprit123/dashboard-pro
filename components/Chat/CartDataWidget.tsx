'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/card';
import { Badge } from '@/components/UI/badge';
import { ShoppingCart, TrendingUp, AlertTriangle, DollarSign } from 'lucide-react';

interface CartAnalytics {
  totalCarts: number;
  activeCarts: number;
  abandonedCarts: number;
  totalRevenue: number;
  avgCartValue: number;
  categoryBreakdown: Record<string, number>;
  abandonmentRate: number;
}

export function CartDataWidget() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['cart-data-analytics'],
    queryFn: async () => {
      const response = await fetch('/api/cart-data?analytics=true');
      if (!response.ok) throw new Error('Failed to fetch cart data');
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Cart Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
            <p>Failed to load cart data</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const analytics: CartAnalytics = data?.analytics;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Cart Analytics Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Total Carts</span>
              </div>
              <p className="text-2xl font-bold">{analytics?.totalCarts || 0}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Active Carts</span>
              </div>
              <p className="text-2xl font-bold text-green-600">{analytics?.activeCarts || 0}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium">Abandoned</span>
              </div>
              <p className="text-2xl font-bold text-orange-600">{analytics?.abandonedCarts || 0}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Avg. Value</span>
              </div>
              <p className="text-2xl font-bold">${analytics?.avgCartValue?.toFixed(2) || '0.00'}</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Abandonment Rate</span>
              <Badge variant={analytics?.abandonmentRate > 50 ? 'destructive' : 'secondary'}>
                {analytics?.abandonmentRate?.toFixed(1) || 0}%
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {analytics?.categoryBreakdown &&
              Object.entries(analytics.categoryBreakdown).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-sm">{category}</span>
                  <Badge variant="outline">{count} items</Badge>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
