import { useState } from 'react';
import { Zap } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { aiCreditsApi } from '@/lib/api';
import { AddCreditsModal } from './add-credits-modal';

export function CreditBalanceBar() {
  const [showAddCredits, setShowAddCredits] = useState(false);

  const { data: balance } = useQuery({
    queryKey: ['ai-credits-balance'],
    queryFn: aiCreditsApi.getBalance,
    refetchInterval: 30000,
  });

  const cents = balance?.balanceCents || 0;
  const isLow = cents < 100;
  const isEmpty = cents <= 0;

  return (
    <>
      <button
        onClick={() => setShowAddCredits(true)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-[7px] text-xs font-medium transition-colors ${
          isEmpty
            ? 'bg-red-50 text-red-700 hover:bg-red-100'
            : isLow
            ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
        title="AI Credits"
      >
        <Zap className="w-3.5 h-3.5" />
        ${(cents / 100).toFixed(2)}
      </button>

      {showAddCredits && (
        <AddCreditsModal onClose={() => setShowAddCredits(false)} />
      )}
    </>
  );
}
