'use client';

import { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const settingItems = [
  { label: 'Wallet', type: 'item', href: '/settings/wallet' },
  { label: 'General', type: 'item' },
  { label: 'Security and Privacy', type: 'item' },
  { label: 'Notifications', type: 'item' },
  { label: 'Help', type: 'item' },
  { label: 'About', type: 'item' },
];

export default function SettingsDropdown() {
  const [open, setOpen] = useState(false);
  const [showBackdrop, setShowBackdrop] = useState(false);

  useEffect(() => {
    if (open) {
      setShowBackdrop(true);
    } else {
      const timer = setTimeout(() => setShowBackdrop(false), 200);
      return () => clearTimeout(timer);
    }
  }, [open]);

  return (
    <>
      {showBackdrop && (
        <div
          className={`fixed inset-0 bg-black/20 backdrop-blur-xs z-40 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setOpen(false)}
        />
      )}
      <div className="relative z-50">
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="rounded-full md:rounded-none hover:bg-gray-100 dark:hover:bg-gray-800 h-16 md:h-auto w-16 md:w-40 md:hover:bg-transparent"
            >
              <Settings className="h-10 w-10 text-gray-700 dark:text-gray-300" />
              <span className="hidden md:flex">Settings</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={5}
            className={`w-56 p-1 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-md shadow-lg 
              transition-all duration-200 overflow-hidden ${open ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
          >
            {settingItems.map((item) => (
              <DropdownMenuItem
                key={item.label}
                asChild
                className="cursor-pointer px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800
                  border-b border-gray-100 dark:border-gray-800 last:border-b-0"
              >
                <Link href={item.href || '#'}>{item.label}</Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
