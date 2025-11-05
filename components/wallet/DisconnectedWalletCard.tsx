'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';

export const DisconnectedWalletCard = () => {
  return (
    <Card className="border-yellow-200 bg-yellow-50 shadow-sm mb-4">
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10">
            <Image
              src="/wallet-icon.svg"
              alt="Disconnected Wallet"
              fill
              className="object-contain opacity-50"
            />
          </div>
          <div>
            <h3 className="font-medium text-sm text-yellow-700">Wallet Disconnected</h3>
            <p className="text-xs text-yellow-600">Please connect your wallet to continue</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DisconnectedWalletCard;
