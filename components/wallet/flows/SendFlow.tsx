'use client';

import React, { useState } from 'react';
import { ActionModal } from '../ActionModal';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MOCK_ASSETS } from '@/data/mock-wallet-data';
import { CheckCircle2, Send } from 'lucide-react';

interface FlowProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SendFlow({ isOpen, onClose }: FlowProps) {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [asset, setAsset] = useState('eth');
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [note, setNote] = useState('');

  const handleSend = () => {
    setStep('success');
  };

  const handleClose = () => {
    setStep('form');
    setAsset('eth');
    setAmount('');
    setRecipient('');
    setNote('');
    onClose();
  };

  return (
    <ActionModal
      isOpen={isOpen}
      onClose={handleClose}
      title={step === 'form' ? 'Send Asset' : 'Transaction Successful'}
      description={step === 'form' ? 'Enter the details of your transaction.' : 'Your asset has been sent.'}
      icon={<Send className="h-6 w-6 text-orange-500" />}
    >
      {step === 'form' ? (
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="send-asset">Asset</Label>
            <Select value={asset} onValueChange={setAsset}>
              <SelectTrigger id="send-asset"><SelectValue placeholder="Select asset" /></SelectTrigger>
              <SelectContent>{MOCK_ASSETS.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="recipient">Recipient Address</Label>
            <Input id="recipient" value={recipient} onChange={e => setRecipient(e.target.value)} placeholder="0x..." />
          </div>
          <div>
            <Label htmlFor="send-amount">Amount</Label>
            <Input id="send-amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" />
          </div>
          <div>
            <Label htmlFor="note">Note (Optional)</Label>
            <Textarea id="note" value={note} onChange={e => setNote(e.target.value)} placeholder="e.g., For dinner" />
          </div>
          <div className="text-xs text-gray-500">Network fee: ~0.0001 ETH (mock)</div>
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={handleClose} className="w-full">Cancel</Button>
            <Button onClick={handleSend} disabled={!asset || !amount || !recipient} className="w-full bg-amber-500 hover:bg-amber-600">Send</Button>
          </div>
        </div>
      ) : (
        <div className="py-8 text-center">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <p className="text-lg font-medium">Sent {amount} {MOCK_ASSETS.find(a => a.id === asset)?.symbol} to:</p>
          <p className="text-sm text-gray-600 font-mono break-all">{recipient}</p>
          <Button onClick={handleClose} className="mt-6">Done</Button>
        </div>
      )}
    </ActionModal>
  );
}
