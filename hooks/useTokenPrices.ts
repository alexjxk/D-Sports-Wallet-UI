import { useQuery } from '@tanstack/react-query';

export interface TokenPrice {
  chain_id: number;
  address: string;
  symbol: string;
  price_usd: number;
  price_usd_cents: number;
}

export interface TokenPriceResponse {
  data: TokenPrice[];
}

export interface CoinGeckoPriceData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
}

const POPULAR_TOKEN_ADDRESSES = [
  '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', // ETH (native) - using the correct native address format
  '0xA0b86a33E6441Ad436830f3Db1D35E7F7Aebfd36', // USDC
  '0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDT
  '0x6B175474E89094C44Da98b954EedeAC495271d0F', // DAI
  '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', // WBTC
];

// Mapping of token symbols to CoinGecko IDs
const COINGECKO_ID_MAP: Record<string, string> = {
  ETH: 'ethereum',
  BTC: 'bitcoin',
  WBTC: 'wrapped-bitcoin',
  USDC: 'usd-coin',
  USDT: 'tether',
  DOGE: 'dogecoin',
  MATIC: 'polygon-ecosystem-token',
  BNB: 'binancecoin',
  XRP: 'ripple',
  SOL: 'solana',
};

// Alternative IDs to try if the primary fails (excluding primary to avoid duplicates)
const COINGECKO_ALTERNATIVES: Record<string, string[]> = {
  XRP: ['xrp', 'ripple-labs', 'xrp-token'],
  MATIC: ['matic-network', 'polygon', 'matic'],
  WBTC: ['bitcoin', 'wbtc', 'wrapped-btc'],
  DOGE: ['doge', 'dogechain'],
  BNB: ['bnb', 'binance-coin', 'binance-smart-chain'],
  SOL: ['sol', 'solana-ecosystem'],
  ETH: ['ethereum-classic', 'ethereum-meta'],
  USDC: ['centre-usd-coin', 'usd-circle'],
  USDT: ['tether-gold', 'tether-eurt'],
};

async function fetchTokenPrice(address: string, clientId: string): Promise<TokenPrice | null> {
  try {
    // Handle native ETH address mapping
    const apiAddress = address === 'native' || address === '0x0000000000000000000000000000000000000000' 
      ? '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' 
      : address;

    console.log(`Fetching price for token: ${address} (API address: ${apiAddress})`);
    
    const url = `https://1.insight.thirdweb.com/v1/tokens/price?address=${apiAddress}`;
    
    const response = await fetch(url, {
      headers: {
        'x-client-id': clientId,
      },
    });
    
    if (!response.ok) {
      console.warn(`Failed to fetch price for ${address}: ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    
    // The API returns an array, take the first result
    if (data.data && data.data.length > 0) {
      const priceData = data.data[0];
      return {
        chain_id: priceData.chain_id,
        address: address, // Use original address format for consistency
        symbol: priceData.symbol,
        price_usd: priceData.price_usd,
        price_usd_cents: priceData.price_usd_cents,
      };
    }
    
    return null;
  } catch (error) {
    console.warn(`Error fetching price for ${address}:`, error);
    return null;
  }
}

export function useTokenPrices(tokenAddresses?: string[]) {
  const addresses = tokenAddresses || POPULAR_TOKEN_ADDRESSES;
  
  return useQuery({
    queryKey: ['tokenPrices', addresses],
    queryFn: async (): Promise<TokenPriceResponse> => {
      console.log('Fetching token prices for addresses:', addresses);
      
      try {
        const clientId = process.env.NEXT_PUBLIC_TW_CLIENT_ID;
        if (!clientId) throw new Error('Missing NEXT_PUBLIC_TW_CLIENT_ID');
        
        // Fetch prices for all tokens in parallel
        const pricePromises = addresses.map(address => 
          fetchTokenPrice(address, clientId)
        );
        
        const results = await Promise.all(pricePromises);
        
        // Filter out null results (failed requests)
        const validPrices = results.filter((price): price is TokenPrice => price !== null);
        
        console.log('Token prices fetched:', validPrices);
        
        return { data: validPrices };
      } catch (error) {
        console.error('Error fetching token prices:', error);
        throw error;
      }
    },
    staleTime: 60000, // 1 minute
    refetchInterval: 300000, // Refetch every 5 minutes
  });
}

export function useTokenPrice(tokenAddress?: string) {
  const { data, ...rest } = useTokenPrices(tokenAddress ? [tokenAddress] : undefined);
  
  return {
    ...rest,
    data: data?.data?.[0] || null,
  };
}

// New hook to fetch 24h price change data from CoinGecko
export function useCoinGeckoPriceChange(symbol?: string) {
  return useQuery({
    queryKey: ['coinGeckoPriceChange', symbol],
    queryFn: async (): Promise<CoinGeckoPriceData | null> => {
      if (!symbol) return null;
      
      const coinGeckoId = COINGECKO_ID_MAP[symbol.toUpperCase()];
      if (!coinGeckoId) {
        console.warn(`No CoinGecko ID found for symbol: ${symbol}`);
        return null;
      }
      
      try {
        console.log(`Fetching 24h price change for ${symbol} from CoinGecko`);
        console.log(`CoinGecko ID: ${coinGeckoId}`);
        
        const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coinGeckoId}&vs_currencies=usd&include_24hr_change=true`;
        console.log(`Request URL: ${url}`);
        
        const response = await fetch(url);
        
        if (!response.ok) {
          console.warn(`Failed to fetch CoinGecko data for ${symbol}: ${response.status}`);
          return null;
        }
        
        const data = await response.json();
        console.log(`CoinGecko response for ${symbol}:`, data);
        
        if (data[coinGeckoId]) {
          const result = {
            id: coinGeckoId,
            symbol: symbol.toUpperCase(),
            name: coinGeckoId,
            current_price: data[coinGeckoId].usd,
            price_change_percentage_24h: data[coinGeckoId].usd_24h_change || 0,
          };
          console.log(`Processed result for ${symbol}:`, result);
          return result;
        }
        
        console.warn(`No data found for ${symbol} with CoinGecko ID: ${coinGeckoId}`);
        return null;
      } catch (error) {
        console.warn(`Error fetching CoinGecko data for ${symbol}:`, error);
        return null;
      }
    },
    enabled: !!symbol,
    staleTime: 300000, // 5 minutes
    refetchInterval: 300000, // Refetch every 5 minutes
  });
}

