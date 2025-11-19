'use client';

import React from 'react';
import { Bell, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { WalletSelector } from './WalletSelector';
import { NotificationsPanel } from './NotificationsPanel';
import { MockWallet } from '@/data/mock-wallet-data';

interface WalletHeaderProps {
  activeWallet: MockWallet;
  onWalletChange: (wallet: MockWallet) => void;
  onManageWallets: () => void;
}

export function WalletHeader({ activeWallet, onWalletChange, onManageWallets }: WalletHeaderProps) {
  const router = useRouter();
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);
  const unreadCount = 2; // TODO: Calculate from notifications

  return (
    <>
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="min-w-0">
              <WalletSelector
                activeWallet={activeWallet}
                onWalletChange={onWalletChange}
                onManageWallets={onManageWallets}
              />
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <button
                onClick={() => router.push('/settings')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                aria-label="Settings"
              >
                <Settings className="h-5 w-5 text-gray-900" />
              </button>
              
              <div className="flex-shrink-0">
                <button
                  onClick={() => setIsNotificationsOpen(true)}
                  className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="h-6 w-6 text-gray-900" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <NotificationsPanel isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
    </>
  );
}

