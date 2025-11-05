import { useQuery } from '@tanstack/react-query';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { client } from '@/configs/thirdweb-config';
import { SUPPORTED_TOKENS } from '@/constants/tokens';

export interface TokenData {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  balance: string;
  logo?: string;
}

const polygonChain = {
  chainId: 137,
  rpc: ["https://polygon-rpc.com"],
  slug: "polygon",
  name: "Polygon",
  nativeCurrency: {
    name: "MATIC",
    symbol: "MATIC",
    decimals: 18,
  },
};

export function useThirdwebTokenData(address?: string) {
  return useQuery({
    queryKey: ['thirdwebTokenData', address],
    enabled: !!address,
    queryFn: async () => {
      if (!address) return [];
      const sdk = new ThirdwebSDK(polygonChain, client);
      console.log("Querying balance for address:", address);
      const nativeBalance = await sdk.wallet.balance(address);
      return [
        {
          address: 'native',
          name: nativeBalance.name,
          symbol: nativeBalance.symbol,
          decimals: nativeBalance.decimals,
          balance: nativeBalance.displayValue,
        }
      ];
    },
  });
} 