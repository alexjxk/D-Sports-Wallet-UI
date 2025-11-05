"use client";

import React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useWalletStore } from '@/stores/wallet-store';
import { useUserWallets } from '@/hooks/useUserWallets';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wallet, Plus, LogIn, Copy, ArrowLeft, AlertCircle, Key, Settings } from 'lucide-react';
import WalletDropdown from '@/components/wallet/WalletDropdown';
import { TokenList } from '@/components/wallet/TokenList';
import { useToast } from '@/hooks/use-toast';
import useCollectibles from '@/hooks/useCollectibles';
import CollectibleCard from '@/components/wallet/CollectibleCard';
import useSWR from 'swr';
import ChainSwitcher from '@/components/wallet/ChainSwitcher';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { generatePrivateKey, privateKeyToAccount, mnemonicToAccount } from 'viem/accounts';
import { encryptPrivateKey } from '@/utils/encryption';
import { createUserWallet } from '@/app/_actions/wallets';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import dynamic from 'next/dynamic';
import { useWalletBalance } from '@/hooks/useWalletBalance';
import PrivateKeyModal from '@/components/wallet/PrivateKeyModal';
import NewWalletPrivateKeyModal from '@/components/wallet/NewWalletPrivateKeyModal';

interface InventoryItem {
  name: string;
  description: string;
  image?: string;
}

type PageState = 'main' | 'create' | 'import';

