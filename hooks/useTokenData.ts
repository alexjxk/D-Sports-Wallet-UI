import { useQuery } from '@tanstack/react-query';
import { useTokenPrices } from './useTokenPrices';
import { useTokenBalances as useTokenBalancesHook } from './useTokenBalances';

export interface TokenInfo {
  name: string;
  symbol: string;
  logo?: string;
  decimals: number;
  token_address: string;
  balance: string;
  balanceFormatted: string;
  usd?: number;
  price_usd?: number;
  price_24h_change?: number;
}

export interface UseTokenDataReturn {
  tokens: TokenInfo[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useTokenData(walletAddress?: string, chainId: number = 1): UseTokenDataReturn {
  // Get token balances using viem
  const { data: tokenBalances, isLoading: balancesLoading, error: balancesError, refetch: refetchBalances } = useTokenBalancesHook(walletAddress, chainId);
  
  // Get token prices from thirdweb
  const tokenAddresses = tokenBalances?.map(token => token.token_address) || [];
  const { data: pricesData, isLoading: pricesLoading, error: pricesError } = useTokenPrices(tokenAddresses);
  
  // Combine balance and price data
  const combinedData = useQuery({
    queryKey: ['combinedTokenData', tokenBalances, pricesData],
    queryFn: async (): Promise<TokenInfo[]> => {
      if (!tokenBalances) return [];
      
      const priceMap = new Map<string, { price_usd: number; address: string }>();
      if (pricesData?.data) {
        pricesData.data.forEach((price: { price_usd: number; address: string }) => {
          // Handle native ETH special case - map both native formats
          if (price.address === 'native' || 
              price.address === '0x0000000000000000000000000000000000000000' ||
              price.address === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') {
            priceMap.set('native', price);
          } else {
            priceMap.set(price.address.toLowerCase(), price);
          }
        });
      }
      
      return tokenBalances.map((token: { token_address: string; name: string; symbol: string; logo?: string; decimals: number; balance: string; balanceFormatted: string }) => {
        const priceInfo = priceMap.get(token.token_address === 'native' ? 'native' : token.token_address.toLowerCase());
        const balanceFloat = parseFloat(token.balanceFormatted);
        const usdValue = priceInfo && balanceFloat > 0 ? balanceFloat * priceInfo.price_usd : 0;
        
        return {
          name: token.name,
          symbol: token.symbol,
          logo: token.logo,
          decimals: token.decimals,
          token_address: token.token_address,
          balance: token.balance,
          balanceFormatted: token.balanceFormatted,
          usd: usdValue,
          price_usd: priceInfo?.price_usd,
          price_24h_change: undefined, // No longer provided by the API
        };
      });
    },
    enabled: !!tokenBalances,
  });
  
  const isLoading = balancesLoading || pricesLoading || combinedData.isLoading;
  const error = balancesError || pricesError || combinedData.error;
  
  return {
    tokens: combinedData.data || [],
    isLoading,
    error: error as Error | null,
    refetch: () => {
      refetchBalances();
      combinedData.refetch();
    },
  };
}

// Legacy exports for backward compatibility
export const useTokenBalances = useTokenData;
export const useTokenTransfers = () => {
  console.warn('useTokenTransfers is deprecated and no longer implemented');
  return {
    data: [],
    isLoading: false,
    error: null,
    refetch: () => {},
  };
};
