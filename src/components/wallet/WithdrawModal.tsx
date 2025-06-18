import React, { useState, useEffect } from 'react';
import { X, CreditCard, Smartphone, Clock, Info, User, Building, CheckCircle } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import { useAuth } from '../../hooks/useAuth';
import { userProfileService, BankAccountDetails } from '../../services/userProfile.service';
import WithdrawConfirmModal from './WithdrawConfirmModal';
import { formatCurrency } from '../../utils/formatters';

interface WithdrawModalProps {
  onClose: () => void;
  availableBalance: number;
}

export default function WithdrawModal({ onClose, availableBalance }: WithdrawModalProps) {
  const [amount, setAmount] = useState('');
  const [upiId, setUpiId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'bank'>('bank');
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [bankDetails, setBankDetails] = useState<BankAccountDetails | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const { user } = useAuth();
  const { withdraw } = useWallet();

  const MIN_WITHDRAWAL = 120;
  const PROCESSING_FEE_PERCENT = 7;

  useEffect(() => {
    const loadBankDetails = async () => {
      if (!user) return;
      
      try {
        const profile = await userProfileService.getUserProfile(user.uid);
        setBankDetails(profile?.bankAccount || null);
      } catch (error) {
        console.error('Error loading bank details:', error);
      } finally {
        setLoadingProfile(false);
      }
    };

    loadBankDetails();
  }, [user]);

  const calculateProcessingFee = (amount: number) => {
    return (amount * PROCESSING_FEE_PERCENT) / 100;
  };

  const calculateNetAmount = (amount: number) => {
    return amount - calculateProcessingFee(amount);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);

    if (availableBalance <= 0) {
      setError('No funds available for withdrawal');
      return;
    }

    if (numAmount < MIN_WITHDRAWAL) {
      setError(`Minimum withdrawal amount is ${formatCurrency(MIN_WITHDRAWAL)}`);
      return;
    }

    if (numAmount > availableBalance) {
      setError('Amount exceeds available balance');
      return;
    }

    if (paymentMethod === 'upi' && !upiId.trim()) {
      setError('Please enter a valid UPI ID');
      return;
    }

    if (paymentMethod === 'bank' && !bankDetails) {
      setError('Please add bank account details in your profile first');
      return;
    }

    setError('');
    setShowConfirm(true);
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
        <div className="bg-gray-800 rounded-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center p-6 border-b border-gray-700">
            <div>
              <h3 className="text-xl font-semibold">Withdraw Earnings</h3>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-500 font-medium">24/7 Withdrawal Available</span>
              </div>
            </div>
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

            {/* Account Details Section */}
            {!loadingProfile && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-4">Account Details</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Bank Account Details */}
                  {bankDetails ? (
                    <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                      <div className="flex items-center gap-2 mb-3">
                        <Building className="h-5 w-5 text-blue-500" />
                        <span className="font-medium">Bank Account</span>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-400">Account Holder:</span>
                          <p className="font-medium">{bankDetails.accountHolderName}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Account Number:</span>
                          <p className="font-medium">****{bankDetails.accountNumber.slice(-4)}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">IFSC Code:</span>
                          <p className="font-medium">{bankDetails.ifscCode}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500">
                      <div className="flex items-center gap-2 mb-2">
                        <Info className="h-5 w-5 text-yellow-500" />
                        <span className="font-medium text-yellow-500">Bank Account Required</span>
                      </div>
                      <p className="text-sm text-yellow-500 mb-3">
                        Add bank account details to withdraw funds
                      </p>
                      <button
                        type="button"
                        onClick={() => window.open('/account', '_blank')}
                        className="text-sm bg-yellow-500/20 hover:bg-yellow-500/30 px-3 py-1 rounded-md transition-colors"
                      >
                        Add Bank Details
                      </button>
                    </div>
                  )}

                  {/* Withdrawal Info */}
                  <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500">
                    <div className="flex items-center gap-2 mb-3">
                      <Info className="h-5 w-5 text-blue-500" />
                      <span className="font-medium text-blue-500">Withdrawal Info</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Min Withdrawal:</span>
                        <span className="font-medium text-blue-400">{formatCurrency(MIN_WITHDRAWAL)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Processing Fee:</span>
                        <span className="font-medium text-blue-400">{PROCESSING_FEE_PERCENT}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Processing Time:</span>
                        <span className="font-medium text-blue-400">24/7</span>
                      </div>
                    </div>
                  </div>
                </div>
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
                    Withdrawal Amount (₹)
                  </label>
                  <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min={MIN_WITHDRAWAL}
                    max={availableBalance}
                    step="1"
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white text-lg font-semibold"
                    placeholder={`Min ${formatCurrency(MIN_WITHDRAWAL)}`}
                    required
                  />
                  <div className="mt-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Available Balance:</span>
                      <span className="font-medium text-green-400">{formatCurrency(availableBalance)}</span>
                    </div>
                    {amount && parseFloat(amount) >= MIN_WITHDRAWAL && (
                      <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Withdrawal Amount:</span>
                          <span className="font-medium">{formatCurrency(parseFloat(amount))}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Processing Fee ({PROCESSING_FEE_PERCENT}%):</span>
                          <span className="font-medium text-red-400">-{formatCurrency(calculateProcessingFee(parseFloat(amount)))}</span>
                        </div>
                        <div className="flex justify-between text-base border-t border-gray-600 pt-2">
                          <span className="font-medium">You'll Receive:</span>
                          <span className="font-bold text-green-400">{formatCurrency(calculateNetAmount(parseFloat(amount)))}</span>
                        </div>
                      </div>
                    )}
                  </div>
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
                {paymentMethod === 'bank' && bankDetails && (
                  <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <h4 className="font-medium text-blue-400 mb-2">Transfer to Registered Bank Account</h4>
                    <div className="text-sm space-y-1">
                      <p><span className="text-gray-400">Account Holder:</span> {bankDetails.accountHolderName}</p>
                      <p><span className="text-gray-400">Account Number:</span> ****{bankDetails.accountNumber.slice(-4)}</p>
                      <p><span className="text-gray-400">IFSC:</span> {bankDetails.ifscCode}</p>
                      <p className="text-blue-400 mt-2">✓ Funds will be transferred within 24 hours</p>
                    </div>
                  </div>
                )}
              </>
            )}
            
            <button
              type="submit"
              disabled={availableBalance <= 0 || (paymentMethod === 'bank' && !bankDetails) || loadingProfile}
              className={`w-full py-3 rounded-xl font-semibold transition-colors ${
                availableBalance <= 0 || (paymentMethod === 'bank' && !bankDetails) || loadingProfile
                  ? 'bg-gray-600 cursor-not-allowed text-gray-400'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {loadingProfile ? 'Loading...' : 
               availableBalance <= 0 ? 'No Funds Available' : 
               (paymentMethod === 'bank' && !bankDetails) ? 'Add Bank Details First' : 
               'Proceed to Withdraw'}
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