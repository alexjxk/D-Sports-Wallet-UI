// components/wallet/SendTokenModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import BigNumber from 'bignumber.js';
import { SUPPORTED_CHAINS } from '@/components/wallet/ChainSwitcher';
import { utils as ethersUtils } from 'ethers';
import { getDefaultProvider } from 'ethers';

/**
 * Interface representing token data structure used throughout the component
 */
interface TokenData {
  usd: number;               // USD value of token
  token_address: string;     // Contract address of the token
  name: string;              // Full name of the token
  symbol: string;            // Token symbol (e.g., ETH, BTC)
  logo?: string;             // URL to token logo
  thumbnail?: string;        // URL to token thumbnail
  decimals: number;          // Number of decimal places for the token
  balance: string;           // User's token balance in smallest unit (wei, satoshi, etc.)
  possible_spam?: boolean;   // Flag for potentially spam tokens
  verified_collection?: boolean; // Flag for verified token collections
}

/**
 * Props for the SendTokenModal component
 */
interface SendTokenModalProps {
  isOpen: boolean;                   // Controls modal visibility
  onClose: () => void;               // Function to close the modal
  tokens: TokenData[] | undefined;   // List of available tokens in user's wallet
  activeChain: any;                  // Currently connected blockchain network
  wallet?: any;                     // Optional: active wallet instance
}

/**
 * Modal component for sending tokens to other addresses
 * Supports multiple blockchain networks and wallets
 */
