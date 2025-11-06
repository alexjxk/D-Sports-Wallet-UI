'use client';

import React, { useState } from 'react';
import { ActionModal } from '../ActionModal';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MOCK_ASSETS } from '@/data/mock-wallet-data';
import { CheckCircle2, Plus } from 'lucide-react';

interface FlowProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BuyFlow({ isOpen, onClose }: FlowProps) {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [asset, setAsset] = useState('eth');
  const [amount, setAmount] = useState('');

  const selectedAsset = MOCK_ASSETS.find(a => a.id === asset);
  const receivedAmount = amount && selectedAsset ? (parseFloat(amount) / selectedAsset.valueUSD).toFixed(5) : '0.00';

  const handleBuy = () => {
    // Simulate API call
    setStep('success');
  };

  const handleClose = () => {
    setStep('form');
    setAmount('');
    setAsset('eth');
    onClose();
  };

  return (
    <ActionModal
      isOpen={isOpen}
      onClose={handleClose}
      title={step === 'form' ? 'Buy Asset' : 'Purchase Successful'}
      description={step === 'form' ? 'Select an asset and enter the amount to buy.' : 'Your asset has been added to your wallet.'}
      icon={<Plus className="h-6 w-6 text-green-600" />}
    >
      {step === 'form' ? (
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="asset">Asset</Label>
            <Select value={asset} onValueChange={setAsset}>
              <SelectTrigger id="asset">
                <SelectValue placeholder="Select an asset" />
              </SelectTrigger>
              <SelectContent>
                {MOCK_ASSETS.map(a => (
                  <SelectItem key={a.id} value={a.id}>{a.name} ({a.symbol})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="amount">Amount to buy (CAD)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>
          {amount && selectedAsset && (
            <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
              You’ll receive approx. <span className="font-medium">{receivedAmount} {selectedAsset.symbol}</span>
            </div>
          )}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={handleClose} className="w-full">Cancel</Button>
            <Button onClick={handleBuy} disabled={!amount} className="w-full bg-amber-500 hover:bg-amber-600">Buy</Button>
          </div>
        </div>
      ) : (
        <div className="py-8 text-center">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <p className="text-lg font-medium">You bought {receivedAmount} {selectedAsset?.symbol}</p>
          <Button onClick={handleClose} className="mt-6">Done</Button>
        </div>
      )}
    </ActionModal>
  );
}
