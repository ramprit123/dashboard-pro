import { Suspense } from 'react';
import { ChatInterface } from '@/components/Chat/ChatInterface';
import { BottomRightInput } from '@/components/UI/BottomRightInput';
import { ChatMetrics } from '@/components/Chat/ChatMetrics';

export default function ChatPage() {
  return (
    <div className="flex flex-col lg:flex-row h-screen bg-background">
      {/* Left Column - Chat Interface */}
      <div className="w-full lg:w-80 xl:w-96 border-b lg:border-b-0 lg:border-r border-border p-4 overflow-y-auto h-1/2 lg:h-full">
        <Suspense fallback={<div className="animate-pulse bg-muted h-64 rounded" />}>
          <ChatInterface />
        </Suspense>
      </div>

      {/* Right Column - Metrics */}
      <div className="flex-1 relative h-1/2 lg:h-full">
        <ChatMetrics />
      </div>

      {/* Fixed Input */}
      <BottomRightInput />
    </div>
  );
}
