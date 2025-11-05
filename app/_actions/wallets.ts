'use server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

// Create or import a wallet for the authenticated user
export async function createUserWallet({ address, encryptedPrivateKey }: { address: string; encryptedPrivateKey: string }) {
  const session = await auth();
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
}

// Fetch all wallets for the authenticated user (addresses only)
export async function fetchUserWallets() {
  const session = await auth();
  if (!session?.user?.id) return [];
  const wallets = await prisma.wallet.findMany({
    where: { userId: session.user.id },
    select: { id: true, address: true },
  });
  return wallets;
}

// Fetch the encrypted private key for a wallet (only for the owner)
export async function fetchUserWalletPrivateKey(address: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Not authenticated');
  const wallet = await prisma.wallet.findUnique({
    where: { address },
    select: { encryptedPrivateKey: true, userId: true },
  });
  if (!wallet || wallet.userId !== session.user.id) throw new Error('Not authorized');
  return wallet.encryptedPrivateKey;
} 