export function SendTokenModal({
  isOpen,
  onClose,
  tokens,
  activeChain,
  wallet,
}: SendTokenModalProps) {
  // Component state variables
  const [isSending, setIsSending] = useState(false);               // Loading state during transaction
  const [recipient, setRecipient] = useState('');                  // Recipient address
  const [amount, setAmount] = useState('');                        // Amount to send
  const [selectedTokenAddress, setSelectedTokenAddress] = useState(''); // Selected token address
  const [isMetaMaskAvailable, setIsMetaMaskAvailable] = useState(false); // MetaMask availability
  const [gasEstimate, setGasEstimate] = useState<string | null>(null); // NEW: gas estimate in native token
  const [estimatingGas, setEstimatingGas] = useState(false);

  const { toast } = useToast();      // Toast notification hook

  // Check if we're on an EVM-compatible chain
  const isEVMChain = activeChain &&
    SUPPORTED_CHAINS.some(chain => chain.id === activeChain.id);

  /**
   * Effect hook to check for MetaMask availability when the modal opens
   * This runs when the modal is opened or the active chain changes
   */
  useEffect(() => {
    const checkMetaMask = async () => {
      try {
        // Detect MetaMask by checking window.ethereum and isMetaMask property
        const ethereum = window?.ethereum;
        const hasMetaMask = Boolean(
          ethereum &&
          (ethereum.isMetaMask ||
            ethereum.providers?.some((p: any) => p.isMetaMask))
        );

        setIsMetaMaskAvailable(hasMetaMask);

        console.log('MetaMask check:', {
          hasEthereum: Boolean(ethereum),
          hasMetaMask
        });
      } catch (error) {
        console.error('Error checking MetaMask availability:', error);
        setIsMetaMaskAvailable(false);
      }
    };

    // Only run the check when the modal is open
    if (isOpen) {
      checkMetaMask();
    }
  }, [isOpen, activeChain]);

  /**
   * Helper to compute gas estimate using ethers wallet if available (native token only)
   */
  useEffect(() => {
    async function estimate() {
      if (!wallet || !recipient || !amount || !selectedTokenAddress) {
        setGasEstimate(null);
        return;
      }

      // Only estimate for native token transfers for now
      const token = tokens?.find(t => t.token_address === selectedTokenAddress);
      if (!token) return;
      const isNativeToken = token.token_address === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' || token.symbol === 'ETH';
      if (!isNativeToken) {
        setGasEstimate('—');
        return;
      }

      try {
        setEstimatingGas(true);
        const provider = wallet.provider || getDefaultProvider();
        const gas = await provider.estimateGas({
          from: wallet.address,
          to: recipient,
          value: ethersUtils.parseEther(amount),
        });
        let gasPrice: bigint;
        if ((provider as any).getGasPrice) {
          gasPrice = await (provider as any).getGasPrice();
        } else {
          const feeData = await (provider as any).getFeeData?.();
          gasPrice = feeData?.gasPrice ?? 0n;
        }
        const feeEth = ethersUtils.formatEther(gas * gasPrice);
        setGasEstimate(parseFloat(feeEth).toFixed(6) + ' ETH');
      } catch (e) {
        console.warn('Gas estimation failed', e);
        setGasEstimate(null);
      } finally {
        setEstimatingGas(false);
      }
    }

    estimate();
  }, [wallet, recipient, amount, selectedTokenAddress]);

  /**
   * Gets the human-readable name of the current blockchain network
   * @returns string with the network name for display purposes
   */
  const getNetworkName = (): string => {
    if (!activeChain) return 'cryptocurrency';
    return activeChain.name || (activeChain.isEVM ? 'Ethereum' : 'cryptocurrency');
  };

  /**
   * Creates a user-friendly validation error message for the current network
   * @returns string with appropriate validation error message
   */
  const getAddressValidationMessage = (): string => {
    const networkName = getNetworkName();
    return `Please enter a valid ${networkName} address`;
  };

  /**
   * Handles sending tokens using MetaMask wallet
   * Supports both native tokens (ETH, MATIC) and ERC20 tokens
   */
  const sendViaMetaMask = async () => {
    try {
      setIsSending(true);

      // Validate that all required fields are filled
      if (!recipient || !amount || !selectedTokenAddress) {
        toast({
          title: 'Error',
          description: 'Please fill all fields',
          variant: 'destructive',
        });
        return;
      }

      // Find the selected token from available tokens
      const token = tokens?.find(t => t.token_address === selectedTokenAddress);

      if (!token) {
        toast({
          title: 'Error',
          description: 'Invalid token selected',
          variant: 'destructive',
        });
        return;
      }

      // Check if MetaMask is available in the browser
      const ethereum = window?.ethereum;
      if (!ethereum || !(ethereum.isMetaMask || ethereum.providers?.some((p: any) => p.isMetaMask))) {
        toast({
          title: 'MetaMask Not Available',
          description: 'Please install MetaMask to use this feature',
          variant: 'destructive',
        });
        return;
      }

      // Clean amount input by trimming whitespace
      const sanitizedAmount = amount.trim();

      // Validate amount is a valid number format
      if (!/^\d*\.?\d+$/.test(sanitizedAmount)) {
        toast({
          title: 'Invalid Amount',
          description: 'Please enter a valid numeric amount',
          variant: 'destructive',
        });
        return;
      }

      // Ensure amount is a positive number
      const numAmount = Number(sanitizedAmount);
      if (isNaN(numAmount) || numAmount <= 0) {
        toast({
          title: 'Invalid Amount',
          description: 'Amount must be a positive number',
          variant: 'destructive',
        });
        return;
      }

      // Configure BigNumber for precise calculations with large values
      BigNumber.config({
        EXPONENTIAL_AT: 1e+9,        // Prevent scientific notation
        DECIMAL_PLACES: 0,           // No decimal places for wei values
        ROUNDING_MODE: BigNumber.ROUND_DOWN  // Always round down (safer for sending)
      });

      // Calculate amount in wei (or smallest token unit) with precision
      const decimalFactor = new BigNumber(10).pow(token.decimals);
      const amountBN = new BigNumber(sanitizedAmount);

      // Verify BigNumber creation was successful
      if (!amountBN.isFinite()) {
        toast({
          title: 'Error',
          description: 'Invalid amount value',
          variant: 'destructive',
        });
        return;
      }

      // Convert from human-readable units to chain units (e.g., ETH -> wei)
      const amountInWei = amountBN.multipliedBy(decimalFactor).toString();

      try {
        // Get the right provider - either ethereum itself or the MetaMask provider from the providers array
        const provider = ethereum.isMetaMask ?
          ethereum :
          ethereum.providers?.find((p: any) => p.isMetaMask);

        if (!provider) {
          throw new Error("Couldn't find MetaMask provider");
        }

        // Request account access from user
        const accounts = await provider.request({ method: 'eth_requestAccounts' });
        if (!accounts || accounts.length === 0) {
          throw new Error("No accounts found - please unlock MetaMask");
        }

        // Check if we need to switch networks in MetaMask
        if (activeChain && activeChain.id) {
          // Convert chain ID to hexadecimal format required by MetaMask
          const chainIdHex = typeof activeChain.id === 'number' ?
            `0x${activeChain.id.toString(16)}` :
            `0x${parseInt(activeChain.id).toString(16)}`;

          try {
            // Try to switch to the active chain
            await provider.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: chainIdHex }],
            });
          } catch (switchError: any) {
            // This error code indicates that the chain has not been added to MetaMask
            if (switchError.code === 4902) {
              toast({
                title: 'Network Not Available',
                description: `Please add ${activeChain.name} network to your MetaMask`,
                variant: 'destructive',
              });
              return;
            }
            throw switchError;
          }
        }

        // Prepare transaction data for MetaMask
        let txData;

        // Check if we're sending native tokens (ETH, MATIC, etc.)
        const nativeTokenAddresses = [
          '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          '0x0000000000000000000000000000000000000000'
        ];

        const isNativeToken = token.symbol === 'ETH' ||
          token.symbol === activeChain?.nativeCurrency?.symbol ||
          nativeTokenAddresses.includes(token.token_address.toLowerCase());

        if (isNativeToken) {
          // For native token transfers (ETH, MATIC, BNB, etc.)
          txData = {
            to: recipient,
            from: accounts[0],
            value: `0x${BigInt(amountInWei).toString(16)}`,
          };
        } else {
          // For ERC20 token transfers
          // Create the contract method data for 'transfer' function
          const methodId = '0xa9059cbb'; // transfer method ID (first 4 bytes of keccak256("transfer(address,uint256)"))

          // Recipient address (padded to 32 bytes)
          const paddedAddress = recipient.slice(2).padStart(64, '0');

          // Amount (padded to 32 bytes)
          const paddedAmount = BigInt(amountInWei).toString(16).padStart(64, '0');

          // Complete data field - methodId + encoded parameters
          const data = `${methodId}${paddedAddress}${paddedAmount}`;

          txData = {
            to: token.token_address,  // Send to token contract
            from: accounts[0],        // From connected wallet
            value: '0x0',             // 0 ETH value for token transfers
            data,                     // Token transfer data
          };
        }

        // Send transaction via MetaMask
        const txHash = await provider.request({
          method: 'eth_sendTransaction',
          params: [txData],
        });

        // Show success message
        toast({
          title: 'Transaction Sent',
          description: 'Your transaction has been sent via MetaMask',
          variant: 'default',
        });

        // Reset form and close modal
        setRecipient('');
        setAmount('');
        setSelectedTokenAddress('');
        onClose();
      } catch (err: any) {
        // Handle MetaMask-specific errors
        console.error('MetaMask error:', err);
        toast({
          title: 'MetaMask Error',
          description: err.message || 'Transaction failed',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      // Handle general errors
      console.error('Send token error:', error);
      toast({
        title: 'Error',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      // Reset loading state regardless of outcome
      setIsSending(false);
    }
  };

  /**
   * Handles sending tokens
   * Provides a simplified token transfer implementation
   */
  const sendTokens = async () => {
    toast({ title: 'Not Implemented', description: 'Direct send via smart wallet coming soon.' });
  };

  /**
   * Handler for the Send button
   */
  const handleSendClick = async () => {
    try {
      // Check if MetaMask is available and use it, otherwise use our simplified implementation
      if (isMetaMaskAvailable && isEVMChain) {
        await sendViaMetaMask();
      } else {
        await sendTokens();
      }
    } catch (error: any) {
      // Handle any errors that might be thrown from the async functions
      console.error('Transaction error:', error);
      toast({
        title: 'Transaction Failed',
        description: error.message || 'An error occurred during the transaction',
        variant: 'destructive',
      });
    }
  };

  // Don't render anything if modal is closed
  if (!isOpen) return null;

  // Find the selected token to display balance
  const selectedToken = tokens?.find(t => t.token_address === selectedTokenAddress);
  const formattedBalance = selectedToken
    ? (parseFloat(selectedToken.balance) / Math.pow(10, selectedToken.decimals)).toFixed(4)
    : '0.0000';

  // Get network name for display
  const networkName = getNetworkName();

  // Determine if we should show MetaMask option
  const showMetaMaskOption = isMetaMaskAvailable && isEVMChain;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg p-6 shadow-lg max-w-md mx-auto w-full">
        <h2 className="text-xl font-bold mb-4">Send Tokens</h2>

        {/* Wallet Info - Fixed height container */}
        <div className="mb-5">
          {isMetaMaskAvailable && isEVMChain && (
            <div className="flex items-center gap-2 bg-green-50 text-green-600 px-3 py-2 rounded-md border border-green-200 mb-4">
              <div className="relative w-5 h-5">
                <Image
                  src="/MetaMask_Fox.svg"
                  alt="MetaMask Fox"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-sm">MetaMask is available for this transaction</span>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {/* Recipient address input */}
          <div>
            <label className="block text-sm font-medium mb-1">Recipient Address</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder={`${networkName} address...`}
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>

          {/* Token selection dropdown */}
          <div>
            <label className="block text-sm font-medium mb-1">Token</label>
            <select
              className="w-full p-2 border rounded"
              value={selectedTokenAddress}
              onChange={(e) => setSelectedTokenAddress(e.target.value)}
            >
              <option value="">Select Token</option>
              {tokens?.map(token => (
                <option key={token.token_address} value={token.token_address}>
                  {token.symbol} ({(parseFloat(token.balance) / Math.pow(10, token.decimals)).toFixed(4)})
                </option>
              ))}
            </select>
            {selectedToken && (
              <p className="text-xs text-muted-foreground mt-1">
                Available: {formattedBalance} {selectedToken.symbol}
              </p>
            )}
          </div>

          {/* Amount input */}
          <div>
            <label className="block text-sm font-medium mb-1">Amount</label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              placeholder="0.0"
              min="0"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            {amount && (!/^\s*\d*\.?\d+\s*$/.test(amount) || parseFloat(amount.trim()) <= 0) && (
              <p className="text-red-500 text-xs mt-1">Please enter a valid positive number</p>
            )}
          </div>

          {/* Gas Estimate */}
          <div>
            <label className="block text-sm font-medium mb-1">Gas Estimate</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="—"
              value={gasEstimate || '—'}
              readOnly
            />
          </div>
        </div>

        {/* MetaMask message - Fixed height container */}
        <div className="mt-4 min-h-[44px]">
          {showMetaMaskOption && (
            <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
              <p className="flex items-center gap-1 text-amber-700">
                <div className="relative w-4 h-4">
                  <Image
                    src="/MetaMask_Fox.svg"
                    alt="MetaMask Fox"
                    fill
                    className="object-contain"
                  />
                </div>
                You will confirm this transaction in your MetaMask wallet
              </p>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-2 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            className="bg-amber-500 hover:bg-amber-600 text-white"
            onClick={handleSendClick}
            disabled={isSending}
          >
            {isSending ? 'Sending...' : 'Send'}
          </Button>
        </div>
      </div>
    </div>
  );
}
