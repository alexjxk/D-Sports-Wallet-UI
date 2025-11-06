'use client';

import React, { useState } from 'react';
import { ActionModal } from '../ActionModal';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MOCK_ASSETS } from '@/data/mock-wallet-data';
import { CheckCircle2, Repeat } from 'lucide-react';

interface FlowProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SwapFlow({ isOpen, onClose }: FlowProps) {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [fromAsset, setFromAsset] = useState('eth');
  const [toAsset, setToAsset] = useState('usdc');
  const [fromAmount, setFromAmount] = useState('');

  const handleSwap = () => {
    setStep('success');
  };

  const handleClose = () => {
    setStep('form');
    setFromAsset('eth');
    setToAsset('usdc');
    setFromAmount('');
    onClose();
  };

  return (
    <ActionModal
      isOpen={isOpen}
      onClose={handleClose}
      title={step === 'form' ? 'Swap Assets' : 'Swap Successful'}
      description={step === 'form' ? 'Exchange one asset for another.' : 'Your swap has been completed.'}
      icon={<Repeat className="h-6 w-6 text-indigo-500" />}
    >
      {step === 'form' ? (
        <div className="space-y-4 py-4">
          <div>
            <Label>From</Label>
            <div className="flex gap-2">
              <Select value={fromAsset} onValueChange={setFromAsset}>
                <SelectTrigger className="w-2/5"><SelectValue /></SelectTrigger>
                <SelectContent>{MOCK_ASSETS.map(a => <SelectItem key={a.id} value={a.id}>{a.symbol}</SelectItem>)}</SelectContent>
              </Select>
              <Input type="number" value={fromAmount} onChange={e => setFromAmount(e.target.value)} placeholder="0.00" className="w-3/5" />
            </div>
          </div>
          <div>
            <Label>To</Label>
            <Select value={toAsset} onValueChange={setToAsset}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{MOCK_ASSETS.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="text-xs text-gray-500">Price impact: low (mock)</div>
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={handleClose} className="w-full">Cancel</Button>
            <Button onClick={handleSwap} disabled={!fromAmount} className="w-full bg-amber-500 hover:bg-amber-600">Swap</Button>
          </div>
        </div>
      ) : (
        <div className="py-8 text-center">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <p className="text-lg font-medium">You swapped {fromAmount} {MOCK_ASSETS.find(a => a.id === fromAsset)?.symbol} for ...</p>
          <Button onClick={handleClose} className="mt-6">Done</Button>
        </div>
      )}
    </ActionModal>
  );
}
