import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import { loadRazorpay } from '../../utils/razorpay';
import { useAuth } from '../../hooks/useAuth';

interface AddFundsModalProps {
  onClose: () => void;
}

export default function AddFundsModal({ onClose }: AddFundsModalProps) {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { addFunds } = useWallet();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);

    if (numAmount < 100) {
      setError('Minimum amount should be ₹100');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const razorpay = await loadRazorpay();
      
      const options = {
        key: 'rzp_test_YOUR_KEY_HERE', // Replace with your Razorpay key
        amount: numAmount * 100, // Amount in paise
        currency: 'INR',
        name: 'Britannia Investments',
        description: 'Add Funds to Investment Wallet',
        image: 'https://your-logo-url.png', // Replace with your logo URL
        handler: function(response: any) {
          // Payment successful
          if (response.razorpay_payment_id) {
            addFunds(numAmount);
            onClose();
          }
        },
        prefill: {
          name: user?.displayName || '',
          email: user?.email || '',
        },
        theme: {
          color: '#2563EB'
        }
      };

      const paymentObject = new razorpay(options);
      paymentObject.open();
    } catch (error) {
      setError('Failed to initialize payment. Please try again.');
      console.error('Razorpay error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h3 className="text-xl font-semibold">Add Funds</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-4 mb-6">
              <AlertCircle className="h-5 w-5" />
              <p>{error}</p>
            </div>
          )}

          <div className="mb-6">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-400 mb-2">
              Amount (₹)
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="100"
              step="1"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
              placeholder="Enter amount (min ₹100)"
              required
            />
            <p className="text-sm text-gray-400 mt-2">
              Minimum amount: ₹100
            </p>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            ) : (
              'Proceed to Pay'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}