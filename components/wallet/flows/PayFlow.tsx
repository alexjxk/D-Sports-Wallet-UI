'use client';

import React, { useState } from 'react';
import { ActionModal } from '../ActionModal';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MOCK_ASSETS } from '@/data/mock-wallet-data';
import { CheckCircle2, ShoppingBag } from 'lucide-react';

interface FlowProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PayFlow({ isOpen, onClose }: FlowProps) {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [payType, setPayType] = useState('friend');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  const handlePay = () => {
    setStep('success');
  };

  const handleClose = () => {
    setStep('form');
    setPayType('friend');
    setRecipient('');
    setAmount('');
    onClose();
  };

  return (
    <ActionModal
      isOpen={isOpen}
      onClose={handleClose}
      title={step === 'form' ? 'Pay' : 'Payment Sent'}
      description={step === 'form' ? 'Pay a friend or a merchant.' : 'Your payment has been successfully sent.'}
      icon={<ShoppingBag className="h-6 w-6 text-purple-500" />}
    >
      {step === 'form' ? (
        <div className="space-y-4 py-4">
          <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
            <button onClick={() => setPayType('friend')} className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${payType === 'friend' ? 'bg-white shadow-sm' : ''}`}>Pay a Friend</button>
            <button onClick={() => setPayType('merchant')} className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${payType === 'merchant' ? 'bg-white shadow-sm' : ''}`}>Pay a Merchant</button>
          </div>
          {payType === 'friend' ? (
            <div>
              <Label htmlFor="friend-handle">Friend Handle / Address</Label>
              <Input id="friend-handle" value={recipient} onChange={e => setRecipient(e.target.value)} placeholder="@username or 0x..." />
            </div>
          ) : (
            <div>
              <Label htmlFor="merchant-id">Merchant ID / Invoice</Label>
              <Input id="merchant-id" value={recipient} onChange={e => setRecipient(e.target.value)} placeholder="Invoice #12345" />
            </div>
          )}
          <div>
            <Label htmlFor="pay-amount">Amount (USDC)</Label>
            <Input id="pay-amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" />
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={handleClose} className="w-full">Cancel</Button>
            <Button onClick={handlePay} disabled={!recipient || !amount} className="w-full bg-amber-500 hover:bg-amber-600">Pay Now</Button>
          </div>
        </div>
      ) : (
        <div className="py-8 text-center">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <p className="text-lg font-medium">Payment of {amount} USDC sent to:</p>
          <p className="text-sm text-gray-600">{recipient}</p>
          <Button onClick={handleClose} className="mt-6">Done</Button>
        </div>
      )}
    </ActionModal>
  );
}
