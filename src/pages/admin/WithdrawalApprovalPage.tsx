import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { walletService } from '../../services/wallet.service';
import { walletBalanceService } from '../../services/walletBalance.service';
import { Withdrawal } from '../../types/wallet';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function WithdrawalApprovalPage() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'withdrawals'),
      where('status', '==', 'pending')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const pendingWithdrawals = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Withdrawal));
      setWithdrawals(pendingWithdrawals);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleApprove = async (withdrawal: Withdrawal) => {
    if (!withdrawal.id) return;
    
    try {
      // First update the withdrawal status
      await walletService.updateWithdrawalStatus(
        withdrawal.id,
        'completed',
        true,
        `TXN${Date.now()}`
      );

      // Then update the user's wallet balance
      const currentBalance = await walletBalanceService.getBalance(withdrawal.userId);
      await walletBalanceService.updateBalance(withdrawal.userId, Math.max(0, currentBalance.earnings - withdrawal.amount));
    } catch (error) {
      console.error('Failed to approve withdrawal:', error);
    }
  };

  const handleReject = async (withdrawal: Withdrawal) => {
    if (!withdrawal.id) return;
    
    try {
      await walletService.updateWithdrawalStatus(
        withdrawal.id,
        'failed',
        false
      );
    } catch (error) {
      console.error('Failed to reject withdrawal:', error);
    }
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
      <h2 className="text-3xl font-bold mb-8">Pending Withdrawals</h2>

      {withdrawals.length === 0 ? (
        <div className="bg-gray-800 rounded-xl p-8 text-center">
          <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Pending Withdrawals</h3>
          <p className="text-gray-400">All withdrawal requests have been processed</p>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900">
                <tr>
                  <th className="text-left p-4">Date</th>
                  <th className="text-left p-4">User ID</th>
                  <th className="text-left p-4">Amount</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((withdrawal) => (
                  <tr 
                    key={withdrawal.id} 
                    className="border-t border-gray-700 hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="p-4">{formatDate(withdrawal.timestamp)}</td>
                    <td className="p-4 font-mono text-sm">{withdrawal.userId}</td>
                    <td className="p-4">{formatCurrency(withdrawal.amount)}</td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-500/10 text-yellow-500 border border-yellow-500 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Pending Approval
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(withdrawal)}
                          className="px-3 py-1 rounded-lg bg-green-500/10 text-green-500 border border-green-500 hover:bg-green-500/20 transition-colors flex items-center gap-1"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(withdrawal)}
                          className="px-3 py-1 rounded-lg bg-red-500/10 text-red-500 border border-red-500 hover:bg-red-500/20 transition-colors flex items-center gap-1"
                        >
                          <XCircle className="h-4 w-4" />
                          Reject
                        </button>
                      </div>
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