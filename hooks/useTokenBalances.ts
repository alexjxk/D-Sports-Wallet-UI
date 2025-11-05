import { useQuery } from '@tanstack/react-query';
import { createPublicClient, http, erc20Abi, formatUnits } from 'viem';
import { mainnet } from 'viem/chains';
import { SUPPORTED_TOKENS } from '@/constants/tokens';

// Create viem public client for reading blockchain data
const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(`https://1.rpc.thirdweb.com/${process.env.NEXT_PUBLIC_TW_CLIENT_ID}`)
});

export interface TokenData {
  token_address: string;
  name: string;
  symbol: string;
  logo?: string;
  thumbnail?: string;
  decimals: number;
  balance: string;
  balanceFormatted: string; // Human readable balance
  balanceRaw: bigint; // Raw balance as bigint
}

async function fetchTokenBalance(
  walletAddress: string, 
  tokenAddress: string,
  decimals: number,
  symbol: string,
  name: string,
  logoPath?: string
): Promise<TokenData> {
  console.log(`Fetching balance for token ${symbol} at ${tokenAddress}`);
  
  try {
    // Handle native ETH (address 0x0 or 'native')
    if (tokenAddress === 'native' || tokenAddress === '0x0000000000000000000000000000000000000000') {
      const balance = await publicClient.getBalance({
        address: walletAddress as `0x${string}`,
      });
      
      const formatted = formatUnits(balance, 18);
      
      return {
        token_address: 'native',
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18,
        balance: balance.toString(),
        balanceFormatted: formatted,
        balanceRaw: balance,
        logo: '/crypto-images/Ethereum ETH Logo.svg',
      };
    }
    
    // Handle ERC20 tokens
    const balance = await publicClient.readContract({
      address: tokenAddress as `0x${string}`,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [walletAddress as `0x${string}`],
    });
    
    const formatted = formatUnits(balance, decimals);
    
    return {
      token_address: tokenAddress,
      name,
      symbol,
      decimals,
      balance: balance.toString(),
      balanceFormatted: formatted,
      balanceRaw: balance,
      logo: logoPath,
    };
  } catch (error) {
    console.error(`Error fetching balance for ${symbol}:`, error);
    // Return zero balance on error
    return {
      token_address: tokenAddress,
      name,
      symbol,
      decimals,
      balance: '0',
      balanceFormatted: '0',
      balanceRaw: BigInt(0),
      logo: logoPath,
    };
  }
}

export function useTokenBalances(walletAddress?: string, chainId: number = 1) {
  console.log('useTokenBalances hook called with:', { walletAddress, chainId });
  
  return useQuery({
    queryKey: ['tokenBalances', walletAddress, chainId],
    queryFn: async (): Promise<TokenData[]> => {
      if (!walletAddress) {
        console.log('useTokenBalances: No wallet address provided, returning empty array');
        return [];
      }
      
      console.log('useTokenBalances: Fetching token balances for wallet:', walletAddress);
      
      // Get supported tokens
      const tokens = SUPPORTED_TOKENS;
      
      // Add native ETH
      const tokensWithNative = [
        {
          address: 'native',
          symbol: 'ETH',
          name: 'Ethereum',
          decimals: 18,
          logoPath: '/crypto-images/Ethereum ETH Logo.svg'
        },
        ...tokens
      ];
      
      try {
        // Fetch all token balances in parallel
        const balancePromises = tokensWithNative.map(token =>
          fetchTokenBalance(
            walletAddress,
            token.address,
            token.decimals,
            token.symbol,
            token.name,
            token.logoPath
          )
        );
        
        const results = await Promise.all(balancePromises);
        
        // Filter out tokens with zero balance (optional)
        // const nonZeroBalances = results.filter(token => 
        //   token.balanceRaw > BigInt(0)
        // );
        
        console.log(`useTokenBalances: Token balances fetched for wallet ${walletAddress}:`, results);
        return results;
      } catch (error) {
        console.error('Error fetching token balances:', error);
        throw error;
      }
    },
    enabled: !!walletAddress,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
  });
} 