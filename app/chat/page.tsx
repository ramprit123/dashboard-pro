import { Suspense } from 'react';
import { ChatInterface } from '@/components/Chat/ChatInterface';
import { BottomRightInput } from '@/components/UI/BottomRightInput';
import { ChatMetrics } from '@/components/Chat/ChatMetrics';

export default function ChatPage() {
  return (
    <div className="flex h-screen bg-background">
      {/* Left Column - Metrics */}
      <div className="w-80 border-r border-border p-4 overflow-y-auto">
        <Suspense fallback={<div className="animate-pulse bg-muted h-64 rounded" />}>
          {/* <ChatMetrics /> */}
          <ChatInterface />
        </Suspense>
      </div>

      {/* Right Column - Chat */}
      <div className="flex-1 relative">
        {/* <ChatInterface /> */}
        <ChatMetrics />
      </div>

      {/* Fixed Input */}
      <BottomRightInput />
    </div>
  );
}
