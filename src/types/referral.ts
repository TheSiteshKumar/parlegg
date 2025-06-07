export interface ReferralCode {
  id?: string;
  userId: string;
  code: string;
  createdAt: string;
}

export interface Referral {
  id?: string;
  referrerId: string;
  refereeId: string;
  refereeEmail: string;
  refereeName: string;
  referralCode: string;
  status: 'pending' | 'plan_purchased' | 'reward_credited';
  planPurchased?: string;
  planAmount?: number;
  referrerReward?: number;
  refereeReward?: number;
  createdAt: string;
  planPurchasedAt?: string;
  rewardCreditedAt?: string;
}

export interface ReferralReward {
  id?: string;
  userId: string;
  type: 'referral' | 'milestone';
  amount: number;
  description: string;
  referralId?: string;
  milestone?: number;
  status: 'pending' | 'credited';
  createdAt: string;
  creditedAt?: string;
}

export interface ReferralStats {
  totalReferrals: number;
  completedReferrals: number;
  totalRewards: number;
  pendingRewards: number;
  currentMilestone: number;
  nextMilestone: number;
  progressToNext: number;
}

export const REFERRAL_REWARDS = {
  '600': { referrer: 150, referee: 100 },
  '3800': { referrer: 300, referee: 200 },
  '9600': { referrer: 500, referee: 300 },
  '20800': { referrer: 1000, referee: 500 }
};

export const MILESTONE_BONUSES = [
  { referrals: 3, bonus: 100 },
  { referrals: 10, bonus: 300 },
  { referrals: 25, bonus: 1000 },
  { referrals: 50, bonus: 4000 },
  { referrals: 100, bonus: 10000 }
];