function AnimatedContainer({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}

function AnimatedLoadingState() {
  return (
    <AnimatedContainer>
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mb-4" />
        <p className="text-lg text-muted-foreground">Loading your wallet...</p>
      </div>
    </AnimatedContainer>
  );
}

function AnimatedEmptyState({
  onCreate,
  onImport,
}: {
  onCreate: () => void;
  onImport: () => void;
}) {
  return (
    <AnimatedContainer>
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-4 text-center">
        <Wallet className="w-12 h-12 text-amber-500 mb-2" />
        <h2 className="text-2xl font-bold">No Wallets Found</h2>
        <p className="text-muted-foreground max-w-xs mx-auto">
          You don&apos;t have any wallets yet. Create a new smart wallet or import an
          existing one to get started.
        </p>
        <div className="flex gap-3 mt-2">
          <Button
            onClick={onCreate}
            className="bg-amber-500 text-white hover:bg-amber-600"
          >
            <Plus className="w-4 h-4 mr-1" /> Create Wallet
          </Button>
          <Button variant="outline" onClick={onImport}>
            <LogIn className="w-4 h-4 mr-1" /> Import Wallet
          </Button>
        </div>
      </div>
    </AnimatedContainer>
  );
}

function CreateWalletPage({ onBack, onSuccess }: { onBack: () => void; onSuccess: () => void }) {
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();
  const { addWallet, setAddress } = useWalletStore();
  const [isCreating, setIsCreating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showPrivateKeyModal, setShowPrivateKeyModal] = useState(false);
  const [newWalletData, setNewWalletData] = useState<{
    privateKey: string;
    address: string;
  } | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    useWalletStore.persist.rehydrate();
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  const handleCreateWallet = async () => {
    console.log('CREATE WALLET BUTTON CLICKED - Starting wallet creation');
    console.log('User session:', session);
    try {
      setIsCreating(true);
      setErrorMsg(null);
      console.log('Creating wallet - step 1: checking session');
      if (!session?.user?.id) throw new Error('Please sign in to create wallet');
      
      console.log('Creating wallet - step 2: generating private key');
      const privateKey = generatePrivateKey();
      console.log('Generated private key:', privateKey.slice(0, 10) + '...');
      const account = privateKeyToAccount(privateKey);
      console.log('Generated account address:', account.address);
      
      console.log('Creating wallet - step 3: encrypting private key');
      const secret = session.user.id;
      const encryptedPrivateKey = encryptPrivateKey(privateKey, secret);
      console.log('Encrypted private key length:', encryptedPrivateKey.length);
      
      console.log('Creating wallet - step 4: calling server action');
      await createUserWallet({ address: account.address, encryptedPrivateKey });
      console.log('Server action completed successfully');
      
      console.log('Creating wallet - step 5: updating wallet store');
      addWallet({ address: account.address });
      setAddress(account.address);
      console.log('Wallet store updated, new address set:', account.address);
      
      // Store the wallet data and show private key modal
      setNewWalletData({
        privateKey,
        address: account.address,
      });
      setShowPrivateKeyModal(true);
      
      toast({ title: 'Wallet Created', description: 'A new wallet has been created and linked to your account.' });
      console.log('SUCCESS: Wallet creation completed');
      // Don't call onSuccess yet - wait for user to close private key modal
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
    onSuccess(); // Now go back to main page
  };

  return (
    <>
      <AnimatedContainer>
        <div className="max-w-md mx-auto">
          <div className="mb-6">
            <Button variant="ghost" onClick={onBack} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <h2 className="text-2xl font-bold mb-2">Create New Wallet</h2>
            <p className="text-muted-foreground">
              Create a brand-new Ethereum wallet using viem that will be securely linked to your profile.
            </p>
          </div>
          
          <div className="space-y-4">
            {!session && (
              <p className="text-sm text-muted-foreground">Please sign in first.</p>
            )}
            
            <Button 
              onClick={handleCreateWallet} 
              disabled={isCreating || !session} 
              className="w-full"
              size="lg"
            >
              {isCreating ? 'Creating Wallet...' : 'Create New Wallet'}
            </Button>
            
            {errorMsg && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorMsg}</AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </AnimatedContainer>

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

function ImportWalletPage({ onBack, onSuccess }: { onBack: () => void; onSuccess: () => void }) {
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();
  const { addWallet, setAddress } = useWalletStore();
  const [input, setInput] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    useWalletStore.persist.rehydrate();
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  const handleImportWallet = async () => {
    console.log('IMPORT WALLET BUTTON CLICKED - Starting wallet import');
    console.log('User session:', session);
    console.log('Input mnemonic:', input.trim().split(' ').length, 'words');
    try {
      setIsImporting(true);
      setErrorMsg(null);
      console.log('Importing wallet - step 1: checking session');
      if (!session?.user?.id) throw new Error('Please sign in to import wallet');
      
      let account;
      try {
        console.log('Importing wallet - step 2: validating mnemonic');
        const trimmedInput = input.trim();
        const words = trimmedInput.split(/\s+/);
        console.log('Word count:', words.length);
        if (words.length !== 12) {
          throw new Error('Please enter a valid 12-word mnemonic phrase.');
        }
        console.log('Importing wallet - step 3: deriving account from mnemonic');
        account = mnemonicToAccount(trimmedInput);
        console.log('Derived account address:', account.address);
      } catch {
        throw new Error('Invalid 12-word mnemonic phrase');
      }
      
      const address = account.address;
      console.log('Importing wallet - step 4: validating address');
      if (!address) throw new Error('Failed to derive address from mnemonic');
      
      console.log('Importing wallet - step 5: encrypting private key');
      const secret = session.user.id;
      const privateKeyBytes = account.getHdKey().privateKey!;
      const privateKeyHex = '0x' + Buffer.from(privateKeyBytes).toString('hex');
      console.log('Private key hex length:', privateKeyHex.length);
      const encryptedPrivateKey = encryptPrivateKey(privateKeyHex, secret);
      console.log('Encrypted private key length:', encryptedPrivateKey.length);
      
      console.log('Importing wallet - step 6: calling server action');
      await createUserWallet({ address, encryptedPrivateKey });
      console.log('Server action completed successfully');
      
      console.log('Importing wallet - step 7: updating wallet store');
      addWallet({ address });
      setAddress(address);
      console.log('Wallet store updated, new address set:', address);
      
      toast({ title: 'Wallet Imported', description: 'Your wallet has been securely imported and linked to your account.' });
      console.log('SUCCESS: Wallet import completed');
      setInput('');
      onSuccess();
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

  return (
    <AnimatedContainer>
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <h2 className="text-2xl font-bold mb-2">Import Wallet</h2>
          <p className="text-muted-foreground">
            Paste your 12-word mnemonic phrase to import an existing wallet. It will be securely encrypted and linked to your account.
          </p>
        </div>
        
        <div className="space-y-4">
          {!session && (
            <p className="text-sm text-muted-foreground">Please sign in first.</p>
          )}
          
          <textarea
            className="w-full p-3 border rounded-lg resize-none"
            rows={4}
            placeholder="Enter your 12-word mnemonic phrase here..."
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={isImporting || !session}
          />
          
          <Button 
            onClick={handleImportWallet} 
            disabled={isImporting || !input.trim() || !session} 
            className="w-full"
            size="lg"
          >
            {isImporting ? 'Importing Wallet...' : 'Import Wallet'}
          </Button>
          
          {errorMsg && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMsg}</AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </AnimatedContainer>
  );
}

function WalletOverviewCard({ 
  address, 
  activeChainId, 
  setActiveChainId, 
  onCreateWallet, 
  onImportWallet 
}: { 
  address: string | null;
  activeChainId: number;
  setActiveChainId: (chainId: number) => void;
  onCreateWallet: () => void;
  onImportWallet: () => void;
}) {
  const { toast } = useToast();
  const { data: balance, isLoading: balanceLoading, error: balanceError } = useWalletBalance(address || undefined);
  const [privateKeyModalOpen, setPrivateKeyModalOpen] = useState(false);

  const handleCopy = async () => {
    if (!address) return;
    await navigator.clipboard.writeText(address);
    toast({
      title: 'Copied!',
      description: 'Wallet address copied to clipboard.',
    });
  };

  const handleShowPrivateKey = () => {
    setPrivateKeyModalOpen(true);
  };

  return (
    <>
      <Card className="h-fit">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 relative">
            <img
              src="/dslogo.png"
              alt="D-Sports Logo"
              className="w-8 h-8 rounded-full"
            />
            <span className="text-xl font-bold tracking-tight">My Wallet</span>
            {address && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                onClick={handleShowPrivateKey}
                aria-label="Wallet Settings"
              >
                <Settings className="h-4 w-4" />
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Wallet Address */}
          {address && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Wallet Address</label>
              <div className="flex items-center gap-2 p-3 bg-muted/40 rounded-lg">
                <span className="font-mono text-sm flex-1 truncate">
                  {address.slice(0, 8)}...{address.slice(-6)}
                </span>
                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded hover:bg-muted/70 transition"
                  title="Copy address"
                  aria-label="Copy address"
                >
                  <Copy className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>
          )}

          {/* Primary Balance */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Primary Balance</label>
            {balanceLoading ? (
              <div className="animate-pulse">
                <div className="h-8 w-32 bg-muted rounded"></div>
              </div>
            ) : balanceError ? (
              <p className="text-sm text-red-500">Error loading balance</p>
            ) : balance ? (
              <div className="text-2xl font-bold text-amber-500">
                {balance.formatted}
              </div>
            ) : (
              <div className="text-2xl font-bold text-muted-foreground">
                0.0000 ETH
              </div>
            )}
          </div>

          {/* Network Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Network</label>
            <ChainSwitcher
              activeChainId={activeChainId}
              setActiveChainId={setActiveChainId}
            />
          </div>

          {/* Wallet Dropdown */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Active Wallet</label>
            <WalletDropdown />
          </div>

          {/* Private Key Button - Only show if wallet exists */}
          {address && (
            <div className="pt-2">
              <Button 
                variant="outline" 
                onClick={handleShowPrivateKey}
                className="w-full border-amber-500 text-amber-500 hover:bg-amber-50"
                size="default"
              >
                <Key className="w-4 h-4 mr-2" /> Show Private Key
              </Button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <Button 
              variant="outline" 
              onClick={onCreateWallet}
              className="w-full"
              size="default"
            >
              <Plus className="w-4 h-4 mr-2" /> Create Wallet
            </Button>
            <Button 
              variant="outline" 
              onClick={onImportWallet}
              className="w-full"
              size="default"
            >
              <LogIn className="w-4 h-4 mr-2" /> Import Wallet
            </Button>
          </div>
        </CardContent>
      </Card>

      <PrivateKeyModal
        isOpen={privateKeyModalOpen}
        onClose={() => setPrivateKeyModalOpen(false)}
        address={address}
      />
    </>
  );
}

function useInventory() {
  const { data, error, isLoading } = useSWR('/api/inventory', async (url) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch inventory');
    return res.json();
  });
  return {
    items: data?.items || [],
    isLoading,
    error,
  };
}

function WalletPageComponent() {
  const [mounted, setMounted] = useState(false);
  const { wallets, address, setAddress, addWallet } =
    useWalletStore();
  const { data: userWallets, isLoading } = useUserWallets();
  const [activeTab, setActiveTab] = useState('tokens');
  const [pageState, setPageState] = useState<PageState>('main');
  
  // Calculate current address early so we can use it in hooks
  // Only use address if it's stable, otherwise return null to prevent multiple parallel queries
  const currentAddress = React.useMemo(() => {
    // Only return an address if we have a stable state
    if (address) return address;
    // Don't return store wallet address if we're still loading userWallets
    if (isLoading) return null;
    // Only return store wallet if we've finished syncing
    if (wallets && wallets.length > 0 && !isLoading) {
      return wallets[0].address;
    }
    return null;
  }, [address, wallets, isLoading]);
  
  const {
    collectibles,
    loading: collectiblesLoading,
    error: collectiblesError,
  } = useCollectibles(currentAddress || undefined);
  const {
    items: inventoryItems,
    isLoading: inventoryLoading,
    error: inventoryError,
  } = useInventory();
  const [activeChainId, setActiveChainId] = useState(1); // Default to Ethereum
  const { data: session, status } = useSession();
  const router = useRouter();

  // Prevent hydration mismatch
  useEffect(() => {
    // Manually hydrate the wallet store
    useWalletStore.persist.rehydrate();
    setMounted(true);
  }, []);

  // Debug logging
  console.log('WalletPage render - session status:', status);
  console.log('WalletPage render - userWallets:', userWallets);
  console.log('WalletPage render - store wallets:', wallets);
  console.log('WalletPage render - pageState:', pageState);
  console.log('WalletPage render - address from store:', address);
  console.log('WalletPage render - currentAddress (calculated):', currentAddress);
  console.log('WalletPage render - mounted:', mounted);
  console.log('WalletPage render - isLoading:', isLoading);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, router]);

  // Sync backend wallets to store
  useEffect(() => {
    if (mounted && userWallets && userWallets.length > 0) {
      console.log('Syncing backend wallets to store:', userWallets);
      userWallets.forEach((w) => {
        if (
          !wallets.some(
            (sw) => sw.address.toLowerCase() === w.address.toLowerCase(),
          )
        ) {
          console.log('Adding wallet to store:', w.address);
          addWallet({ address: w.address });
        }
      });
      if (!address && userWallets[0]) {
        console.log('Setting active address from userWallets:', userWallets[0].address);
        setAddress(userWallets[0].address);
      }
    }
  }, [mounted, userWallets, wallets, address, addWallet, setAddress]);

  // Also set address from store wallets if no address is set and we have store wallets
  useEffect(() => {
    if (mounted && !address && wallets && wallets.length > 0) {
      console.log('Setting active address from store wallets:', wallets[0].address);
      setAddress(wallets[0].address);
    }
  }, [mounted, address, wallets, setAddress]);

  const handleWalletSuccess = () => {
    setPageState('main');
  };

  // Prevent hydration errors by not rendering until mounted
  if (!mounted) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // Show loading if we're still checking auth
  if (status === 'loading') return <div>Loading...</div>;
  // Don't render anything if not authenticated (redirect will happen)
  if (!session) return null;

  // Loading state
  if (isLoading) return <AnimatedLoadingState />;

  // Check if we have ANY wallets (from either source)
  const hasWallets = (userWallets && userWallets.length > 0) || (wallets && wallets.length > 0);
  console.log('WalletPage render - hasWallets:', hasWallets, 'userWallets length:', userWallets?.length, 'store wallets length:', wallets?.length);

  // Show create wallet page
  if (pageState === 'create') {
    return (
      <div className="max-w-2xl mx-auto w-full px-2 sm:px-4 md:px-8 py-8 min-h-screen flex flex-col">
        <CreateWalletPage 
          onBack={() => setPageState('main')} 
          onSuccess={handleWalletSuccess}
        />
      </div>
    );
  }

  // Show import wallet page
  if (pageState === 'import') {
    return (
      <div className="max-w-2xl mx-auto w-full px-2 sm:px-4 md:px-8 py-8 min-h-screen flex flex-col">
        <ImportWalletPage 
          onBack={() => setPageState('main')} 
          onSuccess={handleWalletSuccess}
        />
      </div>
    );
  }

  // Empty state - show when no wallets exist from either source
  if (!hasWallets) {
    return (
      <div className="max-w-2xl mx-auto w-full px-2 sm:px-4 md:px-8 py-8 min-h-screen flex flex-col">
        <AnimatedEmptyState
          onCreate={() => {
            console.log('EMPTY STATE CREATE BUTTON CLICKED');
            setPageState('create');
          }}
          onImport={() => {
            console.log('EMPTY STATE IMPORT BUTTON CLICKED');
            setPageState('import');
          }}
        />
      </div>
    );
  }

  // Main wallet UI - show when user has wallets
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      {/* Two-Column Layout for Desktop, Single Column for Mobile */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Wallet Overview Card */}
          <div className="lg:col-span-1">
            <WalletOverviewCard
              address={currentAddress}
              activeChainId={activeChainId}
              setActiveChainId={setActiveChainId}
              onCreateWallet={() => {
                console.log('CREATE BUTTON CLICKED - Going to create page');
                setPageState('create');
              }}
              onImportWallet={() => {
                console.log('IMPORT BUTTON CLICKED - Going to import page');
                setPageState('import');
              }}
            />
          </div>

          {/* Right Column - Main Content Area */}
          <div className="lg:col-span-2">
            <Card className="h-fit">
              <CardContent className="p-6">
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="w-full grid grid-cols-3 h-auto p-0 rounded-none border-b bg-muted/50 mb-6">
                    <TabsTrigger
                      value="tokens"
                      className="text-md py-3 font-semibold data-[state=active]:bg-background data-[state=active]:text-amber-500 data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none"
                    >
                      Tokens
                    </TabsTrigger>
                    <TabsTrigger
                      value="collectibles"
                      className="text-md py-3 font-semibold data-[state=active]:bg-background data-[state=active]:text-amber-500 data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none"
                    >
                      Collectibles
                    </TabsTrigger>
                    <TabsTrigger
                      value="inventory"
                      className="text-md py-3 font-semibold data-[state=active]:bg-background data-[state=active]:text-amber-500 data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none"
                    >
                      Inventory
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="tokens" className="mt-0">
                    <AnimatedContainer>
                      {currentAddress ? (
                        <TokenList
                          walletAddress={currentAddress}
                          chainId={activeChainId}
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
                          <p className="text-muted-foreground">Loading wallet data...</p>
                        </div>
                      )}
                    </AnimatedContainer>
                  </TabsContent>

                  <TabsContent value="collectibles" className="mt-0">
                    <AnimatedContainer>
                      {collectiblesLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {[...Array(4)].map((_, i) => (
                            <div
                              key={i}
                              className="rounded-xl bg-muted/40 p-4 min-h-[180px] animate-pulse"
                            />
                          ))}
                        </div>
                      ) : collectiblesError ? (
                        <div className="flex flex-col items-center justify-center min-h-[200px] text-red-500">
                          <p>Error loading collectibles</p>
                        </div>
                      ) : collectibles && collectibles.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {collectibles.map((nft) => (
                            <CollectibleCard key={nft.id} collectible={nft} />
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center min-h-[200px] text-muted-foreground">
                          <span className="text-3xl mb-2">🎨</span>
                          <p>No collectibles found.</p>
                        </div>
                      )}
                    </AnimatedContainer>
                  </TabsContent>

                  <TabsContent value="inventory" className="mt-0">
                    <AnimatedContainer>
                      {inventoryLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {[...Array(3)].map((_, i) => (
                            <div
                              key={i}
                              className="rounded-xl bg-muted/40 p-6 flex flex-col items-center justify-center shadow-sm min-h-[120px] animate-pulse"
                            />
                          ))}
                        </div>
                      ) : inventoryError ? (
                        <div className="flex flex-col items-center justify-center min-h-[200px] text-red-500">
                          <p>Error loading inventory</p>
                        </div>
                      ) : inventoryItems.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {inventoryItems.map((item: InventoryItem, i: number) => (
                            <div
                              key={i}
                              className="rounded-xl bg-muted/40 p-6 flex flex-col items-center justify-center shadow-sm min-h-[120px]"
                            >
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-16 h-16 object-cover rounded mb-2"
                                />
                              )}
                              <span className="mt-2 font-semibold">{item.name}</span>
                              <span className="text-xs text-muted-foreground mt-1 text-center">
                                {item.description}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center min-h-[200px] text-muted-foreground">
                          <span className="text-3xl mb-2">📦</span>
                          <p>No inventory items found.</p>
                        </div>
                      )}
                    </AnimatedContainer>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export the dynamic component to prevent hydration issues
const WalletPage = dynamic(() => Promise.resolve(WalletPageComponent), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center min-h-screen">Loading...</div>
});

export default WalletPage;
