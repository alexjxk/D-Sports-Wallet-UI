'use client';

import React from 'react';
import { Wallet, CreditCard } from 'lucide-react';

interface WalletTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TABS = [
  { key: 'wallet', label: 'Wallet', icon: Wallet },
  { key: 'collectables', label: 'Collectables', icon: CreditCard },
];

export function WalletTabs({ activeTab, onTabChange }: WalletTabsProps) {
  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8 md:gap-12" role="tablist">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => onTabChange(key)}
              className={`py-3 px-4 md:px-6 text-base font-medium flex items-center gap-2 transition-colors relative ${
                activeTab === key
                  ? 'text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              role="tab"
              aria-selected={activeTab === key}
            >
              {Icon && <Icon className="h-5 w-5" />}
              {label}
              {activeTab === key && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

