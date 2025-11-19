"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WalletHeader } from '@/components/wallet/WalletHeader';
import { WalletTabs } from '@/components/wallet/WalletTabs';
import { BalanceHeader } from '@/components/wallet/BalanceHeader';
import { ActionButtonsRow } from '@/components/wallet/ActionButtonsRow';
import { WalletManagementCard } from '@/components/wallet/WalletManagementCard';
import { FavouritesSection } from '@/components/wallet/FavouritesSection';
import { MOCK_WALLETS, MOCK_ASSETS, MockWallet, MockAsset } from '@/data/mock-wallet-data';
import { BottomSheet, BottomSheetContent, BottomSheetHeader, BottomSheetTitle, BottomSheetDescription } from '@/components/ui/bottom-sheet';
import { Card, CardContent } from '@/components/ui/card';

// TODO: Replace with real data from API
interface MockTransaction {
  id: string;
  type: 'sent' | 'received';
  asset: string;
  amount: string;
  to?: string;
  from?: string;
  value: number;
  time: string;
}

const MOCK_TRANSACTIONS: MockTransaction[] = [
  {
    id: '1',
    type: 'sent',
    asset: 'ETH',
    amount: '0.05',
    to: '0x123…',
    value: -150.34,
    time: '2 hours ago',
  },
  {
    id: '2',
    type: 'received',
    asset: 'USDC',
    amount: '50',
    from: 'Binance',
    value: 50.00,
    time: '1 day ago',
  },
  {
    id: '3',
    type: 'sent',
    asset: 'USDT',
    amount: '25',
    to: '0x456…',
    value: -25.00,
    time: '3 days ago',
  },
];

function PortfolioBreakdown({ assets }: { assets: MockAsset[] }) {
  // Calculate portfolio percentages (mock calculation)
  const totalValue = assets.reduce((sum, asset) => sum + asset.valueUSD, 0);
  const topAssets = assets
    .filter(a => a.valueUSD > 0)
    .sort((a, b) => b.valueUSD - a.valueUSD)
    .slice(0, 3);
  
  if (topAssets.length === 0) return null;

  return (
    <div className="p-3 bg-white rounded-lg border border-gray-200">
      <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Portfolio Breakdown</h3>
      <div className="flex items-center gap-2 flex-wrap text-sm">
        {topAssets.map((asset, index) => {
          const percentage = totalValue > 0 ? Math.round((asset.valueUSD / totalValue) * 100) : 0;
          return (
            <React.Fragment key={asset.id}>
              <span className="text-gray-900">
                <span className="font-medium">{asset.symbol}</span> {percentage}%
              </span>
              {index < topAssets.length - 1 && (
                <span className="text-gray-400">•</span>
              )}
            </React.Fragment>
          );
        })}
        {assets.length > topAssets.length && (
          <>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600">Others {100 - topAssets.reduce((sum, a) => {
              const p = totalValue > 0 ? Math.round((a.valueUSD / totalValue) * 100) : 0;
              return sum + p;
            }, 0)}%</span>
          </>
        )}
      </div>
    </div>
  );
}

function RecentActivity() {
  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Recent Activity</h3>
      <div className="space-y-2">
        {MOCK_TRANSACTIONS.map((tx) => (
          <div key={tx.id} className="flex items-center justify-between text-sm">
            <div className="flex-1 min-w-0">
              <div className="text-gray-900">
                {tx.type === 'sent' ? (
                  <>Sent {tx.amount} {tx.asset} → {tx.to}</>
                ) : (
                  <>Received {tx.amount} {tx.asset} from {tx.from}</>
                )}
              </div>
              <div className="text-xs text-gray-500">{tx.time}</div>
            </div>
            <div className={`font-medium ml-4 ${tx.value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {tx.value >= 0 ? '+' : ''}${Math.abs(tx.value).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function WalletPage() {
  const router = useRouter();
  const [activeWallet, setActiveWallet] = useState<MockWallet>(MOCK_WALLETS[0]);
  const [activeTab, setActiveTab] = useState('wallet');
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);
  const [isManageWalletsOpen, setIsManageWalletsOpen] = useState(false);
  const [showAllAssets, setShowAllAssets] = useState(false);

  // Update balance when wallet changes
  useEffect(() => {
    // TODO: Fetch real balance from API
  }, [activeWallet]);

  const handleWalletChange = (wallet: MockWallet) => {
    setActiveWallet(wallet);
  };

  const handleManageWallets = () => {
    setIsManageWalletsOpen(true);
  };

  const handleSecurityCenter = () => {
    router.push('/security');
  };

  const handleAssetClick = (asset: MockAsset) => {
    router.push(`/wallet/asset/${asset.id}`);
  };

  const handleSeeAllAssets = () => {
    setShowAllAssets((prev) => !prev);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'wallet':
        return (
          <div className="space-y-4 md:space-y-6">
            <BalanceHeader
              balance={activeWallet.balanceCAD}
              change24h={activeWallet.change24h}
              changeAmount={activeWallet.changeAmount}
              isHidden={isBalanceHidden}
              onToggleVisibility={() => setIsBalanceHidden(!isBalanceHidden)}
            />
            <ActionButtonsRow />
            <div className="px-4 sm:px-6 lg:px-8 space-y-5">
              <WalletManagementCard
                walletCount={MOCK_WALLETS.length}
                onManageWallets={handleManageWallets}
                onSecurityCenter={handleSecurityCenter}
              />
              <PortfolioBreakdown assets={MOCK_ASSETS} />
              <FavouritesSection
                assets={showAllAssets ? MOCK_ASSETS : MOCK_ASSETS.slice(0, 4)}
                onAssetClick={handleAssetClick}
                onSeeAll={handleSeeAllAssets}
                showAll={showAllAssets}
              />
              <RecentActivity />
            </div>
          </div>
        );
      
      case 'collectables':
        return (
          <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Collectables</h2>
                  <p className="text-gray-600">View your NFT collectables</p>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <WalletHeader
        activeWallet={activeWallet}
        onWalletChange={handleWalletChange}
        onManageWallets={handleManageWallets}
      />
      
      <WalletTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <main className="max-w-6xl mx-auto w-full py-6 md:py-8">
        {renderTabContent()}
      </main>

      {/* Manage Wallets Bottom Sheet */}
      <BottomSheet open={isManageWalletsOpen} onOpenChange={setIsManageWalletsOpen}>
        <BottomSheetContent>
          <BottomSheetHeader>
            <BottomSheetTitle>Manage Wallets</BottomSheetTitle>
            <BottomSheetDescription>
              View and manage your wallets
            </BottomSheetDescription>
          </BottomSheetHeader>
          <div className="px-6 pb-6 space-y-3">
            {MOCK_WALLETS.map((wallet) => (
              <div
                key={wallet.id}
                className={`p-4 border rounded-lg ${
                  wallet.id === activeWallet.id
                    ? 'border-amber-500 bg-amber-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">{wallet.name}</div>
                    <div className="text-sm text-gray-600 font-mono">
                      {wallet.address.slice(0, 6)}…{wallet.address.slice(-4)}
                    </div>
                  </div>
                  {wallet.id === activeWallet.id && (
                    <span className="px-2 py-1 bg-amber-500 text-white text-xs rounded-full">
                      Active
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </BottomSheetContent>
      </BottomSheet>

      {/* Inline 'See All' expansion replaces the bottom sheet */}
    </div>
  );
}
