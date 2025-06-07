import React, { useState, useEffect } from 'react';
import { X, AlertCircle, Copy } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';

interface AddFundsModalProps {
  onClose: () => void;
}

export default function AddFundsModal({ onClose }: AddFundsModalProps) {
  const [amount, setAmount] = useState('100');
  const [error, setError] = useState('');
  const [utrNumber, setUtrNumber] = useState('');
  const [qrCode, setQrCode] = useState('');
  const { requestAddFunds } = useWallet();

  const UPI_ID = 'shiraj9876@ybl';

  useEffect(() => {
    const numAmount = parseFloat(amount);
    if (!isNaN(numAmount) && numAmount >= 100) {
      const upiUrl = `upi://pay?pa=${UPI_ID}&pn=PARLEG&am=${numAmount}&cu=INR`;
      setQrCode(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`);
    } else {
      setQrCode('');
    }
  }, [amount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount < 100) {
      setError('Minimum amount should be ₹100');
      return;
    }

    if (utrNumber.length !== 12 || !/^\d+$/.test(utrNumber)) {
      setError('Please enter a valid 12-digit UTR number');
      return;
    }

    try {
      await requestAddFunds(numAmount, utrNumber);
      onClose();
    } catch (error) {
      setError('Failed to submit request. Please try again.');
    }
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText(UPI_ID);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 h-screen overflow-hidden z-50">
      <div className="bg-gray-800 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700 sticky top-0 bg-gray-800 z-10">
          <h3 className="text-xl font-semibold">Add Funds</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Main Content */}
        <form onSubmit={handleSubmit} className="p-4 flex flex-col lg:flex-row gap-6">
          {/* Left: QR + UPI Info */}
          <div className="lg:w-1/2 space-y-4 bg-gray-900 p-4 rounded-xl">
            <div className="text-center">
              <p className="text-lg font-semibold">Scan to Pay</p>
              <p className="text-sm text-gray-400">Scan the QR or pay directly to UPI ID</p>
            </div>

            {qrCode ? (
              <div className="flex justify-center">
                <img src={qrCode} alt="QR Code" className="bg-white p-3 rounded-lg w-48 h-48" />
              </div>
            ) : (
              <div className="w-full h-48 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 text-sm text-center p-4">
                Enter an amount ≥ ₹100 to generate QR
              </div>
            )}

            <div className="w-full flex items-center gap-2 bg-gray-800 p-2 rounded-lg justify-between">
              <span className="text-gray-300 text-sm truncate">{UPI_ID}</span>
              <button
                type="button"
                onClick={copyUpiId}
                className="text-blue-400 hover:text-blue-300 p-1"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>

            <div className="text-sm text-gray-400">
              <p>After payment, enter the UTR number to confirm.</p>
            </div>
          </div>

          {/* Right: Form Fields */}
          <div className="lg:w-1/2 space-y-4">
            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-3">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-400 mb-1">
                Amount (₹)
              </label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="100"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white"
                placeholder="Enter amount (min ₹100)"
                required
              />
              <p className="text-sm text-gray-400 mt-1">Minimum amount: ₹100</p>
            </div>

            <div>
              <label htmlFor="utr" className="block text-sm font-medium text-gray-400 mb-1">
                UTR Number
              </label>
              <input
                type="text"
                id="utr"
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                maxLength={12}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white"
                placeholder="Enter 12-digit UTR number"
                required
              />
              <p className="text-sm text-gray-400 mt-1">12-digit transaction reference number</p>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Submit Payment Details
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
