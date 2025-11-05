'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown } from 'lucide-react';

import { TokenInfo } from '@/hooks/useTokenData';
import { CoinGeckoPriceData } from '@/hooks/useTokenPrices';
import { formatUnits } from 'viem';
import { Card, CardContent } from '@/components/ui/card';

interface TokenCardProps {
  token: TokenInfo;
  priceData?: CoinGeckoPriceData;
  isLoadingPrice?: boolean;
  isLoading?: boolean;
}

const shimmerAnimation = {
  initial: { backgroundPosition: '-200%' },
  animate: {
    backgroundPosition: '200%',
    transition: {
      repeat: Infinity,
      duration: 2,
      ease: 'linear',
    },
  },
};

export default function TokenCard({
  token,
  priceData,
  isLoadingPrice = false,
  isLoading = false,
}: TokenCardProps) {
  const formattedBalance = (() => {
    try {
      const rawBalance = formatUnits(
        BigInt(token.balance || '0'),
        token.decimals,
      );
      const numericBalance = parseFloat(rawBalance);
      if (numericBalance < 0.0001) return '0.0000';
      if (numericBalance < 1) return numericBalance.toFixed(6);
      return numericBalance.toFixed(4);
    } catch (error) {
      console.error('Error formatting balance:', error);
      return '0.0000';
    }
  })();

  const usdValue = (() => {
    try {
      const numericBalance = parseFloat(formattedBalance);
      const price = token.usd || 0;
      const value = numericBalance * price;
      if (value < 0.01) return '< $0.01';
      return `$${value.toFixed(2)}`;
    } catch (error) {
      console.error('Error calculating USD value:', error);
      return '$0.00';
    }
  })();

  const priceDisplay = (() => {
    // Debug logging
    console.log(`Price data for ${token.symbol}:`, {
      priceData,
      token_price_usd: token.price_usd,
      token_usd: token.usd
    });

    // Try to get price from CoinGecko data first
    if (priceData && priceData.current_price) {
      return `$${priceData.current_price.toFixed(2)}`;
    }
    
    // Fallback to token price_usd
    if (token.price_usd && token.price_usd > 0) {
      return `$${token.price_usd.toFixed(2)}`;
    }
    
    // Try to calculate from USD value and balance
    if (token.usd && token.usd > 0) {
      const numericBalance = parseFloat(formattedBalance);
      if (numericBalance > 0) {
        const pricePerToken = token.usd / numericBalance;
        return `$${pricePerToken.toFixed(2)}`;
      }
    }
    
    return '—';
  })();

  if (isLoading) {
    return (
      <Card className="w-full h-[120px] overflow-hidden">
        <CardContent className="p-4 h-full">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center gap-3">
              <motion.div
                variants={shimmerAnimation}
                initial="initial"
                animate="animate"
                className="w-10 h-10 rounded-full bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%]"
              />
              <div className="space-y-2">
                <motion.div
                  variants={shimmerAnimation}
                  initial="initial"
                  animate="animate"
                  className="h-4 w-24 bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%] rounded"
                />
                <motion.div
                  variants={shimmerAnimation}
                  initial="initial"
                  animate="animate"
                  className="h-3 w-16 bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%] rounded"
                />
              </div>
            </div>
            <div className="text-right space-y-2">
              <motion.div
                variants={shimmerAnimation}
                initial="initial"
                animate="animate"
                className="h-4 w-20 bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%] rounded"
              />
              <motion.div
                variants={shimmerAnimation}
                initial="initial"
                animate="animate"
                className="h-3 w-16 bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%] rounded"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-[120px] overflow-hidden">
      <CardContent className="p-4 h-full">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-3">
            {token.logo ? (
              <div className="relative w-10 h-10 flex-shrink-0">
                <Image
                  src={token.logo}
                  alt={token.name}
                  fill
                  className="rounded-full object-contain"
                  sizes="40px"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `/crypto-images/${token.symbol.toLowerCase()}.svg`;
                  }}
                />
              </div>
            ) : (
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-bold">{token.symbol[0]}</span>
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold truncate">{token.name}</h3>
              <p className="text-sm text-muted-foreground">{token.symbol}</p>
              {isLoadingPrice ? (
                <div className="h-5 w-16 bg-muted rounded animate-pulse" />
              ) : (
                <p className="text-sm font-medium text-foreground">{priceDisplay}</p>
              )}
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="font-medium text-sm">
              {formattedBalance} {token.symbol}
            </p>
            <p className="text-sm text-muted-foreground">{usdValue}</p>
            <div className="flex items-center justify-end gap-1 mt-1">
              {isLoadingPrice ? (
                <div className="h-4 w-12 bg-muted rounded animate-pulse" />
              ) : (
                priceData && priceData.price_change_percentage_24h !== undefined && (
                  <div className={`flex items-center gap-1 text-xs ${priceData.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {priceData.price_change_percentage_24h >= 0 ? (
                      <ArrowUp className="w-3 h-3" />
                    ) : (
                      <ArrowDown className="w-3 h-3" />
                    )}
                    <span>
                      {priceData.price_change_percentage_24h >= 0 ? '+' : ''}{priceData.price_change_percentage_24h.toFixed(2)}%
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
