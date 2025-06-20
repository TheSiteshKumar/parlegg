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
  withdraw: (amount: number, paymentMethod?: string, upiId?: string) => Promise<void>;
  addEarnings: (amount: number) => void;
  invest: (amount: number) => Promise<void>;
  totalEarnings: number;
  setTotalEarnings: (amount: number) => void;
  loadingWithdrawals: boolean;
  refreshBalance: () => Promise<void>;
  getAvailableEarningsBalance: () => number;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState<WalletBalance>({
    investment: 0,
    earnings: 0,
    totalAdded: 0,
    totalUsed: 0,
    referralEarnings: 0,
    investmentReturns: 0
  });
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loadingWithdrawals, setLoadingWithdrawals] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadInitialData = async () => {
      if (user) {
        try {
          const userBalance = await walletBalanceService.getBalance(user.uid);
          setBalance(userBalance);
          setTotalEarnings(userBalance.earnings);

          const userWithdrawals = await walletService.getUserWithdrawals(user.uid);
          setWithdrawals(userWithdrawals);
        } catch (error) {
          console.error('Failed to load initial data:', error);
        } finally {
          setLoadingWithdrawals(false);
        }
      }
    };

    loadInitialData();
  }, [user]);

  useEffect(() => {
    const updateFirebaseBalance = async () => {
      if (user) {
        try {
          await walletBalanceService.updateBalance(user.uid, { earnings: totalEarnings });
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
      setWithdrawals(updatedWithdrawals);
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
    
    try {
      await walletBalanceService.addFunds(user.uid, amount);
      setBalance(prev => ({
        ...prev,
        investment: prev.investment + amount,
        totalAdded: prev.totalAdded + amount
      }));
      addTransaction({
        type: 'deposit',
        amount,
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
    
    try {
      await walletService.createAddFundRequest(user.uid, amount, utrNumber);
      addTransaction({
        type: 'deposit',
        amount,
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
    
    try {
      await walletBalanceService.useInvestmentFunds(user.uid, amount);
      setBalance(prev => ({
        ...prev,
        investment: prev.investment - amount,
        totalUsed: prev.totalUsed + amount
      }));
      addTransaction({
        type: 'investment',
        amount,
        timestamp: new Date().toISOString(),
        description: 'Investment in new plan',
      });
    } catch (error) {
      console.error('Failed to invest:', error);
      throw error;
    }
  };

  // Calculate available balance in earnings wallet
  const getAvailableEarningsBalance = () => {
    const totalApprovedWithdrawals = withdrawals
      .filter(w => w.status === 'completed' && w.approved)
      .reduce((sum, w) => sum + w.amount, 0);
    
    const totalAllEarnings = (balance.investmentReturns || 0) + (balance.referralEarnings || 0);
    return Math.max(0, totalAllEarnings - totalApprovedWithdrawals);
  };

  const withdraw = async (amount: number, paymentMethod = 'bank', upiId = '') => {
    if (!user) throw new Error('User must be logged in to withdraw');
    
    const availableBalance = getAvailableEarningsBalance();
    if (availableBalance < amount) throw new Error('Insufficient balance in earnings wallet');
    if (amount < 100) throw new Error('Minimum withdrawal amount is ₹100');

    try {
      const withdrawalId = await walletService.createWithdrawal(user.uid, amount, paymentMethod, upiId);
      const newWithdrawal: Withdrawal = {
        id: withdrawalId,
        userId: user.uid,
        amount,
        status: 'pending',
        approved: false,
        timestamp: new Date().toISOString(),
        paymentMethod,
        upiId
      };
      setWithdrawals(prev => [newWithdrawal, ...prev]);

      addTransaction({
        type: 'withdrawal',
        amount,
        timestamp: new Date().toISOString(),
        description: `Withdrawal request submitted via ${paymentMethod.toUpperCase()}`,
      });
    } catch (error) {
      console.error('Withdrawal failed:', error);
      throw error;
    }
  };

  const addEarnings = (amount: number) => {
    setTotalEarnings(prev => prev + amount);
    addTransaction({
      type: 'earning',
      amount,
      timestamp: new Date().toISOString(),
      description: 'Daily returns added to earnings wallet',
    });
  };

  const refreshBalance = async () => {
    if (user) {
      try {
        const userBalance = await walletBalanceService.getBalance(user.uid);
        setBalance(userBalance);
        setTotalEarnings(userBalance.earnings);
      } catch (error) {
        console.error('Failed to refresh balance:', error);
      }
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
      invest,
      totalEarnings,
      setTotalEarnings,
      loadingWithdrawals,
      refreshBalance,
      getAvailableEarningsBalance
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