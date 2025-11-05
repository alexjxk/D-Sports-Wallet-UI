// components/wallet/ImportWalletModal.tsx
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
import { mnemonicToAccount } from 'viem/accounts';

interface ImportWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ImportWalletModal({ isOpen, onClose }: ImportWalletModalProps) {
  const { toast } = useToast();
  const { addWallet, setAddress } = useWalletStore();
  const [input, setInput] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const userSession = useSession();

  const handleImportWallet = async () => {
    console.log('IMPORT WALLET BUTTON CLICKED - Starting wallet import');
    console.log('User session:', userSession);
    console.log('Input mnemonic:', input.trim().split(' ').length, 'words');
    try {
      setIsImporting(true);
      setErrorMsg(null);
      console.log('Importing wallet - step 1: checking session');
      if (!userSession) throw new Error('Please sign in to import wallet');
      let account;
      // Only accept 12-word mnemonic
      try {
        console.log('Importing wallet - step 2: validating mnemonic');
        const trimmedInput = input.trim();
        const words = trimmedInput.split(/\s+/);
        console.log('Word count:', words.length);
        if (words.length !== 12) {
          throw new Error('Please enter a valid 12-word mnemonic phrase.');
        }
        // Use viem to derive account
        console.log('Importing wallet - step 3: deriving account from mnemonic');
        account = mnemonicToAccount(trimmedInput);
        console.log('Derived account address:', account.address);
      } catch {
        throw new Error('Invalid 12-word mnemonic phrase');
      }
      // const ethRpc = `https://1.rpc.thirdweb.com/${process.env.NEXT_PUBLIC_TW_CLIENT_ID}`; // For future wallet client actions
      // Test connection by getting address
      const address = account.address;
      console.log('Importing wallet - step 4: validating address');
      if (!address) throw new Error('Failed to derive address from mnemonic');
      // Encrypt private key (from viem account)
      const secret = userSession.id;
      console.log('Importing wallet - step 5: encrypting private key');
      const privateKeyBytes = account.getHdKey().privateKey!;
      const privateKeyHex = '0x' + Buffer.from(privateKeyBytes).toString('hex');
      console.log('Private key hex length:', privateKeyHex.length);
      const encryptedPrivateKey = encryptPrivateKey(privateKeyHex, secret);
      console.log('Encrypted private key length:', encryptedPrivateKey.length);
      // Store via server action
      console.log('Importing wallet - step 6: calling server action');
      await createUserWallet({ address, encryptedPrivateKey });
      console.log('Server action completed successfully');
      console.log('Importing wallet - step 7: updating wallet store');
      addWallet({ address });
      setAddress(address); // Set as active wallet
      console.log('Wallet store updated, new address set:', address);
      toast({ title: 'Wallet Imported', description: 'Your wallet has been securely imported and linked to your account.' });
      console.log('SUCCESS: Wallet import completed');
      setInput('');
      onClose();
    } catch (err: unknown) {
      const error = err as Error;
      console.error('ERROR importing wallet:', error);
      setErrorMsg(error.message || 'Unexpected error');
      toast({ title: 'Error', description: error.message || 'Failed to import wallet', variant: 'destructive' });
    } finally {
      setIsImporting(false);
      console.log('Import wallet process finished');
    }
  };

  console.log('ImportWalletModal render - isOpen:', isOpen);

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => { 
        console.log('Import Dialog onOpenChange called with:', open);
        if (!open) onClose(); 
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Import Wallet</DialogTitle>
          <DialogDescription>Paste your 12-word mnemonic phrase to import an existing wallet. It will be securely encrypted and linked to your account. Only Ethereum Mainnet is supported for now.</DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-6">
          <div className="flex flex-col items-center justify-center py-4 w-full">
            {userSession === null && (
              <p className="text-sm text-muted-foreground mb-2">Please sign in first.</p>
            )}
            <textarea
              className="w-full p-2 border rounded mb-2"
              rows={3}
              placeholder="12-word mnemonic phrase"
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={isImporting || !userSession}
            />
            <Button onClick={handleImportWallet} disabled={isImporting || !input || !userSession} className="w-full">
              {isImporting ? 'Importing...' : 'Import Wallet'}
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
  );
}

export default ImportWalletModal;
