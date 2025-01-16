import React, { useMemo } from 'react';
import { useWallet } from '../context/WalletContext';
import { Clock, ArrowLeft, CheckCircle, XCircle, TrendingUp, TrendingDown } from 'lucide-react';
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
        <div className="bg-gray-800 rounded-xl p-8 text-center">
          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Withdrawals Yet</h3>
          <p className="text-gray-400">Your withdrawal history will appear here</p>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900">
                <tr>
                  <th className="text-left p-4">Date</th>
                  <th className="text-left p-4">Amount</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Transaction ID</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((withdrawal) => (
                  <tr 
                    key={withdrawal.id || `${withdrawal.timestamp}-${withdrawal.amount}`}
                    className="border-t border-gray-700 hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="p-4">{formatDate(withdrawal.timestamp)}</td>
                    <td className="p-4">{formatCurrency(withdrawal.amount)}</td>
                    <td className="p-4">
                      <span className={getStatusBadge(withdrawal.status, withdrawal.approved)}>
                        {getStatusIcon(withdrawal.status, withdrawal.approved)}
                        {getStatusText(withdrawal.status, withdrawal.approved)}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400">
                      {withdrawal.transactionId || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}