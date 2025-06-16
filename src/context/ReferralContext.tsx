import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Referral, ReferralReward, ReferralStats } from '../types/referral';
import { referralService } from '../services/referral.service';
import { useAuth } from '../hooks/useAuth';

interface ReferralContextType {
  referralCode: string | null;
  referrals: Referral[];
  rewards: ReferralReward[];
  stats: ReferralStats | null;
  loading: boolean;
  createReferralCode: () => Promise<string>;
  processReferralReward: (refereeId: string, planLevel: string, planAmount: number) => Promise<void>;
  refreshData: () => Promise<void>;
}

const ReferralContext = createContext<ReferralContextType | undefined>(undefined);

export function ReferralProvider({ children }: { children: ReactNode }) {
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [rewards, setRewards] = useState<ReferralReward[]>([]);
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const loadData = async () => {
    if (!user) {
      setReferralCode(null);
      setReferrals([]);
      setRewards([]);
      setStats(null);
      setLoading(false);
      return;
    }

    try {
      const [code, userReferrals, userRewards, userStats] = await Promise.all([
        referralService.getUserReferralCode(user.uid),
        referralService.getUserReferrals(user.uid),
        referralService.getUserRewards(user.uid),
        referralService.getReferralStats(user.uid)
      ]);

      setReferralCode(code);
      setReferrals(userReferrals);
      setRewards(userRewards);
      setStats(userStats);
    } catch (error) {
      console.error('Failed to load referral data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = referralService.subscribeToReferrals(user.uid, (updatedReferrals) => {
      setReferrals(updatedReferrals);
      // Refresh stats when referrals update
      referralService.getReferralStats(user.uid).then(setStats);
    });

    return () => unsubscribe();
  }, [user]);

  const createReferralCode = async (): Promise<string> => {
    if (!user) throw new Error('User must be logged in');
    
    const code = await referralService.createReferralCode(user.uid, user.displayName || 'User');
    setReferralCode(code);
    return code;
  };

  const processReferralReward = async (refereeId: string, planLevel: string, planAmount: number) => {
    await referralService.processReferralReward(refereeId, planLevel, planAmount);
    await loadData(); // Refresh all data
  };

  const refreshData = async () => {
    await loadData();
  };

  return (
    <ReferralContext.Provider value={{
      referralCode,
      referrals,
      rewards,
      stats,
      loading,
      createReferralCode,
      processReferralReward,
      refreshData
    }}>
      {children}
    </ReferralContext.Provider>
  );
}

export function useReferral() {
  const context = useContext(ReferralContext);
  if (context === undefined) {
    throw new Error('useReferral must be used within a ReferralProvider');
  }
  return context;
}