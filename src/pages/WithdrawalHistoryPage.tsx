import React, { useMemo } from 'react';
import { useWallet } from '../context/WalletContext';
import { Clock, ArrowLeft, CheckCircle, XCircle, TrendingUp, TrendingDown, CreditCard, Smartphone, Calendar, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function WithdrawalHistoryPage() {
  const { withdrawals, loadingWithdrawals } = useWallet();

  // Calculate summary statistics
  const stats = useMemo(() => {
    const approved = withdrawals.filter(w => w.status === 'completed' && w.approved);
    const rejected = withdrawals.filter(w => w.status === 'failed' || (w.status === 'completed' && !w.approved));
    
    return {
      totalApproved: approved.reduce((sum, w) => sum + w.amount, 0),
      totalRejected: rejected.reduce((sum, w) => sum + w.amount, 0),
      countApproved: approved.length,
      countRejected: rejected.length
    };
  }, [withdrawals]);

  const getStatusBadge = (status: string, approved: boolean) => {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2";
    
    if (status === 'pending') {
      return `${baseClasses} bg-yellow-500/10 text-yellow-500 border border-yellow-500`;
    }
    
    if (status === 'completed' && approved) {
      return `${baseClasses} bg-green-500/10 text-green-500 border border-green-500`;
    }
    
    if (status === 'failed' || !approved) {
      return `${baseClasses} bg-red-500/10 text-red-500 border border-red-500`;
    }
    
    return `${baseClasses} bg-gray-500/10 text-gray-500 border border-gray-500`;
  };

  const getStatusText = (status: string, approved: boolean) => {
    if (status === 'pending') return 'Pending Approval';
    if (status === 'completed' && approved) return 'Approved & Completed';
    if (status === 'failed' || !approved) return 'Rejected';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getStatusIcon = (status: string, approved: boolean) => {
    if (status === 'completed' && approved) {
      return <CheckCircle className="h-4 w-4" />;
    }
    if (status === 'failed' || !approved) {
      return <XCircle className="h-4 w-4" />;
    }
    return null;
  };

  if (loadingWithdrawals) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link 
            to="/dashboard" 
            className="flex items-center text-blue-400 hover:text-blue-500 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <h2 className="text-3xl font-bold">Withdrawal History</h2>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="h-6 w-6 text-green-500" />
            <h3 className="text-lg font-semibold">Approved Withdrawals</h3>
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-bold text-green-500">{formatCurrency(stats.totalApproved)}</p>
            <p className="text-sm text-gray-400">{stats.countApproved} withdrawals approved</p>
          </div>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
          <div className="flex items-center gap-3 mb-4">
            <TrendingDown className="h-6 w-6 text-red-500" />
            <h3 className="text-lg font-semibold">Rejected Withdrawals</h3>
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-bold text-red-500">{formatCurrency(stats.totalRejected)}</p>
            <p className="text-sm text-gray-400">{stats.countRejected} withdrawals rejected</p>
          </div>
        </div>
      </div>

      {withdrawals.length === 0 ? (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 text-center border border-gray-700/50">
          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Withdrawals Yet</h3>
          <p className="text-gray-400 mb-4">Your withdrawal history will appear here</p>
          <Link 
            to="/dashboard" 
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            Start Withdrawing
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {withdrawals.map((withdrawal) => (
            <div 
              key={withdrawal.id || `${withdrawal.timestamp}-${withdrawal.amount}`}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Left Section - Main Info */}
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
                      <h3 className="text-lg font-semibold">{formatCurrency(withdrawal.amount)}</h3>
                      <span className={getStatusBadge(withdrawal.status, withdrawal.approved)}>
                        {getStatusIcon(withdrawal.status, withdrawal.approved)}
                        {getStatusText(withdrawal.status, withdrawal.approved)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(withdrawal.timestamp)}
                      </div>
                      <div className="flex items-center gap-1">
                        {withdrawal.paymentMethod === 'upi' ? (
                          <>
                            <Smartphone className="h-4 w-4" />
                            UPI Transfer
                          </>
                        ) : (
                          <>
                            <CreditCard className="h-4 w-4" />
                            Bank Transfer
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Section - Details */}
                <div className="flex flex-col sm:flex-row gap-4 lg:text-right">
                  {withdrawal.transactionId && (
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Transaction ID</p>
                      <p className="text-sm font-mono bg-gray-700/50 px-2 py-1 rounded text-blue-400">
                        {withdrawal.transactionId}
                      </p>
                    </div>
                  )}
                  {withdrawal.upiId && (
                    <div>
                      <p className="text-xs text-gray-400 mb-1">UPI ID</p>
                      <p className="text-sm font-mono bg-gray-700/50 px-2 py-1 rounded">
                        {withdrawal.upiId}
                      </p>
                    </div>
                  )}
                  {withdrawal.status === 'pending' && (
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Estimated Time</p>
                      <p className="text-sm text-yellow-400">Within 24 hours</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Processing Fee Info */}
              <div className="mt-4 pt-4 border-t border-gray-700/50">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Requested Amount</p>
                    <p className="font-semibold">{formatCurrency(withdrawal.amount)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Processing Fee (7%)</p>
                    <p className="font-semibold text-red-400">-{formatCurrency(withdrawal.amount * 0.07)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Net Amount</p>
                    <p className="font-semibold text-green-400">{formatCurrency(withdrawal.amount * 0.93)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Payment Method</p>
                    <p className="font-semibold capitalize">{withdrawal.paymentMethod || 'Bank'}</p>
                  </div>
                </div>
                
                {/* Rejection Reason */}
                {withdrawal.status === 'failed' && withdrawal.rejectionReason && (
                  <div className="mt-4 pt-4 border-t border-gray-700/50">
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <XCircle className="h-4 w-4 text-red-400" />
                        <p className="text-red-400 font-medium text-sm">Rejection Reason</p>
                      </div>
                      <p className="text-sm text-gray-300">{withdrawal.rejectionReason}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}