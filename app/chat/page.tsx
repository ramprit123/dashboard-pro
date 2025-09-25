'use client';

import { Suspense } from 'react';
import { ChatInterface } from '@/components/Chat/ChatInterface';
import { BottomRightInput } from '@/components/UI/BottomRightInput';
import { AnalyticsDisplay } from '@/components/Chat/AnalyticsDisplay';
import { AnalyticsProvider, useAnalytics } from '@/contexts/AnalyticsContext';

function ChatPageContent() {
  const { currentAnalytics } = useAnalytics();

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-background">
      {/* Left Column - Chat Interface */}
      <div className="w-full lg:w-80 xl:w-96 border-b lg:border-b-0 lg:border-r border-border p-4 overflow-y-auto h-1/2 lg:h-full">
        <Suspense fallback={<div className="animate-pulse bg-muted h-64 rounded" />}>
          <ChatInterface />
        </Suspense>
      </div>

      {/* Right Column - Analytics Display */}
      <div className="flex-1 relative h-1/2 lg:h-full">
        <AnalyticsDisplay analyticsData={currentAnalytics} />
      </div>

      {/* Fixed Input */}
      <BottomRightInput />
    </div>
  );
}

export default function ChatPage() {
  return (
    <AnalyticsProvider>
      <ChatPageContent />
    </AnalyticsProvider>
  );
}
