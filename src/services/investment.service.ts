import { collection, addDoc, query, where, getDocs, DocumentData } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Investment } from '../types/investment';

export const investmentService = {
  async createInvestment(userId: string, investment: Omit<Investment, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'investments'), {
      ...investment,
      userId,
      createdAt: new Date().toISOString(),
      status: 'active'
    });
    return docRef.id;
  },

  async getUserInvestments(userId: string): Promise<Investment[]> {
    const q = query(
      collection(db, 'investments'), 
      where('userId', '==', userId),
      where('status', '==', 'active')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Investment));
  }
};