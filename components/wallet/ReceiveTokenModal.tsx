'use client';

// Importing necessary components and hooks
import { Button } from '@/components/ui/button'; // Button component from the UI library
import { useToast } from '@/hooks/use-toast'; // Custom hook for displaying toast notifications
import { useQRCode } from 'next-qrcode';
import { ethers } from 'ethers';

// Defining the props for the ReceiveTokenModal component
interface ReceiveTokenModalProps {
  isOpen: boolean; // Determines if the modal is open
  onCloseAction: () => void; // Function to handle closing the modal
  address: string | null; // Wallet address to display or generate QR code for
  wallet?: ethers.Wallet | null; // Optional: active wallet instance
}

// Functional component for the ReceiveTokenModal
export function ReceiveTokenModal({
  isOpen, // Prop to check if the modal should be displayed
  onCloseAction, // Prop for the close action handler
  address, // Prop for the wallet address
  wallet, // Prop for the wallet instance
}: ReceiveTokenModalProps) {
  const { toast } = useToast(); // Destructuring toast function from the useToast hook
  const { SVG } = useQRCode();

  

  // If the modal is not open, return null to render nothing
  if (!isOpen) return null;

  // JSX for rendering the modal
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      {/* Modal container */}
      <div className="bg-background rounded-lg p-6 shadow-lg max-w-md mx-auto">
        <div className="space-y-4 text-center">
          {/* Modal title */}
          <h2 className="text-xl font-bold">Receive Tokens</h2>
          {/* Modal description */}
          <p className="text-sm text-muted-foreground">
            Share your address to receive tokens
          </p>

          {/* QR Code or placeholder */}
          <div className="p-4 bg-gray-100 mx-auto w-40 h-40 flex items-center justify-center">
            {address ? (
              // Display QR code if address is available
              (<SVG
                text={address}
                options={{
                  type: 'type/image',
                  errorCorrectionLevel: 'M',
                  margin: 3,
                  scale: 4,
                  width: 200,
                  color: {
                    dark: '#000000',
                    light: '#ffffff',
                  },
                }}
              />)
            ) : (
              // Placeholder text if no address is available
              (<p className="text-xs text-gray-500">No address available</p>)
            )}
          </div>

          {/* Wallet address display and copy button */}
          <div className="mt-2">
            <p className="text-xs text-muted-foreground mb-1">
              Your Wallet Address
            </p>
            <div className="flex items-center flex-col justify-center gap-2">
              {/* Display wallet address */}
              <code className="bg-muted p-2 rounded text-sm break-all">
                {address}
              </code>


              {/* Copy button */}
              <Button
                variant="ghost"
                size="sm"
                className="p-1 text-amber-500 hover:text-amber-600"
                onClick={() => {
                  if (address) {
                    navigator.clipboard.writeText(address); // Copy address to clipboard
                    toast({
                      title: 'Copied to clipboard',
                      description: 'Your wallet address has been copied.',
                      duration: 2000,
                    }); // Show success toast
                  }
                }}
              >
                Copy
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"></path>
                  <rect x="8" y="6" width="8" height="12" rx="1"></rect>
                  <path d="M8 6v4a2 2 0 0 0 2 2h4"></path>
                  <rect x="8" y="10" width="8" height="12" rx="1"></rect>
                  <path d="M8 10v4a2 2 0 0 0 2 2h4"></path>
                  <rect x="8" y="14" width="8" height="12" rx="1"></rect>
                  <path d="M8 14v4a2 2 0 0 0 2 2h4"></path>
                  <rect x="8" y="18" width="8" height="12" rx="1"></rect>
                  <path d="M8 18v4a2 2 0 0 0 2 2h4"></path>
                  <rect x="8" y="22" width="8" height="12" rx="1"></rect>
                  <path d="M8 22v4a2 2 0 0 0 2 2h4"></path>
                </svg>
              </Button>
            </div>
          </div>
        </div>
        {/* Close button for the modal */}
        <div className="mt-4 flex justify-end">
          <Button variant="outline" onClick={onCloseAction}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
