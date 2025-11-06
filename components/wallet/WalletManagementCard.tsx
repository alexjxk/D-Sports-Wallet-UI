'use client';

import React, { useState } from 'react';
import { Plus, LogIn, MoreVertical, Edit, Trash2, Shield, Key, Eye, EyeOff, AlertTriangle, Copy, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface WalletManagementCardProps {
  walletCount: number;
  onManageWallets: () => void;
  onSecurityCenter: () => void;
}

export function WalletManagementCard({ walletCount, onManageWallets, onSecurityCenter }: WalletManagementCardProps) {
  const [isAddWalletOpen, setIsAddWalletOpen] = useState(false);
  const [isImportWalletOpen, setIsImportWalletOpen] = useState(false);
  const [walletName, setWalletName] = useState('');
  const [seedPhrase, setSeedPhrase] = useState('');
  const [seedWords, setSeedWords] = useState<string[]>(Array(12).fill(''));
  const [importMode, setImportMode] = useState<'paste' | 'individual'>('paste');
  const [showSeedPhrase, setShowSeedPhrase] = useState(false);
  const [addWalletStep, setAddWalletStep] = useState(1);
  const [isImporting, setIsImporting] = useState(false);

  const handleAddWallet = () => {
    if (addWalletStep === 1) {
      setAddWalletStep(2);
    } else {
      // TODO: Actually create wallet
      setIsAddWalletOpen(false);
      setAddWalletStep(1);
      setWalletName('');
      onManageWallets();
    }
  };

  const handlePasteSeedPhrase = (value: string) => {
    const words = value.trim().split(/\s+/).filter(w => w.length > 0);
    if (words.length === 12) {
      setSeedWords(words);
      setSeedPhrase(value);
    } else {
      setSeedPhrase(value);
    }
  };

  const handleWordChange = (index: number, value: string) => {
    const newWords = [...seedWords];
    newWords[index] = value.toLowerCase().trim();
    setSeedWords(newWords);
    setSeedPhrase(newWords.join(' '));
  };

  const handlePasteToWords = () => {
    const words = seedPhrase.trim().split(/\s+/).filter(w => w.length > 0);
    if (words.length === 12) {
      setSeedWords(words);
    }
  };

  const handleImportWallet = async () => {
    setIsImporting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    // TODO: Actually import wallet
    setIsImportWalletOpen(false);
    setSeedPhrase('');
    setSeedWords(Array(12).fill(''));
    setImportMode('paste');
    setIsImporting(false);
    onManageWallets();
  };

  const filledWordsCount = seedWords.filter(w => w.length > 0).length;
  const isValid = filledWordsCount === 12;
  const canPaste = seedPhrase.trim().split(/\s+/).filter(w => w.length > 0).length === 12;

  return (
    <>
      <div className="p-4 bg-white rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900">Wallet Management</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <MoreVertical className="h-4 w-4 text-gray-600" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => {}}>
                <Edit className="h-4 w-4 mr-2" />
                Rename active wallet
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {}} className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Remove wallet
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onSecurityCenter}>
                <Shield className="h-4 w-4 mr-2" />
                Open Security Center
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex gap-2 flex-wrap items-center">
          <Button
            onClick={() => setIsAddWalletOpen(true)}
            className="bg-amber-500 hover:bg-amber-600 text-white"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Wallet
          </Button>
          
          <Button
            onClick={() => setIsImportWalletOpen(true)}
            variant="outline"
            size="sm"
          >
            <LogIn className="h-4 w-4 mr-1" />
            Import Wallet
          </Button>
          
          <button
            onClick={onManageWallets}
            className="text-sm text-gray-600 hover:text-gray-900 ml-auto"
          >
            {walletCount} wallet{walletCount !== 1 ? 's' : ''}
          </button>
        </div>
      </div>

      {/* Add Wallet Dialog */}
      <Dialog open={isAddWalletOpen} onOpenChange={setIsAddWalletOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {addWalletStep === 1 ? 'Create New Wallet' : 'Confirm Wallet Details'}
            </DialogTitle>
            <DialogDescription>
              {addWalletStep === 1
                ? 'Give your wallet a name to help you identify it.'
                : 'Review your wallet details before creating.'}
            </DialogDescription>
          </DialogHeader>
          
          {addWalletStep === 1 ? (
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="wallet-name">Wallet Name</Label>
                <Input
                  id="wallet-name"
                  value={walletName}
                  onChange={(e) => setWalletName(e.target.value)}
                  placeholder="e.g., Main Wallet"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Wallet Name</div>
                <div className="font-medium">{walletName || 'Unnamed Wallet'}</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Address</div>
                <div className="font-mono text-sm">0x0000...0000</div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            {addWalletStep === 2 && (
              <Button variant="outline" onClick={() => setAddWalletStep(1)}>
                Back
              </Button>
            )}
            <Button
              onClick={handleAddWallet}
              className="bg-amber-500 hover:bg-amber-600"
              disabled={addWalletStep === 1 && !walletName.trim()}
            >
              {addWalletStep === 1 ? 'Continue' : 'Create Wallet'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Wallet Dialog - Improved */}
      <Dialog open={isImportWalletOpen} onOpenChange={(open) => {
        if (!open) {
          setIsImportWalletOpen(false);
          setSeedPhrase('');
          setSeedWords(Array(12).fill(''));
          setImportMode('paste');
          setShowSeedPhrase(false);
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Key className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <DialogTitle className="text-2xl">Import Wallet</DialogTitle>
                <DialogDescription className="mt-1">
                  Enter your 12-word recovery phrase to restore your wallet
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Security Warning */}
          <Alert className="bg-amber-50 border-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <strong>Never share your recovery phrase.</strong> Only enter it on trusted devices. D-Sports will never ask for your recovery phrase.
            </AlertDescription>
          </Alert>

          {/* Mode Toggle */}
          <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
            <button
              onClick={() => {
                setImportMode('paste');
                if (canPaste) handlePasteToWords();
              }}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                importMode === 'paste'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Paste Phrase
            </button>
            <button
              onClick={() => setImportMode('individual')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                importMode === 'individual'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Enter Words
            </button>
          </div>

          <div className="space-y-4 py-4">
            {importMode === 'paste' ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="seed-phrase">Recovery Phrase (12 words)</Label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowSeedPhrase(!showSeedPhrase)}
                      className="text-xs text-gray-600 hover:text-gray-900 flex items-center gap-1"
                    >
                      {showSeedPhrase ? (
                        <>
                          <EyeOff className="h-3 w-3" />
                          Hide
                        </>
                      ) : (
                        <>
                          <Eye className="h-3 w-3" />
                          Show
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <Textarea
                  id="seed-phrase"
                  value={seedPhrase}
                  onChange={(e) => handlePasteSeedPhrase(e.target.value)}
                  placeholder="word1 word2 word3 ... word12"
                  rows={4}
                  className={`font-mono text-sm ${showSeedPhrase ? '' : 'tracking-wider'}`}
                  type={showSeedPhrase ? 'text' : 'password'}
                />
                <div className="flex items-center justify-between text-xs">
                  <span className={`${canPaste ? 'text-green-600' : 'text-gray-500'}`}>
                    {canPaste ? (
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        {canPaste ? '12 words detected' : `${seedPhrase.trim().split(/\s+/).filter(w => w.length > 0).length} words`}
                      </span>
                    ) : (
                      `${seedPhrase.trim().split(/\s+/).filter(w => w.length > 0).length} / 12 words`
                    )}
                  </span>
                  {canPaste && (
                    <button
                      type="button"
                      onClick={handlePasteToWords}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Switch to individual words →
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Enter Recovery Words</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                      {filledWordsCount} / 12 words
                    </span>
                    <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all"
                        style={{ width: `${(filledWordsCount / 12) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {seedWords.map((word, index) => (
                    <div key={index} className="relative">
                      <div className="absolute -top-1 -left-1 text-[10px] text-gray-400 font-medium">
                        {index + 1}
                      </div>
                      <Input
                        value={word}
                        onChange={(e) => handleWordChange(index, e.target.value)}
                        placeholder={`Word ${index + 1}`}
                        className="font-mono text-sm pr-8"
                        autoComplete="off"
                      />
                      {word.length > 0 && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <button
                    type="button"
                    onClick={() => {
                      const pasted = seedPhrase.trim().split(/\s+/);
                      if (pasted.length === 12) {
                        pasted.forEach((word, i) => handleWordChange(i, word));
                      }
                    }}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Paste all words
                  </button>
                  <span>•</span>
                  <span>Type each word individually</span>
                </div>
              </div>
            )}

            {/* Wallet Name (Optional) */}
            <div>
              <Label htmlFor="import-wallet-name">Wallet Name (Optional)</Label>
              <Input
                id="import-wallet-name"
                value={walletName}
                onChange={(e) => setWalletName(e.target.value)}
                placeholder="e.g., Imported Wallet"
                className="mt-1"
              />
            </div>
          </div>
          
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsImportWalletOpen(false);
                setSeedPhrase('');
                setSeedWords(Array(12).fill(''));
                setImportMode('paste');
                setShowSeedPhrase(false);
              }}
              disabled={isImporting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleImportWallet}
              className="bg-amber-500 hover:bg-amber-600"
              disabled={!isValid || isImporting}
            >
              {isImporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Importing...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Import Wallet
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
