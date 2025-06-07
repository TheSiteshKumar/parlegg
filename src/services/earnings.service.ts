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
        // Calculate days elapsed since investment start (including today if investment is active)
        const elapsedDays = Math.min(
          Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1, // +1 to include current day
          investment.duration // Cap at max duration
        );
        
        // Calculate total earnings for this investment
        totalEarnings += investment.dailyReturns * Math.max(0, elapsedDays);
      }
    });
    
    return totalEarnings;
  },

  // Get total earnings for a specific investment from day one
  calculateInvestmentEarningsToDate(investment: Investment): number {
    const now = new Date();
    const startDate = new Date(investment.investmentDate);
    
    if (now >= startDate) {
      const elapsedDays = Math.min(
        Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1, // +1 to include current day
        investment.duration
      );
      
      return investment.dailyReturns * Math.max(0, elapsedDays);
    }
    
    return 0;
  },

  getInvestmentStatus(investment: Investment): {
    isActive: boolean;
    remainingDays: number;
    progress: number;
    totalEarnedToDate: number;
    daysElapsed: number;
  } {
    const now = new Date();
    const startDate = new Date(investment.investmentDate);
    const endDate = new Date(investment.endDate);
    
    const isActive = now >= startDate && now <= endDate;
    const daysElapsed = Math.max(0, Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1);
    const remainingDays = Math.max(0, investment.duration - daysElapsed);
    const progress = (daysElapsed / investment.duration) * 100;
    const totalEarnedToDate = this.calculateInvestmentEarningsToDate(investment);
    
    return {
      isActive,
      remainingDays,
      progress: Math.min(100, Math.max(0, progress)),
      totalEarnedToDate,
      daysElapsed: Math.min(daysElapsed, investment.duration)
    };
  }
};