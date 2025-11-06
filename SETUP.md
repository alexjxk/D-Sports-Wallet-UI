# D-Sports Wallet UI - Setup Guide

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- PostgreSQL database (or your preferred database)
- Git

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dsports_wallet?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-generate-with-openssl-rand-base64-32"

# Thirdweb (optional - for collectibles)
NEXT_PUBLIC_TW_CLIENT_ID="your-thirdweb-client-id"

# Contract (optional - for collectibles)
NEXT_PUBLIC_CONTRACT_ADDRESS="0x0000000000000000000000000000000000000000"
```

To generate a secure `NEXTAUTH_SECRET`, run:
```bash
openssl rand -base64 32
```

### 3. Set Up Database

1. Make sure your PostgreSQL database is running
2. Initialize Prisma and run migrations:

```bash
npx prisma generate
npx prisma db push
```

Or if you prefer to use migrations:
```bash
npx prisma migrate dev --name init
```

### 4. Configure Authentication

The current setup uses NextAuth with a credentials provider. You'll need to:

1. Update `auth.ts` to add your authentication providers (Google, GitHub, etc.)
2. Or implement proper credential validation in the `authorize` function

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── (dashboard)/       # Dashboard route group
│   │   └── wallet/        # Wallet pages
│   ├── _actions/          # Server actions
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── wallet/           # Wallet-specific components
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
├── stores/               # Zustand state stores
├── utils/                # Utility functions
└── prisma/               # Prisma schema
```

## Features

- ✅ Wallet creation and import
- ✅ Token balance tracking
- ✅ Collectibles/NFT display
- ✅ Multi-chain support (Ethereum)
- ✅ Secure private key encryption
- ✅ User authentication

## Next Steps

1. **Configure Authentication**: Set up your preferred auth providers in `auth.ts`
2. **Database Setup**: Ensure your database is properly configured and migrations are run
3. **Thirdweb Integration**: If using collectibles, configure your Thirdweb contract
4. **Environment Variables**: Set all required environment variables
5. **Customization**: Customize the UI components and styling as needed

## Troubleshooting

### Database Connection Issues
- Verify your `DATABASE_URL` is correct
- Ensure PostgreSQL is running
- Check database permissions

### Authentication Issues
- Verify `NEXTAUTH_SECRET` is set
- Check that `NEXTAUTH_URL` matches your development URL
- Ensure auth providers are properly configured

### Build Errors
- Run `npm install` to ensure all dependencies are installed
- Clear `.next` folder and rebuild: `rm -rf .next && npm run build`
- Check TypeScript errors: `npm run type-check`

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Type check TypeScript

## License

See LICENSE file for details.

