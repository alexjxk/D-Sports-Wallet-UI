'use client';

import React, { useState } from 'react';
import { Info } from 'lucide-react';
import Image from 'next/image';
import { MockAsset } from '@/data/mock-wallet-data';
import { ASSET_EXPLANATIONS } from '@/data/mock-wallet-data';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CRYPTO_IMAGES } from '@/utils/cryptoImages';

interface AssetRowProps {
  asset: MockAsset;
  onClick: () => void;
}

export function AssetRow({ asset, onClick }: AssetRowProps) {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const isPositive = asset.change24h >= 0;
  const iconUrl = asset.icon || CRYPTO_IMAGES[asset.symbol as keyof typeof CRYPTO_IMAGES] || CRYPTO_IMAGES.ETH;

  const handleInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsTooltipOpen(true);
  };

  return (
    <>
      <div
        onClick={onClick}
        className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="relative w-10 h-10 flex-shrink-0">
            <Image
              src={iconUrl}
              alt={asset.name}
              fill
              className="rounded-full object-cover"
              sizes="40px"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><circle cx="20" cy="20" r="20" fill="#fef3c7"/><text x="20" y="25" text-anchor="middle" font-size="18" fill="#92400e">${asset.symbol[0]}</text></svg>`)}`;
              }}
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-gray-900 truncate">{asset.name}</h3>
              <button
                onClick={handleInfoClick}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                aria-label="Asset information"
              >
                <Info className="h-3 w-3 text-gray-500" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-500">{asset.symbol}</p>
              {asset.balance > 0 && (
                <span className="text-xs text-gray-400">
                  {asset.balanceFormatted} {asset.symbol}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="text-right flex-shrink-0 ml-4">
          <div className="font-semibold text-gray-900">
            ${asset.valueUSD.toFixed(2)}
          </div>
          <div className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}{asset.change24h.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Asset Info Tooltip */}
      <Dialog open={isTooltipOpen} onOpenChange={setIsTooltipOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{asset.name}</DialogTitle>
            <DialogDescription>
              {ASSET_EXPLANATIONS[asset.symbol] || `${asset.name} is a digital asset in your D-Sports wallet.`}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium text-gray-700">Utility in D-Sports:</span>
                <ul className="mt-2 space-y-1">
                  {asset.utility.map((util, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-amber-500 mt-1">•</span>
                      <span>{util}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

