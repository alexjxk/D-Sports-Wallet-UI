'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

// Define proper type for chain objects
interface Chain {
  id: number;
  name: string;
  symbol: string;
  color: string;
  isEVM: boolean;
}

export const SUPPORTED_CHAINS: Chain[] = [
  { id: 1, name: 'Ethereum', symbol: 'ETH', color: '#627EEA', isEVM: true },
  { id: 137, name: 'Polygon', symbol: 'MATIC', color: '#8247E5', isEVM: true },
  { id: 56, name: 'BNB Chain', symbol: 'BNB', color: '#F3BA2F', isEVM: true },
  { id: 42161, name: 'Arbitrum', symbol: 'ETH', color: '#2D374B', isEVM: true },
  { id: 10, name: 'Optimism', symbol: 'ETH', color: '#FF0420', isEVM: true },
];

interface ChainSwitcherProps {
  activeChainId: number;
  setActiveChainId: (id: number) => void;
}

export default function ChainSwitcher({ activeChainId, setActiveChainId }: ChainSwitcherProps) {
  const [isSwitching, setIsSwitching] = useState<boolean>(false);
  const [targetChainId, setTargetChainId] = useState<number | null>(null);
  const { toast } = useToast();
  const [dropdownSide, setDropdownSide] = useState<'top' | 'bottom'>('bottom');
  const [messagePosition, setMessagePosition] = useState<'top' | 'bottom'>('bottom');

  useEffect(() => {
    // Function to update dropdown side and message position based on window width
    const updatePositions = () => {
      if (typeof window !== 'undefined') {
        const isMobile = window.innerWidth < 768;
        setDropdownSide(isMobile ? 'top' : 'bottom');
        setMessagePosition(isMobile ? 'top' : 'bottom');
      }
    };
    updatePositions();
    window.addEventListener('resize', updatePositions);
    return () => window.removeEventListener('resize', updatePositions);
  }, []);

  // Find the active chain in our supported chains list
  const currentChain = SUPPORTED_CHAINS.find(
    (chain) => chain.id === activeChainId
  );

  const handleSwitchChain = async (chainId: number) => {
    if (chainId === activeChainId || isSwitching) {
      return;
    }
    try {
      setIsSwitching(true);
      setTargetChainId(chainId);
      setTimeout(() => {
        setActiveChainId(chainId);
        setTargetChainId(null);
        setIsSwitching(false);
        const targetChain = SUPPORTED_CHAINS.find(chain => chain.id === chainId);
        toast({
          title: 'Chain Switched',
          description: `Successfully switched to ${targetChain?.name || 'new chain'}`,
        });
      }, 1000);
    } catch (error) {
      console.error('Error switching chain:', error);
      toast({
        title: 'Error Switching Chain',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
      setTargetChainId(null);
      setIsSwitching(false);
    }
  };

  // Style object for chain indicator with proper typing
  const getChainIndicatorStyle = (chain: Chain) => ({
    backgroundColor: chain.color,
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    display: 'inline-block',
    marginRight: '6px'
  });

  return (
    <div className="relative w-auto">
      {isSwitching && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`absolute left-1/2 transform -translate-x-1/2 bg-background border border-border rounded-lg p-2 shadow-md z-10 flex items-center gap-2 whitespace-nowrap
            ${messagePosition === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'}`}
        >
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span className="text-sm">
            Switching to {SUPPORTED_CHAINS.find(chain => chain.id === targetChainId)?.name}...
          </span>
        </motion.div>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={`flex items-center gap-1 h-9 px-3 max-w-40
              sm:px-2 sm:max-w-32
              xs:px-1.5 xs:max-w-20
              ${isSwitching ? 'border-primary' : ''}`}
            disabled={isSwitching}
          >
            {isSwitching ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-xs truncate">Switching...</span>
              </>
            ) : (
              <>
                {currentChain && (
                  <span
                    style={getChainIndicatorStyle(currentChain)}
                    className="animate-pulse"
                  />
                )}
                <span className="text-xs font-medium truncate hidden sm:inline">{currentChain?.name || 'Select'}</span>
                <ChevronDown className="h-3 w-3 ml-1 flex-shrink-0" />
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          side={dropdownSide}
          sideOffset={5}
          className="w-32"
        >
          {SUPPORTED_CHAINS.map((chain) => (
            <DropdownMenuItem
              key={chain.id}
              className={`flex items-center gap-2 text-xs ${chain.id === activeChainId ? 'font-bold bg-muted' : ''
                }`}
              onClick={() => handleSwitchChain(chain.id)}
              disabled={isSwitching || chain.id === activeChainId}
            >
              <span style={getChainIndicatorStyle(chain)} />
              <span>{chain.name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
