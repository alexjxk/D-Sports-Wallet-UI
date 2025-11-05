'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Copy, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

interface NewWalletPrivateKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  privateKey: string;
  walletAddress: string;
}

export function NewWalletPrivateKeyModal({ 
  isOpen, 
  onClose, 
  privateKey, 
  walletAddress 
}: NewWalletPrivateKeyModalProps) {
  const { toast } = useToast();
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [hasConfirmedSaved, setHasConfirmedSaved] = useState(false);

  const handleCopyPrivateKey = async () => {
    if (!privateKey) return;
    
    try {
      await navigator.clipboard.writeText(privateKey);
      toast({
        title: 'Copied!',
        description: 'Private key copied to clipboard',
      });
    } catch (error) {
      console.error('Failed to copy:', error);
      toast({
        title: 'Error',
        description: 'Failed to copy to clipboard',
        variant: 'destructive',
      });
    }
  };

  const handleClose = () => {
    if (!hasConfirmedSaved) {
      toast({
        title: 'Warning',
        description: 'Please confirm you have saved your private key before continuing',
        variant: 'destructive',
      });
      return;
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => handleClose()}>
      <DialogContent className="sm:max-w-lg" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Wallet Created Successfully!
          </DialogTitle>
          <DialogDescription>
            Your new wallet has been created. Please save your private key immediately - this is the only time it will be shown.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>CRITICAL:</strong> Save your private key now! If you lose it, you will permanently lose access to your wallet and all funds.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Wallet Address</label>
              </div>
              <div className="font-mono text-sm bg-background p-2 rounded border break-all">
                {walletAddress}
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Private Key</label>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPrivateKey(!showPrivateKey)}
                    className="h-8 w-8"
                  >
                    {showPrivateKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCopyPrivateKey}
                    className="h-8 w-8"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="font-mono text-sm bg-background p-2 rounded border break-all">
                {showPrivateKey ? privateKey : '•'.repeat(64)}
              </div>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="font-semibold text-amber-600">Security Best Practices:</div>
            <div className="space-y-2 text-muted-foreground ml-4">
              <p>• Write down your private key on paper and store it safely</p>
              <p>• Never share your private key with anyone</p>
              <p>• Do not store it digitally (screenshots, notes apps, etc.)</p>
              <p>• Consider using a hardware wallet for large amounts</p>
              <p>• Make multiple copies and store them in different secure locations</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="confirm-saved"
              checked={hasConfirmedSaved}
              onChange={(e) => setHasConfirmedSaved(e.target.checked)}
              className="h-4 w-4 text-amber-500 focus:ring-amber-500 border-gray-300 rounded"
            />
            <label htmlFor="confirm-saved" className="text-sm font-medium">
              I have securely saved my private key and understand I cannot recover it later
            </label>
          </div>
        </div>

        <DialogFooter>
          <Button 
            onClick={handleClose}
            disabled={!hasConfirmedSaved}
            className="w-full"
          >
            I Have Saved My Private Key - Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default NewWalletPrivateKeyModal; 