'use client';

import React from 'react';
import { AssetRow } from './AssetRow';
import { MockAsset } from '@/data/mock-wallet-data';

interface FavouritesSectionProps {
  assets: MockAsset[];
  onAssetClick: (asset: MockAsset) => void;
  onSeeAll: () => void;
  showAll?: boolean;
}

export function FavouritesSection({ assets, onAssetClick, onSeeAll, showAll = false }: FavouritesSectionProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Favourites</h2>
        <button
          onClick={onSeeAll}
          className="text-amber-600 text-sm font-medium hover:text-amber-700 transition-colors"
        >
          {showAll ? 'See Less' : 'See All'}
        </button>
      </div>
      
      <div className="space-y-3">
        {assets.map((asset) => (
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

