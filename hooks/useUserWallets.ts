import { useQuery } from '@tanstack/react-query';
import { fetchUserWallets } from '@/app/_actions/wallets';

export interface UserWallet {
  id?: string;
  address: string;
}

export function useUserWallets() {
  return useQuery<UserWallet[]>({
    queryKey: ['userWallets'],
    queryFn: async () => {
      return fetchUserWallets(); // server action invoked from client
    },
    staleTime: 60_000,
  });
} 