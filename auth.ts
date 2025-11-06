import NextAuth, { type NextAuthOptions, getServerSession } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

// Conditionally import Prisma adapter only if database is available
let PrismaAdapter: any = null;
let prisma: any = null;

try {
  if (process.env.DATABASE_URL) {
    const adapter = require("@next-auth/prisma-adapter");
    PrismaAdapter = adapter.PrismaAdapter;
    const prismaModule = require("@/lib/prisma");
    prisma = prismaModule.prisma;
  }
} catch (error) {
  console.log('[MOCK] NextAuth: Prisma adapter not available, using JWT-only mode');
}

export const authOptions: NextAuthOptions = {
  ...(PrismaAdapter && prisma ? { adapter: PrismaAdapter(prisma) } : {}),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
      },
      async authorize(credentials) {
        // This is a placeholder - implement your actual authentication logic
        // For now, return a mock user
        if (credentials?.email) {
          return {
            id: "1",
            email: credentials.email,
            name: "Test User",
          }
        }
        return null
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
}

export default NextAuth(authOptions)

// Helper function to get session in server components/actions
export const auth = async () => {
  return await getServerSession(authOptions)
}

