'use client';

import React from 'react';
import { Menu, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TrendingUp } from 'lucide-react';
import { WalletSelector } from './WalletSelector';
import { SideDrawer } from './SideDrawer';
import { MissionsPanel } from './MissionsPanel';
import { NotificationsPanel } from './NotificationsPanel';
import { MockWallet } from '@/data/mock-wallet-data';

interface WalletHeaderProps {
  activeWallet: MockWallet;
  onWalletChange: (wallet: MockWallet) => void;
  onManageWallets: () => void;
}

export function WalletHeader({ activeWallet, onWalletChange, onManageWallets }: WalletHeaderProps) {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [isMissionsOpen, setIsMissionsOpen] = React.useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);
  const unreadCount = 2; // TODO: Calculate from notifications

  return (
    <>
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex-shrink-0">
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6 text-gray-900" />
              </button>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="min-w-0">
                <WalletSelector
                  activeWallet={activeWallet}
                  onWalletChange={onWalletChange}
                  onManageWallets={onManageWallets}
                />
              </div>
              
              <Button
                onClick={() => setIsMissionsOpen(true)}
                className="bg-amber-500 hover:bg-amber-600 text-white px-3 sm:px-4 py-2 rounded-full text-sm flex items-center gap-2 flex-shrink-0"
              >
                <TrendingUp className="h-4 w-4 md:h-5 md:w-5" />
                <span className="hidden sm:inline">Missions</span>
              </Button>
              
              <div className="flex-shrink-0">
                <button
                  onClick={() => setIsNotificationsOpen(true)}
                  className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="h-6 w-6 text-gray-900" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SideDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      <MissionsPanel isOpen={isMissionsOpen} onClose={() => setIsMissionsOpen(false)} />
      <NotificationsPanel isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
    </>
  );
}

