/**
 * Mock data for frontend-only wallet UI
 * TODO: Replace with real API calls when backend is ready
 */

export interface MockWallet {
  id: string;
  name: string;
  address: string;
  balance: number;
  balanceCAD: number;
  change24h: number;
  changeAmount: number;
}

export interface MockAsset {
  id: string;
  symbol: string;
  name: string;
  icon: string;
  balance: number;
  balanceFormatted: string;
  valueUSD: number;
  change24h: number;
  tags: string[];
  utility: string[];
}

export interface MockNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export interface MockMission {
  id: string;
  title: string;
  description: string;
  reward: string;
  progress: number;
  maxProgress: number;
}

// Mock wallets
export const MOCK_WALLETS: MockWallet[] = [
  {
    id: '1',
    name: 'Main Wallet',
    address: '0xC3644a1F3B2a5eC68D8C3648e2B68B0',
    balance: 0,
    balanceCAD: 0,
    change24h: 3.28,
    changeAmount: 0,
  },
  {
    id: '2',
    name: 'Trading Wallet',
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    balance: 1250.50,
    balanceCAD: 1688.18,
    change24h: -1.25,
    changeAmount: -21.10,
  },
];

// Mock assets
export const MOCK_ASSETS: MockAsset[] = [
  {
    id: 'eth',
    symbol: 'ETH',
    name: 'Ethereum',
    icon: '',
    balance: 0,
    balanceFormatted: '0.00',
    valueUSD: 3142.31,
    change24h: 2.82,
    tags: ['Crypto', 'Layer 1'],
    utility: ['Used for contests', 'Network fees', 'Unlocks fan perks'],
  },
  {
    id: 'usdc',
    symbol: 'USDC',
    name: 'USD Coin',
    icon: '',
    balance: 0,
    balanceFormatted: '0.00',
    valueUSD: 1.00,
    change24h: 0.01,
    tags: ['Stablecoin', 'USD Pegged'],
    utility: ['Stable value', 'Trading', 'Payments'],
  },
  {
    id: 'usdt',
    symbol: 'USDT',
    name: 'Tether USD',
    icon: '',
    balance: 0,
    balanceFormatted: '0.00',
    valueUSD: 1.00,
    change24h: 0.00,
    tags: ['Stablecoin', 'USD Pegged'],
    utility: ['Stable value', 'Trading', 'Payments'],
  },
  {
    id: 'dai',
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    icon: '',
    balance: 0,
    balanceFormatted: '0.00',
    valueUSD: 1.00,
    change24h: -0.01,
    tags: ['Stablecoin', 'DeFi'],
    utility: ['Stable value', 'DeFi protocols', 'Yield farming'],
  },
  {
    id: 'btc',
    symbol: 'BTC',
    name: 'Bitcoin',
    icon: '',
    balance: 0,
    balanceFormatted: '0.00',
    valueUSD: 64642.31,
    change24h: 1.98,
    tags: ['Crypto', 'Layer 1'],
    utility: ['Store of value', 'Payments'],
  },
  {
    id: 'matic',
    symbol: 'MATIC',
    name: 'Polygon',
    icon: '',
    balance: 0,
    balanceFormatted: '0.00',
    valueUSD: 0.16,
    change24h: 3.28,
    tags: ['Layer 2', 'Scaling'],
    utility: ['Low fees', 'Fast transactions'],
  },
  {
    id: 'sol',
    symbol: 'SOL',
    name: 'Solana',
    icon: '',
    balance: 0,
    balanceFormatted: '0.00',
    valueUSD: 153.48,
    change24h: 0.59,
    tags: ['Crypto', 'High throughput'],
    utility: ['Fast transactions', 'dApps'],
  },
  {
    id: 'ada',
    symbol: 'ADA',
    name: 'Cardano',
    icon: '',
    balance: 0,
    balanceFormatted: '0.00',
    valueUSD: 0.42,
    change24h: -0.85,
    tags: ['Crypto', 'Layer 1'],
    utility: ['Smart contracts', 'dApps'],
  },
  {
    id: 'avax',
    symbol: 'AVAX',
    name: 'Avalanche',
    icon: '',
    balance: 0,
    balanceFormatted: '0.00',
    valueUSD: 28.41,
    change24h: 1.12,
    tags: ['Crypto', 'Layer 1'],
    utility: ['Subnets', 'dApps'],
  },
  {
    id: 'xrp',
    symbol: 'XRP',
    name: 'XRP',
    icon: '',
    balance: 0,
    balanceFormatted: '0.00',
    valueUSD: 0.52,
    change24h: 0.34,
    tags: ['Payments'],
    utility: ['Fast settlements'],
  },
];

// Mock notifications
export const MOCK_NOTIFICATIONS: MockNotification[] = [
  {
    id: '1',
    title: 'Wallet Created',
    message: 'Your new wallet has been successfully created.',
    time: '2 hours ago',
    read: false,
  },
  {
    id: '2',
    title: 'Mission Completed',
    message: 'You completed the "Predict the Winner" mission!',
    time: '1 day ago',
    read: false,
  },
  {
    id: '3',
    title: 'Asset Update',
    message: 'ETH price increased by 2.82%',
    time: '2 days ago',
    read: true,
  },
];

// Mock missions
export const MOCK_MISSIONS: MockMission[] = [
  {
    id: '1',
    title: 'Predict the Winner',
    description: 'Make 3 correct predictions this week',
    reward: '100 XP + 10 USDC',
    progress: 2,
    maxProgress: 3,
  },
  {
    id: '2',
    title: 'First Trade',
    description: 'Complete your first trade',
    reward: '50 XP',
    progress: 0,
    maxProgress: 1,
  },
  {
    id: '3',
    title: 'Collect Fan Tokens',
    description: 'Collect 5 different fan tokens',
    reward: '200 XP + Rare NFT',
    progress: 3,
    maxProgress: 5,
  },
];

// Asset explanations for tooltips
export const ASSET_EXPLANATIONS: Record<string, string> = {
  ETH: 'Ethereum is the native cryptocurrency of the Ethereum blockchain. It powers smart contracts and decentralized applications, and is used for network transaction fees.',
  USDC: 'USD Coin is a stablecoin pegged to the US dollar. It provides price stability and is commonly used for trading and payments in the crypto ecosystem.',
  USDT: 'Tether USD is a stablecoin backed by reserves and pegged to the US dollar. It\'s widely used for trading and transferring value without volatility.',
  DAI: 'Dai is a decentralized stablecoin that maintains its peg to the US dollar through collateralized debt positions and algorithmic mechanisms.',
};

