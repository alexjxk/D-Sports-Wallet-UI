'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useWalletStore } from '@/stores/wallet-store';
import useSession from '@/hooks/use-session';
import { encryptPrivateKey } from '@/utils/encryption';
import { createUserWallet } from '@/app/_actions/wallets';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import NewWalletPrivateKeyModal from '@/components/wallet/NewWalletPrivateKeyModal';

interface CreateWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateWalletModal({ isOpen, onClose }: CreateWalletModalProps) {
  const { toast } = useToast();
  const { addWallet, setAddress } = useWalletStore();
  const [isCreating, setIsCreating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showPrivateKeyModal, setShowPrivateKeyModal] = useState(false);
  const [newWalletData, setNewWalletData] = useState<{
    privateKey: string;
    address: string;
  } | null>(null);
  const userSession = useSession();

  const handleCreateWallet = async () => {
    console.log('CREATE WALLET BUTTON CLICKED - Starting wallet creation');
    console.log('User session:', userSession);
    try {
      setIsCreating(true);
      setErrorMsg(null);
      console.log('Creating wallet - step 1: checking session');
      if (!userSession) throw new Error('Please sign in to create wallet');
      
      console.log('Creating wallet - step 2: generating private key');
      // 1. Generate wallet using viem
      const privateKey = generatePrivateKey();
      console.log('Generated private key:', privateKey.slice(0, 10) + '...');
      const account = privateKeyToAccount(privateKey);
      console.log('Generated account address:', account.address);
      
      // 2. Encrypt private key with session id
      const secret = userSession.id; // or use a passphrase if you want
      console.log('Creating wallet - step 3: encrypting private key');
      const encryptedPrivateKey = encryptPrivateKey(privateKey, secret);
      console.log('Encrypted private key length:', encryptedPrivateKey.length);
      
      // 3. Call server action to store
      console.log('Creating wallet - step 4: calling server action');
      await createUserWallet({ address: account.address, encryptedPrivateKey });
      console.log('Server action completed successfully');
      
      // 4. Add to local store
      console.log('Creating wallet - step 5: updating wallet store');
      addWallet({ address: account.address });
      setAddress(account.address); // Set as active wallet
      console.log('Wallet store updated, new address set:', account.address);
      
      // 5. Store the wallet data and show private key modal
      setNewWalletData({
        privateKey,
        address: account.address,
      });
      setShowPrivateKeyModal(true);
      
      toast({ title: 'Wallet Created', description: 'A new wallet has been created and linked to your account.' });
      console.log('SUCCESS: Wallet creation completed');
      onClose(); // Close the create wallet modal
    } catch (err: unknown) {
      const error = err as Error;
      console.error('ERROR creating wallet:', error);
      setErrorMsg(error.message || 'Unexpected error');
      toast({ title: 'Error', description: error.message || 'Failed to create wallet', variant: 'destructive' });
    } finally {
      setIsCreating(false);
      console.log('Create wallet process finished');
    }
  };

  const handlePrivateKeyModalClose = () => {
    setShowPrivateKeyModal(false);
    setNewWalletData(null);
  };

  console.log('CreateWalletModal render - isOpen:', isOpen);

  return (
    <>
      <Dialog 
        open={isOpen} 
        onOpenChange={(open) => { 
          console.log('Dialog onOpenChange called with:', open);
          if (!open) onClose(); 
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Create New Wallet</DialogTitle>
            <DialogDescription>Create a brand-new Ethereum wallet using viem that will be securely linked to your profile.</DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-6">
            <div className="flex flex-col items-center justify-center py-4">
              {userSession === null && (
                <p className="text-sm text-muted-foreground mb-2">Please sign in first.</p>
              )}
              <Button onClick={handleCreateWallet} disabled={isCreating || !userSession} className="w-full">
                {isCreating ? 'Creating Wallet...' : 'Create New Wallet'}
              </Button>
              {errorMsg && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errorMsg}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {newWalletData && (
        <NewWalletPrivateKeyModal
          isOpen={showPrivateKeyModal}
          onClose={handlePrivateKeyModalClose}
          privateKey={newWalletData.privateKey}
          walletAddress={newWalletData.address}
        />
      )}
    </>
  );
}

export default CreateWalletModal; 