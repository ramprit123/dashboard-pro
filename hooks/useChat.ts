'use client';

import { create } from 'zustand';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Message {
  id: string;
  message: string;
  timestamp: string;
  isUser?: boolean;
  conversationId?: string;
}

interface ChatState {
  messages: Message[];
  currentConversationId: string;
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
}

const useChatStore = create<ChatState>((set) => ({
  messages: [],
  currentConversationId: 'default',
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
  setMessages: (messages) => set({ messages }),
}));

export function useChat() {
  const queryClient = useQueryClient();
  const { messages, addMessage, setMessages, currentConversationId } = useChatStore();

  // Fetch chat history
  const { isLoading: isLoadingHistory } = useQuery({
    queryKey: ['chat-history', currentConversationId],
    queryFn: async () => {
      const response = await fetch('/api/chat');
      if (!response.ok) throw new Error('Failed to fetch chat history');
      const data = await response.json();
      setMessages(data.messages || []);
      return data.messages;
    },
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      // Add user message immediately
      const userMessage: Message = {
        id: `user_${Date.now()}`,
        message,
        timestamp: new Date().toISOString(),
        isUser: true,
        conversationId: currentConversationId,
      };
      addMessage(userMessage);

      // Send to API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, conversationId: currentConversationId }),
      });

      if (!response.ok) throw new Error('Failed to send message');
      return response.json();
    },
    onSuccess: (data) => {
      // Add bot response
      const botMessage: Message = {
        id: data.id,
        message: data.message,
        timestamp: data.timestamp,
        isUser: false,
        conversationId: data.conversationId,
      };
      addMessage(botMessage);
    },
    onError: (error) => {
      console.error('Failed to send message:', error);
      // Could add error handling here
    },
  });

  // Stream message function (for future streaming implementation)
  const sendStreamingMessage = async (message: string) => {
    // Add user message
    const userMessage: Message = {
      id: `user_${Date.now()}`,
      message,
      timestamp: new Date().toISOString(),
      isUser: true,
    };
    addMessage(userMessage);

    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let streamedContent = '';

      const streamMessage: Message = {
        id: `bot_${Date.now()}`,
        message: '',
        timestamp: new Date().toISOString(),
        isUser: false,
      };
      addMessage(streamMessage);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') return;

            try {
              const parsed = JSON.parse(data);
              if (parsed.word) {
                streamedContent += parsed.word + ' ';
                // Update the streaming message
                // Note: This is a simplified version - in production, you'd want to update the specific message
                setMessages([
                  ...messages.slice(0, -1),
                  { ...streamMessage, message: streamedContent.trim() }
                ]);
              }
            } catch (e) {
              // Ignore parsing errors
            }
          }
        }
      }
    } catch (error) {
      console.error('Streaming failed:', error);
      // Fallback to regular message
      await sendMessageMutation.mutateAsync(message);
    }
  };

  return {
    messages,
    isLoading: sendMessageMutation.isPending,
    isLoadingHistory,
    sendMessage: sendMessageMutation.mutateAsync,
    sendStreamingMessage,
  };
}