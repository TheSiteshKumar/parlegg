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
  referralEarnings?: number;
  investmentReturns?: number;
  actionLabel: string;
  onAction: () => void;
  variant?: 'blue' | 'green';
  subtitle?: string;
  disabled?: boolean;
}

export default function WalletCard({
  title,
  balance,
  totalEarnings,
  totalWithdrawn,
  totalAdded,
  totalUsed,
  referralEarnings,
  investmentReturns,
  actionLabel,
  onAction,
  variant = 'blue',
  subtitle,
  disabled = false
}: WalletCardProps) {
  const baseButtonClass = "w-full py-3 rounded-xl font-semibold transition-colors";
  const buttonClass = disabled 
    ? `${baseButtonClass} bg-gray-600 cursor-not-allowed text-gray-400`
    : variant === 'blue' 
      ? `${baseButtonClass} bg-blue-600 hover:bg-blue-700`
      : `${baseButtonClass} bg-green-600 hover:bg-green-700`;

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50">
      <div className="flex items-center gap-3 mb-4">
        <WalletIcon className={`h-5 w-5 ${variant === 'blue' ? 'text-blue-500' : 'text-green-500'}`} />
        <div className="flex-1">
          <h3 className="font-semibold">{title}</h3>
          {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
        </div>
      </div>
      
      <div className="mb-6">
        <p className="text-xs text-gray-400 mb-1">Available Balance</p>
        <p className="text-3xl font-bold tracking-tight">{formatCurrency(balance)}</p>
        
        {/* Investment Wallet Details */}
        {totalAdded !== undefined && totalUsed !== undefined && (
          <div className="mt-3 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Total Added</span>
              <span className="text-blue-400">{formatCurrency(totalAdded ?? 0)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Total Used</span>
              <span className="text-gray-300">{formatCurrency(totalUsed ?? 0)}</span>
            </div>
            <div className="flex justify-between text-xs border-t border-gray-700 pt-1 mt-2">
              <span className="text-blue-300 font-medium">= Available Balance</span>
              <span className="text-blue-400 font-bold">{formatCurrency(balance)}</span>
            </div>
          </div>
        )}

        {/* Earnings Wallet Details */}
        {totalEarnings !== undefined && totalWithdrawn !== undefined && (
          <div className="mt-3 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">• Investment Returns</span>
              <span className="text-green-400">{formatCurrency(investmentReturns || 0)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">• Referral Rewards</span>
              <span className="text-purple-400">{formatCurrency(referralEarnings || 0)}</span>
            </div>
            <div className="flex justify-between text-xs border-t border-gray-700 pt-1 mt-2">
              <span className="text-gray-300 font-medium">Total Earned</span>
              <span className="text-white font-semibold">{formatCurrency(totalEarnings)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-red-400">- Total Withdrawn</span>
              <span className="text-red-400">-{formatCurrency(totalWithdrawn)}</span>
            </div>
            <div className="flex justify-between text-xs border-t border-gray-700 pt-1 mt-2">
              <span className="text-green-300 font-medium">= Available Balance</span>
              <span className="text-green-400 font-bold">{formatCurrency(balance)}</span>
            </div>
            
            {balance < 100 && (
              <div className="mt-2 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <p className="text-yellow-400 text-xs">
                  Minimum ₹100 required for withdrawal
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <button
        onClick={onAction}
        disabled={disabled}
        className={buttonClass}
      >
        {actionLabel}
      </button>
    </div>
  );
}