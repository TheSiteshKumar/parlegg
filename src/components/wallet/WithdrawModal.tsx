import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import WithdrawConfirmModal from './WithdrawConfirmModal';
import { formatCurrency } from '../../utils/formatters';

interface WithdrawModalProps {
  onClose: () => void;
}

export default function WithdrawModal({ onClose }: WithdrawModalProps) {
  const [amount, setAmount] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const { withdraw, availableEarnings } = useWallet();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);

    if (availableEarnings <= 0) {
      setError('No funds available for withdrawal');
      return;
    }

    if (numAmount > 0 && numAmount <= availableEarnings) {
      setError('');
      setShowConfirm(true);
    } else {
      setError('Invalid withdrawal amount');
    }
  };

  const handleConfirmWithdraw = async () => {
    try {
      const numAmount = parseFloat(amount);
      await withdraw(numAmount);
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Withdrawal failed');
      setShowConfirm(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-xl w-full max-w-md mx-4">
          <div className="flex justify-between items-center p-6 border-b border-gray-700">
            <h3 className="text-xl font-semibold">Withdraw Earnings</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-4 mb-6">
                {error}
              </div>
            )}

            {availableEarnings <= 0 ? (
              <div className="bg-yellow-500/10 border border-yellow-500 text-yellow-500 rounded-lg p-4 mb-6">
                No funds available for withdrawal at this time
              </div>
            ) : (
              <div className="mb-6">
                <label htmlFor="amount" className="block text-sm font-medium text-gray-400 mb-2">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0"
                  max={availableEarnings}
                  step="0.01"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  placeholder="Enter amount"
                  required
                />
                <p className="text-sm text-gray-400 mt-2">
                  Available: {formatCurrency(availableEarnings)}
                </p>
              </div>
            )}
            
            <button
              type="submit"
              disabled={availableEarnings <= 0}
              className={`w-full py-3 rounded-xl font-semibold transition-colors ${
                availableEarnings <= 0
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {availableEarnings <= 0 ? 'No Funds Available' : 'Withdraw'}
            </button>
          </form>
        </div>
      </div>

      {showConfirm && (
        <WithdrawConfirmModal
          amount={parseFloat(amount)}
          onConfirm={handleConfirmWithdraw}
          onClose={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}