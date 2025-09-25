'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/UI/button';
import { Input } from '@/components/UI/input';
import {
  Send,
  Minimize2,
  Move,
  Pin,
  Settings,
  CornerDownRight,
  CornerDownLeft,
  CornerUpLeft,
  CornerUpRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '@/hooks/useChat';
import { cn } from '@/lib/utils';

type Position = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'free';

interface Dimensions {
  width: number;
  height: number;
}

export function BottomRightInput() {
  const [isExpanded, setIsExpanded] = useState(false); // Start minimized
  const [inputValue, setInputValue] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [showPositionMenu, setShowPositionMenu] = useState(false);
  const [position, setPosition] = useState<Position>('bottom-left'); // Start bottom-left
  const [dimensions, setDimensions] = useState<Dimensions>({ width: 320, height: 200 });
  const [isSticky, setIsSticky] = useState(true); // Start sticky
  const [mounted, setMounted] = useState(false); // Fix hydration
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
  const { sendMessage, isLoading } = useChat();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    // Set initial screen size and responsive dimensions
    const updateScreenSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setScreenSize({ width, height });

      // Responsive default dimensions based on screen size
      if (width >= 1536) {
        // 2xl screens
        setDimensions((prev) => ({
          width: Math.min(prev.width, Math.max(400, width * 0.25)),
          height: Math.min(prev.height, Math.max(300, height * 0.4)),
        }));
      } else if (width >= 1280) {
        // xl screens
        setDimensions((prev) => ({
          width: Math.min(prev.width, Math.max(360, width * 0.28)),
          height: Math.min(prev.height, Math.max(250, height * 0.35)),
        }));
      } else if (width >= 1024) {
        // lg screens
        setDimensions((prev) => ({
          width: Math.min(prev.width, 320),
          height: Math.min(prev.height, 200),
        }));
      }
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);

    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const getPositionStyles = () => {
    if (!mounted || position === 'free' || !isSticky) return {};

    const margin = 24;
    const bottomMargin = 50; // 50px from bottom as requested

    switch (position) {
      case 'top-left':
        return { x: margin, y: margin };
      case 'top-right':
        return {
          x: window.innerWidth - (isExpanded ? dimensions.width : 48) - margin,
          y: margin,
        };
      case 'bottom-left':
        return {
          x: margin,
          y: window.innerHeight - (isExpanded ? dimensions.height : 48) - bottomMargin,
        };
      case 'bottom-right':
        return {
          x: window.innerWidth - (isExpanded ? dimensions.width : 48) - margin,
          y: window.innerHeight - (isExpanded ? dimensions.height : 48) - bottomMargin,
        };
      default:
        return {};
    }
  };

  const handlePositionChange = (newPosition: Position) => {
    setPosition(newPosition);
    setIsSticky(newPosition !== 'free');
    setShowPositionMenu(false);
  };

  const handleResize = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = dimensions.width;
    const startHeight = dimensions.height;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = Math.max(280, startWidth + (e.clientX - startX));
      const newHeight = Math.max(150, startHeight + (e.clientY - startY));
      setDimensions({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

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

  // Don't render until mounted to prevent hydration issues
  if (!mounted) {
    return null;
  }

  return (
    <motion.div
      ref={containerRef}
      className={cn(
        'fixed z-50',
        isDragging && 'cursor-grabbing',
        isResizing && isExpanded && 'cursor-nw-resize',
        !isSticky && !isExpanded && 'cursor-move'
      )}
      initial={{
        x: 24, // Start on left side
        y: window.innerHeight - 48 - 50, // 50px from bottom
      }}
      animate={{
        width: isExpanded ? `${dimensions.width}px` : '48px',
        height: isExpanded ? `${dimensions.height}px` : '48px',
        ...getPositionStyles(),
      }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      drag={(!isSticky || !isExpanded) && !isResizing}
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={{
        left: 0,
        right: window.innerWidth - (isExpanded ? dimensions.width : 48),
        top: 0,
        bottom: window.innerHeight - (isExpanded ? dimensions.height : 48),
      }}
      onDragStart={() => {
        setIsDragging(true);
        // If dragging while minimized, make it free-moving
        if (!isExpanded) {
          setIsSticky(false);
          setPosition('free');
        }
      }}
      onDragEnd={() => setIsDragging(false)}
      whileDrag={{ scale: isExpanded ? 1.02 : 1.1 }}
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
              onClick={(e) => {
                // Prevent expansion if currently dragging
                if (!isDragging) {
                  setIsExpanded(true);
                }
              }}
              onMouseDown={(e) => {
                // Prevent click event from firing during drag
                e.stopPropagation();
              }}
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
            className="bg-background border border-border rounded-lg shadow-lg h-full flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center gap-2 p-3 border-b border-border">
              {!isSticky && <Move className="h-3 w-3 text-muted-foreground cursor-grab" />}
              <span className="text-sm font-medium flex-1">Quick Chat</span>

              {/* Position Menu */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => setShowPositionMenu(!showPositionMenu)}
                  aria-label="Position settings"
                >
                  <Settings className="h-3 w-3" />
                </Button>

                {showPositionMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute right-0 top-8 bg-background border border-border rounded-md shadow-lg p-2 min-w-[160px] z-10"
                  >
                    <div className="text-xs font-medium text-muted-foreground mb-2">Position</div>
                    <div className="grid grid-cols-2 gap-1 mb-2">
                      <Button
                        variant={position === 'top-left' ? 'default' : 'ghost'}
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => handlePositionChange('top-left')}
                      >
                        <CornerUpLeft className="h-3 w-3 mr-1" />
                        TL
                      </Button>
                      <Button
                        variant={position === 'top-right' ? 'default' : 'ghost'}
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => handlePositionChange('top-right')}
                      >
                        <CornerUpRight className="h-3 w-3 mr-1" />
                        TR
                      </Button>
                      <Button
                        variant={position === 'bottom-left' ? 'default' : 'ghost'}
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => handlePositionChange('bottom-left')}
                      >
                        <CornerDownLeft className="h-3 w-3 mr-1" />
                        BL
                      </Button>
                      <Button
                        variant={position === 'bottom-right' ? 'default' : 'ghost'}
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => handlePositionChange('bottom-right')}
                      >
                        <CornerDownRight className="h-3 w-3 mr-1" />
                        BR
                      </Button>
                    </div>
                    <Button
                      variant={position === 'free' ? 'default' : 'ghost'}
                      size="sm"
                      className="w-full h-8 text-xs"
                      onClick={() => handlePositionChange('free')}
                    >
                      <Move className="h-3 w-3 mr-1" />
                      Free Move
                    </Button>
                  </motion.div>
                )}
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => setIsSticky(!isSticky)}
                aria-label={isSticky ? 'Unpin position' : 'Pin position'}
              >
                <Pin className={cn('h-3 w-3', isSticky && 'text-primary')} />
              </Button>

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

            {/* Content Area */}
            <div className="flex-1 p-3 overflow-auto">
              <div className="text-sm text-muted-foreground mb-3">
                Chat messages will appear here...
              </div>
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-border">
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
            </div>

            {/* Resize Handle - Only show when expanded */}
            {isExpanded && (
              <div
                className="absolute bottom-0 right-0 w-4 h-4 cursor-nw-resize opacity-50 hover:opacity-100 transition-opacity"
                onMouseDown={handleResize}
              >
                <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-muted-foreground" />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
