'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NotFoundScreen from '@/app/not-found';
import { Settings } from 'lucide-react';
import { LoadingSpinnerCustom } from '@/components/leaderboard/loading-spinner-custom';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface WalletProfileSectionProps {
  totalMarketValue: number;
  isRefreshing: boolean;
  refetch: () => Promise<void>;
  isLoading: boolean;
  isError: boolean;
  isLoggedIn: boolean;
  sdkHasLoaded: boolean;
  walletAddress?: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  setIsRefreshing: (val: boolean) => void;
}

const fadeInUpVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export default function WalletProfileSection({
  totalMarketValue,
  isRefreshing,
  refetch,
  isLoading,
  isError,
  isLoggedIn,
  sdkHasLoaded,
  walletAddress,
  open,
  setOpen,
  setIsRefreshing,
}: WalletProfileSectionProps) {
  const handleRefresh = () => {
    setIsRefreshing(true);
    refetch().finally(() => setIsRefreshing(false));
  };

  return (
    <motion.div
      variants={fadeInUpVariants}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      <div className="overflow-hidden border-none shadow-md bg-linear-to-br from-background to-muted">
        <div className="p-4 sm:p-6 md:p-8 flex flex-col items-center space-y-6 relative">
          {!open && (
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(!open)}
                aria-label="Wallet Settings"
              >
                <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>
          )}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32">
            <Image
              src="/dslogo.png"
              alt="D-Sports Logo"
              fill
              className="object-contain"
              priority
            />
          </div>

          <AnimatePresence mode="wait">
            {isLoading || isRefreshing ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <LoadingSpinnerCustom />
              </motion.div>
            ) : isLoggedIn && sdkHasLoaded && isError ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <NotFoundScreen />
              </motion.div>
            ) : (
              <motion.div
                key="balance"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  damping: 20,
                }}
                className="text-center space-y-2 relative"
              >
                <motion.h1
                  className="text-4xl font-bold bg-clip-text text-gold"
                  key={totalMarketValue.toString()}
                  initial={{ opacity: 0.5, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  ${totalMarketValue.toFixed(2)}
                </motion.h1>

                {/* Absolute positioned refresh button */}
                <button
                  onClick={handleRefresh}
                  className="absolute top-2 right-2 sm:top-4 sm:right-4"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Refresh"
                  >
                    <LoadingSpinnerCustom />
                  </Button>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mx-4">
            {walletAddress && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Wallet Address:</span>
                <span className="text-sm">{walletAddress}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
