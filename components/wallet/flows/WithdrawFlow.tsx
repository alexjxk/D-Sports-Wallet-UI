'use client';

import React, { useState } from 'react';
import { ActionModal } from '../ActionModal';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MOCK_ASSETS } from '@/data/mock-wallet-data';
import { CheckCircle2, Landmark } from 'lucide-react';

interface FlowProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WithdrawFlow({ isOpen, onClose }: FlowProps) {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [asset, setAsset] = useState('usdc');
  const [amount, setAmount] = useState('');
  const [destination, setDestination] = useState('bank');

  const handleWithdraw = () => {
    setStep('success');
  };

  const handleClose = () => {
    setStep('form');
    setAsset('usdc');
    setAmount('');
    setDestination('bank');
    onClose();
  };

  return (
    <ActionModal
      isOpen={isOpen}
      onClose={handleClose}
      title={step === 'form' ? 'Withdraw' : 'Withdrawal Initiated'}
      description={step === 'form' ? 'Withdraw your funds to a bank or external wallet.' : 'Your withdrawal is being processed.'}
      icon={<Landmark className="h-6 w-6 text-amber-500" />}
    >
      {step === 'form' ? (
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="withdraw-asset">From</Label>
            <Select value={asset} onValueChange={setAsset}>
              <SelectTrigger id="withdraw-asset"><SelectValue /></SelectTrigger>
              <SelectContent>{MOCK_ASSETS.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="withdraw-amount">Amount</Label>
            <Input id="withdraw-amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" />
          </div>
          <div>
            <Label htmlFor="withdraw-destination">Destination</Label>
            <Select value={destination} onValueChange={setDestination}>
              <SelectTrigger id="withdraw-destination"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="bank">Bank Account (...1234)</SelectItem>
                <SelectItem value="wallet">External Wallet (...5678)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={handleClose} className="w-full">Cancel</Button>
            <Button onClick={handleWithdraw} disabled={!asset || !amount} className="w-full bg-amber-500 hover:bg-amber-600">Withdraw</Button>
          </div>
        </div>
      ) : (
        <div className="py-8 text-center">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <p className="text-lg font-medium">Withdrawal of {amount} {MOCK_ASSETS.find(a => a.id === asset)?.symbol} initiated.</p>
          <p className="text-sm text-gray-600">Estimated arrival: 1-2 business days (mock)</p>
          <Button onClick={handleClose} className="mt-6">Done</Button>
        </div>
      )}
    </ActionModal>
  );
}
