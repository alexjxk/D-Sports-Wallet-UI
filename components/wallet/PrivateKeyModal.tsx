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
import { AlertTriangle, Copy, Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import useSession from '@/hooks/use-session';
import { decryptPrivateKey } from '@/utils/encryption';
import { fetchUserWalletPrivateKey } from '@/app/_actions/wallets';

interface PrivateKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  address: string | null;
}

export function PrivateKeyModal({ isOpen, onClose, address }: PrivateKeyModalProps) {
  const { toast } = useToast();
  const [privateKey, setPrivateKey] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [hasRetrieved, setHasRetrieved] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const userSession = useSession();

  const handleRetrievePrivateKey = async () => {
    if (!address) return;
    
    try {
      setIsLoading(true);
      setErrorMsg(null);
      
      // Try to fetch from localStorage first (client-side mode)
      const localSecret = 'local-wallet-secret-' + (typeof window !== 'undefined' ? window.location.hostname : 'dev');
      const storedKey = localStorage.getItem(`wallet_${address}`);
      
      if (storedKey) {
        // Decrypt using local secret
        const decryptedPrivateKey = decryptPrivateKey(storedKey, localSecret);
        setPrivateKey(decryptedPrivateKey);
        setHasRetrieved(true);
        setShowPrivateKey(true);
        return;
      }
      
      // Fallback to server if userSession exists and backend is enabled
      if (userSession) {
        try {
          const encryptedPrivateKey = await fetchUserWalletPrivateKey(address);
          const decryptedPrivateKey = decryptPrivateKey(encryptedPrivateKey, userSession.id);
          setPrivateKey(decryptedPrivateKey);
          setHasRetrieved(true);
          setShowPrivateKey(true);
          return;
        } catch (serverError) {
          // Server fetch failed, continue to error message
        }
      }
      
      // No private key found
      throw new Error('Private key not found. This wallet was not created in this session.');
      
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Error retrieving private key:', error);
      setErrorMsg(error.message || 'Failed to retrieve private key');
      toast({
        title: 'Error',
        description: error.message || 'Failed to retrieve private key',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

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
    setPrivateKey('');
    setHasRetrieved(false);
    setShowPrivateKey(false);
    setErrorMsg(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Reveal Private Key
          </DialogTitle>
          <DialogDescription>
            Your private key gives full access to your wallet. Keep it safe and never share it with anyone.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          {!hasRetrieved ? (
            // Initial warning screen
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Security Warning:</strong> Anyone with access to your private key can control your wallet and steal all your assets.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Never share your private key with anyone</p>
                <p>• Store it securely offline</p>
                <p>• Make sure no one is watching your screen</p>
                <p>• Consider using a hardware wallet for large amounts</p>
              </div>

              <Button 
                onClick={handleRetrievePrivateKey} 
                disabled={isLoading || !address}
                className="w-full"
                variant="destructive"
              >
                {isLoading ? 'Retrieving...' : 'I Understand, Reveal Private Key'}
              </Button>
            </div>
          ) : (
            // Private key display
            <div className="space-y-4">
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
              
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Make sure to save this private key in a secure location. You will not be able to recover your wallet without it.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {errorMsg && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{errorMsg}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default PrivateKeyModal; 