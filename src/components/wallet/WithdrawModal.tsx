import React, { useState } from 'react';
import { X, CreditCard, Smartphone } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import WithdrawConfirmModal from './WithdrawConfirmModal';
import { formatCurrency } from '../../utils/formatters';

interface WithdrawModalProps {
  onClose: () => void;
}

export default function WithdrawModal({ onClose }: WithdrawModalProps) {
  const [amount, setAmount] = useState('');
  const [upiId, setUpiId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'bank'>('upi');
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const { withdraw, totalEarnings, withdrawals } = useWallet();

  const totalApprovedWithdrawals = withdrawals
    .filter(w => w.status === 'completed' && w.approved)
    .reduce((sum, w) => sum + w.amount, 0);

  const availableBalance = totalEarnings - totalApprovedWithdrawals;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);

    if (availableBalance <= 0) {
      setError('No funds available for withdrawal');
      return;
    }

    if (numAmount > 0 && numAmount <= availableBalance) {
      if (paymentMethod === 'upi' && !upiId.trim()) {
        setError('Please enter a valid UPI ID');
        return;
      }
      setError('');
      setShowConfirm(true);
    } else {
      setError('Invalid withdrawal amount');
    }
  };

  const handleConfirmWithdraw = async () => {
    try {
      const numAmount = parseFloat(amount);
      await withdraw(numAmount, paymentMethod, upiId);
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

            {availableBalance <= 0 ? (
              <div className="bg-yellow-500/10 border border-yellow-500 text-yellow-500 rounded-lg p-4 mb-6">
                No funds available for withdrawal at this time
              </div>
            ) : (
              <>
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
                    max={availableBalance}
                    step="0.01"
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                    placeholder="Enter amount"
                    required
                  />
                  <p className="text-sm text-gray-400 mt-2">
                    Available: {formatCurrency(availableBalance)}
                  </p>
                </div>

                {/* Payment Method Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-400 mb-3">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('upi')}
                      className={`p-3 rounded-lg border-2 transition-colors flex items-center justify-center gap-2 ${
                        paymentMethod === 'upi'
                          ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                          : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      <Smartphone className="h-5 w-5" />
                      UPI
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('bank')}
                      className={`p-3 rounded-lg border-2 transition-colors flex items-center justify-center gap-2 ${
                        paymentMethod === 'bank'
                          ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                          : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      <CreditCard className="h-5 w-5" />
                      Bank
                    </button>
                  </div>
                </div>

                {/* UPI ID Input */}
                {paymentMethod === 'upi' && (
                  <div className="mb-6">
                    <label htmlFor="upiId" className="block text-sm font-medium text-gray-400 mb-2">
                      UPI ID
                    </label>
                    <input
                      type="text"
                      id="upiId"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                      placeholder="example@upi"
                      required
                    />
                  </div>
                )}

                {/* Bank Details Note */}
                {paymentMethod === 'bank' && (
                  <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <p className="text-blue-400 text-sm">
                      Bank transfer will be processed to your registered bank account within 3-5 business days.
                    </p>
                  </div>
                )}
              </>
            )}
            
            <button
              type="submit"
              disabled={availableBalance <= 0}
              className={`w-full py-3 rounded-xl font-semibold transition-colors ${
                availableBalance <= 0
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {availableBalance <= 0 ? 'No Funds Available' : 'Withdraw'}
            </button>
          </form>
        </div>
      </div>

      {showConfirm && (
        <WithdrawConfirmModal
          amount={parseFloat(amount)}
          paymentMethod={paymentMethod}
          upiId={upiId}
          onConfirm={handleConfirmWithdraw}
          onClose={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}