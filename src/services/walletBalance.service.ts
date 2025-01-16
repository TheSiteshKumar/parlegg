import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { WalletBalance } from '../types/wallet';

export const walletBalanceService = {
  async getBalance(userId: string): Promise<WalletBalance> {
    const docRef = doc(db, 'walletBalances', userId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      const initialBalance = { investment: 0, earnings: 0 };
      await setDoc(docRef, initialBalance);
      return initialBalance;
    }
    
    return docSnap.data() as WalletBalance;
  },

  async updateBalance(userId: string, balance: number): Promise<void> {
    const docRef = doc(db, 'walletBalances', userId);
    await updateDoc(docRef, { earnings: balance });
  }
};