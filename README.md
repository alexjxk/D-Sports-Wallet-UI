# D-Sports Wallet Design - Export Package

This folder contains all wallet-related UI/UX files from the D-Sports PWA codebase, organized for easy export and reuse.

## 📁 Folder Structure

```
D-Sports-Wallet-Design/
├── app/
│   ├── (dashboard)/
│   │   └── wallet/
│   │       ├── page.tsx          # Main wallet page component
│   │       └── loading.tsx        # Loading state component
│   └── _actions/
│       └── wallets.ts             # Server actions for wallet operations
├── components/
│   └── wallet/
│       ├── ChainSwitcher.tsx           # Blockchain network switcher
│       ├── CollectibleCard.tsx         # NFT/collectible card display
│       ├── CollectibleList.tsx          # List of collectibles
│       ├── ConnectedWalletCard.tsx      # Connected wallet display card
│       ├── CreateWalletModal.tsx        # Modal for creating new wallet
│       ├── DisconnectedWalletCard.tsx  # Disconnected state card
│       ├── FeaturedCollectibles.tsx     # Featured collectibles section
│       ├── ImportWalletModal.tsx        # Modal for importing wallet
│       ├── LoginComponent.tsx           # Wallet login component
│       ├── NewWalletPrivateKeyModal.tsx # Modal for new wallet private key
│       ├── ParallaxContainer.tsx        # Parallax effect container
│       ├── PrivateKeyModal.tsx          # Modal for viewing private key
│       ├── ReceiveTokenModal.tsx        # Modal for receiving tokens
│       ├── RefreshButton.tsx             # Refresh button component
│       ├── SendTokenModal.tsx            # Modal for sending tokens
│       ├── SettingsDropdown.tsx           # Wallet settings dropdown
│       ├── Tabs.tsx                      # Tab navigation component
│       ├── TokenCard.tsx                 # Individual token display card
│       ├── TokenList.tsx                 # List of tokens
│       ├── WalletAddressButton.tsx       # Wallet address button
│       ├── WalletDropdown.tsx             # Wallet selection dropdown
│       ├── WalletProfileSection.tsx      # Wallet profile section
│       └── WalletTabsSection.tsx         # Wallet tabs section
├── hooks/
│   ├── useActiveWallet.ts          # Hook for active wallet management
│   ├── use-collectibles.ts         # Hook for collectibles data
│   ├── useCollectibles.ts          # Alternative collectibles hook
│   ├── useThirdwebTokenData.ts     # Thirdweb token data hook
│   ├── useTokenBalances.ts         # Token balances hook
│   ├── useTokenData.ts             # Token data hook
│   ├── useTokenPrices.ts           # Token prices hook
│   ├── use-wallet-auth.ts          # Wallet authentication hook
│   └── useUserWallets.ts           # User wallets hook
│   └── useWalletBalance.ts         # Wallet balance hook
├── stores/
│   ├── wallet-page-store.ts        # Wallet page state store
│   └── wallet-store.ts             # Main wallet state store
└── utils/
    └── encryption.ts                # Encryption utilities for private keys
```

## 📋 File Overview

### Main Page
- **`app/(dashboard)/wallet/page.tsx`** - The main wallet page component that orchestrates all wallet functionality including:
  - Wallet creation and import flows
  - Token and collectible display
  - Wallet management
  - Empty states and loading states

### Components (23 files)
All wallet-specific UI components including modals, cards, lists, and navigation elements.

### Hooks (11 files)
Custom React hooks for:
- Wallet management and state
- Token data fetching
- Collectibles management
- Balance tracking

### Stores (2 files)
State management stores using TanStack Store for:
- Wallet state persistence
- Page-level wallet state

### Actions (1 file)
Server actions for wallet operations (create, fetch, etc.)

### Utils (1 file)
Encryption utilities for secure private key handling

## 🔌 Dependencies

These files depend on the following (not included in this export):
- `@/components/ui/*` - Shared UI components (Button, Card, Tabs, etc.)
- `@/stores/auth-store` - Authentication store
- `@/lib/prisma` - Database client
- `@/auth` - Authentication configuration
- Next.js 15+ with App Router
- React 19+
- Framer Motion - For animations
- Viem - For Ethereum wallet operations
- TanStack Store - For state management
- Various UI libraries (Radix UI, Lucide React, etc.)

## 📝 Notes

- All imports use the `@/` alias which maps to the project root
- Some components may have dependencies on shared UI components that aren't included
- The wallet functionality integrates with the database through Prisma
- Authentication is handled through NextAuth.js
- Private keys are encrypted using CryptoJS before storage

## 🚀 Usage

To use these files in a new project:
1. Copy the folder structure to your project
2. Ensure all dependencies are installed
3. Update import paths if your alias structure differs
4. Set up the required database schema for wallets
5. Configure authentication
6. Set up environment variables for encryption

## 📦 Export Information

- **Exported on:** $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
- **Source Project:** D-Sports PWA
- **Version:** 0.1.15

