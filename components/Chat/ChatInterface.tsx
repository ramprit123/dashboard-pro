'use client';

import { useChat } from '@/hooks/useChat';
import { ChatMessage } from './ChatMessage';
import { QuerySuggestions } from './QuerySuggestions';
import { ScrollArea } from '@/components/UI/scroll-area';
import { useEffect, useRef } from 'react';

export function ChatInterface() {
  const { messages, isLoading, sendMessage } = useChat();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleQuerySelect = async (query: string) => {
    try {
      await sendMessage(query);
    } catch (error) {
      console.error('Failed to send query:', error);
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'end',
        });
      }
    };

    // Small delay to ensure DOM is updated
    const timeoutId = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeoutId);
  }, [messages, isLoading]);

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-border p-4">
        <h2 className="text-xl font-semibold">Chat History</h2>
        <p className="text-sm text-muted-foreground">{messages.length} messages</p>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4 pb-20">
          {messages.length === 0 ? (
            <QuerySuggestions onQuerySelect={handleQuerySelect} />
          ) : (
            messages.map((message) => <ChatMessage key={message.id} message={message} />)
          )}

          {isLoading && (
            <div className="flex items-center space-x-2 text-muted-foreground">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span>Analyzing call center data...</span>
            </div>
          )}

          {/* Invisible element to scroll to */}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
    </div>
  );
}
