import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import WalletCard from './WalletCard';
import AddFundsModal from './AddFundsModal';
import WithdrawModal from './WithdrawModal';
import { useWallet } from '../../context/WalletContext';
import { History } from 'lucide-react';

export default function WalletSection() {
  const { balance, totalEarnings, withdrawals } = useWallet();
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);

  const totalApprovedWithdrawals = useMemo(() => {
    return withdrawals
      .filter(w => w.status === 'completed' && w.approved)
      .reduce((sum, w) => sum + w.amount, 0);
  }, [withdrawals]);

  const availableBalance = useMemo(() => {
    return totalEarnings - totalApprovedWithdrawals;
  }, [totalEarnings, totalApprovedWithdrawals]);

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">Wallets</h3>
        <Link 
          to="/withdrawals"
          className="flex items-center text-blue-400 hover:text-blue-500 transition-colors"
        >
          <History className="h-4 w-4 mr-2" />
          Withdrawal History
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <WalletCard
          title="Investment Wallet"
          balance={balance.investment}
          totalAdded={balance.totalAdded}
          totalUsed={balance.totalUsed}
          actionLabel="Add Funds"
          onAction={() => setShowAddFunds(true)}
          variant="blue"
        />
        
        <WalletCard
          title="Earnings Wallet"
          balance={availableBalance}
          totalEarnings={totalEarnings}
          totalWithdrawn={totalApprovedWithdrawals}
          actionLabel="Withdraw"
          onAction={() => setShowWithdraw(true)}
          variant="green"
        />
      </div>

      {showAddFunds && (
        <AddFundsModal onClose={() => setShowAddFunds(false)} />
      )}
      
      {showWithdraw && (
        <WithdrawModal onClose={() => setShowWithdraw(false)} />
      )}
    </div>
  );
}