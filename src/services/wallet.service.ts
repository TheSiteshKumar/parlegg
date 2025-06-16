import { doc, setDoc, getDoc, updateDoc, collection, addDoc, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { WalletBalance, Withdrawal, AddFundRequest } from '../types/wallet';

export const walletService = {
  async getWalletBalance(userId: string): Promise<WalletBalance> {
    const docRef = doc(db, 'wallets', userId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      const initialBalance: WalletBalance = { investment: 0, earnings: 0, totalAdded: 0, totalUsed: 0 };
      await setDoc(docRef, initialBalance);
      return initialBalance;
    }
    
    return docSnap.data() as WalletBalance;
  },

  async updateWalletBalance(userId: string, balance: WalletBalance): Promise<void> {
    const docRef = doc(db, 'wallets', userId);
    await updateDoc(docRef, balance);
  },

  async createAddFundRequest(userId: string, amount: number, utrNumber: string): Promise<string> {
    const request: Omit<AddFundRequest, 'id'> = {
      userId,
      amount,
      utrNumber,
      status: 'pending',
      timestamp: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, 'addFundRequests'), request);
    return docRef.id;
  },

  async updateAddFundRequestStatus(
    requestId: string,
    status: AddFundRequest['status'],
    approved: boolean
  ): Promise<void> {
    const docRef = doc(db, 'addFundRequests', requestId);
    await updateDoc(docRef, {
      status,
      approved,
      processedAt: new Date().toISOString()
    });
  },

  async createWithdrawal(userId: string, amount: number, paymentMethod = 'upi', upiId = ''): Promise<string> {
    const withdrawal: Omit<Withdrawal, 'id'> = {
      userId,
      amount,
      approved: false,
      status: 'pending',
      timestamp: new Date().toISOString(),
      paymentMethod,
      upiId
    };

    const docRef = await addDoc(collection(db, 'withdrawals'), withdrawal);
    return docRef.id;
  },

  async getUserWithdrawals(userId: string): Promise<Withdrawal[]> {
    const q = query(
      collection(db, 'withdrawals'),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Withdrawal)).sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  },

  subscribeToWithdrawals(userId: string, callback: (withdrawals: Withdrawal[]) => void) {
    const q = query(
      collection(db, 'withdrawals'),
      where('userId', '==', userId)
    );

    return onSnapshot(q, (snapshot) => {
      const withdrawals = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Withdrawal)).sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      callback(withdrawals);
    }, error => {
      console.error('Error in withdrawal subscription:', error);
    });
  },

  async updateWithdrawalStatus(
    withdrawalId: string, 
    status: Withdrawal['status'], 
    approved: boolean,
    transactionId?: string
  ): Promise<void> {
    const docRef = doc(db, 'withdrawals', withdrawalId);
    const updateData = {
      status,
      approved,
      processedAt: new Date().toISOString(),
      ...(transactionId && { transactionId })
    };
    await updateDoc(docRef, updateData);
  }
};