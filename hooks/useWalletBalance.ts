import { useQuery } from '@tanstack/react-query';
import { createPublicClient, http, formatEther } from 'viem';
import { mainnet } from 'viem/chains';

// Create viem public client for reading blockchain data
const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(`https://1.rpc.thirdweb.com/${process.env.NEXT_PUBLIC_TW_CLIENT_ID}`)
});

export interface WalletBalance {
  address: string;
  balance: string; // ETH balance as string
  balanceWei: bigint; // Raw balance in wei
  formatted: string; // Formatted balance with symbol
}

export function useWalletBalance(address?: string) {
  return useQuery({
    queryKey: ['walletBalance', address],
    queryFn: async (): Promise<WalletBalance | null> => {
      if (!address) return null;
      
      console.log('Fetching balance for address:', address);
      
      try {
        const balanceWei = await publicClient.getBalance({
          address: address as `0x${string}`,
        });
        
        const balanceEth = formatEther(balanceWei);
        
        console.log('Balance fetched:', {
          address,
          balanceWei: balanceWei.toString(),
          balanceEth
        });
        
        return {
          address,
          balance: balanceEth,
          balanceWei,
          formatted: `${parseFloat(balanceEth).toFixed(4)} ETH`
        };
      } catch (error) {
        console.error('Error fetching balance:', error);
        throw error;
      }
    },
    enabled: !!address,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
  });
} 