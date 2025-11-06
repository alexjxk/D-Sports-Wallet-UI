'use client';

import React, { useState } from 'react';
import { Wallet, ChevronDown, Plus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { MOCK_WALLETS, MockWallet } from '@/data/mock-wallet-data';

interface WalletSelectorProps {
  activeWallet: MockWallet;
  onWalletChange: (wallet: MockWallet) => void;
  onManageWallets: () => void;
}

export function WalletSelector({ activeWallet, onWalletChange, onManageWallets }: WalletSelectorProps) {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}…${address.slice(-4)}`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
          <Wallet className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-900">
            {formatAddress(activeWallet.address)}
          </span>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase">
          Your Wallets
        </div>
        {MOCK_WALLETS.map((wallet) => (
          <DropdownMenuItem
            key={wallet.id}
            onClick={() => onWalletChange(wallet)}
            className={`cursor-pointer ${
              wallet.id === activeWallet.id ? 'bg-amber-50' : ''
            }`}
          >
            <div className="flex flex-col">
              <span className="font-medium text-gray-900">{wallet.name}</span>
              <span className="text-xs text-gray-500">{formatAddress(wallet.address)}</span>
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onManageWallets}
          className="cursor-pointer"
        >
          <Plus className="h-4 w-4 mr-2" />
          Manage wallets
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

