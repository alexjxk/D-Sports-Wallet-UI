'use client';

import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@radix-ui/react-tabs';
import { motion } from 'framer-motion';
import { NotFoundScreen } from '@/components/ui-utils/not-found-screen';
import { LoadingSpinnerCustom } from '@/components/leaderboard/loading-spinner-custom';
import { Card } from '@/components/ui/card';
import { TokenList } from '@/components/wallet/TokenList';
// import CollectibleList from './CollectibleList';

interface WalletTabsSectionProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isLoggedIn: boolean;
  isLoading: boolean;
  isRefreshing: boolean;
  sdkHasLoaded: boolean;
  isError: boolean;
  walletAddress?: string;
}

const fadeInUpVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

const tabVariants = {
  initial: { opacity: 0, x: -20 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

export default function WalletTabsSection({
  activeTab,
  setActiveTab,
  isLoggedIn,
  isLoading,
  isRefreshing,
  sdkHasLoaded,
  isError,
  walletAddress,
}: WalletTabsSectionProps) {
  return (
    <motion.div
      variants={fadeInUpVariants}
      initial="initial"
      animate="animate"
      className="flex flex-col h-full"
    >
      <Card className="flex-1 border-none shadow-md overflow-hidden">
        <Tabs
          defaultValue="tokens"
          value={activeTab}
          onValueChange={setActiveTab}
          className="h-full flex flex-col"
        >
          <TabsList className="w-full grid grid-cols-2 h-auto rounded-none border-b bg-muted/50">
            <TabsTrigger
              value="tokens"
              className="text-sm sm:text-md md:text-xl p-2 font-semibold data-[state=active]:bg-background data-[state=active]:text-gold data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-gold rounded-none"
            >
              TOKENS
            </TabsTrigger>
            <TabsTrigger
              value="collectibles"
              className="text-sm sm:text-md md:text-xl p-2 font-semibold data-[state=active]:bg-background data-[state=active]:text-gold data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-gold rounded-none"
            >
              COLLECTIBLES
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden">
            <TabsContent
              value="tokens"
              className="h-full mt-0 p-2 sm:p-4 md:p-6 data-[state=active]:h-full"
            >
              <motion.div
                key="tokens-content"
                variants={tabVariants}
                initial="initial"
                animate="animate"
                className="h-full overflow-y-auto"
              >
                {!isLoggedIn ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Please log in to see tokens.
                    </p>
                  </div>
                ) : isLoading || isRefreshing ? (
                  <div className="flex items-center justify-center h-full">
                    <LoadingSpinnerCustom />
                  </div>
                ) : isLoggedIn && sdkHasLoaded && isError ? (
                  <NotFoundScreen />
                ) : (
                  <TokenList walletAddress={walletAddress!} />
                )}
              </motion.div>
            </TabsContent>

            <TabsContent
              value="collectibles"
              className="h-full mt-0 p-2 sm:p-4 md:p-6 data-[state=active]:h-full"
            >
              <motion.div
                key="collectibles-content"
                variants={tabVariants}
                initial="initial"
                animate="animate"
                className="h-full overflow-y-auto"
              >
                {/* <CollectibleList /> */}
              </motion.div>
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </motion.div>
  );
}
