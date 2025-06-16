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
  const { addEarnings, setTotalEarnings } = useWallet();
  const { processReferralReward } = useReferral();
  const [lastEarningsUpdate, setLastEarningsUpdate] = useState<Date | null>(null);

  const updateTotalEarnings = useCallback(() => {
    if (!investments.length) return;
    const total = earningsService.calculateTotalEarningsToDate(investments);
    setTotalEarnings(total);
  }, [investments, setTotalEarnings]);

  const processEarnings = useCallback(() => {
    if (!user || investments.length === 0) return;

    const now = new Date();
    // Check if we already processed earnings today
    if (lastEarningsUpdate) {
      const lastUpdate = new Date(lastEarningsUpdate);
      if (
        lastUpdate.getDate() === now.getDate() &&
        lastUpdate.getMonth() === now.getMonth() &&
        lastUpdate.getFullYear() === now.getFullYear()
      ) {
        return;
      }
    }

    // Calculate and add daily earnings
    const dailyEarnings = earningsService.calculateDailyEarnings(investments);
    if (dailyEarnings > 0) {
      addEarnings(dailyEarnings);
      setLastEarningsUpdate(now);
      updateTotalEarnings();
      
      // Update investments with new remaining days
      setInvestments(prevInvestments => 
        prevInvestments.map(investment => {
          const status = earningsService.getInvestmentStatus(investment);
          return {
            ...investment,
            daysRemaining: status.remainingDays
          };
        })
      );
    }
  }, [user, investments, addEarnings, lastEarningsUpdate, updateTotalEarnings]);

  // Load investments on mount and user change
  useEffect(() => {
    const loadInvestments = async () => {
      if (user) {
        try {
          const userInvestments = await investmentService.getUserInvestments(user.uid);
          setInvestments(userInvestments);
          // Calculate total earnings when investments are loaded
          const total = earningsService.calculateTotalEarningsToDate(userInvestments);
          setTotalEarnings(total);
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
  }, [user, setTotalEarnings]);

  // Process earnings every minute and on component mount
  useEffect(() => {
    processEarnings();
    const interval = setInterval(processEarnings, 60000);
    return () => clearInterval(interval);
  }, [processEarnings]);

  const addInvestment = async (investment: Omit<Investment, 'id'>) => {
    if (!user) throw new Error('User must be logged in to invest');
    
    try {
      const id = await investmentService.createInvestment(user.uid, investment);
      setInvestments(prev => [...prev, { ...investment, id }]);
      updateTotalEarnings();

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