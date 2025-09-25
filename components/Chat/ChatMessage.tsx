'use client';

import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/UI/avatar';
import { Bot, User, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/UI/badge';

interface Message {
  id: string;
  message: string;
  timestamp: string;
  isUser?: boolean;
  conversationId?: string;
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const hasAnalytics = !message.isUser; // Bot messages might have analytics

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex gap-3 p-4 rounded-lg',
        message.isUser ? 'bg-primary/10 ml-4' : 'bg-muted mr-4'
      )}
    >
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarFallback>
          {message.isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-sm">{message.isUser ? 'You' : 'Assistant'}</span>
          <span className="text-xs text-muted-foreground">
            {new Date(message.timestamp).toLocaleTimeString()}
          </span>
          {hasAnalytics && (
            <Badge variant="secondary" className="text-xs">
              <BarChart3 className="h-3 w-3 mr-1" />
              Analytics
            </Badge>
          )}
        </div>
        <div className="text-sm leading-relaxed">
          {message.isUser ? (
            <p>{message.message}</p>
          ) : (
            <div>
              <p className="line-clamp-3">{message.message}</p>
              {hasAnalytics && (
                <p className="text-xs text-muted-foreground mt-2 italic">
                  📊 View detailed charts and tables in the right panel
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
