import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Investment } from '../types/investment';
import { investmentService } from '../services/investment.service';
import { earningsService } from '../services/earnings.service';
import { useAuth } from '../hooks/useAuth';
import { useWallet } from './WalletContext';
import { useReferral } from './ReferralContext';

interface InvestmentContextType {
  investments: Investment[];
  addInvestment: (investment: Omit<Investment, 'id'>) => Promise<void>;
  loading: boolean;
}

const InvestmentContext = createContext<InvestmentContextType | undefined>(undefined);

export function InvestmentProvider({ children }: { children: ReactNode }) {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { setTotalEarnings } = useWallet();
  const { processReferralReward } = useReferral();

  const updateTotalEarnings = useCallback(() => {
    if (!investments.length) {
      setTotalEarnings(0);
      return;
    }
    
    // Calculate total earnings from all investments from day one
    const total = earningsService.calculateTotalEarningsToDate(investments);
    setTotalEarnings(total);
  }, [investments, setTotalEarnings]);

  // Load investments on mount and user change
  useEffect(() => {
    const loadInvestments = async () => {
      if (user) {
        try {
          const userInvestments = await investmentService.getUserInvestments(user.uid);
          setInvestments(userInvestments);
        } catch (error) {
          console.error('Failed to load investments:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setInvestments([]);
        setLoading(false);
      }
    };

    loadInvestments();
  }, [user]);

  // Update total earnings whenever investments change
  useEffect(() => {
    updateTotalEarnings();
  }, [updateTotalEarnings]);

  // Update earnings every minute to account for new days
  useEffect(() => {
    const interval = setInterval(() => {
      updateTotalEarnings();
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [updateTotalEarnings]);

  const addInvestment = async (investment: Omit<Investment, 'id'>) => {
    if (!user) throw new Error('User must be logged in to invest');
    
    try {
      const id = await investmentService.createInvestment(user.uid, investment);
      const newInvestment = { ...investment, id };
      setInvestments(prev => [...prev, newInvestment]);

      // Process referral reward if this is the user's first investment
      try {
        await processReferralReward(user.uid, investment.planLevel, investment.amount);
      } catch (referralError) {
        console.error('Failed to process referral reward:', referralError);
        // Don't block investment if referral processing fails
      }
    } catch (error) {
      console.error('Failed to add investment:', error);
      throw error;
    }
  };

  return (
    <InvestmentContext.Provider value={{ investments, addInvestment, loading }}>
      {children}
    </InvestmentContext.Provider>
  );
}

export function useInvestments() {
  const context = useContext(InvestmentContext);
  if (context === undefined) {
    throw new Error('useInvestments must be used within an InvestmentProvider');
  }
  return context;
}