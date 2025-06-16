import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { WalletBalance } from '../types/wallet';

export const walletBalanceService = {
  async getBalance(userId: string): Promise<WalletBalance> {
    const docRef = doc(db, 'walletBalances', userId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      const initialBalance: WalletBalance = {
        investment: 0,
        earnings: 0,
        totalAdded: 0,
        totalUsed: 0
      };
      await setDoc(docRef, initialBalance);
      return initialBalance;
    }
    
    return docSnap.data() as WalletBalance;
  },

  async updateBalance(userId: string, balance: Partial<WalletBalance>): Promise<void> {
    const docRef = doc(db, 'walletBalances', userId);
    await updateDoc(docRef, balance);
  },

  async addFunds(userId: string, amount: number): Promise<void> {
    const docRef = doc(db, 'walletBalances', userId);
    const docSnap = await getDoc(docRef);
    const currentBalance = docSnap.exists() ? docSnap.data() as WalletBalance : {
      investment: 0,
      earnings: 0,
      totalAdded: 0,
      totalUsed: 0
    };

    await updateDoc(docRef, {
      investment: currentBalance.investment + amount,
      totalAdded: currentBalance.totalAdded + amount
    });
  },

  async useInvestmentFunds(userId: string, amount: number): Promise<void> {
    const docRef = doc(db, 'walletBalances', userId);
    const docSnap = await getDoc(docRef);
    const currentBalance = docSnap.exists() ? docSnap.data() as WalletBalance : {
      investment: 0,
      earnings: 0,
      totalAdded: 0,
      totalUsed: 0
    };

    if (currentBalance.investment < amount) {
      throw new Error('Insufficient funds');
    }

    await updateDoc(docRef, {
      investment: currentBalance.investment - amount,
      totalUsed: currentBalance.totalUsed + amount
    });
  }
};