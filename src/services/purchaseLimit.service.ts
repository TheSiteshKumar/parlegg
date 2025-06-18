import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { PlanPurchaseHistory, PurchaseLimitError } from '../types/investment';
import { investmentPlans } from '../data/investmentPlans';

export const purchaseLimitService = {
  // Get purchase history for a specific user and plan
  async getPurchaseHistory(userId: string, planLevel: string): Promise<PlanPurchaseHistory | null> {
    const docRef = doc(db, 'planPurchaseHistory', `${userId}_${planLevel}`);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as PlanPurchaseHistory;
    }
    return null;
  },

  // Get all purchase history for a user
  async getUserPurchaseHistory(userId: string): Promise<PlanPurchaseHistory[]> {
    const q = query(
      collection(db, 'planPurchaseHistory'),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as PlanPurchaseHistory));
  },

  // Check if user can purchase a plan
  async canPurchasePlan(userId: string, planLevel: string): Promise<{ canPurchase: boolean; error?: PurchaseLimitError }> {
    // Find the plan
    const plan = investmentPlans.find(p => p.level === planLevel);
    if (!plan) {
      throw new Error('Plan not found');
    }

    // If purchase limit is 0, it means unlimited
    if (plan.purchaseLimit === 0) {
      return { canPurchase: true };
    }

    // Get current purchase history
    const history = await this.getPurchaseHistory(userId, planLevel);
    const currentCount = history?.purchaseCount || 0;

    if (currentCount >= plan.purchaseLimit) {
      const error: PurchaseLimitError = new Error('Purchase limit reached for this plan.') as PurchaseLimitError;
      error.code = 'PURCHASE_LIMIT_EXCEEDED';
      error.planName = plan.name;
      error.currentCount = currentCount;
      error.maxLimit = plan.purchaseLimit;
      
      return { canPurchase: false, error };
    }

    return { canPurchase: true };
  },

  // Record a purchase (increment counter)
  async recordPurchase(userId: string, planLevel: string): Promise<void> {
    const plan = investmentPlans.find(p => p.level === planLevel);
    if (!plan) {
      throw new Error('Plan not found');
    }

    const docRef = doc(db, 'planPurchaseHistory', `${userId}_${planLevel}`);
    const currentTime = new Date().toISOString();
    
    // Get existing history
    const history = await this.getPurchaseHistory(userId, planLevel);
    
    if (history) {
      // Update existing record
      await updateDoc(docRef, {
        purchaseCount: history.purchaseCount + 1,
        lastPurchaseDate: currentTime,
        updatedAt: currentTime
      });
    } else {
      // Create new record
      const newHistory: Omit<PlanPurchaseHistory, 'id'> = {
        userId,
        planLevel,
        planName: plan.name,
        purchaseCount: 1,
        lastPurchaseDate: currentTime,
        createdAt: currentTime,
        updatedAt: currentTime
      };
      
      await setDoc(docRef, newHistory);
    }
  },

  // Get purchase counts for all plans for a user (for UI display)
  async getUserPurchaseCounts(userId: string): Promise<Record<string, number>> {
    const histories = await this.getUserPurchaseHistory(userId);
    const counts: Record<string, number> = {};
    
    histories.forEach(history => {
      counts[history.planLevel] = history.purchaseCount;
    });
    
    return counts;
  },

  // Admin function: Reset purchase count for a user and plan
  async resetPurchaseCount(userId: string, planLevel: string): Promise<void> {
    const docRef = doc(db, 'planPurchaseHistory', `${userId}_${planLevel}`);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      await updateDoc(docRef, {
        purchaseCount: 0,
        updatedAt: new Date().toISOString()
      });
    }
  },

  // Admin function: Delete purchase history for a user and plan
  async deletePurchaseHistory(userId: string, planLevel: string): Promise<void> {
    const docRef = doc(db, 'planPurchaseHistory', `${userId}_${planLevel}`);
    await docRef.delete();
  }
};