'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface RefreshButtonProps {
  onClick: () => void;
  isRefreshing: boolean;
  className?: string;
  position?: 'inline' | 'absolute';
}

function RefreshButton({
  onClick,
  isRefreshing,
  className = '',
  position = 'inline',
}: RefreshButtonProps) {
  if (position === 'absolute') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.button
              onClick={onClick}
              className={`absolute -top-8 -right-8 p-1 background-transparent rounded-full transition-colors ${className}`}
              whileHover={{ scale: 1.1, rotate: 10 }}
              whileTap={{ scale: 0.9, rotate: 0 }}
              disabled={isRefreshing}
              aria-label="Refresh balance"
            >
              <motion.div
                animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
                transition={
                  isRefreshing
                    ? {
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 1.5,
                        ease: 'linear',
                      }
                    : {}
                }
              >
                <RefreshCw className="h-3.5 w-3.5 text-amber-500 sm:h-4 sm:w-4" />
              </motion.div>
            </motion.button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Refresh data</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Default inline button
  return (
    <motion.button
      onClick={onClick}
      className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-background border border-border hover:bg-muted/50 transition-colors ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      disabled={isRefreshing}
    >
      <motion.div
        animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
        transition={
          isRefreshing
            ? {
                repeat: Number.POSITIVE_INFINITY,
                duration: 1.5,
                ease: 'linear',
              }
            : {}
        }
      >
        <RefreshCw className="h-4 w-4" />
      </motion.div>
      <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
    </motion.button>
  );
}

export default memo(RefreshButton);
