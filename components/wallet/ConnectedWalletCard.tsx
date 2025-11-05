'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

// Utility function to format wallet address
const formatWalletAddress = (address: string, chars = 4): string => {
  if (!address) return '';
  return `${address.substring(0, chars)}...${address.substring(address.length - chars)}`;
};

// Connected Wallet Card Component with proper TypeScript types
interface ConnectedWalletCardProps {
  address: string;
  walletType?: string;
}

export const ConnectedWalletCard = ({ address, walletType = 'metamask' }: ConnectedWalletCardProps) => {
  // Get the appropriate wallet icon
  const getWalletIcon = () => {
    switch (walletType.toLowerCase()) {
      case 'metamask':
        return '/MetaMask_Fox.svg';
      default:
        return '/wallet-icon.svg'; // Default wallet icon
    }
  };

  // Get the blockchain explorer URL
  const getExplorerUrl = () => {
    return `https://etherscan.io/address/${address}`;
  };

  return (
    <Card className="border-green-200 bg-green-50 shadow-sm mb-4">
      <CardContent className="p-4 flex flex-row items-left justify-between">
        <div className="flex items-center gap-2">
          <div>
            <h3 className="font-medium text-sm text-green-700">Connected Wallet</h3>
            <p className="text-xs text-green-600">{formatWalletAddress(address, 6)}</p>
          </div>
        </div>
        <a
          href={getExplorerUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-600 hover:text-green-800"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </CardContent>
    </Card>
  );
};

export default ConnectedWalletCard;
