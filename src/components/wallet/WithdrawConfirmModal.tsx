import React from 'react';
import { X, Smartphone, CreditCard } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface WithdrawConfirmModalProps {
  amount: number;
  paymentMethod: 'upi' | 'bank';
  upiId?: string;
  onConfirm: () => void;
  onClose: () => void;
}

export default function WithdrawConfirmModal({
  amount,
  paymentMethod,
  upiId,
  onConfirm,
  onClose
}: WithdrawConfirmModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h3 className="text-xl font-semibold">Confirm Withdrawal</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="bg-gray-900 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3 mb-3">
              {paymentMethod === 'upi' ? (
                <Smartphone className="h-5 w-5 text-blue-400" />
              ) : (
                <CreditCard className="h-5 w-5 text-blue-400" />
              )}
              <span className="text-gray-300">
                {paymentMethod === 'upi' ? 'UPI Transfer' : 'Bank Transfer'}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Amount:</span>
                <span className="text-white font-semibold">{formatCurrency(amount)}</span>
              </div>
              {paymentMethod === 'upi' && upiId && (
                <div className="flex justify-between">
                  <span className="text-gray-400">UPI ID:</span>
                  <span className="text-white">{upiId}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-400">Processing Time:</span>
                <span className="text-white">
                  {paymentMethod === 'upi' ? '24-48 hours' : '3-5 business days'}
                </span>
              </div>
            </div>
          </div>
          
          <p className="text-gray-300 mb-6 text-center">
            Are you sure you want to proceed with this withdrawal?
          </p>
          
          <div className="space-y-4">
            <button
              onClick={onConfirm}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
            >
              Confirm Withdrawal
            </button>
            <button
              onClick={onClose}
              className="w-full bg-gray-700 text-white py-3 rounded-xl font-semibold hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}