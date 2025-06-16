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

  const withdraw = async (amount: number, paymentMethod = 'upi', upiId = '') => {
    if (!user) throw new Error('User must be logged in to withdraw');
    if (totalEarnings < amount) throw new Error('Insufficient balance');

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
      loadingWithdrawals
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