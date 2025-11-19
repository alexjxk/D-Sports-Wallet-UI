'use client';

import React, { useState } from 'react';
import { Plus, ArrowUp, ArrowDown, ShoppingBag, Send, QrCode, Repeat, Landmark } from 'lucide-react';
import { ActionModal } from './ActionModal';
import { BuyFlow } from './flows/BuyFlow';
import { DepositFlow } from './flows/DepositFlow';
import { SendFlow } from './flows/SendFlow';
import { ReceiveFlow } from './flows/ReceiveFlow';
import { SwapFlow } from './flows/SwapFlow';
import { PayFlow } from './flows/PayFlow';
import { SellFlow } from './flows/SellFlow';
import { WithdrawFlow } from './flows/WithdrawFlow';

const ACTIONS = [
  { key: 'buy', label: 'Buy', color: 'bg-green-500', icon: Plus, FlowComponent: BuyFlow },
  { key: 'deposit', label: 'Deposit', color: 'bg-blue-500', icon: ArrowDown, FlowComponent: DepositFlow },
  { key: 'send', label: 'Send', color: 'bg-orange-500', icon: Send, FlowComponent: SendFlow },
  { key: 'receive', label: 'Receive', color: 'bg-teal-500', icon: QrCode, FlowComponent: ReceiveFlow },
  { key: 'swap', label: 'Swap', color: 'bg-indigo-500', icon: Repeat, FlowComponent: SwapFlow },
  { key: 'pay', label: 'Pay', color: 'bg-purple-500', icon: ShoppingBag, FlowComponent: PayFlow },
  { key: 'sell', label: 'Sell', color: 'bg-red-500', icon: ArrowUp, FlowComponent: SellFlow },
  { key: 'withdraw', label: 'Withdraw', color: 'bg-amber-500', icon: Landmark, FlowComponent: WithdrawFlow },
];

export function ActionButtonsRow() {
  const [activeAction, setActiveAction] = useState<string | null>(null);

  const activeFlow = ACTIONS.find(a => a.key === activeAction);
  const FlowComponent = activeFlow?.FlowComponent;

  return (
    <>
      <div className="w-full">
        <div
          className="flex gap-3 md:gap-4 lg:gap-6 overflow-x-auto pb-3 px-4 sm:px-6 lg:px-8 snap-x snap-mandatory no-scrollbar"
        >
          {ACTIONS.map(({ key, label, color, icon: Icon }) => (
            <div key={key} className="snap-center flex-shrink-0">
              <button
                onClick={() => setActiveAction(key)}
                className="flex flex-col items-center justify-center gap-1 w-16 h-20 sm:gap-2 sm:w-20 sm:h-24 md:w-24 md:h-28 bg-cream rounded-3xl hover:bg-cream-dark transition-all shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 active:scale-95"
                aria-label={label}
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 ${color} rounded-full flex items-center justify-center shadow-sm`}>
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-white" />
                </div>
                <span className="text-xs sm:text-sm md:text-base font-medium text-gray-900">{label}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {activeFlow && FlowComponent && (
        <FlowComponent
          isOpen={!!activeAction}
          onClose={() => setActiveAction(null)}
        />
      )}
    </>
  );
}
