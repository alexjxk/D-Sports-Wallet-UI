import React from 'react';
import { Wallet, Loader2 } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Wallet className="h-6 w-6 text-amber-500" />
          </div>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground">Loading...</p>
          <p className="text-sm text-muted-foreground mt-1">Please wait</p>
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;

