'use client';

import React, { useState } from 'react';
import { ActionModal } from '../ActionModal';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MOCK_ASSETS } from '@/data/mock-wallet-data';
import { CheckCircle2, ArrowUp } from 'lucide-react';

interface FlowProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SellFlow({ isOpen, onClose }: FlowProps) {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [asset, setAsset] = useState('eth');
  const [amount, setAmount] = useState('');
  const [destination, setDestination] = useState('fiat');

  const handleSell = () => {
    setStep('success');
  };

  const handleClose = () => {
    setStep('form');
    setAsset('eth');
    setAmount('');
    setDestination('fiat');
    onClose();
  };

  return (
    <ActionModal
      isOpen={isOpen}
      onClose={handleClose}
      title={step === 'form' ? 'Sell Asset' : 'Sale Successful'}
      description={step === 'form' ? 'Sell your asset for fiat or stablecoin.' : 'Your sale has been completed.'}
      icon={<ArrowUp className="h-6 w-6 text-red-500" />}
    >
      {step === 'form' ? (
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="sell-asset">Asset to Sell</Label>
            <Select value={asset} onValueChange={setAsset}>
              <SelectTrigger id="sell-asset"><SelectValue /></SelectTrigger>
              <SelectContent>{MOCK_ASSETS.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="sell-amount">Amount</Label>
            <Input id="sell-amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" />
          </div>
          <div>
            <Label htmlFor="destination">Destination</Label>
            <Select value={destination} onValueChange={setDestination}>
              <SelectTrigger id="destination"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="fiat">Fiat Balance (CAD)</SelectItem>
                <SelectItem value="usdc">Stablecoin (USDC)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={handleClose} className="w-full">Cancel</Button>
            <Button onClick={handleSell} disabled={!asset || !amount} className="w-full bg-amber-500 hover:bg-amber-600">Sell</Button>
          </div>
        </div>
      ) : (
        <div className="py-8 text-center">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <p className="text-lg font-medium">You sold {amount} {MOCK_ASSETS.find(a => a.id === asset)?.symbol}</p>
          <Button onClick={handleClose} className="mt-6">Done</Button>
        </div>
      )}
    </ActionModal>
  );
}
