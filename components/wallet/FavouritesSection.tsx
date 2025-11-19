'use client';

import React, { useState, useMemo } from 'react';
import { AssetRow } from './AssetRow';
import { MockAsset } from '@/data/mock-wallet-data';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FavouritesSectionProps {
  assets: MockAsset[];
  onAssetClick: (asset: MockAsset) => void;
  onSeeAll: () => void;
  showAll?: boolean;
}

type SortOption = 'default' | 'name' | 'change24h' | 'value';

export function FavouritesSection({ assets, onAssetClick, onSeeAll, showAll = false }: FavouritesSectionProps) {
  const [sortBy, setSortBy] = useState<SortOption>('default');

  const sortedAssets = useMemo(() => {
    const sorted = [...assets];
    
    switch (sortBy) {
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'change24h':
        return sorted.sort((a, b) => b.change24h - a.change24h);
      case 'value':
        return sorted.sort((a, b) => b.valueUSD - a.valueUSD);
      default:
        return sorted;
    }
  }, [assets, sortBy]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Favourites</h2>
        <div className="flex items-center gap-3">
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
            <SelectTrigger className="w-32 h-8 text-xs">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="change24h">Top Movers</SelectItem>
              <SelectItem value="value">Value</SelectItem>
            </SelectContent>
          </Select>
          <button
            onClick={onSeeAll}
            className="text-amber-600 text-sm font-medium hover:text-amber-700 transition-colors"
          >
            {showAll ? 'See Less' : 'See All'}
          </button>
        </div>
      </div>
      
      <div className="space-y-3">
        {sortedAssets.map((asset) => (
          <AssetRow
            key={asset.id}
            asset={asset}
            onClick={() => onAssetClick(asset)}
          />
        ))}
      </div>
    </div>
  );
}

