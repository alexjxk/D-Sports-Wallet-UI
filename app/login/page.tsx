'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      // This is a placeholder - you'll need to configure actual authentication providers
      // For now, this will redirect after a mock sign-in
      await signIn('credentials', {
        redirect: false,
        callbackUrl: '/wallet',
      });
      router.push('/wallet');
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>
            Sign in to access your D-Sports Wallet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleSignIn} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
          <p className="text-sm text-muted-foreground mt-4 text-center">
            Note: Authentication providers need to be configured in auth.ts
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

