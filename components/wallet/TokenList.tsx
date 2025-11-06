'use client';

import React, { useMemo } from 'react';
import TokenCard from '@/components/wallet/TokenCard';
import { useTokenBalances } from '@/hooks/useTokenBalances';
import { useMultipleTokenPrices } from '@/hooks/useTokenPrices';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { CRYPTO_IMAGES } from '@/utils/cryptoImages';

interface TokenListProps {
  walletAddress?: string;
  chainId?: number;
}

// Demo tokens for empty state
const DEMO_TOKENS = [
  {
    name: 'Dogecoin',
    symbol: 'DOGE',
    logo: CRYPTO_IMAGES.DOGE,
    token_address: '0xDOGE',
    balance: '0',
    balanceFormatted: '0.0000',
    decimals: 8,
    usd: 0,
  },
  {
    name: 'Ethereum',
    symbol: 'ETH',
    logo: CRYPTO_IMAGES.ETH,
    token_address: '0xETH',
    balance: '0',
    balanceFormatted: '0.0000',
    decimals: 18,
    usd: 0,
  },
  {
    name: 'Bitcoin',
    symbol: 'BTC',
    logo: CRYPTO_IMAGES.BTC,
    token_address: '0xBTC',
    balance: '0',
    balanceFormatted: '0.0000',
    decimals: 8,
    usd: 0,
  },
  {
    name: 'USD Coin',
    symbol: 'USDC',
    logo: CRYPTO_IMAGES.USDC,
    token_address: '0xUSDC',
    balance: '0',
    balanceFormatted: '0.0000',
    decimals: 6,
    usd: 0,
  },
  {
    name: 'BNB',
    symbol: 'BNB',
    logo: CRYPTO_IMAGES.BNB,
    token_address: '0xBNB',
    balance: '0',
    balanceFormatted: '0.0000',
    decimals: 18,
    usd: 0,
  },
  {
    name: 'Polygon',
    symbol: 'MATIC',
    logo: CRYPTO_IMAGES.MATIC,
    token_address: '0xMATIC',
    balance: '0',
    balanceFormatted: '0.0000',
    decimals: 18,
    usd: 0,
  },
  {
    name: 'Solana',
    symbol: 'SOL',
    logo: CRYPTO_IMAGES.SOL,
    token_address: '0xSOL',
    balance: '0',
    balanceFormatted: '0.0000',
    decimals: 9,
    usd: 0,
  },
  {
    name: 'XRP',
    symbol: 'XRP',
    logo: CRYPTO_IMAGES.XRP,
    token_address: '0xXRP',
    balance: '0',
    balanceFormatted: '0.0000',
    decimals: 6,
    usd: 0,
  },
];

function TokenLoadingCard({ instanceId, index }: { instanceId: string; index: number }) {
  return (
    <div
      key={`${instanceId}-loading-${index}`}
      className="rounded-xl bg-muted/40 p-4 h-[120px] shadow-sm"
    >
      <div className="flex items-center justify-between h-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-24 bg-muted rounded animate-pulse" />
            <div className="h-3 w-16 bg-muted/70 rounded animate-pulse" />
            <div className="h-3 w-20 bg-muted/50 rounded animate-pulse" />
          </div>
        </div>
        <div className="text-right space-y-2">
          <div className="h-4 w-20 bg-muted rounded animate-pulse" />
          <div className="h-3 w-16 bg-muted/60 rounded animate-pulse" />
          <div className="h-3 w-12 bg-muted/40 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function TokenList({ walletAddress, chainId = 1 }: TokenListProps) {
  const { data: tokens, isLoading: tokensLoading, error, refetch } = useTokenBalances(walletAddress, chainId);

  // Generate a unique instance ID for this component to avoid key conflicts
  const instanceId = useMemo(() => {
    return `tokenlist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Map all tokens to have a guaranteed token_address property  
  const normalizedTokens = tokens?.map(token => ({
    ...token,
    token_address: token.token_address ?? '',
  })) || [];

  // If no tokens, show demo tokens. Otherwise, show all real tokens (even zero balance, including native ETH)
  const displayTokens = normalizedTokens.length === 0 ? DEMO_TOKENS : normalizedTokens;

  // Extract symbols for price fetching
  const tokenSymbols = displayTokens.map(token => token.symbol);

  // Fetch price data for all tokens
  const { data: priceData, isLoading: pricesLoading } = useMultipleTokenPrices(tokenSymbols);

  // Debug log for tokens and wallet address
  if (typeof window !== 'undefined') {
    console.log('TokenList render - walletAddress:', walletAddress);
    console.log('TokenList render - chainId:', chainId);
    console.log('TokenList render - tokens:', tokens);
    console.log('TokenList render - tokensLoading:', tokensLoading);
    console.log('TokenList render - priceData:', priceData);
    console.log('TokenList render - pricesLoading:', pricesLoading);
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
        <p className="text-red-500">Error loading tokens</p>
        <Button
          variant="outline"
          onClick={() => refetch()}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {tokensLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          {[...Array(4)].map((_, i) => (
            <TokenLoadingCard key={`${instanceId}-loading-${i}`} instanceId={instanceId} index={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          {displayTokens.map((token, index) => (
            <div key={`${instanceId}-${walletAddress || 'demo'}-${token.token_address}-${token.symbol}-${index}`}>
              <TokenCard 
                token={token} 
                priceData={priceData?.[token.symbol]} 
                isLoadingPrice={pricesLoading}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
