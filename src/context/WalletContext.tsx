import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WalletBalance, WalletTransaction, Withdrawal } from '../types/wallet';
import { walletService } from '../services/wallet.service';
import { walletBalanceService } from '../services/walletBalance.service';
import { useAuth } from '../hooks/useAuth';

interface WalletContextType {
  balance: WalletBalance;
  transactions: WalletTransaction[];
  withdrawals: Withdrawal[];
  addFunds: (amount: number) => Promise<void>;
  requestAddFunds: (amount: number, utrNumber: string) => Promise<void>;
  withdraw: (amount: number) => Promise<void>;
  addEarnings: (amount: number) => void;
  addReferralEarnings: (amount: number, description: string) => void;
  invest: (amount: number) => Promise<void>;
  totalEarnings: number;
  totalRewards: number;
  setTotalEarnings: (amount: number) => void;
  setTotalRewards: (amount: number) => void;
  loadingWithdrawals: boolean;
  // Calculated values
  totalWithdrawn: number;
  availableEarnings: number;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState<WalletBalance>({
    investment: 0,
    earnings: 0,
    totalAdded: 0,
    totalUsed: 0
  });
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [totalEarnings, setTotalEarnings] = useState(0); // Investment returns only
  const [totalRewards, setTotalRewards] = useState(0); // Referral rewards only
  const [loadingWithdrawals, setLoadingWithdrawals] = useState(true);
  const { user } = useAuth();

  // Calculate total withdrawn amount from approved withdrawals only
  const totalWithdrawn = withdrawals
    .filter(w => w.status === 'completed' && w.approved)
    .reduce((sum, w) => sum + (w.amount || 0), 0);

  // Total Earnings = Investment Returns + Referral Rewards
  const combinedTotalEarnings = (totalEarnings || 0) + (totalRewards || 0);

  // Available Balance = Total Earnings - Total Withdrawn
  const availableEarnings = Math.max(0, combinedTotalEarnings - (totalWithdrawn || 0));

  useEffect(() => {
    const loadInitialData = async () => {
      if (user) {
        try {
          const userBalance = await walletBalanceService.getBalance(user.uid);
          setBalance({
            investment: userBalance.investment || 0,
            earnings: userBalance.earnings || 0,
            totalAdded: userBalance.totalAdded || 0,
            totalUsed: userBalance.totalUsed || 0
          });
          // Set total earnings from the balance (this is investment returns)
          setTotalEarnings(userBalance.earnings || 0);

          const userWithdrawals = await walletService.getUserWithdrawals(user.uid);
          setWithdrawals(userWithdrawals || []);
        } catch (error) {
          console.error('Failed to load initial data:', error);
          setBalance({
            investment: 0,
            earnings: 0,
            totalAdded: 0,
            totalUsed: 0
          });
          setTotalEarnings(0);
          setWithdrawals([]);
        } finally {
          setLoadingWithdrawals(false);
        }
      } else {
        setBalance({
          investment: 0,
          earnings: 0,
          totalAdded: 0,
          totalUsed: 0
        });
        setTotalEarnings(0);
        setTotalRewards(0);
        setWithdrawals([]);
        setLoadingWithdrawals(false);
      }
    };

    loadInitialData();
  }, [user]);

  // Update Firebase when total earnings changes (investment returns only)
  useEffect(() => {
    const updateFirebaseBalance = async () => {
      if (user && totalEarnings >= 0) {
        try {
          await walletBalanceService.updateBalance(user.uid, { earnings: totalEarnings });
          // Update local balance state
          setBalance(prev => ({ ...prev, earnings: totalEarnings }));
        } catch (error) {
          console.error('Failed to update balance in Firebase:', error);
        }
      }
    };

    updateFirebaseBalance();
  }, [totalEarnings, user]);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = walletService.subscribeToWithdrawals(user.uid, (updatedWithdrawals) => {
      setWithdrawals(updatedWithdrawals || []);
    });

