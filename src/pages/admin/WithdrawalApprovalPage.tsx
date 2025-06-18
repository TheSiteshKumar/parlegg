import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { walletService } from '../../services/wallet.service';
import { walletBalanceService } from '../../services/walletBalance.service';
import { userProfileService, BankAccountDetails } from '../../services/userProfile.service';
import { Withdrawal } from '../../types/wallet';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { CheckCircle, XCircle, AlertCircle, Eye, User, Building, CreditCard, Smartphone, Calendar, DollarSign, X } from 'lucide-react';

interface WithdrawalWithUserData extends Withdrawal {
  userEmail?: string;
  userDisplayName?: string;
  bankDetails?: BankAccountDetails;
  userBalance?: {
    investmentReturns: number;
    referralEarnings: number;
    totalEarnings: number;
    totalApprovedWithdrawals: number;
    availableBalance: number;
  };
}

export default function WithdrawalApprovalPage() {
  const [withdrawals, setWithdrawals] = useState<WithdrawalWithUserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<WithdrawalWithUserData | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [withdrawalToProcess, setWithdrawalToProcess] = useState<WithdrawalWithUserData | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, 'withdrawals'),
      where('status', '==', 'pending')
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const pendingWithdrawals = await Promise.all(
        snapshot.docs.map(async (docSnapshot) => {
          const withdrawalData = {
            id: docSnapshot.id,
            ...docSnapshot.data()
          } as Withdrawal;

          // Fetch user details
          try {
            const userDoc = await getDoc(doc(db, 'users', withdrawalData.userId));
            const userData = userDoc.data();
            
            // Fetch user profile with bank details
            const userProfile = await userProfileService.getUserProfile(withdrawalData.userId);
            
            // Fetch user's balance information
            const userBalance = await walletBalanceService.getBalance(withdrawalData.userId);
            const userWithdrawals = await walletService.getUserWithdrawals(withdrawalData.userId);
            const totalApprovedWithdrawals = userWithdrawals
              .filter(w => w.status === 'completed' && w.approved)
              .reduce((sum, w) => sum + w.amount, 0);
            
            const investmentReturns = userBalance.investmentReturns || 0;
            const referralEarnings = userBalance.referralEarnings || 0;
            const totalEarnings = investmentReturns + referralEarnings;
            const availableBalance = totalEarnings - totalApprovedWithdrawals;

            return {
              ...withdrawalData,
              userEmail: userData?.email || 'Unknown',
              userDisplayName: userData?.displayName || 'Unknown User',
              bankDetails: userProfile?.bankAccount,
              userBalance: {
                investmentReturns,
                referralEarnings,
                totalEarnings,
                totalApprovedWithdrawals,
                availableBalance
              }
            } as WithdrawalWithUserData;
          } catch (error) {
            console.error('Error fetching user data:', error);
            return withdrawalData as WithdrawalWithUserData;
          }
        })
      );
      
      setWithdrawals(pendingWithdrawals);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const showApproveConfirmation = (withdrawal: WithdrawalWithUserData) => {
    setWithdrawalToProcess(withdrawal);
    setShowApproveModal(true);
  };

  const showRejectConfirmation = (withdrawal: WithdrawalWithUserData) => {
    setWithdrawalToProcess(withdrawal);
    setRejectionReason('');
    setShowRejectModal(true);
  };

  const handleApprove = async () => {
    if (!withdrawalToProcess?.id) return;
    
    try {
      // First, check if user has enough earnings to cover this withdrawal
      const userBalance = await walletBalanceService.getBalance(withdrawalToProcess.userId);
      const totalEarnings = (userBalance.investmentReturns || 0) + (userBalance.referralEarnings || 0);
      
      // Get already approved withdrawals for this user
      const userWithdrawals = await walletService.getUserWithdrawals(withdrawalToProcess.userId);
      const totalApprovedWithdrawals = userWithdrawals
        .filter(w => w.status === 'completed' && w.approved)
        .reduce((sum, w) => sum + w.amount, 0);
      
      const availableBalance = totalEarnings - totalApprovedWithdrawals;
      
      if (withdrawalToProcess.amount > availableBalance) {
        alert(`Cannot approve withdrawal! User's available balance (₹${availableBalance.toFixed(2)}) is less than withdrawal amount (₹${withdrawalToProcess.amount.toFixed(2)})`);
        return;
      }
      
      // Update the withdrawal status
      await walletService.updateWithdrawalStatus(
        withdrawalToProcess.id,
        'completed',
        true,
        `TXN${Date.now()}`
      );

      // Note: We don't need to update the user's balance here
      // The available balance calculation automatically accounts for approved withdrawals
      // by subtracting total approved withdrawals from total earnings
      
      // Close modals
      setShowApproveModal(false);
      setShowDetailModal(false);
      setSelectedWithdrawal(null);
      setWithdrawalToProcess(null);
    } catch (error) {
      console.error('Failed to approve withdrawal:', error);
    }
  };

  const handleReject = async () => {
    if (!withdrawalToProcess?.id) return;
    
    try {
      await walletService.updateWithdrawalStatus(
        withdrawalToProcess.id,
        'failed',
        false,
        undefined,
        rejectionReason || 'Rejected by admin'
      );
      
      // Close modals
      setShowRejectModal(false);
      setShowDetailModal(false);
      setSelectedWithdrawal(null);
      setWithdrawalToProcess(null);
      setRejectionReason('');
    } catch (error) {
      console.error('Failed to reject withdrawal:', error);
    }
  };

  const handleViewDetails = (withdrawal: WithdrawalWithUserData) => {
    setSelectedWithdrawal(withdrawal);
    setShowDetailModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">Withdrawal Management</h2>
          <p className="text-gray-400">Review and process pending withdrawal requests</p>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500 rounded-lg px-4 py-2">
          <span className="text-yellow-500 font-semibold">{withdrawals.length} Pending Requests</span>
        </div>
      </div>

      {withdrawals.length === 0 ? (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 text-center border border-gray-700/50">
          <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Pending Withdrawals</h3>
          <p className="text-gray-400">All withdrawal requests have been processed</p>
        </div>
      ) : (
        <div className="space-y-4">
          {withdrawals.map((withdrawal) => (
            <div key={withdrawal.id} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Left Section - User & Amount Info */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gray-700/50 rounded-lg">
                    {withdrawal.paymentMethod === 'upi' ? (
                      <Smartphone className="h-6 w-6 text-blue-400" />
                    ) : (
                      <CreditCard className="h-6 w-6 text-green-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-green-400">{formatCurrency(withdrawal.amount)}</h3>
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-500/10 text-yellow-500 border border-yellow-500 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Pending Approval
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-300">{withdrawal.userDisplayName}</span>
                        <span className="text-gray-500">({withdrawal.userEmail})</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Calendar className="h-4 w-4" />
                        {formatDate(withdrawal.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Section - Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => handleViewDetails(withdrawal)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500 hover:bg-blue-500/20 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    View Details
                  </button>
                  <button
                    onClick={() => showApproveConfirmation(withdrawal)}
                    disabled={withdrawal.userBalance && withdrawal.userBalance.availableBalance < withdrawal.amount}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      withdrawal.userBalance && withdrawal.userBalance.availableBalance < withdrawal.amount
                        ? 'bg-gray-500/10 text-gray-500 border border-gray-500 cursor-not-allowed'
                        : 'bg-green-500/10 text-green-400 border border-green-500 hover:bg-green-500/20'
                    }`}
                  >
                    <CheckCircle className="h-4 w-4" />
                    {withdrawal.userBalance && withdrawal.userBalance.availableBalance < withdrawal.amount ? 'Insufficient Balance' : 'Approve'}
                  </button>
                  <button
                    onClick={() => showRejectConfirmation(withdrawal)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500 hover:bg-red-500/20 transition-colors"
                  >
                    <XCircle className="h-4 w-4" />
                    Reject
                  </button>
                </div>
              </div>

              {/* Quick Info Row */}
              <div className="mt-4 pt-4 border-t border-gray-700/50">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Net Amount</p>
                    <p className="font-semibold text-green-400">{formatCurrency(withdrawal.amount * 0.93)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Processing Fee</p>
                    <p className="font-semibold text-red-400">-{formatCurrency(withdrawal.amount * 0.07)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Payment Method</p>
                    <p className="font-semibold capitalize">{withdrawal.paymentMethod || 'Bank'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Available Balance</p>
                    {withdrawal.userBalance ? (
                      <p className="font-semibold text-blue-400">
                        {formatCurrency(withdrawal.userBalance.availableBalance)}
                      </p>
                    ) : (
                      <p className="text-gray-500">Loading...</p>
                    )}
                  </div>
                  <div>
                    <p className="text-gray-400">Balance Status</p>
                    {withdrawal.userBalance ? (
                      withdrawal.userBalance.availableBalance >= withdrawal.amount ? (
                        <p className="text-green-400 font-semibold flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Sufficient
                        </p>
                      ) : (
                        <p className="text-red-400 font-semibold flex items-center gap-1">
                          <XCircle className="h-3 w-3" />
                          Insufficient
                        </p>
                      )
                    ) : (
                      <p className="text-gray-500">Checking...</p>
                    )}
                  </div>
                  <div>
                    <p className="text-gray-400">Bank Details</p>
                    <p className="font-semibold">
                      {withdrawal.bankDetails ? 
                        <span className="text-green-400">✓ Available</span> : 
                        <span className="text-red-400">✗ Missing</span>
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedWithdrawal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h3 className="text-xl font-semibold">Withdrawal Details</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* User Information */}
              <div>
                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-400" />
                  User Information
                </h4>
                <div className="bg-gray-900/50 p-4 rounded-lg space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Name</p>
                      <p className="font-semibold">{selectedWithdrawal.userDisplayName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Email</p>
                      <p className="font-semibold">{selectedWithdrawal.userEmail}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">User ID</p>
                    <p className="font-mono text-sm bg-gray-700 px-2 py-1 rounded">{selectedWithdrawal.userId}</p>
                  </div>
                </div>
              </div>

              {/* User Balance Information */}
              {selectedWithdrawal.userBalance && (
                <div>
                  <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-yellow-400" />
                    User Balance & Earnings
                  </h4>
                  <div className="bg-gray-900/50 p-4 rounded-lg space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-400">Investment Returns</p>
                        <p className="text-lg font-semibold text-green-400">
                          {formatCurrency(selectedWithdrawal.userBalance.investmentReturns)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Referral Earnings</p>
                        <p className="text-lg font-semibold text-purple-400">
                          {formatCurrency(selectedWithdrawal.userBalance.referralEarnings)}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-400">Total Earnings</p>
                        <p className="text-lg font-bold text-white">
                          {formatCurrency(selectedWithdrawal.userBalance.totalEarnings)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Previously Withdrawn</p>
                        <p className="text-lg font-semibold text-red-400">
                          -{formatCurrency(selectedWithdrawal.userBalance.totalApprovedWithdrawals)}
                        </p>
                      </div>
                    </div>
                    <div className="border-t border-gray-700 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-blue-300 font-semibold">Available Balance</span>
                        <span className="text-xl font-bold text-blue-400">
                          {formatCurrency(selectedWithdrawal.userBalance.availableBalance)}
                        </span>
                      </div>
                      <div className="mt-2">
                        {selectedWithdrawal.userBalance.availableBalance >= selectedWithdrawal.amount ? (
                          <div className="flex items-center gap-2 text-green-400 text-sm">
                            <CheckCircle className="h-4 w-4" />
                            <span>✓ Sufficient balance for this withdrawal</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-red-400 text-sm">
                            <XCircle className="h-4 w-4" />
                            <span>✗ Insufficient balance! Shortage: {formatCurrency(selectedWithdrawal.amount - selectedWithdrawal.userBalance.availableBalance)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Withdrawal Information */}
              <div>
                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-400" />
                  Withdrawal Information
                </h4>
                <div className="bg-gray-900/50 p-4 rounded-lg space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Requested Amount</p>
                      <p className="text-xl font-bold text-green-400">{formatCurrency(selectedWithdrawal.amount)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Processing Fee (7%)</p>
                      <p className="text-lg font-semibold text-red-400">-{formatCurrency(selectedWithdrawal.amount * 0.07)}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Net Amount (User Receives)</p>
                      <p className="text-xl font-bold text-blue-400">{formatCurrency(selectedWithdrawal.amount * 0.93)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Request Date</p>
                      <p className="font-semibold">{formatDate(selectedWithdrawal.timestamp)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bank Details */}
              {selectedWithdrawal.bankDetails && (
                <div>
                  <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Building className="h-5 w-5 text-purple-400" />
                    Bank Account Details
                  </h4>
                  <div className="bg-gray-900/50 p-4 rounded-lg space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-400">Account Holder Name</p>
                        <p className="font-semibold">{selectedWithdrawal.bankDetails.accountHolderName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Account Number</p>
                        <p className="font-mono">{selectedWithdrawal.bankDetails.accountNumber}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">IFSC Code</p>
                      <p className="font-mono font-semibold">{selectedWithdrawal.bankDetails.ifscCode}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* UPI Details */}
              {selectedWithdrawal.upiId && (
                <div>
                  <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Smartphone className="h-5 w-5 text-blue-400" />
                    UPI Details
                  </h4>
                  <div className="bg-gray-900/50 p-4 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-400">UPI ID</p>
                      <p className="font-mono font-semibold">{selectedWithdrawal.upiId}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 p-6 border-t border-gray-700">
              <button
                onClick={() => showApproveConfirmation(selectedWithdrawal)}
                className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition-colors"
              >
                <CheckCircle className="h-5 w-5" />
                Approve & Process
              </button>
              <button
                onClick={() => showRejectConfirmation(selectedWithdrawal)}
                className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition-colors"
              >
                <XCircle className="h-5 w-5" />
                Reject Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approve Confirmation Modal */}
      {showApproveModal && withdrawalToProcess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-gray-800 rounded-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold">Approve Withdrawal Request</h3>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-300 mb-6">
                  Please review the details below before approving this withdrawal request:
                </p>

                {/* User Information */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-400" />
                    User Information
                  </h4>
                  <div className="bg-gray-900/50 p-4 rounded-lg space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-400 text-sm">Name:</span>
                        <p className="font-medium">{withdrawalToProcess.userDisplayName}</p>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Email:</span>
                        <p className="font-medium">{withdrawalToProcess.userEmail}</p>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">User ID:</span>
                      <p className="font-mono text-sm bg-gray-700 px-2 py-1 rounded mt-1">{withdrawalToProcess.userId}</p>
                    </div>
                  </div>
                </div>

                {/* Withdrawal Details */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-400" />
                    Withdrawal Details
                  </h4>
                  <div className="bg-gray-900/50 p-4 rounded-lg space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-400 text-sm">Requested Amount:</span>
                        <p className="text-xl font-bold text-green-400">{formatCurrency(withdrawalToProcess.amount)}</p>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Processing Fee (7%):</span>
                        <p className="text-lg font-semibold text-red-400">-{formatCurrency(withdrawalToProcess.amount * 0.07)}</p>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-gray-700">
                      <span className="text-gray-400 text-sm">Net Amount (User Receives):</span>
                      <p className="text-2xl font-bold text-blue-400">{formatCurrency(withdrawalToProcess.amount * 0.93)}</p>
                    </div>
                  </div>
                </div>

                {/* Bank Details */}
                {withdrawalToProcess.bankDetails && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Building className="h-5 w-5 text-purple-400" />
                      Bank Account Details
                    </h4>
                    <div className="bg-gray-900/50 p-4 rounded-lg space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-gray-400 text-sm">Account Holder:</span>
                          <p className="font-semibold">{withdrawalToProcess.bankDetails.accountHolderName}</p>
                        </div>
                        <div>
                          <span className="text-gray-400 text-sm">Account Number:</span>
                          <p className="font-mono">{withdrawalToProcess.bankDetails.accountNumber}</p>
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">IFSC Code:</span>
                        <p className="font-mono font-semibold">{withdrawalToProcess.bankDetails.ifscCode}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* UPI Details */}
                {withdrawalToProcess.upiId && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Smartphone className="h-5 w-5 text-blue-400" />
                      UPI Details
                    </h4>
                    <div className="bg-gray-900/50 p-4 rounded-lg">
                      <span className="text-gray-400 text-sm">UPI ID:</span>
                      <p className="font-mono font-semibold">{withdrawalToProcess.upiId}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowApproveModal(false);
                    setWithdrawalToProcess(null);
                  }}
                  className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApprove}
                  className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-medium text-white transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle className="h-5 w-5" />
                  Approve & Process Transfer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Confirmation Modal */}
      {showRejectModal && withdrawalToProcess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-gray-800 rounded-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <XCircle className="h-6 w-6 text-red-500" />
                </div>
                <h3 className="text-xl font-semibold">Reject Withdrawal Request</h3>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-300 mb-6">
                  Please review the details below before rejecting this withdrawal request:
                </p>

                {/* User Information */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-400" />
                    User Information
                  </h4>
                  <div className="bg-gray-900/50 p-4 rounded-lg space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-400 text-sm">Name:</span>
                        <p className="font-medium">{withdrawalToProcess.userDisplayName}</p>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Email:</span>
                        <p className="font-medium">{withdrawalToProcess.userEmail}</p>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">User ID:</span>
                      <p className="font-mono text-sm bg-gray-700 px-2 py-1 rounded mt-1">{withdrawalToProcess.userId}</p>
                    </div>
                  </div>
                </div>

                {/* Withdrawal Details */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-red-400" />
                    Withdrawal Details
                  </h4>
                  <div className="bg-gray-900/50 p-4 rounded-lg space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-400 text-sm">Requested Amount:</span>
                        <p className="text-xl font-bold text-red-400">{formatCurrency(withdrawalToProcess.amount)}</p>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Request Date:</span>
                        <p className="font-semibold">{formatDate(withdrawalToProcess.timestamp)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bank Details */}
                {withdrawalToProcess.bankDetails && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Building className="h-5 w-5 text-purple-400" />
                      Bank Account Details
                    </h4>
                    <div className="bg-gray-900/50 p-4 rounded-lg space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-gray-400 text-sm">Account Holder:</span>
                          <p className="font-semibold">{withdrawalToProcess.bankDetails.accountHolderName}</p>
                        </div>
                        <div>
                          <span className="text-gray-400 text-sm">Account Number:</span>
                          <p className="font-mono">{withdrawalToProcess.bankDetails.accountNumber}</p>
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">IFSC Code:</span>
                        <p className="font-mono font-semibold">{withdrawalToProcess.bankDetails.ifscCode}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* UPI Details */}
                {withdrawalToProcess.upiId && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Smartphone className="h-5 w-5 text-blue-400" />
                      UPI Details
                    </h4>
                    <div className="bg-gray-900/50 p-4 rounded-lg">
                      <span className="text-gray-400 text-sm">UPI ID:</span>
                      <p className="font-mono font-semibold">{withdrawalToProcess.upiId}</p>
                    </div>
                  </div>
                )}

                {/* Rejection Reason */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-400" />
                    Rejection Reason
                  </h4>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white resize-none"
                    rows={4}
                    placeholder="Enter detailed reason for rejection (optional)..."
                  />
                  <p className="text-sm text-gray-400 mt-2">
                    This reason will be visible to the user in their withdrawal history.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setWithdrawalToProcess(null);
                    setRejectionReason('');
                  }}
                  className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-medium text-white transition-colors flex items-center justify-center gap-2"
                >
                  <XCircle className="h-5 w-5" />
                  Reject Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}