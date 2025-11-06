'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Send, ArrowDown, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MOCK_ASSETS } from '@/data/mock-wallet-data';
import Image from 'next/image';
import { CRYPTO_IMAGES } from '@/utils/cryptoImages';

export default function AssetDetailPage() {
  const router = useRouter();
  const params = useParams();
  const assetId = params.id as string;
  
  const asset = MOCK_ASSETS.find(a => a.id === assetId);
  
  if (!asset) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Asset not found</h1>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  const iconUrl = asset.icon || CRYPTO_IMAGES[asset.symbol as keyof typeof CRYPTO_IMAGES] || CRYPTO_IMAGES.ETH;
  const isPositive = asset.change24h >= 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 z-10">
        <div className="flex items-center gap-4 max-w-4xl mx-auto">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3 flex-1">
            <div className="relative w-10 h-10">
              <Image
                src={iconUrl}
                alt={asset.name}
                fill
                className="rounded-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><circle cx="20" cy="20" r="20" fill="#fef3c7"/><text x="20" y="25" text-anchor="middle" font-size="18" fill="#92400e">${asset.symbol[0]}</text></svg>`)}`;
                }}
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{asset.name}</h1>
              <p className="text-sm text-gray-600">{asset.symbol}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Balance & Price */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-end justify-between mb-4">
              <div>
                <div className="text-3xl font-bold text-gray-900">
                  ${asset.valueUSD.toFixed(2)}
                </div>
                <div className={`text-sm font-medium mt-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {isPositive ? '+' : ''}{asset.change24h.toFixed(2)}% (24h)
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Balance</div>
                <div className="text-lg font-semibold text-gray-900">{asset.balanceFormatted} {asset.symbol}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Price Chart Placeholder */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Price History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <p className="text-sm">Price chart (24h)</p>
                <p className="text-xs mt-1">TODO: Integrate chart library</p>
                {/* Simple SVG placeholder */}
                <svg width="100%" height="120" className="mt-4">
                  <polyline
                    points="0,100 50,80 100,90 150,70 200,75 250,60 300,65"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {asset.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Utility in D-Sports */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Utility in D-Sports</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {asset.utility.map((util, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">•</span>
                  <span className="text-gray-700">{util}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Sticky Action Bar */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto flex gap-3">
          <Button className="flex-1 bg-amber-500 hover:bg-amber-600" size="lg">
            <Send className="w-4 h-4 mr-2" />
            Send
          </Button>
          <Button variant="outline" className="flex-1" size="lg">
            <ArrowDown className="w-4 h-4 mr-2" />
            Receive
          </Button>
          <Button variant="outline" className="flex-1" size="lg">
            <ExternalLink className="w-4 h-4 mr-2" />
            View in explorer
          </Button>
        </div>
      </div>
    </div>
  );
}