    return () => unsubscribe();
  }, [user]);

  const addTransaction = (transaction: Omit<WalletTransaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: Math.random().toString(36).substr(2, 9),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const addFunds = async (amount: number) => {
    if (!user) throw new Error('User must be logged in to add funds');
    
    const numAmount = Number(amount) || 0;
    if (numAmount <= 0) throw new Error('Invalid amount');
    
    try {
      await walletBalanceService.addFunds(user.uid, numAmount);
      setBalance(prev => ({
        ...prev,
        investment: (prev.investment || 0) + numAmount,
        totalAdded: (prev.totalAdded || 0) + numAmount
      }));
      addTransaction({
        type: 'deposit',
        amount: numAmount,
        timestamp: new Date().toISOString(),
        description: 'Added funds to investment wallet',
      });
    } catch (error) {
      console.error('Failed to add funds:', error);
      throw error;
    }
  };

  const requestAddFunds = async (amount: number, utrNumber: string) => {
    if (!user) throw new Error('User must be logged in to add funds');
    
    const numAmount = Number(amount) || 0;
    if (numAmount <= 0) throw new Error('Invalid amount');
    
    try {
      await walletService.createAddFundRequest(user.uid, numAmount, utrNumber);
      addTransaction({
        type: 'deposit',
        amount: numAmount,
        timestamp: new Date().toISOString(),
        description: 'Add funds request submitted',
      });
    } catch (error) {
      console.error('Failed to request add funds:', error);
      throw error;
    }
  };

  const invest = async (amount: number) => {
    if (!user) throw new Error('User must be logged in to invest');
    
    const numAmount = Number(amount) || 0;
    if (numAmount <= 0) throw new Error('Invalid amount');
    if ((balance.investment || 0) < numAmount) throw new Error('Insufficient funds');
    
    try {
      await walletBalanceService.useInvestmentFunds(user.uid, numAmount);
      setBalance(prev => ({
        ...prev,
        investment: Math.max(0, (prev.investment || 0) - numAmount),
        totalUsed: (prev.totalUsed || 0) + numAmount
      }));
      addTransaction({
        type: 'investment',
        amount: numAmount,
        timestamp: new Date().toISOString(),
        description: 'Investment in new plan',
      });
    } catch (error) {
      console.error('Failed to invest:', error);
      throw error;
    }
  };

  const withdraw = async (amount: number) => {
    if (!user) throw new Error('User must be logged in to withdraw');
    
    const numAmount = Number(amount) || 0;
    if (numAmount <= 0) throw new Error('Invalid amount');
    if (availableEarnings < numAmount) throw new Error('Insufficient balance');

    try {
      const withdrawalId = await walletService.createWithdrawal(user.uid, numAmount);
      const newWithdrawal: Withdrawal = {
        id: withdrawalId,
        userId: user.uid,
        amount: numAmount,
        status: 'pending',
        approved: false,
        timestamp: new Date().toISOString()
      };
      setWithdrawals(prev => [newWithdrawal, ...prev]);

      addTransaction({
        type: 'withdrawal',
        amount: numAmount,
        timestamp: new Date().toISOString(),
        description: 'Withdrawal request submitted',
      });
    } catch (error) {
      console.error('Withdrawal failed:', error);
      throw error;
    }
  };

  const addEarnings = (amount: number) => {
    const numAmount = Number(amount) || 0;
    if (numAmount > 0) {
      setTotalEarnings(prev => (prev || 0) + numAmount);
      addTransaction({
        type: 'earning',
        amount: numAmount,
        timestamp: new Date().toISOString(),
        description: 'Daily returns added to earnings wallet',
      });
    }
  };

  const addReferralEarnings = (amount: number, description: string) => {
    const numAmount = Number(amount) || 0;
    if (numAmount > 0) {
      setTotalRewards(prev => (prev || 0) + numAmount);
      addTransaction({
        type: 'referral',
        amount: numAmount,
        timestamp: new Date().toISOString(),
        description: description || 'Referral reward',
      });
    }
  };

  return (
    <WalletContext.Provider value={{
      balance,
      transactions,
      withdrawals,
      addFunds,
      requestAddFunds,
      withdraw,
      addEarnings,
      addReferralEarnings,
      invest,
      totalEarnings: totalEarnings || 0,
      totalRewards: totalRewards || 0,
      setTotalEarnings,
      setTotalRewards,
      loadingWithdrawals,
      totalWithdrawn: totalWithdrawn || 0,
      availableEarnings: availableEarnings || 0
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}