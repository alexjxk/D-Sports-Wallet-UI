import { useState, useEffect } from 'react';
import { useWalletStore } from '@/stores/wallet-store';
import { contract } from '@/configs/thirdweb-config';

export interface Collectible {
  id: string;
  name: string;
  description: string;
  image: string;
  contractAddress: string;
  tokenId: string;
}

export default function useCollectibles(walletAddress?: string) {
  const [collectibles, setCollectibles] = useState<Collectible[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const addressFromStore = useWalletStore((state) => state.address);

  useEffect(() => {
    async function fetchCollectibles() {
      const address = walletAddress || addressFromStore;
      if (!address) {
        setLoading(false);
        setCollectibles([]);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        // Get total number of token types (templates)
        const templatesCount = await contract.read.getTemplatesCount();
        const tokenIds = Array.from({ length: Number(templatesCount) }, (_, i) => i);
        // Get balances for all token IDs for this address
        const balances = await contract.erc1155.balanceOfBatch({
          owners: Array(tokenIds.length).fill(address),
          tokenIds,
        });
        // Filter tokenIds with balance > 0
        const ownedTokenIds = tokenIds.filter((_, i) => balances[i] && BigInt(balances[i]) > 0n);
        // Fetch metadata for each owned token
        const collectiblesData = await Promise.all(
          ownedTokenIds.map(async (tokenId) => {
            const meta = await contract.read.getTemplate([tokenId]);
            return {
              id: String(tokenId),
              name: meta.name,
              description: meta.description,
              image: meta.image,
              contractAddress: contract.address,
              tokenId: String(tokenId),
            };
          })
        );
        setCollectibles(collectiblesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch collectibles');
        setCollectibles([]);
      } finally {
        setLoading(false);
      }
    }
    fetchCollectibles();
  }, [walletAddress, addressFromStore]);

  return { collectibles, loading, error };
}
