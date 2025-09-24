'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/UI/input';
import { Send, Minimize2, Move } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '@/hooks/useChat';
import { cn } from '@/lib/utils';

export function BottomRightInput() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const { sendMessage, isLoading } = useChat();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    await sendMessage(inputValue);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
    if (e.key === 'Escape') {
      setIsExpanded(false);
    }
  };

  return (
    <motion.div
      className={cn(
        'fixed z-50 cursor-move',
        'safe-area-inset-bottom safe-area-inset-right',
        isDragging && 'cursor-grabbing'
      )}
      initial={{
        x: typeof window !== 'undefined' ? window.innerWidth - (isExpanded ? 320 : 48) - 24 : 0,
        y: typeof window !== 'undefined' ? window.innerHeight - 48 - 24 : 0,
      }}
      animate={{
        width: isExpanded ? '320px' : '48px',
        height: isExpanded ? 'auto' : '48px',
      }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      drag
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={{
        left: 0,
        right: typeof window !== 'undefined' ? window.innerWidth - (isExpanded ? 320 : 48) : 0,
        top: 0,
        bottom: typeof window !== 'undefined' ? window.innerHeight - 48 : 0,
      }}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      whileDrag={{ scale: 1.05 }}
    >
      <AnimatePresence>
        {!isExpanded ? (
          <motion.div
            key="collapsed"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              size="lg"
              className="w-12 h-12 rounded-full shadow-lg"
              onClick={() => setIsExpanded(true)}
              aria-label="Open chat input"
            >
              <Send className="h-5 w-5" />
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="bg-background border border-border rounded-lg shadow-lg p-3"
          >
            <div className="flex items-center gap-2 mb-2">
              <Move className="h-3 w-3 text-muted-foreground cursor-grab" />
              <span className="text-sm font-medium flex-1">Quick Chat</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => setIsExpanded(false)}
                aria-label="Minimize chat input"
              >
                <Minimize2 className="h-3 w-3" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="sm"
                disabled={!inputValue.trim() || isLoading}
                className="px-3"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
