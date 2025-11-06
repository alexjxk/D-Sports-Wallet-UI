/**
 * Utility to get cryptocurrency logo images from CoinGecko CDN
 * CoinGecko provides free, reliable crypto logos
 */

const COINGECKO_IMAGE_BASE = 'https://assets.coingecko.com/coins/images';
const COINGECKO_SIZE = 'small'; // small, thumb, or large

// Map of token symbols to CoinGecko coin IDs
const COIN_IDS: Record<string, string> = {
  // Major cryptocurrencies
  'BTC': '1',
  'ETH': '279',
  'BNB': '1839',
  'SOL': '4128',
  'XRP': '52',
  'DOGE': '5',
  'MATIC': '4713',
  'ADA': '2010',
  'AVAX': '12559',
  'DOT': '6636',
  
  // Stablecoins
  'USDC': '6319',
  'USDT': '325',
  'DAI': '4943',
  'BUSD': '9576',
  
  // DeFi tokens
  'UNI': '12504',
  'LINK': '877',
  'AAVE': '7278',
  'MKR': '1518',
  'SUSHI': '11976',
  'CRV': '12124',
  
  // Layer 2
  'APE': '24383',
  'PEPE': '29850',
  
  // Wrapped tokens
  'WETH': '279',
};

/**
 * Get cryptocurrency logo URL from CoinGecko CDN
 * @param symbol - Token symbol (e.g., 'BTC', 'ETH')
 * @param size - Image size: 'small', 'thumb', or 'large' (default: 'small')
 * @returns URL to the crypto logo image
 */
export function getCryptoImage(symbol: string, size: 'small' | 'thumb' | 'large' = 'small'): string {
  const coinId = COIN_IDS[symbol.toUpperCase()];
  
  if (!coinId) {
    // Fallback to a generic placeholder or CoinGecko's default
    return `https://assets.coingecko.com/coins/images/1/${size}/bitcoin.png`;
  }
  
  // Map size to CoinGecko size parameter
  const sizeMap = {
    small: 'small',
    thumb: 'thumb',
    large: 'large',
  };
  
  const sizeParam = sizeMap[size];
  
  // CoinGecko CDN format: /coins/images/{id}/{size}/{name}.png
  // We'll use the coin ID as the identifier
  return `https://assets.coingecko.com/coins/images/${coinId}/${sizeParam}/${symbol.toLowerCase()}.png`;
}

/**
 * Get cryptocurrency logo URL with fallback
 * @param symbol - Token symbol
 * @param fallbackUrl - Optional fallback URL if image not found
 * @returns URL to the crypto logo image
 */
export function getCryptoImageWithFallback(
  symbol: string,
  fallbackUrl?: string
): string {
  try {
    return getCryptoImage(symbol);
  } catch {
    return fallbackUrl || getCryptoImage('BTC'); // Default to Bitcoin
  }
}

/**
 * Direct CoinGecko image URLs for common tokens
 * These are the most reliable URLs from CoinGecko CDN
 */
export const CRYPTO_IMAGES: Record<string, string> = {
  // Bitcoin
  'BTC': 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
  'Bitcoin': 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
  
  // Ethereum
  'ETH': 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
  'Ethereum': 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
  'WETH': 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
  
  // BNB
  'BNB': 'https://assets.coingecko.com/coins/images/1839/small/bnb.png',
  
  // Solana
  'SOL': 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
  'Solana': 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
  
  // XRP
  'XRP': 'https://assets.coingecko.com/coins/images/52/small/xrp-symbol-white-128.png',
  
  // Dogecoin
  'DOGE': 'https://assets.coingecko.com/coins/images/5/small/dogecoin.png',
  'Dogecoin': 'https://assets.coingecko.com/coins/images/5/small/dogecoin.png',
  
  // Polygon
  'MATIC': 'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png',
  'Polygon': 'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png',
  
  // USD Coin
  'USDC': 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png',
  'USD Coin': 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png',
  
  // Tether
  'USDT': 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
  'Tether': 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
  
  // Dai
  'DAI': 'https://assets.coingecko.com/coins/images/4943/small/dai.png',
  'Dai': 'https://assets.coingecko.com/coins/images/4943/small/dai.png',
  
  // Uniswap
  'UNI': 'https://assets.coingecko.com/coins/images/12504/small/uniswap-uni.png',
  'Uniswap': 'https://assets.coingecko.com/coins/images/12504/small/uniswap-uni.png',
  
  // ApeCoin
  'APE': 'https://assets.coingecko.com/coins/images/24383/small/apecoin.jpg',
  'ApeCoin': 'https://assets.coingecko.com/coins/images/24383/small/apecoin.jpg',
  
  // Pepe
  'PEPE': 'https://assets.coingecko.com/coins/images/29850/small/pepe-token.jpeg',
  'Pepe': 'https://assets.coingecko.com/coins/images/29850/small/pepe-token.jpeg',
};

