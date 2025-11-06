import { CRYPTO_IMAGES } from '@/utils/cryptoImages';

/**
 * Supported ERC20 tokens configuration
 * Each token includes its contract address, symbol, name, decimals, and optional logo path
 */

export interface SupportedToken {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoPath?: string;
}

/**
 * List of supported ERC20 tokens
 * These are popular tokens on Ethereum mainnet
 */
export const SUPPORTED_TOKENS: SupportedToken[] = [
  // Stablecoins
  {
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    logoPath: CRYPTO_IMAGES.USDC,
  },
  {
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDT
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    logoPath: CRYPTO_IMAGES.USDT,
  },
  {
    address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', // DAI
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    decimals: 18,
    logoPath: CRYPTO_IMAGES.DAI,
  },
  
  // Popular DeFi tokens
  {
    address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', // UNI
    symbol: 'UNI',
    name: 'Uniswap',
    decimals: 18,
    logoPath: CRYPTO_IMAGES.UNI,
  },
  {
    address: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0', // MATIC (Polygon)
    symbol: 'MATIC',
    name: 'Polygon',
    decimals: 18,
    logoPath: CRYPTO_IMAGES.MATIC,
  },
  {
    address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
    symbol: 'WETH',
    name: 'Wrapped Ethereum',
    decimals: 18,
    logoPath: CRYPTO_IMAGES.WETH,
  },
  
  // Layer 2 tokens
  {
    address: '0x4d224452801ACEd8B2F0aebE155379bb5D594381', // ApeCoin
    symbol: 'APE',
    name: 'ApeCoin',
    decimals: 18,
    logoPath: CRYPTO_IMAGES.APE,
  },
  
  // Meme tokens
  {
    address: '0x6982508145454Ce325dDbE47a25d4ec3d2311933', // PEPE
    symbol: 'PEPE',
    name: 'Pepe',
    decimals: 18,
    logoPath: CRYPTO_IMAGES.PEPE,
  },
  
  // Add more tokens as needed
];

/**
 * Get token by address (case-insensitive)
 */
export function getTokenByAddress(address: string): SupportedToken | undefined {
  return SUPPORTED_TOKENS.find(
    (token) => token.address.toLowerCase() === address.toLowerCase()
  );
}

/**
 * Get token by symbol (case-insensitive)
 */
export function getTokenBySymbol(symbol: string): SupportedToken | undefined {
  return SUPPORTED_TOKENS.find(
    (token) => token.symbol.toLowerCase() === symbol.toLowerCase()
  );
}

