# D-Sports Wallet UI

A modern, responsive wallet interface for managing Ethereum wallets and tokens.

## 🚀 Quick Start (Frontend Only - No Backend Required)

This project is configured to run **without a backend** for frontend development and design viewing. Simply run:

```bash
npm install
npm run dev
```

Then open [http://localhost:3000/wallet](http://localhost:3000/wallet) to see the wallet interface.

## 📋 Features

- ✅ Wallet creation and import
- ✅ Token balance tracking
- ✅ Collectibles/NFT display
- ✅ Multi-chain support (Ethereum, Polygon, etc.)
- ✅ Secure private key encryption
- ✅ Beautiful, responsive UI
- ✅ Improved layout and spacing for better UX

## 🎨 Viewing the Design

The app is pre-configured to work without a backend:

- **No database required** - All backend calls are mocked
- **No authentication required** - Auth is bypassed in mock mode
- **No API keys needed** - All external services are optional

Just run `npm run dev` and navigate to `/wallet` to see the full interface!

## 🔧 Enabling Backend (Optional)

If you want to enable backend functionality later, create a `.env` file:

```env
# Database (required for backend)
DATABASE_URL="postgresql://user:password@localhost:5432/dsports_wallet"

# NextAuth (required for authentication)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Enable backend mode
NEXT_PUBLIC_ENABLE_BACKEND="true"
```

Then run:
```bash
npx prisma generate
npx prisma db push
```

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── (dashboard)/       # Dashboard route group
│   │   └── wallet/        # Wallet pages
│   ├── _actions/          # Server actions (mocked)
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── wallet/           # Wallet-specific components
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
├── stores/               # Zustand state stores
└── utils/                # Utility functions
```

## 🛠️ Development

### Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Mock Mode

The app automatically detects if a backend is configured:

- **No DATABASE_URL** → Mock mode (frontend only)
- **DATABASE_URL set** → Backend mode (requires database)

In mock mode:
- All wallet operations work in the UI (but don't persist)
- Authentication is bypassed
- Server actions return mock data
- No database connection required

## 📝 Notes

- The wallet functionality works entirely in the browser for design purposes
- Private keys are generated and displayed but not saved without a backend
- Token balances will show 0 without a backend (but the UI still works)
- All components are fully functional for UI/UX testing

## 📦 Export Information

- **Source Project:** D-Sports PWA
- **Version:** 0.1.16
