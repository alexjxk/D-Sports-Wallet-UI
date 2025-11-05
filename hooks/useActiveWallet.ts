import { useEffect, useState } from 'react';
import { fetchUserWalletPrivateKey } from '@/app/_actions/wallets';
import { decryptPrivateKey } from '@/utils/encryption';
import useSession from '@/hooks/use-session';
import { ethers } from 'ethers';

export function useActiveWallet(address: string | null | undefined) {
  const [wallet, setWallet] = useState<ethers.Wallet | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const userSession = useSession();

  useEffect(() => {
    let cancelled = false;
    async function loadWallet() {
      if (!address || !userSession) {
        setWallet(null);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const encrypted = await fetchUserWalletPrivateKey(address);
        const privateKey = decryptPrivateKey(encrypted, userSession.id);
        const w = new ethers.Wallet(privateKey);
        if (!cancelled) setWallet(w);
      } catch (err: any) {
        if (!cancelled) {
          setWallet(null);
          setError(err.message || 'Failed to load wallet');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadWallet();
    return () => { cancelled = true; };
  }, [address, userSession]);

  return { wallet, loading, error };
} 