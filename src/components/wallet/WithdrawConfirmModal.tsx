import React from 'react';
import { X } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface WithdrawConfirmModalProps {
  amount: number;
  onConfirm: () => void;
  onClose: () => void;
}

export default function WithdrawConfirmModal({
  amount,
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
          <p className="text-gray-300 mb-4">
            Are you sure you want to withdraw {formatCurrency(amount)}?
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