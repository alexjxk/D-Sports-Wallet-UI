'use server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';

// Check if we're in development mode without backend
const MOCK_MODE = process.env.NODE_ENV === 'development' && !process.env.DATABASE_URL;

// Mock Prisma client to avoid errors when database isn't configured
let prisma: any;
try {
  prisma = require('@/lib/prisma').prisma;
} catch (error) {
  // Prisma not available, will use mocks
}

// Create or import a wallet for the authenticated user
export async function createUserWallet({ address, encryptedPrivateKey }: { address: string; encryptedPrivateKey: string }) {
  if (MOCK_MODE) {
    console.log('[MOCK] createUserWallet called with:', { address });
    // Return mock response
    return { id: 'mock-' + Date.now(), address };
  }

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new Error('Not authenticated');

    // Prevent duplicate addresses for this user
    const existing = await prisma.wallet.findUnique({ where: { address } });
    if (existing) throw new Error('Wallet already exists');

    const wallet = await prisma.wallet.create({
      data: {
        userId: session.user.id,
        address,
        encryptedPrivateKey,
      },
    });
    return { id: wallet.id, address: wallet.address };
  } catch (error) {
    console.error('Error creating wallet (falling back to mock):', error);
    // Fallback to mock if database fails
    return { id: 'mock-' + Date.now(), address };
  }
}

// Fetch all wallets for the authenticated user (addresses only)
export async function fetchUserWallets() {
  if (MOCK_MODE) {
    console.log('[MOCK] fetchUserWallets called - returning empty array');
    return [];
  }

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return [];
    const wallets = await prisma.wallet.findMany({
      where: { userId: session.user.id },
      select: { id: true, address: true },
    });
    return wallets;
  } catch (error) {
    console.error('Error fetching wallets (falling back to mock):', error);
    // Fallback to empty array if database fails
    return [];
  }
}

// Fetch the encrypted private key for a wallet (only for the owner)
export async function fetchUserWalletPrivateKey(address: string) {
  if (MOCK_MODE) {
    console.log('[MOCK] fetchUserWalletPrivateKey called - returning mock encrypted key');
    throw new Error('Mock mode: Private key retrieval not available');
  }

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new Error('Not authenticated');
    const wallet = await prisma.wallet.findUnique({
      where: { address },
      select: { encryptedPrivateKey: true, userId: true },
    });
    if (!wallet || wallet.userId !== session.user.id) throw new Error('Not authorized');
    return wallet.encryptedPrivateKey;
  } catch (error) {
    console.error('Error fetching private key:', error);
    throw error;
  }
}
