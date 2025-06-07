import React from 'react';
import { Wallet as WalletIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface WalletCardProps {
  title: string;
  balance: number;
  totalEarnings?: number;
  totalRewards?: number;
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
  totalRewards,
  totalWithdrawn,
  totalAdded,
  totalUsed,
  actionLabel,
  onAction,
  variant = 'blue',
  subtitle
}: WalletCardProps) {
  const baseButtonClass = "w-full py-3 rounded-xl font-semibold transition-all transform hover:scale-105";
  const buttonClass = variant === 'blue' 
    ? `${baseButtonClass} bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg`
    : `${baseButtonClass} bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg`;

  const cardClass = variant === 'blue'
    ? 'bg-gradient-to-br from-blue-900/20 to-blue-800/20 border-blue-500/20'
    : 'bg-gradient-to-br from-green-900/20 to-green-800/20 border-green-500/20';

  // Ensure all values are numbers with fallbacks
  const safeBalance = Number(balance) || 0;
  const safeTotalEarnings = Number(totalEarnings) || 0;
  const safeTotalRewards = Number(totalRewards) || 0;
  const safeTotalWithdrawn = Number(totalWithdrawn) || 0;
  const safeTotalAdded = Number(totalAdded) || 0;
  const safeTotalUsed = Number(totalUsed) || 0;

  // Calculate combined total earnings for earnings wallet
  const combinedTotalEarnings = safeTotalEarnings + safeTotalRewards;

  return (
    <div className={`${cardClass} backdrop-blur-sm p-8 rounded-2xl border transition-all hover:border-opacity-40`}>
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-3 rounded-xl ${variant === 'blue' ? 'bg-blue-500/10' : 'bg-green-500/10'}`}>
          <WalletIcon className={`h-6 w-6 ${variant === 'blue' ? 'text-blue-500' : 'text-green-500'}`} />
        </div>
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
        </div>
      </div>
      
      <div className="mb-8">
        <p className="text-sm text-gray-400 mb-2">Available Balance</p>
        <p className={`text-4xl font-bold tracking-tight ${variant === 'blue' ? 'text-blue-400' : 'text-green-400'}`}>
          {formatCurrency(safeBalance)}
        </p>
        
        {/* Earnings Wallet Details */}
        {totalEarnings !== undefined && totalRewards !== undefined && totalWithdrawn !== undefined && (
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-900/30 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-gray-400">Investment Returns</span>
              </div>
              <span className="text-blue-500 font-semibold">{formatCurrency(safeTotalEarnings)}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-900/30 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-purple-500" />
                <span className="text-sm text-gray-400">Referral Rewards</span>
              </div>
              <span className="text-purple-500 font-semibold">{formatCurrency(safeTotalRewards)}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-900/30 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-400">Total Withdrawn</span>
              </div>
              <span className="text-gray-300 font-semibold">{formatCurrency(safeTotalWithdrawn)}</span>
            </div>
            {/* Show calculation breakdown for earnings wallet */}
            <div className="mt-4 p-3 bg-green-500/5 border border-green-500/20 rounded-lg">
              <div className="text-xs text-green-400 mb-1">Balance Calculation:</div>
              <div className="text-xs text-gray-300">
                ({formatCurrency(safeTotalEarnings)} + {formatCurrency(safeTotalRewards)}) - {formatCurrency(safeTotalWithdrawn)} = {formatCurrency(safeBalance)}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                (Investment Returns + Referral Rewards) - Total Withdrawn = Available Balance
              </div>
            </div>
          </div>
        )}

        {/* Investment Wallet Details */}
        {totalAdded !== undefined && totalUsed !== undefined && (
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-900/30 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-gray-400">Total Added</span>
              </div>
              <span className="text-blue-500 font-semibold">{formatCurrency(safeTotalAdded)}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-900/30 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-400">Total Used</span>
              </div>
              <span className="text-gray-300 font-semibold">{formatCurrency(safeTotalUsed)}</span>
            </div>
            {/* Show calculation breakdown for investment wallet */}
<div className="mt-4 p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg">
  <div className="text-xs text-blue-400 mb-1">Balance Calculation:</div>
  <div className="text-xs text-gray-300">
    {formatCurrency(safeTotalAdded)} (added) - {formatCurrency(safeTotalUsed)} (used) = {formatCurrency(safeBalance)} (available)
  </div>
  <div className="text-xs text-gray-400 mt-1">
    (Total Added - Total Used) = Available Balance
  </div>
</div>

          
          </div>
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