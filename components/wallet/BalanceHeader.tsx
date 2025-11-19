'use client';

import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface BalanceHeaderProps {
  balance: number;
  change24h: number;
  changeAmount: number;
  isHidden: boolean;
  onToggleVisibility: () => void;
}

export function BalanceHeader({
  balance,
  change24h,
  changeAmount,
  isHidden,
  onToggleVisibility,
}: BalanceHeaderProps) {
  const formatBalance = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const isPositive = change24h >= 0;

  return (
    <div className="py-8 md:py-12 flex flex-col items-center">
      <div className="flex items-center justify-center mb-2">
        <span className="text-gray-600 text-sm md:text-base flex items-center gap-2">
          Total Balance
          <button
            onClick={onToggleVisibility}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
            aria-label={isHidden ? 'Show balance' : 'Hide balance'}
          >
            {isHidden ? (
              <EyeOff className="h-4 w-4 text-gray-500" />
            ) : (
              <Eye className="h-4 w-4 text-gray-500" />
            )}
          </button>
        </span>
      </div>
      
      <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-2">
        {isHidden ? '••••••' : formatBalance(balance)}
      </div>
      
      <div className={`flex items-center gap-4 text-sm ${isHidden ? 'opacity-50' : ''}`}>
        <span className={`font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? '+' : ''}{change24h.toFixed(2)}%
        </span>
        <span className={`font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? '+' : ''}{isHidden ? '••••' : formatBalance(changeAmount)}
        </span>
      </div>
    </div>
  );
}