// New hook to fetch multiple token prices at once for TokenList
export function useMultipleTokenPrices(symbols: string[]) {
  return useQuery({
    queryKey: ['multipleTokenPrices', symbols],
    queryFn: async (): Promise<Record<string, CoinGeckoPriceData>> => {
      if (!symbols || symbols.length === 0) return {};
      
      console.log('🚀 Starting real-time price fetching for tokens:', symbols);
      
      let priceMap: Record<string, CoinGeckoPriceData> = {}; // eslint-disable-line prefer-const
      let globalAttempt = 0;
      const maxGlobalAttempts = 50; // Keep trying for up to 50 rounds
      
      while (Object.keys(priceMap).length < symbols.length && globalAttempt < maxGlobalAttempts) {
        globalAttempt++;
        console.log(`🔄 Global attempt ${globalAttempt}/${maxGlobalAttempts} - Have ${Object.keys(priceMap).length}/${symbols.length} tokens`);
        
        // Get remaining symbols that we don't have data for yet
        const remainingSymbols = symbols.filter(symbol => !priceMap[symbol.toUpperCase()]);
        console.log('🎯 Still need data for:', remainingSymbols);
        
        // Quick connectivity test with a known working ID
        try {
          const testResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd', {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
            signal: AbortSignal.timeout(5000),
          });
          
          if (!testResponse.ok) {
            console.warn('⚠️ CoinGecko API connectivity test failed:', testResponse.status);
            await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5s before retrying
            continue;
          } else {
            const testData = await testResponse.json();
            console.log('✅ CoinGecko API connectivity test passed:', testData);
          }
        } catch (testError) {
          console.warn('⚠️ CoinGecko API connectivity test error:', testError);
          await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5s before retrying
          continue;
        }
        
        // Process tokens one by one for real-time updates instead of all at once
        for (const symbol of remainingSymbols) {
          const coinGeckoId = COINGECKO_ID_MAP[symbol.toUpperCase()];
          if (!coinGeckoId) {
            console.warn(`No CoinGecko ID found for symbol: ${symbol}`);
            continue;
          }
          
          // Try primary ID first, then alternatives (deduplicated)
          const alternatives = COINGECKO_ALTERNATIVES[symbol.toUpperCase()] || [];
          const idsToTry = [coinGeckoId, ...alternatives].filter((id, index, arr) => 
            arr.indexOf(id) === index // Remove duplicates
          );
          
          // Aggressive retry logic 
          const maxRetries = 5; // Reduced retries for faster processing
          let success = false;
          
          for (let i = 0; i < idsToTry.length && !success; i++) {
            const idToTry = idsToTry[i];
            
            for (let retry = 0; retry < maxRetries && !success; retry++) {
              try {
                console.log(`Fetching price for ${symbol} using ID: ${idToTry} (attempt ${i + 1}, retry ${retry + 1})`);
                
                const url = `https://api.coingecko.com/api/v3/simple/price?ids=${idToTry}&vs_currencies=usd&include_24hr_change=true`;
                
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

                const response = await fetch(url, {
                  method: 'GET',
                  headers: {
                    'Accept': 'application/json',
                  },
                  signal: controller.signal,
                });

                clearTimeout(timeoutId);
                
                if (!response.ok) {
                  const errorText = await response.text();
                  console.warn(`Failed to fetch price for ${symbol} with ID ${idToTry}: ${response.status} - ${errorText}`);
                  
                  // Wait before retry
                  const waitTime = Math.min(Math.pow(2, retry) * 1000, 5000); // Cap at 5s
                  await new Promise(resolve => setTimeout(resolve, waitTime));
                  continue; // Retry same ID
                }
                
                const data = await response.json();
                
                if (data[idToTry]) {
                  console.log(`✅ Success for ${symbol} with ID: ${idToTry}`);
                  priceMap[symbol.toUpperCase()] = {
                    id: idToTry,
                    symbol: symbol.toUpperCase(),
                    name: idToTry,
                    current_price: data[idToTry].usd,
                    price_change_percentage_24h: data[idToTry].usd_24h_change || 0,
                  };
                  console.log(`📈 Real-time update: ${symbol} = $${data[idToTry].usd}`);
                  success = true;
                  
                  // Show progress immediately
                  console.log(`📊 Live progress: ${Object.keys(priceMap).length}/${symbols.length} tokens loaded`);
                } else {
                  console.warn(`No data returned for ${symbol} with ID ${idToTry}`);
                  break; // Try next ID if no data found
                }
              } catch (error) {
                console.warn(`Error fetching price for ${symbol} with ID ${idToTry}:`, error);
                
                // Wait before retry
                const waitTime = Math.min(Math.pow(2, retry) * 1000, 5000);
                await new Promise(resolve => setTimeout(resolve, waitTime));
              }
            } // End retry loop
          } // End ID loop
          
          if (!success) {
            console.warn(`❌ Failed to get data for ${symbol} with all available IDs:`, idsToTry);
          }
          
          // Small delay between tokens to avoid overwhelming the API
          await new Promise(resolve => setTimeout(resolve, 200));
        }
        
        console.log(`📊 Current progress: ${Object.keys(priceMap).length}/${symbols.length} tokens collected`);
        
        // Return partial results immediately if we have any data
        if (Object.keys(priceMap).length > 0 && globalAttempt === 1) {
          console.log('🚀 Returning partial results immediately for better UX');
          // Continue fetching in background but return what we have so far
        }
        
        // If we got all tokens, break early
        if (Object.keys(priceMap).length === symbols.length) {
          console.log('🎉 Successfully collected all token prices!');
          break;
        }
        
        // Shorter wait time for faster updates
        if (globalAttempt < maxGlobalAttempts) {
          console.log('⏳ Waiting 1 second before next global attempt...');
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      console.log(`🏁 Final result: ${Object.keys(priceMap).length}/${symbols.length} tokens collected after ${globalAttempt} attempts`);
      console.log('📋 Final price map:', priceMap);
      
      return priceMap;
    },
    enabled: symbols && symbols.length > 0,
    staleTime: 30000, // 30 seconds - much faster updates
    refetchInterval: 60000, // Refetch every 1 minute for live data
    retry: 5, // More React Query level retries
    retryDelay: 2000, // 2 second delay between React Query retries
  });
}