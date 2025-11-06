'use client';

import React, { useState } from 'react';
import { ActionModal } from '../ActionModal';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ArrowDown, CheckCircle2 } from 'lucide-react';

interface FlowProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DepositFlow({ isOpen, onClose }: FlowProps) {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [source, setSource] = useState('bank');
  const [amount, setAmount] = useState('');

  const handleDeposit = () => {
    setStep('success');
  };

  const handleClose = () => {
    setStep('form');
    setSource('bank');
    setAmount('');
    onClose();
  };

  return (
    <ActionModal
      isOpen={isOpen}
      onClose={handleClose}
      title={step === 'form' ? 'Deposit Funds' : 'Instructions Generated'}
      description={step === 'form' ? 'Choose a source and amount to deposit.' : 'Follow the instructions to complete your deposit.'}
      icon={<ArrowDown className="h-6 w-6 text-blue-600" />}
    >
      {step === 'form' ? (
        <div className="space-y-4 py-4">
          <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
            <button onClick={() => setSource('bank')} className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${source === 'bank' ? 'bg-white shadow-sm' : ''}`}>From Bank</button>
            <button onClick={() => setSource('exchange')} className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${source === 'exchange' ? 'bg-white shadow-sm' : ''}`}>From Exchange</button>
          </div>
          <div>
            <Label htmlFor="deposit-amount">Amount (CAD)</Label>
            <Input id="deposit-amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" />
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={handleClose} className="w-full">Cancel</Button>
            <Button onClick={handleDeposit} disabled={!amount} className="w-full bg-amber-500 hover:bg-amber-600">Generate Instructions</Button>
          </div>
        </div>
      ) : (
        <div className="py-8 text-center">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <p className="text-lg font-medium">Reference Code: DSW-48AK2Z</p>
          <p className="text-gray-600">Check your email for full instructions.</p>
          <Button onClick={handleClose} className="mt-6">Done</Button>
        </div>
      )}
    </ActionModal>
  );
}
