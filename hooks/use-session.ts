import { useSession as useNextAuthSession } from 'next-auth/react';

/**
 * Custom hook that wraps NextAuth's useSession
 * Returns the session user directly with id property for easier access
 */
export default function useSession() {
  const { data: session, status } = useNextAuthSession();

  // Return the user object directly, or null if not authenticated
  if (status === 'loading') {
    return null; // Still loading
  }

  if (status === 'unauthenticated' || !session?.user) {
    return null; // Not authenticated
  }

  // Return the user with id property
  return {
    id: session.user.id || '',
    email: session.user.email,
    name: session.user.name,
    image: session.user.image,
  };
}

