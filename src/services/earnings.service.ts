import { Investment } from '../types/investment';

export const earningsService = {
  calculateDailyEarnings(investments: Investment[]): number {
    const now = new Date();
    let totalDailyEarnings = 0;
    
    investments.forEach(investment => {
      const startDate = new Date(investment.investmentDate);
      const endDate = new Date(investment.endDate);
      
      // Check if investment is active (within start and end dates)
      if (now >= startDate && now <= endDate) {
        totalDailyEarnings += investment.dailyReturns;
      }
    });
    
    return totalDailyEarnings;
  },

  calculateTotalEarningsToDate(investments: Investment[]): number {
    const now = new Date();
    let totalEarnings = 0;
    
    investments.forEach(investment => {
      const startDate = new Date(investment.investmentDate);
      const endDate = new Date(investment.endDate);
      
      if (now >= startDate) {
        // Calculate days elapsed since investment start
        const elapsedDays = Math.min(
          Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)),
          investment.duration // Cap at max duration
        );
        
        // Calculate total earnings for this investment
        totalEarnings += investment.dailyReturns * elapsedDays;
      }
    });
    
    return totalEarnings;
  },

  getInvestmentStatus(investment: Investment): {
    isActive: boolean;
    remainingDays: number;
    progress: number;
  } {
    const now = new Date();
    const startDate = new Date(investment.investmentDate);
    const endDate = new Date(investment.endDate);
    
    const isActive = now >= startDate && now <= endDate;
    const elapsedDays = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const remainingDays = Math.max(0, investment.duration - elapsedDays);
    const progress = (elapsedDays / investment.duration) * 100;
    
    return {
      isActive,
      remainingDays,
      progress: Math.min(100, Math.max(0, progress))
    };
  }
};