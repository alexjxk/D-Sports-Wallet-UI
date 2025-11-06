'use client';

import React, { useState } from 'react';
import { ActionModal } from '../ActionModal';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MOCK_ASSETS } from '@/data/mock-wallet-data';
import { QrCode, Copy } from 'lucide-react';

interface FlowProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReceiveFlow({ isOpen, onClose }: FlowProps) {
  const [asset, setAsset] = useState('eth');
  const mockAddress = "0xC3644a1F3B2a5eC68D8C3648e2B68B0";

  const handleCopy = () => {
    navigator.clipboard.writeText(mockAddress);
  };

  return (
    <ActionModal
      isOpen={isOpen}
      onClose={onClose}
      title="Receive Asset"
      description="Share your address to receive assets."
      icon={<QrCode className="h-6 w-6 text-teal-500" />}
    >
      <div className="space-y-4 py-4">
        <div>
          <Label htmlFor="receive-asset">Asset</Label>
          <Select value={asset} onValueChange={setAsset}>
            <SelectTrigger id="receive-asset"><SelectValue placeholder="Select asset" /></SelectTrigger>
            <SelectContent>{MOCK_ASSETS.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-white rounded-lg border">
            {/* Placeholder for QR code component */}
            <svg width="160" height="160" viewBox="0 0 100 100">
              <rect width="100" height="100" fill="#f3f4f6" />
              <text x="50" y="55" textAnchor="middle" fontSize="10" fill="#9ca3af">QR Code</text>
            </svg>
          </div>
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg w-full">
            <span className="text-sm font-mono flex-1 truncate">{mockAddress}</span>
            <Button variant="ghost" size="icon" onClick={handleCopy}><Copy className="h-4 w-4" /></Button>
          </div>
        </div>
        <div className="text-xs text-center text-gray-500">
          Send only {MOCK_ASSETS.find(a => a.id === asset)?.symbol} on the Ethereum network to this address.
        </div>
        <div className="pt-4">
          <Button onClick={onClose} className="w-full">Done</Button>
        </div>
      </div>
    </ActionModal>
  );
}
