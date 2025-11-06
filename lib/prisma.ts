// Prisma client - only initializes if DATABASE_URL is available
let prisma: any = null;

try {
  if (process.env.DATABASE_URL) {
    const { PrismaClient } = require('@prisma/client');
    const globalForPrisma = globalThis as unknown as {
      prisma: typeof PrismaClient | undefined
    }

    prisma = globalForPrisma.prisma ?? new PrismaClient()

    if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
  } else {
    console.log('[MOCK] Prisma: DATABASE_URL not set, using mock mode');
  }
} catch (error) {
  console.log('[MOCK] Prisma: Failed to initialize, using mock mode', error);
}

export { prisma }

