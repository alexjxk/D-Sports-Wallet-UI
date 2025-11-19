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
          <div className="space-y-6 md:space-y-8">
            <BalanceHeader
              balance={activeWallet.balanceCAD}
              change24h={activeWallet.change24h}
              changeAmount={activeWallet.changeAmount}
              isHidden={isBalanceHidden}
              onToggleVisibility={() => setIsBalanceHidden(!isBalanceHidden)}
            />
            <ActionButtonsRow />
            <div className="px-4 sm:px-6 lg:px-8 space-y-6">
              <WalletManagementCard
                walletCount={MOCK_WALLETS.length}
                onManageWallets={handleManageWallets}
                onSecurityCenter={handleSecurityCenter}
              />
              <FavouritesSection
                assets={showAllAssets ? MOCK_ASSETS : MOCK_ASSETS.slice(0, 4)}
                onAssetClick={handleAssetClick}
                onSeeAll={handleSeeAllAssets}
                showAll={showAllAssets}
              />
            </div>
          </div>
        );
      
      case 'Earn':
        return (
          <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Earn Rewards</h2>
                  <p className="text-gray-600">Complete missions and earn rewards</p>
                </div>
              </CardContent>
            </Card>
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
      
      <main className="max-w-6xl mx-auto w-full py-8 md:py-12">
        <WalletTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
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
