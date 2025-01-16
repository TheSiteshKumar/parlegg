import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WalletBalance, WalletTransaction, Withdrawal } from '../types/wallet';
import { walletService } from '../services/wallet.service';
import { walletBalanceService } from '../services/walletBalance.service';
import { useAuth } from '../hooks/useAuth';

interface WalletContextType {
  balance: WalletBalance;
  transactions: WalletTransaction[];
  withdrawals: Withdrawal[];
  addFunds: (amount: number) => void;
  withdraw: (amount: number) => Promise<void>;
  addEarnings: (amount: number) => void;
  invest: (amount: number) => void;
  totalEarnings: number;
  setTotalEarnings: (amount: number) => void;
  loadingWithdrawals: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState<WalletBalance>({
    investment: 0,
    earnings: 0,
  });
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loadingWithdrawals, setLoadingWithdrawals] = useState(true);
  const { user } = useAuth();

  // Load initial balance and withdrawals
  useEffect(() => {
    const loadInitialData = async () => {
      if (user) {
        try {
          // Load wallet balance
          const userBalance = await walletBalanceService.getBalance(user.uid);
          setBalance(userBalance);
          setTotalEarnings(userBalance.earnings);

          // Load withdrawals
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

  // Update Firebase balance when total earnings change
  useEffect(() => {
    const updateFirebaseBalance = async () => {
      if (user) {
        try {
          await walletBalanceService.updateBalance(user.uid, totalEarnings);
        } catch (error) {
          console.error('Failed to update balance in Firebase:', error);
        }
      }
    };

    updateFirebaseBalance();
  }, [totalEarnings, user]);

  // Listen for withdrawal status changes
  useEffect(() => {
    if (!user) return;

    const unsubscribe = walletService.subscribeToWithdrawals(user.uid, (updatedWithdrawals) => {
      const oldWithdrawals = withdrawals;
      
      updatedWithdrawals.forEach(newWithdrawal => {
        const oldWithdrawal = oldWithdrawals.find(w => w.id === newWithdrawal.id);
        
        // Handle status changes
        if (oldWithdrawal?.status === 'pending') {
          if (newWithdrawal.status === 'completed' && newWithdrawal.approved) {
            // Deduct amount from earnings only when withdrawal is approved
            setTotalEarnings(prev => Math.max(0, prev - newWithdrawal.amount));
            
            addTransaction({
              type: 'withdrawal',
              amount: newWithdrawal.amount,
              timestamp: new Date().toISOString(),
              description: 'Withdrawal completed'
            });
          } else if (newWithdrawal.status === 'failed') {
            addTransaction({
              type: 'withdrawal',
              amount: newWithdrawal.amount,
              timestamp: new Date().toISOString(),
              description: 'Withdrawal request rejected'
            });
          }
        }
      });

      setWithdrawals(updatedWithdrawals);
    });

    return () => unsubscribe();
  }, [user, withdrawals]);

  const addTransaction = (transaction: Omit<WalletTransaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: Math.random().toString(36).substr(2, 9),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const addFunds = (amount: number) => {
    setBalance(prev => ({
      ...prev,
      investment: prev.investment + amount,
    }));
    addTransaction({
      type: 'deposit',
      amount,
      timestamp: new Date().toISOString(),
      description: 'Added funds to investment wallet',
    });
  };

  const withdraw = async (amount: number) => {
    if (!user) throw new Error('User must be logged in to withdraw');
    if (totalEarnings < amount) throw new Error('Insufficient balance');

    try {
      const withdrawalId = await walletService.createWithdrawal(user.uid, amount);
      
      // Add to local withdrawals list without deducting the amount
      const newWithdrawal: Withdrawal = {
        id: withdrawalId,
        userId: user.uid,
        amount,
        status: 'pending',
        approved: false,
        timestamp: new Date().toISOString()
      };
      setWithdrawals(prev => [newWithdrawal, ...prev]);

      addTransaction({
        type: 'withdrawal',
        amount,
        timestamp: new Date().toISOString(),
        description: 'Withdrawal request submitted',
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

  const invest = (amount: number) => {
    if (balance.investment >= amount) {
      setBalance(prev => ({
        ...prev,
        investment: prev.investment - amount,
      }));
      addTransaction({
        type: 'investment',
        amount,
        timestamp: new Date().toISOString(),
        description: 'Investment in new plan',
      });
    }
  };

  return (
    <WalletContext.Provider value={{
      balance,
      transactions,
      withdrawals,
      addFunds,
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