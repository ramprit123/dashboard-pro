'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/card';
import { Badge } from '@/components/UI/badge';
import { AlertCircle, CheckCircle, Clock, Zap } from 'lucide-react';

interface ApiStatus {
  status: 'healthy' | 'rate_limited' | 'error' | 'fallback';
  lastRequest?: string;
  rateLimitReset?: string;
  model?: string;
  fallbackActive?: boolean;
}

export function ApiStatusWidget() {
  const { data: status, isLoading } = useQuery<ApiStatus>({
    queryKey: ['api-status'],
    queryFn: async () => {
      try {
        // Test API with a simple request
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: 'status check',
            includeCartData: false,
          }),
        });

        if (response.ok) {
          return {
            status: 'healthy' as const,
            lastRequest: new Date().toISOString(),
            model: 'meta-llama/llama-3.1-8b-instruct:free',
          };
        } else if (response.status === 429) {
          return {
            status: 'rate_limited' as const,
            lastRequest: new Date().toISOString(),
          };
        } else {
          return {
            status: 'error' as const,
            lastRequest: new Date().toISOString(),
          };
        }
      } catch (error) {
        return {
          status: 'fallback' as const,
          fallbackActive: true,
          lastRequest: new Date().toISOString(),
        };
      }
    },
    refetchInterval: 30000, // Check every 30 seconds
    retry: false,
  });

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rate_limited':
        return <Clock className="h-4 w-4 text-orange-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'fallback':
        return <Zap className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'healthy':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Healthy
          </Badge>
        );
      case 'rate_limited':
        return <Badge variant="destructive">Rate Limited</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'fallback':
        return <Badge variant="secondary">Fallback Mode</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusMessage = (status?: ApiStatus) => {
    switch (status?.status) {
      case 'healthy':
        return 'OpenRouter API is working normally. Using AI-powered responses.';
      case 'rate_limited':
        return 'OpenRouter API rate limit reached. Requests are being throttled. Try again in a few minutes.';
      case 'error':
        return 'OpenRouter API is experiencing issues. Using fallback responses.';
      case 'fallback':
        return 'Using local cart analysis. OpenRouter API may be unavailable.';
      default:
        return 'Checking API status...';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            API Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          API Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon(status?.status)}
              <span className="font-medium">OpenRouter API</span>
            </div>
            {getStatusBadge(status?.status)}
          </div>

          <p className="text-sm text-muted-foreground">{getStatusMessage(status)}</p>

          {status?.model && (
            <div className="text-xs text-muted-foreground">Model: {status.model}</div>
          )}

          {status?.lastRequest && (
            <div className="text-xs text-muted-foreground">
              Last checked: {new Date(status.lastRequest).toLocaleTimeString()}
            </div>
          )}

          {status?.status === 'rate_limited' && (
            <div className="p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
              <p className="text-sm text-orange-800 dark:text-orange-200">
                💡 <strong>Tip:</strong> Free tier has rate limits. Consider upgrading your
                OpenRouter plan for higher limits.
              </p>
            </div>
          )}

          {status?.fallbackActive && (
            <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                🔄 <strong>Fallback Active:</strong> Using local cart analysis while API is
                unavailable.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
