import React, { useState } from 'react';
import { useWalletStore } from '@/stores/wallet-store';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Pencil, Check, ChevronDown } from 'lucide-react';

const ICONS = ['💼', '🦊', '🔑', '🪙', '🌈', '⚡️', '🎨', '⭐️', '🏆', '🧩'];
const COLORS = [
  '#6366f1', // indigo
  '#f59e42', // orange
  '#10b981', // green
  '#f43f5e', // pink
  '#fbbf24', // yellow
  '#3b82f6', // blue
  '#a21caf', // purple
  '#64748b', // slate
  '#eab308', // gold
  '#111827', // black
];

export default function WalletDropdown() {
  const {
    wallets,
    address,
    setAddress,
    updateWalletMeta,
  } = useWalletStore();
  const active = wallets.find((w) => w.address === address);
  const [editing, setEditing] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [editColor, setEditColor] = useState('');
  const [editIcon, setEditIcon] = useState('');

  const startEdit = (wallet: any) => {
    setEditing(wallet.address);
    setEditLabel(wallet.label || '');
    setEditColor(wallet.color || COLORS[0]);
    setEditIcon(wallet.icon || ICONS[0]);
  };

  const saveEdit = (address: string) => {
    updateWalletMeta(address, {
      label: editLabel,
      color: editColor,
      icon: editIcon,
    });
    setEditing(null);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="flex items-center gap-2 px-3 py-2 rounded-full border border-gray-300 bg-white hover:bg-gray-50"
          style={{ backgroundColor: active?.color || '#ffffff', color: '#111827' }}
        >
          <span className="text-xl">{active?.icon || '💼'}</span>
          <span className="font-semibold text-sm">
            {active?.label || (active?.address ? `${active.address.slice(0, 6)}...${active.address.slice(-4)}` : 'Select Wallet')}
          </span>
          <ChevronDown className="w-4 h-4 ml-1 text-gray-600" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[220px] bg-white border border-gray-200">
        {wallets.map((w) => (
          <DropdownMenuItem
            key={w.address}
            className="flex items-center gap-2 group"
            style={{ backgroundColor: w.address === address ? '#fef3c7' : undefined }}
            onClick={() => setAddress(w.address)}
          >
            <span className="text-xl mr-1">{w.icon || '💼'}</span>
            {editing === w.address ? (
              <>
                <input
                  className="border rounded px-1 py-0.5 w-20 text-xs mr-1"
                  value={editLabel}
                  onChange={e => setEditLabel(e.target.value)}
                  placeholder="Label"
                  onClick={e => e.stopPropagation()}
                />
                <select
                  className="border rounded px-1 py-0.5 w-12 text-xs mr-1"
                  value={editColor}
                  onChange={e => setEditColor(e.target.value)}
                  style={{ backgroundColor: editColor }}
                  onClick={e => e.stopPropagation()}
                >
                  {COLORS.map((c) => (
                    <option key={c} value={c} style={{ backgroundColor: c }} />
                  ))}
                </select>
                <select
                  className="border rounded px-1 py-0.5 w-10 text-xs mr-1"
                  value={editIcon}
                  onChange={e => setEditIcon(e.target.value)}
                  onClick={e => e.stopPropagation()}
                >
                  {ICONS.map((ic) => (
                    <option key={ic} value={ic}>{ic}</option>
                  ))}
                </select>
                <Button
                  size="icon"
                  variant="ghost"
                  className="p-1"
                  onClick={e => { e.stopPropagation(); saveEdit(w.address); }}
                >
                  <Check className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                <span className="font-medium text-sm mr-1">
                  {w.label || `${w.address.slice(0, 6)}...${w.address.slice(-4)}`}
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="p-1 ml-auto opacity-60 group-hover:opacity-100"
                  onClick={e => { e.stopPropagation(); startEdit(w); }}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
              </>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 