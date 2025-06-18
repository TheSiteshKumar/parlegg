import { collection, addDoc, query, where, getDocs, DocumentData } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Investment, PurchaseLimitError } from '../types/investment';
import { purchaseLimitService } from './purchaseLimit.service';

export const investmentService = {
  async createInvestment(userId: string, investment: Omit<Investment, 'id'>): Promise<string> {
    // Check purchase limits before creating investment
    const limitCheck = await purchaseLimitService.canPurchasePlan(userId, investment.planLevel);
    
    if (!limitCheck.canPurchase && limitCheck.error) {
      throw limitCheck.error;
    }

    // Create the investment
    const docRef = await addDoc(collection(db, 'investments'), {
      ...investment,
      userId,
      createdAt: new Date().toISOString(),
      status: 'active'
    });

    // Record the purchase in purchase history
    await purchaseLimitService.recordPurchase(userId, investment.planLevel);

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
  },

  // Get purchase counts for user (for UI display)
  async getUserPurchaseCounts(userId: string): Promise<Record<string, number>> {
    return purchaseLimitService.getUserPurchaseCounts(userId);
  },

  // Check if user can purchase a specific plan
  async canPurchasePlan(userId: string, planLevel: string): Promise<{ canPurchase: boolean; error?: PurchaseLimitError }> {
    return purchaseLimitService.canPurchasePlan(userId, planLevel);
  }
};