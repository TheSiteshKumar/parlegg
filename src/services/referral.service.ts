import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc,
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { ReferralCode, Referral, ReferralReward, ReferralStats, REFERRAL_REWARDS, MILESTONE_BONUSES } from '../types/referral';

export const referralService = {
  // Generate a unique referral code
  generateReferralCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },

  // Create referral code for user
  async createReferralCode(userId: string, userName: string): Promise<string> {
    let code = this.generateReferralCode();
    let isUnique = false;
    
    // Ensure code is unique
    while (!isUnique) {
      const q = query(collection(db, 'referralCodes'), where('code', '==', code));
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        isUnique = true;
      } else {
        code = this.generateReferralCode();
      }
    }

    const referralCode: Omit<ReferralCode, 'id'> = {
      userId,
      code,
      createdAt: new Date().toISOString()
    };

    await addDoc(collection(db, 'referralCodes'), referralCode);
    return code;
  },

  // Get user's referral code
  async getUserReferralCode(userId: string): Promise<string | null> {
    const q = query(collection(db, 'referralCodes'), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      return snapshot.docs[0].data().code;
    }
    return null;
  },

  // Validate referral code and get referrer info
  async validateReferralCode(code: string): Promise<{ userId: string; isValid: boolean }> {
    const q = query(collection(db, 'referralCodes'), where('code', '==', code));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      return { userId: snapshot.docs[0].data().userId, isValid: true };
    }
    return { userId: '', isValid: false };
  },

  // Create referral relationship
  async createReferral(
    referrerId: string, 
    refereeId: string, 
    refereeEmail: string,
    refereeName: string,
    referralCode: string
  ): Promise<string> {
    const referral: Omit<Referral, 'id'> = {
      referrerId,
      refereeId,
      refereeEmail,
      refereeName,
      referralCode,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, 'referrals'), referral);
    return docRef.id;
  },

  // Process referral reward when plan is purchased
  async processReferralReward(refereeId: string, planLevel: string, planAmount: number): Promise<void> {
    // Find the referral
    const q = query(collection(db, 'referrals'), where('refereeId', '==', refereeId));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const referralDoc = snapshot.docs[0];
      const referral = referralDoc.data() as Referral;
      
      if (referral.status === 'pending') {
        const rewards = REFERRAL_REWARDS[planLevel as keyof typeof REFERRAL_REWARDS];
        
        if (rewards) {
          // Update referral status
          await updateDoc(doc(db, 'referrals', referralDoc.id), {
            status: 'plan_purchased',
            planPurchased: planLevel,
            planAmount,
            referrerReward: rewards.referrer,
            refereeReward: rewards.referee,
            planPurchasedAt: new Date().toISOString()
          });

          // Create reward for referrer
          await addDoc(collection(db, 'referralRewards'), {
            userId: referral.referrerId,
            type: 'referral',
            amount: rewards.referrer,
            description: `Referral reward for ${referral.refereeName}'s ${planLevel} plan purchase`,
            referralId: referralDoc.id,
            status: 'credited',
            createdAt: new Date().toISOString(),
            creditedAt: new Date().toISOString()
          });

          // Create reward for referee
          await addDoc(collection(db, 'referralRewards'), {
            userId: refereeId,
            type: 'referral',
            amount: rewards.referee,
            description: `Welcome bonus for purchasing ${planLevel} plan`,
            referralId: referralDoc.id,
            status: 'credited',
            createdAt: new Date().toISOString(),
            creditedAt: new Date().toISOString()
          });

          // Check for milestone bonuses
          await this.checkMilestoneBonuses(referral.referrerId);
        }
      }
    }
  },

  // Check and award milestone bonuses
  async checkMilestoneBonuses(userId: string): Promise<void> {
    const completedReferrals = await this.getCompletedReferralsCount(userId);
    
    for (const milestone of MILESTONE_BONUSES) {
      if (completedReferrals >= milestone.referrals) {
        // Check if milestone bonus already awarded
        const q = query(
          collection(db, 'referralRewards'),
          where('userId', '==', userId),
          where('type', '==', 'milestone'),
          where('milestone', '==', milestone.referrals)
        );
        const snapshot = await getDocs(q);
        
        if (snapshot.empty) {
          // Award milestone bonus
          await addDoc(collection(db, 'referralRewards'), {
            userId,
            type: 'milestone',
            amount: milestone.bonus,
            description: `Milestone bonus for ${milestone.referrals} completed referrals`,
            milestone: milestone.referrals,
            status: 'credited',
            createdAt: new Date().toISOString(),
            creditedAt: new Date().toISOString()
          });
        }
      }
    }
  },

  // Get completed referrals count
  async getCompletedReferralsCount(userId: string): Promise<number> {
    const q = query(
      collection(db, 'referrals'),
      where('referrerId', '==', userId),
      where('status', '==', 'plan_purchased')
    );
    const snapshot = await getDocs(q);
    return snapshot.size;
  },

  // Get user referrals
  async getUserReferrals(userId: string): Promise<Referral[]> {
    const q = query(
      collection(db, 'referrals'),
      where('referrerId', '==', userId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Referral)).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  // Get user rewards
  async getUserRewards(userId: string): Promise<ReferralReward[]> {
    const q = query(
      collection(db, 'referralRewards'),
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as ReferralReward)).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  // Get referral statistics
  async getReferralStats(userId: string): Promise<ReferralStats> {
    const [referrals, rewards] = await Promise.all([
      this.getUserReferrals(userId),
      this.getUserRewards(userId)
    ]);

    const totalReferrals = referrals.length;
    const completedReferrals = referrals.filter(r => r.status === 'plan_purchased').length;
    const totalRewards = rewards.reduce((sum, r) => sum + r.amount, 0);
    const pendingRewards = rewards.filter(r => r.status === 'pending').reduce((sum, r) => sum + r.amount, 0);

    // Find current and next milestone
    let currentMilestone = 0;
    let nextMilestone = MILESTONE_BONUSES[0].referrals;
    
    for (const milestone of MILESTONE_BONUSES) {
      if (completedReferrals >= milestone.referrals) {
        currentMilestone = milestone.referrals;
      } else {
        nextMilestone = milestone.referrals;
        break;
      }
    }

    const progressToNext = nextMilestone > currentMilestone 
      ? ((completedReferrals - currentMilestone) / (nextMilestone - currentMilestone)) * 100
      : 100;

    return {
      totalReferrals,
      completedReferrals,
      totalRewards,
      pendingRewards,
      currentMilestone,
      nextMilestone,
      progressToNext: Math.min(100, Math.max(0, progressToNext))
    };
  },

  // Subscribe to referral updates
  subscribeToReferrals(userId: string, callback: (referrals: Referral[]) => void) {
    const q = query(
      collection(db, 'referrals'),
      where('referrerId', '==', userId)
    );

    return onSnapshot(q, (snapshot) => {
      const referrals = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Referral)).sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      callback(referrals);
    });
  }
};