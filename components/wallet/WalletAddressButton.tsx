'use client';

import type React from 'react';

import { useState, useRef, memo } from 'react';
import { Check, Copy } from 'lucide-react';

interface WalletAddressButtonProps {
  address: string;
  className?: string;
}

function WalletAddressButton({
  address,
  className = '',
}: WalletAddressButtonProps) {
  const [copied, setCopied] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Truncate the wallet address to show first 4 and last 4 characters
  const truncatedAddress = address
    ? `${address.substring(0, 4)}...${address.substring(address.length - 4)}`
    : '0x00...0000';

  const copyToClipboard = (e: React.MouseEvent) => {
    // Create ripple effect
    if (buttonRef.current) {
      const button = buttonRef.current;
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.className = 'absolute rounded-full bg-amber-500/30 animate-ripple';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      button.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    }

    // Copy to clipboard
    navigator.clipboard.writeText(address);
    setCopied(true);

    // Reset the copied state after 2 seconds
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className={`relative group ${className} w-full`}>
      {/* Button */}
      <button
        ref={buttonRef}
        onClick={copyToClipboard}
        className={`
          relative overflow-hidden w-full h-10 px-4 py-2 rounded-md
          font-mono text-sm flex items-center justify-between
          border-2 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50
          shadow-sm hover:shadow-sm transition-all duration-300
          ${
            copied
              ? 'border-amber-500'
              : 'border-slate-200 dark:border-slate-700 group-hover:border-amber-500/70'
          }
        `}
      >
        {/* Button content */}
        <span
          className={`transition-all duration-300 ${
            copied ? 'text-amber-500 dark:text-amber-500' : ''
          }`}
        >
          {truncatedAddress}
        </span>

        <div className="relative w-5 h-5 flex items-center justify-center ml-2">
          <span
            className={`
            absolute inset-0 flex items-center justify-center transition-all duration-300
            ${copied ? 'opacity-0 scale-0' : 'opacity-70 scale-100'}
          `}
          >
            <Copy className="h-3.5 w-3.5" />
          </span>
          <span
            className={`
            absolute inset-0 flex items-center justify-center transition-all duration-300 text-amber-500
            ${copied ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}
          `}
          >
            <Check className="h-3.5 w-3.5" />
          </span>
        </div>
      </button>

      {/* Elegant border highlight */}
      <div
        className={`
        absolute -inset-[1px] rounded-md -z-10
        bg-linear-to-r from-amber-500/50 via-amber-500 to-amber-500/50
        transition-all duration-300 opacity-0 blur-[1px]
        group-hover:opacity-100
        ${copied ? 'opacity-100 blur-[2px]' : ''}
      `}
      />

      {/* Subtle corner accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-tl-sm" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-tr-sm" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-bl-sm" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-br-sm" />
    </div>
  );
}

export default memo(WalletAddressButton);
