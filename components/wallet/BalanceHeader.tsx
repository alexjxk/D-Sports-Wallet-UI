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

  const isZero = change24h === 0 && changeAmount === 0;
  const changeColor = isZero 
    ? 'text-gray-500' 
    : (isPositive ? 'text-green-600' : 'text-red-600');

  return (
    <div className="py-4 md:py-6 flex flex-col items-center">
      <div className="flex items-center justify-center mb-1.5">
        <span className="text-gray-600 text-sm flex items-center gap-2">
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
      
      <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-3">
        {isHidden ? '••••••' : formatBalance(balance)}
      </div>
      
      <div className={`flex flex-col items-center gap-1 text-sm ${isHidden ? 'opacity-50' : ''}`}>
        <div className={`font-medium ${changeColor}`}>
          <span className="text-gray-600">24h Change: </span>
          {isPositive ? '+' : ''}{change24h.toFixed(2)}%
        </div>
        <div className={`font-medium ${changeColor}`}>
          <span className="text-gray-600">Today: </span>
          {isPositive ? '+' : ''}{isHidden ? '••••' : formatBalance(changeAmount)}
        </div>
      </div>
    </div>
  );
}

