'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet } from 'lucide-react';
import { useState } from 'react';
import { useWalletStore } from '@/stores/wallet-store';
import { useToast } from '@/hooks/use-toast';

export const LoginComponent = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const { setAddress } = useWalletStore();
  const { toast } = useToast();

  const handleConnectMetamask = async () => {
    try {
      setIsConnecting(true);
      // Simplified wallet connection - just set a demo address
      setAddress('0x1234567890123456789012345678901234567890');
      toast({
        title: 'Wallet Connected',
        description: 'Successfully connected to MetaMask',
      });
    } catch (error) {
      console.error('Failed to connect to MetaMask:', error);
      toast({
        title: 'Connection Failed',
        description: 'Failed to connect to MetaMask',
        variant: 'destructive',
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleConnectCoinbase = async () => {
    try {
      setIsConnecting(true);
      // Simplified wallet connection - just set a demo address
      setAddress('0x1234567890123456789012345678901234567890');
      toast({
        title: 'Wallet Connected',
        description: 'Successfully connected to Coinbase Wallet',
      });
    } catch (error) {
      console.error('Failed to connect to Coinbase Wallet:', error);
      toast({
        title: 'Connection Failed',
        description: 'Failed to connect to Coinbase Wallet',
        variant: 'destructive',
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleConnectWalletConnect = async () => {
    try {
      setIsConnecting(true);
      // Simplified wallet connection - just set a demo address
      setAddress('0x1234567890123456789012345678901234567890');
      toast({
        title: 'Wallet Connected',
        description: 'Successfully connected with WalletConnect',
      });
    } catch (error) {
      console.error('Failed to connect with WalletConnect:', error);
      toast({
        title: 'Connection Failed',
        description: 'Failed to connect with WalletConnect',
        variant: 'destructive',
      });
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Card className="border-none shadow-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Connect Your Wallet</CardTitle>
        <CardDescription>
          Connect your wallet to access your digital assets
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center gap-2 py-6"
          onClick={handleConnectMetamask}
          disabled={isConnecting}
        >
          <img src="/MetaMask_Fox.svg" alt="MetaMask" className="h-6 w-6" />
          <span>Connect with MetaMask</span>
        </Button>

        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center gap-2 py-6"
          onClick={handleConnectCoinbase}
          disabled={isConnecting}
        >
          <img src="/coinbase-wallet-logo.png" alt="Coinbase Wallet" className="h-6 w-6" />
          <span>Connect with Coinbase Wallet</span>
        </Button>

        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center gap-2 py-6"
          onClick={handleConnectWalletConnect}
          disabled={isConnecting}
        >
          <img src="/walletconnect-logo.png" alt="WalletConnect" className="h-6 w-6" />
          <span>Connect with WalletConnect</span>
        </Button>
      </CardContent>
    </Card>
  );
};

export default LoginComponent;
