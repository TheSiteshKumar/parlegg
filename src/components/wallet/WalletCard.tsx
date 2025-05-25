import React from 'react';
import { Wallet as WalletIcon } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface WalletCardProps {
  title: string;
  balance: number;
  totalEarnings?: number;
  totalWithdrawn?: number;
  totalAdded?: number;
  totalUsed?: number;
  actionLabel: string;
  onAction: () => void;
  variant?: 'blue' | 'green';
  subtitle?: string;
}

export default function WalletCard({
  title,
  balance,
  totalEarnings,
  totalWithdrawn,
  totalAdded,
  totalUsed,
  actionLabel,
  onAction,
  variant = 'blue',
  subtitle
}: WalletCardProps) {
  const baseButtonClass = "w-full py-3 rounded-xl font-semibold transition-colors";
  const buttonClass = variant === 'blue' 
    ? `${baseButtonClass} bg-blue-600 hover:bg-blue-700`
    : `${baseButtonClass} bg-green-600 hover:bg-green-700`;

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50">
      <div className="flex items-center gap-3 mb-6">
        <WalletIcon className={`h-6 w-6 ${variant === 'blue' ? 'text-blue-500' : 'text-green-500'}`} />
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      
      <div className="mb-8">
        <p className="text-sm text-gray-400 mb-1">Available Balance</p>
        <p className="text-4xl font-bold tracking-tight">{formatCurrency(balance)}</p>
        
        {totalEarnings !== undefined && totalWithdrawn !== undefined && (
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Total Earnings</span>
              <span className="text-green-500">{formatCurrency(totalEarnings)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Total Withdrawn</span>
              <span className="text-gray-300">{formatCurrency(totalWithdrawn)}</span>
            </div>
          </div>
        )}

        {totalAdded !== undefined && totalUsed !== undefined && (
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Total Added</span>
              <span className="text-blue-500">{formatCurrency(totalAdded ?? 0)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Total Used</span>
              <span className="text-gray-300">{formatCurrency(totalUsed ?? 0)}</span>
            </div>
          </div>
        )}
        
        {subtitle && (
          <p className="text-sm text-gray-400 mt-2">{subtitle}</p>
        )}
      </div>

      <button
        onClick={onAction}
        className={buttonClass}
      >
        {actionLabel}
      </button>
    </div>
  );
}