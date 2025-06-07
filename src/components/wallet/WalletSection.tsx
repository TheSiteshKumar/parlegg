import React, { useState } from 'react';
import WalletCard from './WalletCard';
import AddFundsModal from './AddFundsModal';
import WithdrawModal from './WithdrawModal';
import { useWallet } from '../../context/WalletContext';

export default function WalletSection() {
  const { balance, totalEarnings, totalRewards, totalWithdrawn, availableEarnings } = useWallet();
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold mb-2">Your Wallets</h3>
        <p className="text-gray-400">Manage your investment funds and earnings</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <WalletCard
          title="Investment Wallet"
          subtitle="Add funds to start investing"
          balance={balance.investment || 0}
          totalAdded={balance.totalAdded || 0}
          totalUsed={balance.totalUsed || 0}
          actionLabel="Add Funds"
          onAction={() => setShowAddFunds(true)}
          variant="blue"
        />
        
        <WalletCard
          title="Earnings Wallet"
          subtitle="Your investment returns & referral rewards"
          balance={availableEarnings}
          totalEarnings={totalEarnings || 0}
          totalRewards={totalRewards || 0}
          totalWithdrawn={totalWithdrawn || 0}
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